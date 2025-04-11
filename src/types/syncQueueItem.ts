export interface SyncQueueItem {
  id: string;
  data: any; // payload que será sincronizado
  status: 'created' | 'updated' | 'deleted' | 'error';
  syncStatus: 'sync-needed' | 'sync-started' | 'sync-completed' | 'sync-error';
  retryCount?: number;
  lastAttempt?: number;
}
