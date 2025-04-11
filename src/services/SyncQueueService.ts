import api from './api';
import { SyncQueueItem } from '../types/syncQueueItem';
import SyncQueue from '../types/SyncQueue';

/*
  SyncQueueService
  responsible by sending to api the user requests for sincronization
*/
export default class SyncQueueService {
  static async create(items: SyncQueueItem[]): Promise<SyncQueueItem[]> {
    const payload = { items: SyncQueue.prepareCreateRequest(items) };
    const response = await api.post<{ data: SyncQueueItem[] }>('/queue/process-sync', payload);
    return response.data.data;
  }

  static async update(items: SyncQueueItem[]): Promise<SyncQueueItem[]> {
    const payload = { items: SyncQueue.prepareCreateRequest(items) };
    const response = await api.post<{ data: SyncQueueItem[] }>('/queue/process-sync', payload);
    return response.data.data;
  }

  static async delete(items: SyncQueueItem[]): Promise<SyncQueueItem[]> {
    const payload = { items: SyncQueue.prepareCreateRequest(items) };
    const response = await api.post<{ data: SyncQueueItem[] }>('/queue/process-sync', payload);
    return response.data.data;
  }

  static async test(): Promise<{ message: string }> {
    const response = await api.get<{ message: string }>('/test');
    return response.data;
  }
}
