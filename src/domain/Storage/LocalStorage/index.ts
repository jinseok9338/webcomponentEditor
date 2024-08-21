import { IStorage } from "../IStorage";

export class LocalStorage implements IStorage {
  key: string;
  constructor(key: string = "canvas-html") {
    this.key = key;
  }
  getItem(): string | null {
    return localStorage.getItem(this.key);
  }

  setItem(value: string): string {
    localStorage.setItem(this.key, value);
    return value;
  }

  removeItem(): void {
    localStorage.removeItem(this.key);
  }
}
