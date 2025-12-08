import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storeTokens, getStoredTokens, clearTokens, isTokenExpired, refreshAccessToken } from '../tokenManager';

const FAKE_API_URL = 'http://localhost:8787';

// Helper to create a fake JWT payload
function createFakeJWT(expSecondsFromNow: number) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({ sub: 'u1', iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + expSecondsFromNow })
  );
  const sig = 'signature';
  return `${header}.${payload}.${sig}`;
}

describe('tokenManager', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('stores and retrieves tokens', () => {
    const token = createFakeJWT(3600);
    storeTokens({ accessToken: token, refreshToken: 'r1', expiresAt: Date.now() + 3600_000, tokenType: 'Bearer' });
    const stored = getStoredTokens();
    expect(stored?.accessToken).toBe(token);
    expect(stored?.refreshToken).toBe('r1');
  });

  it('clears tokens', () => {
    storeTokens({ accessToken: 'a', refreshToken: 'r', expiresAt: Date.now() + 1000 });
    clearTokens();
    expect(getStoredTokens()).toBeNull();
  });

  it('detects expiry with buffer', () => {
    const future = Date.now() + 5_000; // 5s ahead
    expect(isTokenExpired(future, 10_000)).toBe(true); // with 10s buffer, considered expired
    expect(isTokenExpired(future, 1_000)).toBe(false);
  });

  it('refreshAccessToken calls backend and stores new tokens', async () => {
    const newAccess = createFakeJWT(900);
    // mock fetch
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => ({ accessToken: newAccess, refreshToken: 'r2', expiresAt: Date.now() + 900_000 })
    })) as any);

    const res = await refreshAccessToken('r1');
    expect(res.accessToken).toBe(newAccess);
    const stored = getStoredTokens();
    expect(stored?.refreshToken).toBe('r2');
  });
});

