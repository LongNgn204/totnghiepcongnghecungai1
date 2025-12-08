/**
 * ✅ PHASE 2 - STEP 2.3: Cache Manager Service
 * 
 * Features:
 * - Cache management with TTL
 * - Cache statistics
 * - Cache invalidation
 * - Multiple cache strategies
 * - Memory + localStorage
 */

import { getCache, setCache, clearCache, clearAllCache, hashKey } from './cache';

export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize?: number; // Max number of items
  strategy?: 'LRU' | 'FIFO'; // Eviction strategy
}

export interface CacheStats {
  totalItems: number;
  hitRate: number;
  missRate: number;
  totalHits: number;
  totalMisses: number;
  averageAccessTime: number;
}

export interface CacheEntry<T> {
  key: string;
  value: T;
  createdAt: number;
  accessedAt: number;
  accessCount: number;
  ttl: number;
}

/**
 * ✅ Cache manager service
 */
export class CacheManager {
  private memoryCache = new Map<string, CacheEntry<any>>();
  private configs = new Map<string, CacheConfig>();
  private stats = {
    hits: 0,
    misses: 0,
    totalAccessTime: 0,
    accessCount: 0,
  };

  /**
   * Set cache configuration
   */
  setConfig(namespace: string, config: CacheConfig): void {
    this.configs.set(namespace, config);
  }

  /**
   * Get cache configuration
   */
  getConfig(namespace: string): CacheConfig {
    return this.configs.get(namespace) || {
      ttl: 10 * 60 * 1000, // 10 minutes default
      maxSize: 100,
      strategy: 'LRU',
    };
  }

  /**
   * Set cache value
   */
  set<T>(namespace: string, key: string, value: T, ttl?: number): void {
    const config = this.getConfig(namespace);
    const actualTTL = ttl || config.ttl;
    const cacheKey = `${namespace}:${key}`;

    // Store in memory
    const entry: CacheEntry<T> = {
      key: cacheKey,
      value,
      createdAt: Date.now(),
      accessedAt: Date.now(),
      accessCount: 0,
      ttl: actualTTL,
    };

    this.memoryCache.set(cacheKey, entry);

    // Store in localStorage
    try {
      setCache(cacheKey, value, actualTTL);
    } catch (err) {
      console.warn('[CacheManager] Failed to store in localStorage:', err);
    }

    // Check size limit
    if (config.maxSize && this.memoryCache.size > config.maxSize) {
      this.evict(namespace, config);
    }
  }

  /**
   * Get cache value
   */
  get<T>(namespace: string, key: string): T | null {
    const cacheKey = `${namespace}:${key}`;
    const startTime = performance.now();

    // Try memory cache first
    const memEntry = this.memoryCache.get(cacheKey);
    if (memEntry) {
      // Check if expired
      if (Date.now() - memEntry.createdAt > memEntry.ttl) {
        this.memoryCache.delete(cacheKey);
      } else {
        // Update access info
        memEntry.accessedAt = Date.now();
        memEntry.accessCount++;

        // Record stats
        this.stats.hits++;
        this.stats.totalAccessTime += performance.now() - startTime;
        this.stats.accessCount++;

        return memEntry.value as T;
      }
    }

    // Try localStorage
    const value = getCache<T>(cacheKey);
    if (value !== null) {
      // Restore to memory cache
      const entry: CacheEntry<T> = {
        key: cacheKey,
        value,
        createdAt: Date.now(),
        accessedAt: Date.now(),
        accessCount: 1,
        ttl: this.getConfig(namespace).ttl,
      };
      this.memoryCache.set(cacheKey, entry);

      // Record stats
      this.stats.hits++;
      this.stats.totalAccessTime += performance.now() - startTime;
      this.stats.accessCount++;

      return value;
    }

    // Cache miss
    this.stats.misses++;
    return null;
  }

  /**
   * Check if key exists
   */
  has(namespace: string, key: string): boolean {
    const cacheKey = `${namespace}:${key}`;
    const entry = this.memoryCache.get(cacheKey);

    if (!entry) return false;

    // Check if expired
    if (Date.now() - entry.createdAt > entry.ttl) {
      this.memoryCache.delete(cacheKey);
      return false;
    }

    return true;
  }

  /**
   * Delete cache entry
   */
  delete(namespace: string, key: string): void {
    const cacheKey = `${namespace}:${key}`;
    this.memoryCache.delete(cacheKey);
    clearCache(cacheKey);
  }

  /**
   * Clear namespace
   */
  clear(namespace: string): void {
    // Clear memory cache
    for (const key of this.memoryCache.keys()) {
      if (key.startsWith(`${namespace}:`)) {
        this.memoryCache.delete(key);
      }
    }

    // Clear localStorage
    clearAllCache(`${namespace}:`);
  }

  /**
   * Clear all caches
   */
  clearAll(): void {
    this.memoryCache.clear();
    clearAllCache();
  }

