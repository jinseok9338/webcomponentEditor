export interface IStorage {
  key: string;
  getItem(): string | null;
  setItem(value: string): string;
  removeItem(): void;
}
