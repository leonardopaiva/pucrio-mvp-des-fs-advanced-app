import { SyncQueueItem } from "../types/syncQueueItem";

export default class SyncQueueLocalStorageService<T extends SyncQueueItem> {
  private storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
    this.initializeStorage();
  }

  private initializeStorage(): void {
    const existingData = localStorage.getItem(this.storageKey);
    if (!existingData) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
  }

  listItems(): T[] {
    const items = localStorage.getItem(this.storageKey);
    return items ? JSON.parse(items) : [];
  }

  setItems(items: T[]): boolean {
    const allValid = items.every(item => this.validateSyncData(item));
    if (!allValid) {
      console.error("setItems aborted: one or more items do not have valid data (must include non-empty 'id' and 'name').");
      return false;
    }
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    return true;
  }

  addItem(newItem: T): { status: boolean; message: string } {
    if (!this.validateSyncData(newItem)) {
      return { status: false, message: 'Invalid item data. Insertion aborted.' };
    }
    const items: T[] = this.listItems();
    items.push(newItem);
    this.setItems(items);
    return { status: true, message: 'New item successfully added.' };
  }

  updateItem(id: string, updatedItem: T): { status: boolean; message: string } {
    const items: T[] = this.listItems();
    const itemIndex = items.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return { status: false, message: 'Item not found.' };
    }
    if (!this.validateSyncData(updatedItem)) {
      return { status: false, message: 'Invalid item data. Update aborted.' };
    }
    items[itemIndex] = updatedItem;
    this.setItems(items);
    return { status: true, message: 'Item successfully updated.' };
  }

  removeItem(id: string): { status: boolean; message: string } {
    const items: T[] = this.listItems();
    const newItems = items.filter(item => item.id !== id);
    if (newItems.length === items.length) {
      return { status: false, message: 'Item not found.' };
    }
    this.setItems(newItems);
    return { status: true, message: 'Item successfully removed.' };
  }

  findItemById(id: string): T | null {
    const items: T[] = this.listItems();
    const item = items.find(item => item.id === id);
    return item || null;
  }

  /**
   * Valida se os dados do item são válidos para a fila de sincronização.
   * Checa se:
   *   - O item possui um id (na raiz do item) válido (string não vazia).
   *   - Os campos 'status' e 'syncStatus' têm valores permitidos.
   *   - O campo 'data' é um objeto que possui as propriedades 'id' e 'name', ambas strings não vazias.
   */
  private validateSyncData(item: T): boolean {
    if (!item.id) {
      return false;
    }
    const allowedStatus = ['created', 'updated', 'deleted', 'error'];
    if (!item.status || !allowedStatus.includes(item.status)) {
      return false;
    }
    const allowedSyncStatus = ['sync-needed', 'sync-started', 'sync-completed', 'sync-error'];
    if (!item.syncStatus || !allowedSyncStatus.includes(item.syncStatus)) {
      return false;
    }
    if (!item.data || typeof item.data !== 'object') {
      return false;
    }
    // if (!('id' in item.data) || typeof item.data.id !== 'string' || item.data.id.trim() === '') {
    //   return false;
    // }
    if (!('id' in item.data)) {
      return false;
    }

    if (!('name' in item.data) || typeof item.data.name !== 'string' || item.data.name.trim() === '') {
      return false;
    }
    return true;
  }
}