  /**
   * Evict entries based on strategy
   */
  private evict(namespace: string, config: CacheConfig): void {
    const entries = Array.from(this.memoryCache.values()).filter(e =>
      e.key.startsWith(`${namespace}:`)
    );

    if (entries.length === 0) return;

    let toEvict: CacheEntry<any>;

    if (config.strategy === 'LRU') {
      // Evict least recently used
      toEvict = entries.reduce((a, b) =>
        a.accessedAt < b.accessedAt ? a : b
      );
    } else {
      // FIFO: Evict oldest
      toEvict = entries.reduce((a, b) =>
        a.createdAt < b.createdAt ? a : b
      );
    }

    this.memoryCache.delete(toEvict.key);
    clearCache(toEvict.key);
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const totalItems = this.memoryCache.size;
    const totalRequests = this.stats.hits + this.stats.misses;

    return {
      totalItems,
      hitRate: totalRequests > 0 ? this.stats.hits / totalRequests : 0,
      missRate: totalRequests > 0 ? this.stats.misses / totalRequests : 0,
      totalHits: this.stats.hits,
      totalMisses: this.stats.misses,
      averageAccessTime: this.stats.accessCount > 0
        ? this.stats.totalAccessTime / this.stats.accessCount
        : 0,
    };
  }

  /**
   * Get namespace statistics
   */
  getNamespaceStats(namespace: string) {
    const entries = Array.from(this.memoryCache.values()).filter(e =>
      e.key.startsWith(`${namespace}:`)
    );

    return {
      totalItems: entries.length,
      totalSize: entries.reduce((sum, e) => {
        const size = JSON.stringify(e.value).length;
        return sum + size;
      }, 0),
      oldestEntry: entries.length > 0
        ? Math.min(...entries.map(e => e.createdAt))
        : null,
      newestEntry: entries.length > 0
        ? Math.max(...entries.map(e => e.createdAt))
        : null,
    };
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      totalAccessTime: 0,
      accessCount: 0,
    };
  }

  /**
   * Get all entries in namespace
   */
  getAll(namespace: string): Map<string, any> {
    const result = new Map<string, any>();

    for (const [key, entry] of this.memoryCache.entries()) {
      if (key.startsWith(`${namespace}:`)) {
        const shortKey = key.substring(`${namespace}:`.length);
        result.set(shortKey, entry.value);
      }
    }

    return result;
  }
}

/**
 * ✅ Global cache manager instance
 */
export const cacheManager = new CacheManager();

/**
 * ✅ Initialize cache configurations
 */
export function initializeCacheConfigs(): void {
  // AI responses: 10 minutes
  cacheManager.setConfig('ai', {
    ttl: 10 * 60 * 1000,
    maxSize: 50,
    strategy: 'LRU',
  });

  // Exam history: 1 hour
  cacheManager.setConfig('exam', {
    ttl: 60 * 60 * 1000,
    maxSize: 100,
    strategy: 'LRU',
  });

  // Flashcards: 30 minutes
  cacheManager.setConfig('flashcard', {
    ttl: 30 * 60 * 1000,
    maxSize: 100,
    strategy: 'LRU',
  });

  // Chat sessions: 24 hours
  cacheManager.setConfig('chat', {
    ttl: 24 * 60 * 60 * 1000,
    maxSize: 50,
    strategy: 'LRU',
  });

  // User data: 1 hour
  cacheManager.setConfig('user', {
    ttl: 60 * 60 * 1000,
    maxSize: 10,
    strategy: 'LRU',
  });
}

/**
 * ✅ Cache helpers for specific domains
 */
export const cacheHelpers = {
  // AI cache
  ai: {
    set: (key: string, value: any, ttl?: number) =>
      cacheManager.set('ai', key, value, ttl),
    get: (key: string) => cacheManager.get('ai', key),
    has: (key: string) => cacheManager.has('ai', key),
    delete: (key: string) => cacheManager.delete('ai', key),
    clear: () => cacheManager.clear('ai'),
  },

  // Exam cache
  exam: {
    set: (key: string, value: any, ttl?: number) =>
      cacheManager.set('exam', key, value, ttl),
    get: (key: string) => cacheManager.get('exam', key),
    has: (key: string) => cacheManager.has('exam', key),
    delete: (key: string) => cacheManager.delete('exam', key),
    clear: () => cacheManager.clear('exam'),
  },

  // Flashcard cache
  flashcard: {
    set: (key: string, value: any, ttl?: number) =>
      cacheManager.set('flashcard', key, value, ttl),
    get: (key: string) => cacheManager.get('flashcard', key),
    has: (key: string) => cacheManager.has('flashcard', key),
    delete: (key: string) => cacheManager.delete('flashcard', key),
    clear: () => cacheManager.clear('flashcard'),
  },

  // Chat cache
  chat: {
    set: (key: string, value: any, ttl?: number) =>
      cacheManager.set('chat', key, value, ttl),
    get: (key: string) => cacheManager.get('chat', key),
    has: (key: string) => cacheManager.has('chat', key),
    delete: (key: string) => cacheManager.delete('chat', key),
    clear: () => cacheManager.clear('chat'),
  },

  // User cache
  user: {
    set: (key: string, value: any, ttl?: number) =>
      cacheManager.set('user', key, value, ttl),
    get: (key: string) => cacheManager.get('user', key),
    has: (key: string) => cacheManager.has('user', key),
    delete: (key: string) => cacheManager.delete('user', key),
    clear: () => cacheManager.clear('user'),
  },
};

export default {
  CacheManager,
  cacheManager,
  initializeCacheConfigs,
  cacheHelpers,
};

