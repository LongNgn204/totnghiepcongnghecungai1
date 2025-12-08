/**
 * ✅ PHASE 1 - STEP 1.4: Token Management & Refresh System
 * 
 * Features:
 * - Automatic token refresh before expiry
 * - Token expiry detection
 * - Refresh token rotation
 * - Secure token storage
 * - Token validation
 */

import { AppErrorClass, ErrorCode, createAuthError } from './errorHandler';

const API_URL = (import.meta.env.VITE_API_URL as string) || (import.meta.env.MODE === 'development' ? 'http://localhost:8787' : '');

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  tokenType?: string;
}

export interface TokenPayload {
  sub: string; // User ID
  iat: number; // Issued at
  exp: number; // Expiration
  [key: string]: any;
}

/**
 * ✅ Decode JWT token (without verification)
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}

/**
 * ✅ Check if token is expired
 */
export function isTokenExpired(expiresAt: number, bufferMs: number = 60000): boolean {
  return Date.now() >= expiresAt - bufferMs;
}

/**
 * ✅ Get token expiration time from token
 */
export function getTokenExpirationTime(token: string): number | null {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return null;
  return payload.exp * 1000; // Convert to milliseconds
}

/**
 * ✅ Store tokens securely
 */
export function storeTokens(tokenData: TokenData): void {
  try {
    localStorage.setItem('auth_token', tokenData.accessToken);
    localStorage.setItem('refresh_token', tokenData.refreshToken);
    localStorage.setItem('token_expires_at', String(tokenData.expiresAt));
    localStorage.setItem('token_type', tokenData.tokenType || 'Bearer');
  } catch (error) {
    console.error('Failed to store tokens:', error);
    throw new AppErrorClass(
      ErrorCode.UNKNOWN_ERROR,
      'Không thể lưu token',
      { error },
      undefined,
      'storeTokens'
    );
  }
}

/**
 * ✅ Get stored tokens
 */
export function getStoredTokens(): TokenData | null {
  try {
    const accessToken = localStorage.getItem('auth_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const expiresAt = localStorage.getItem('token_expires_at');

    if (!accessToken || !refreshToken || !expiresAt) {
      return null;
    }

    return {
      accessToken,
      refreshToken,
      expiresAt: Number(expiresAt),
      tokenType: localStorage.getItem('token_type') || 'Bearer',
    };
  } catch (error) {
    console.error('Failed to get stored tokens:', error);
    return null;
  }
}

/**
 * ✅ Clear stored tokens
 */
export function clearTokens(): void {
  try {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expires_at');
    localStorage.removeItem('token_type');
  } catch (error) {
    console.error('Failed to clear tokens:', error);
  }
}

/**
 * ✅ Refresh access token
 */
export async function refreshAccessToken(refreshToken: string): Promise<TokenData> {
  try {
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw createAuthError(ErrorCode.TOKEN_EXPIRED, 'refreshAccessToken');
    }

    const data = await response.json();
    const tokenData: TokenData = {
      accessToken: data.accessToken || data.data?.accessToken,
      refreshToken: data.refreshToken || data.data?.refreshToken || refreshToken,
      expiresAt: data.expiresAt || data.data?.expiresAt || Date.now() + 15 * 60 * 1000,
      tokenType: data.tokenType || data.data?.tokenType || 'Bearer',
    };

    // Store new tokens
    storeTokens(tokenData);

    return tokenData;
  } catch (error) {
    console.error('Token refresh failed:', error);
    clearTokens();
    throw error;
  }
}

/**
 * ✅ Token refresh manager with automatic scheduling
 */
export class TokenRefreshManager {
  private refreshTimeoutId: NodeJS.Timeout | null = null;
  private refreshPromise: Promise<TokenData> | null = null;
  private isRefreshing = false;

  /**
   * Schedule token refresh before expiry
   */
  scheduleRefresh(expiresAt: number, bufferMs: number = 60000): void {
    // Clear existing timeout
    if (this.refreshTimeoutId) {
      clearTimeout(this.refreshTimeoutId);
    }

    const timeUntilExpiry = expiresAt - Date.now() - bufferMs;

    if (timeUntilExpiry > 0) {
      this.refreshTimeoutId = setTimeout(() => {
        this.refresh();
      }, timeUntilExpiry);

      if (process.env.NODE_ENV === 'development') {
        console.log(
          `[TOKEN] Refresh scheduled in ${Math.round(timeUntilExpiry / 1000)}s`
        );
      }
    }
  }

  /**
   * Perform token refresh
   */
  async refresh(): Promise<TokenData | null> {
    // Prevent multiple simultaneous refresh attempts
    if (this.isRefreshing) {
      return this.refreshPromise || null;
    }

    this.isRefreshing = true;

    try {
      const tokens = getStoredTokens();
      if (!tokens) {
        throw createAuthError(ErrorCode.INVALID_TOKEN, 'refresh');
      }

      this.refreshPromise = refreshAccessToken(tokens.refreshToken);
      const newTokenData = await this.refreshPromise;

      // Schedule next refresh
      this.scheduleRefresh(newTokenData.expiresAt);

      if (process.env.NODE_ENV === 'development') {
        console.log('[TOKEN] Token refreshed successfully');
      }

      return newTokenData;
    } catch (error) {
      console.error('[TOKEN] Refresh failed:', error);
      clearTokens();
      window.dispatchEvent(new Event('auth-error'));
      return null;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  /**
   * Check if token needs refresh and refresh if needed
   */
  async ensureValidToken(bufferMs: number = 60000): Promise<boolean> {
    const tokens = getStoredTokens();

    if (!tokens) {
      return false;
    }

    if (isTokenExpired(tokens.expiresAt, bufferMs)) {
      const result = await this.refresh();
      return result !== null;
    }

    return true;
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    const tokens = getStoredTokens();
    return tokens?.accessToken || null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const tokens = getStoredTokens();
    if (!tokens) return false;

    // Check if token is expired
    return !isTokenExpired(tokens.expiresAt);
  }

  /**
   * Cleanup (clear timeout and tokens)
   */
  cleanup(): void {
    if (this.refreshTimeoutId) {
      clearTimeout(this.refreshTimeoutId);
      this.refreshTimeoutId = null;
    }
    clearTokens();
  }

  /**
   * Reset manager state
   */
  reset(): void {
    if (this.refreshTimeoutId) {
      clearTimeout(this.refreshTimeoutId);
      this.refreshTimeoutId = null;
    }
    this.isRefreshing = false;
    this.refreshPromise = null;
  }
}

/**
 * ✅ Global token manager instance
 */
export const tokenManager = new TokenRefreshManager();

/**
 * ✅ Initialize token manager on app start
 */
export async function initializeTokenManager(): Promise<boolean> {
  const tokens = getStoredTokens();

  if (!tokens) {
    return false;
  }

  // Check if token is expired
  if (isTokenExpired(tokens.expiresAt)) {
    // Try to refresh
    const result = await tokenManager.refresh();
    return result !== null;
  }

  // Schedule refresh for valid token
  tokenManager.scheduleRefresh(tokens.expiresAt);
  return true;
}

/**
 * ✅ Logout and cleanup
 */
export function logout(): void {
  tokenManager.cleanup();
  window.dispatchEvent(new Event('logout'));
}

export default {
  decodeToken,
  isTokenExpired,
  getTokenExpirationTime,
  storeTokens,
  getStoredTokens,
  clearTokens,
  refreshAccessToken,
  TokenRefreshManager,
  tokenManager,
  initializeTokenManager,
  logout,
};

