import { DATA_APPOINTMENTS } from '../data-appointments';
import { SyncQueueItem } from '../types/syncQueueItem';

export function generateSyncQueueItems(): SyncQueueItem[] {
  return DATA_APPOINTMENTS.map(item => ({
    id: item.id,
    data: item,
    status: 'created',
    syncStatus: 'sync-needed',
    retryCount: 0,
    lastAttempt: 0,
  }));
}
