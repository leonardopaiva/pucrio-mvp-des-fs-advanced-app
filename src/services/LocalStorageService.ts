
/*
  * LocalStorageService:
  * The LocalStorageService handles requests that fail to be saved to the backend server.
  * It stores data locally in localStorage, enabling the app to function offline 
  * through the use of PWA (Progressive Web App) capabilities.
  * TODO: Implement synchronization of offline data with online data.
*/
export default class LocalStorageService<T extends { id: string }> {
  private storageKey: string;

  /*
    * Initialize a localstorage based on storageKey
    * so LocalStorageService will be reused for any app module
    * like appointments or events or anything.
  */
  constructor(storageKey: string) {
    this.storageKey = storageKey;

    this.initializeStorage();
  }

  /*
    * Checks if there is already an item for the storageKey in localStorage
    * If no data exists, initializes with an empty list
  */
  private initializeStorage(): void {
    const existingData = localStorage.getItem(this.storageKey);
    
    if (!existingData)
      localStorage.setItem(this.storageKey, JSON.stringify([]));
  }

  /*
    * addItem:
    * Function to add a new record to local storage
    * Retrieves existing data from localStorage
    * Checks if the date and time of the new item already exist
    * Adds the new item to the list
    * Updates the localStorage
  */
  addItem(newItem: T): { status: boolean, message: string } {
    const existingItems: T[] = this.listItems();

    if (this.checkDuplicateDate(existingItems, newItem)) {
      return { status: false, message: 'An appointment with the same date and time already exists.' };
    }

    existingItems.push(newItem);

    localStorage.setItem(this.storageKey, JSON.stringify(existingItems));

    return { status: true, message: 'New item successfully added.' };
  }

  /* Function to list all items */
  listItems(): T[] {
    const items = localStorage.getItem(this.storageKey);
    return items ? JSON.parse(items) : [];
  }

  /* Function to remove a specific item by ID */
  removeItem(id: string): { status: boolean, message: string } {
    const items: T[] = this.listItems();
    
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return { status: false, message: 'Item not found.' };
    }

    items.splice(itemIndex, 1);

    localStorage.setItem(this.storageKey, JSON.stringify(items));

    return { status: true, message: 'Item successfully removed.' };
  }

  /* Function to update a specific item by ID */
  updateItem(id: string, updatedItem: T): { status: boolean, message: string } {
    const items: T[] = this.listItems();

    const itemIndex = items.findIndex(item => item.id === id);

    if (itemIndex === -1) {
      return { status: false, message: 'Item not found.' };
    }

    items[itemIndex] = updatedItem;

    localStorage.setItem(this.storageKey, JSON.stringify(items));

    return { status: true, message: 'Item successfully updated.' };
  }

  /* Function to find an item by ID */
  findItemById(id: string): T | null {
    const items: T[] = this.listItems();
    const item = items.find((item) => item.id === id);

    return item || null;
  }

  /* Function to check if an appointment with the same date and time already exists */
  private checkDuplicateDate(existingItems: T[], newItem: T): boolean {

    const newItemDate = (newItem as any).date;

    return existingItems.some((item) => {
      const itemDate = (item as any).date;
      return itemDate === newItemDate;
    });
  }
}