import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { SyncQueueItem } from '../types/syncQueueItem';
import SyncQueueService from '../services/SyncQueueService';
import SyncQueueLocalStorageService from '../services/SyncQueueLocalStorageService';
import LocalStorageService from '../services/LocalStorageService';
import { Appointment } from '../services/interfaces';
import { useSharedApp } from './SharedAppContext';

interface SyncQueueContextType {
  queueItems: SyncQueueItem[];
  loading: boolean;
  refreshQueue: () => void;
  loadQueue: () => void;
}

const SyncQueueContext = createContext<SyncQueueContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'sync-queue';
const RETRY_DELAY = 60000;
const MAX_RETRY_COUNT = 5;

const syncStorage = new SyncQueueLocalStorageService<SyncQueueItem>(LOCAL_STORAGE_KEY);
const appointmentStorage = new LocalStorageService<Appointment>('appointments');

/*
  SyncQueueProvider

  This component provides a React context for managing a synchronization queue for appointment operations.
  The queue is stored using a local storage service and holds items with various sync statuses 
  ("sync-needed", "sync-started", "sync-error", and "sync-completed").

  This approach allows the app to automatically handle synchronization retries and keep the local data in sync with the server,
  making the user experience seamless even when network or server issues occur.
*/
export const SyncQueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queueItems, setQueueItems] = useState<SyncQueueItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { setAppointmentsDirty } = useSharedApp();

  const loadQueue = useCallback(() => {
    try {
      const items: SyncQueueItem[] = syncStorage.listItems();
      setQueueItems(items);
    } catch (err) {
      console.error("Error loading sync queue", err);
    }
  }, []);

  const processSyncQueue = async () => {
    let items: SyncQueueItem[];
    try {
      items = syncStorage.listItems();
    } catch (err) {
      console.error("Error reading sync queue", err);
      return;
    }

    if (!items || items.length === 0) return;

    const now = Date.now();

    // Initialize retryCount and lastAttempt if not defined
    items = items.map(item => ({
      ...item,
      retryCount: item.retryCount !== undefined ? item.retryCount : 0,
      lastAttempt: item.lastAttempt !== undefined ? item.lastAttempt : now,
    }));

    // Items that were in "sync-started" from previous executions are marked as "sync-error"
    items = items.map(item =>
      item.syncStatus === 'sync-started'
        ? { ...item, syncStatus: 'sync-error' }
        : item
    );
    syncStorage.setItems(items);

    // For items with "sync-error": if the delay has passed and retryCount is less than MAX_RETRY_COUNT, revert them to "sync-needed"
    items = items.map(item => {
      if (item.syncStatus === 'sync-error') {
        const retryCount = item.retryCount ?? 0;
        const lastAttempt = item.lastAttempt ?? now;
        if (now - lastAttempt >= RETRY_DELAY && retryCount < MAX_RETRY_COUNT) {
          return { ...item, syncStatus: 'sync-needed', retryCount: retryCount + 1, lastAttempt: now };
        }
      }
      return item;
    });
    syncStorage.setItems(items);

    // Filter the items that need to be sent (status "sync-needed")
    const itemsToSync = items.filter(item => item.syncStatus === 'sync-needed');
    if (itemsToSync.length === 0) return;

    setLoading(true);
    try {
      const createItems = itemsToSync.filter(item => item.status === 'created');
      const updateItems = itemsToSync.filter(item => item.status === 'updated');
      const deleteItems = itemsToSync.filter(item => item.status === 'deleted');

      // Mark the items to be sent as "sync-started"
      itemsToSync.forEach(item => (item.syncStatus = 'sync-started'));

      let updatedItems: SyncQueueItem[] = [];
      if (createItems.length > 0) {
        const result = await SyncQueueService.create(createItems);
        updatedItems = updatedItems.concat(result);
      }
      if (updateItems.length > 0) {
        const result = await SyncQueueService.update(updateItems);
        updatedItems = updatedItems.concat(result);
      }
      if (deleteItems.length > 0) {
        const result = await SyncQueueService.delete(deleteItems);
        updatedItems = updatedItems.concat(result);
      }

      // Update the queue: for each item that was in "sync-started",
      // if it is successfully updated, mark it as "sync-completed"
      // and if the id present in updated.data is different from the original id (item.data.id),
      // update the appointment in local storage using the original id and mark the dirty flag.
      // AppointmentContext is hearing appointmentsDirty so it will call refreshAppointments 
      // automatically when appointmentsDirty is true
      let isAppointmentsDirty = false;
      const finalQueue = items.map(item => {
        if (item.syncStatus === 'sync-started') {
          const updated = updatedItems.find(u => u.id === item.id);
          if (updated && updated.data !== null) {
            if (updated.data.name && updated.data.id && updated.data.id !== item.data.id) {
              // Update the appointment in local storage using the original id
              appointmentStorage.updateItem(item.data.id, updated.data);
              isAppointmentsDirty = true;
            }
            updated.syncStatus = 'sync-completed' as 'sync-completed';
            updated.lastAttempt = item.lastAttempt;
            updated.retryCount = item.retryCount;
            updated.status = item.status;
            return updated;
          } else {
            return { ...item, syncStatus: 'sync-error' as 'sync-error' };
          }
        }
        return item;
      });

      syncStorage.setItems(finalQueue);
      setQueueItems(finalQueue);

      if (isAppointmentsDirty) setAppointmentsDirty(true);
    } catch (error) {
      console.error("Error processing sync queue", error);
      items = items.map(item =>
        item.syncStatus === 'sync-started'
          ? { ...item, syncStatus: 'sync-error', lastAttempt: now }
          : item
      );
      const validItems = syncStorage.setItems(items);
      if (validItems) setQueueItems(items);
    } finally {
      setLoading(false);
    }
  };

  const refreshQueue = () => {
    loadQueue();
    processSyncQueue();
  };

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  return (
    <SyncQueueContext.Provider value={{ queueItems, loading, refreshQueue, loadQueue }}>
      {children}
    </SyncQueueContext.Provider>
  );
};

export const useSyncQueue = (): SyncQueueContextType => {
  const context = useContext(SyncQueueContext);
  if (!context) {
    throw new Error("useSyncQueue must be used within a SyncQueueProvider");
  }
  return context;
};
