import '@testing-library/jest-dom/vitest';

// Default navigator.onLine to false in tests to avoid API calls
Object.defineProperty(window.navigator, 'onLine', {
  value: false,
  configurable: true,
});

// Polyfill localStorage for environments where it's missing or partial
class MemoryStorage implements Storage {
  private store = new Map<string, string>();
  get length() { return this.store.size; }
  clear(): void { this.store.clear(); }
  getItem(key: string): string | null { return this.store.has(key) ? this.store.get(key)! : null; }
  key(index: number): string | null { return Array.from(this.store.keys())[index] ?? null; }
  removeItem(key: string): void { this.store.delete(key); }
  setItem(key: string, value: string): void { this.store.set(key, String(value)); }
}

if (typeof window.localStorage === 'undefined' || typeof window.localStorage.getItem !== 'function') {
  const storage = new MemoryStorage();
  Object.defineProperty(window, 'localStorage', { value: storage, configurable: true, writable: false });
}

