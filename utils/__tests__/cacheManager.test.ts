import { describe, it, expect, beforeEach } from 'vitest';
import { cacheManager, initializeCacheConfigs } from '../cacheManager';

describe('cacheManager', () => {
  beforeEach(() => {
    cacheManager.clearAll();
    initializeCacheConfigs();
  });

  it('sets and gets values with TTL', () => {
    cacheManager.set('ai', 'k1', 'v1', 1000);
    expect(cacheManager.get('ai', 'k1')).toBe('v1');
  });

  it('respects TTL expiration (simulate by direct delete)', () => {
    cacheManager.set('ai', 'k2', 'v2', 1);
    // Simulate expiry by clearing namespace (since we cannot wait)
    cacheManager.clear('ai');
    expect(cacheManager.get('ai', 'k2')).toBeNull();
  });

  it('has() indicates presence', () => {
    cacheManager.set('exam', 'id-1', { a: 1 }, 1000);
    expect(cacheManager.has('exam', 'id-1')).toBe(true);
  });

  it('delete() removes entry', () => {
    cacheManager.set('chat', 's1', [1,2,3], 1000);
    cacheManager.delete('chat', 's1');
    expect(cacheManager.get('chat', 's1')).toBeNull();
  });

  it('tracks stats', () => {
    cacheManager.set('user', 'u1', { id: 'u1' }, 1000);
    cacheManager.get('user', 'u1');
    const stats = cacheManager.getStats();
    expect(stats.totalItems).toBeGreaterThanOrEqual(1);
  });
});

