// src/services/SyncQueue.ts
import { SyncQueueItem } from '../types/syncQueueItem';

export default class SyncQueue {
  /**
   * Prepara o payload para a criação de itens de sincronização,
   * retornando um array com os itens no formato esperado pelo back-end:
   * { id, domain, action, data }.
   *
   * @param items Array de SyncQueueItem
   * @returns Array formatado para envio
   */
  static prepareCreateRequest(items: SyncQueueItem[]): any[] {
    return items.map(item => {
      // Define o domínio a partir de item.data.domain, se existir; caso contrário, define um default.
      const domain = item.data && item.data.domain ? item.data.domain : "appointment";

      // Define a ação com base no status
      let action: string;
      if (item.status === 'created') {
        action = 'create';
      } else if (item.status === 'updated') {
        action = 'update';
      } else if (item.status === 'deleted') {
        action = 'delete';
      } else {
        action = 'error';
      }

      return {
        id: item.id,
        domain,
        action,
        data: item.data,
      };
    });
  }
}
