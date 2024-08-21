import { IStorage } from "../IStorage";

export class SessionStorage implements IStorage {
  key: string;
  constructor(key: string = "canvas-html") {
    this.key = key;
  }
  getItem(): string | null {
    return sessionStorage.getItem(this.key);
  }

  setItem(value: string): string {
    sessionStorage.setItem(this.key, value);
    return value;
  }

  removeItem(): void {
    sessionStorage.removeItem(this.key);
  }
}
