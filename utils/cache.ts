// Simple TTL cache using localStorage
// Keys are namespaced; values stored as { value, expiry }

export interface CacheEntry<T> {
  value: T;
  expiry: number; // timestamp ms
}

const NS = 'app.cache.';

export function setCache<T>(key: string, value: T, ttlMs: number): void {
  const entry: CacheEntry<T> = { value, expiry: Date.now() + ttlMs };
  try {
    localStorage.setItem(NS + key, JSON.stringify(entry));
  } catch (e) {
    // storage might be full or disabled, ignore
  }
}

export function getCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(NS + key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry<T>;
    if (!entry || !entry.expiry) return null;
    if (Date.now() > entry.expiry) {
      localStorage.removeItem(NS + key);
      return null;
    }
    return entry.value;
  } catch {
    return null;
  }
}

export function clearCache(key: string): void {
  try { localStorage.removeItem(NS + key); } catch {}
}

export function clearAllCache(prefix?: string): void {
  try {
    const p = NS + (prefix || '');
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(p)) localStorage.removeItem(k);
    }
  } catch {}
}

export function hashKey(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const chr = input.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

