import { IStorage } from "./IStorage";

export class HTMLStorage {
  private storage: IStorage;

  constructor(storage: IStorage, defaultValue?: string) {
    this.storage = storage;
    if (defaultValue) {
      this.updateItem(defaultValue);
    }
  }

  getItem(): string | null {
    return this.storage.getItem();
  }

  updateItem(value: string): void {
    this.storage.setItem(value);
  }

  removeItem(): void {
    this.storage.removeItem();
  }
}
