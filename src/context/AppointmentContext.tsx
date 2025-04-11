import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { Appointment } from '../services/interfaces';
import LocalStorageService from '../services/LocalStorageService';
import SyncQueueLocalStorageService from '../services/SyncQueueLocalStorageService';
import { SyncQueueItem } from '../types/syncQueueItem';
import { useSharedApp } from './SharedAppContext';
import { generateUniqueId } from '../util/functions';

interface AppointmentContextType {
  appointments: Appointment[];
  loading: boolean;
  refreshAppointments: () => void;
  deleteAppointment: (id: string) => void;
  createAppointment: (appointment: Appointment) => boolean;
  updateAppointment: (appointment: Appointment) => boolean;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

/*
  AppointmentProvider

  The refreshAppointments function is the only one that communicates with the API; the other functions only
  modify the local storage for appointments as well as the sync queue.
  This is because when the user is creating, updating, or deleting items, everything is done without having
  to wait for the server request. Later, the user can sync with the cloud using the SyncQueueContext,
  via the floating button located at the bottom right corner of the app.
*/
export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const appointmentStorage = new LocalStorageService<Appointment>('appointments');
  const syncQueueLocalStorageService = new SyncQueueLocalStorageService<SyncQueueItem>('sync-queue');

  const { appointmentsDirty, setAppointmentsDirty } = useSharedApp();

  const refreshAppointments = () => {
    setLoading(true);
    api.get('/appointments')
      .then(res => {
        const data = res.data.data;
        const events: Appointment[] = data && data.events ? data.events : (Array.isArray(data) ? data : []);
        events.forEach(event => {
          const localItem = appointmentStorage.findItemById(event.id);
          if (!localItem) {
            const syncItems = syncQueueLocalStorageService.listItems();
            const isMarkedForDeletion = syncItems.find(syncItem =>
              syncItem.data &&
              syncItem.data.id === event.id &&
              syncItem.status === 'deleted' &&
              syncItem.syncStatus !== 'sync-completed'
            );
            const isMarkedForUpdate = syncItems.find(syncItem =>
              syncItem.data &&
              syncItem.data.id === event.id &&
              syncItem.status === 'updated' &&
              syncItem.syncStatus !== 'sync-completed'
            );
            if (!isMarkedForDeletion && !isMarkedForUpdate) {
              appointmentStorage.addItem(event);
            }
          }
        });
        const localAppointments = appointmentStorage.listItems();
        setAppointments(localAppointments);
      })
      .catch(() => {
        const localAppointments = appointmentStorage.listItems();
        setAppointments(localAppointments);
      })
      .finally(() => {
        setLoading(false);
        if (appointmentsDirty) {
          setAppointmentsDirty(false);
        }
      });
  };

  /*
    deleteAppointment

    Performs operations on the appointments local storage and sync queue.
    It checks if a sync item already exists to determine whether 
    it should update it with the new data before creating a new item.
  */
  const deleteAppointment = (id: string) => {
    const appointmentItem = appointmentStorage.findItemById(id);
    if (!appointmentItem) {
      alert("Appointment not found in local storage.");
      return;
    }

    const existingCreatedItem = syncQueueLocalStorageService.listItems().find(item =>
      item.data &&
      item.data.id === appointmentItem.id &&
      item.status === 'created' &&
      item.syncStatus !== 'sync-completed'
    );
    if (existingCreatedItem) {

      const removeResult = syncQueueLocalStorageService.removeItem(existingCreatedItem.id);
      if (!removeResult.status) {
        alert("Error removing item from queue: " + removeResult.message);
        return;
      }
      appointmentStorage.removeItem(id);
      refreshAppointments();
      alert("Appointment removed locally (unsynchronized item).");
      return;
    }

    const existingSyncItem = syncQueueLocalStorageService.listItems().find(item =>
      item.data &&
      item.data.id === appointmentItem.id &&
      item.syncStatus !== 'sync-completed'
    );
    let result;
    if (existingSyncItem) {
      result = syncQueueLocalStorageService.updateItem(existingSyncItem.id, {
        ...existingSyncItem,
        status: 'deleted',
        syncStatus: 'sync-needed',
        retryCount: 0,
        lastAttempt: 0
      });
    } else {
      const syncItem: SyncQueueItem = {
        id: appointmentItem.id,
        status: 'deleted',
        syncStatus: 'sync-needed',
        retryCount: 0,
        lastAttempt: 0,
        data: { ...appointmentItem }
      };
      result = syncQueueLocalStorageService.addItem(syncItem);
    }
    if (result.status) {
      appointmentStorage.removeItem(id);
      refreshAppointments();
      alert("Appointment removed and scheduled for synchronization.");
    } else {
      alert("Error scheduling deletion: " + result.message);
    }
  };

  /*
    createAppointment

    Performs operations on the appointments local storage and sync queue.
  */
  const createAppointment = (appointment: Appointment): boolean => {
    const appointmentToAdd: Appointment = { ...appointment, id: appointment.id || generateUniqueId() };
    const addResult = appointmentStorage.addItem(appointmentToAdd);
    if (!addResult.status) {
      alert(addResult.message);
      return false;
    }
    const syncItem: SyncQueueItem = {
      id: appointmentToAdd.id,
      status: 'created',
      syncStatus: 'sync-needed',
      retryCount: 0,
      lastAttempt: 0,
      data: { ...appointmentToAdd }
    };
    const syncResult = syncQueueLocalStorageService.addItem(syncItem);
    if (!syncResult.status) {
      alert(syncResult.message);
      return false;
    }
    refreshAppointments();
    return true;
  };

  /*
    updateAppointment:

    Performs operations on the appointments local storage and sync queue.
    Checks whether a sync item for updating this appointment already exists.
    If found, it updates the existing sync item with the new data; otherwise,
    it creates a new sync item for updating.
  */
  const updateAppointment = (appointment: Appointment): boolean => {
    const updateResult = appointmentStorage.updateItem(appointment.id, appointment);
    if (!updateResult.status) {
      alert(updateResult.message);
      return false;
    }
    const syncItems = syncQueueLocalStorageService.listItems();
    const existingSyncItem = syncItems.find(item =>
      item.data && item.data.id === appointment.id &&
      item.status === 'updated' &&
      item.syncStatus !== 'sync-completed'
    );
    let syncResult;
    if (existingSyncItem) {
      syncResult = syncQueueLocalStorageService.updateItem(existingSyncItem.id, {
        ...existingSyncItem,
        data: { ...appointment }
      });
    } else {
      const syncItem: SyncQueueItem = {
        id: appointment.id,
        status: 'updated',
        syncStatus: 'sync-needed',
        retryCount: 0,
        lastAttempt: 0,
        data: { ...appointment }
      };
      syncResult = syncQueueLocalStorageService.addItem(syncItem);
    }
    if (!syncResult.status) {
      alert(syncResult.message);
      return false;
    }
    refreshAppointments();
    return true;
  };

  useEffect(() => {
    refreshAppointments();
  }, []);

  useEffect(() => {
    if (appointmentsDirty) {
      refreshAppointments();
    }
  }, [appointmentsDirty]);

  return (
    <AppointmentContext.Provider value={{ appointments, loading, refreshAppointments, deleteAppointment, createAppointment, updateAppointment }}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = (): AppointmentContextType => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};
