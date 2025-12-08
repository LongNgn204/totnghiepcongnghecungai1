import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchAPI } from '../apiClient';
import { AppErrorClass, ErrorCode } from '../errorHandler';

describe('apiClient', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('throws UNAUTHORIZED when no token for protected endpoint', async () => {
    await expect(fetchAPI('/api/exams')).rejects.toBeInstanceOf(AppErrorClass);
    await expect(fetchAPI('/api/exams')).rejects.toHaveProperty('code', ErrorCode.UNAUTHORIZED);
  });

  it('passes token and returns JSON on success', async () => {
    localStorage.setItem('auth_token', 'token');
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ ok: true }) })) as any);

    const res = await fetchAPI('/api/exams');
    expect(res).toEqual({ ok: true });
  });

  it('wraps network errors', async () => {
    localStorage.setItem('auth_token', 'token');
    vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('Network error'); }) as any);

    await expect(
      fetchAPI('/api/exams', {}, { maxRetries: 0, initialDelayMs: 1, maxDelayMs: 1, backoffMultiplier: 1 })
    ).rejects.toBeInstanceOf(AppErrorClass);
  });
});

