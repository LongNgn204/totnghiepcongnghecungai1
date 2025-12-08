/**
 * ✅ PHASE 1 - STEP 1.4: Enhanced Authentication Context
 * 
 * Features:
 * - Token refresh integration
 * - Auto-logout on 401
 * - Session management
 * - Error handling
 * - Sync integration
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { resumeSync, pauseSync } from '../utils/syncManager';
import { 
  tokenManager, 
  initializeTokenManager, 
  getStoredTokens, 
  clearTokens,
  TokenData 
} from '../utils/tokenManager';
import { 
  AppErrorClass, 
  ErrorCode, 
  logError, 
  getErrorMessage,
  isAuthError 
} from '../utils/errorHandler';

interface User {
  id: string;
  email: string;
  displayName: string;
  username: string;
  avatar?: string;
  bio?: string;
  createdAt: number;
  lastLogin?: number;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (identifier: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL: string = (import.meta.env.VITE_API_URL as string) || (import.meta.env.MODE === 'development' ? 'http://localhost:8787' : '');

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const authInitializedRef = useRef(false);

  /**
   * ✅ Logout with cleanup
   */
  const logout = useCallback(() => {
    try {
      const currentToken = localStorage.getItem('auth_token');
      if (currentToken) {
        // Notify backend about logout
        fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${currentToken}`,
            'Content-Type': 'application/json',
          },
        }).catch(err => console.error('Logout notification error:', err));
      }

      // Clear state
      setUser(null);
      setToken(null);
      setError(null);

      // Clear storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('user_id');

      // Cleanup token manager
      tokenManager.cleanup();

      // Pause sync
      pauseSync();

      // Dispatch logout event
      window.dispatchEvent(new Event('logout'));
    } catch (err) {
      console.error('Logout error:', err);
    }
  }, []);

  /**
   * ✅ Initialize authentication on app start
   */
  useEffect(() => {
    const initAuth = async () => {
      if (authInitializedRef.current) return;
      authInitializedRef.current = true;

      try {
        // Try to initialize token manager
        const tokenValid = await initializeTokenManager();

        if (tokenValid) {
          const tokens = getStoredTokens();
          if (tokens) {
            setToken(tokens.accessToken);

            // Fetch user data
            try {
              const response = await fetch(`${API_URL}/api/auth/me`, {
                headers: {
                  Authorization: `Bearer ${tokens.accessToken}`,
                  'Content-Type': 'application/json',
                },
              });

              if (response.ok) {
                const result = await response.json();
                const userData = result.data || result;
                setUser(userData);
                localStorage.setItem('user_data', JSON.stringify(userData));
                resumeSync();
              } else if (response.status === 401) {
                // Token invalid, logout
                logout();
              } else {
                throw new Error(`Failed to fetch user data: ${response.statusText}`);
              }
            } catch (err) {
              console.error('Error fetching user data:', err);
              logout();
            }
          }
        } else {
          pauseSync();
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    /**
     * ✅ Handle auth errors from other components
     */
    const handleAuthError = () => {
      logout();
    };

    window.addEventListener('auth-error', handleAuthError);

    return () => {
      window.removeEventListener('auth-error', handleAuthError);
    };
  }, [logout]);

  /**
   * ✅ Handle successful authentication
   */
  const handleSuccessfulAuth = (data: any) => {
    try {
      if (!data.user || !data.token) {
        throw new AppErrorClass(
          ErrorCode.INVALID_DATA,
          'Dữ liệu xác thực không hợp lệ',
          { data },
          undefined,
          'handleSuccessfulAuth'
        );
      }

      // Store tokens
      const tokenData: TokenData = {
        accessToken: data.token,
        refreshToken: data.refreshToken || data.token,
        expiresAt: data.expiresAt || Date.now() + 15 * 60 * 1000,
        tokenType: 'Bearer',
      };

      // Store tokens and schedule refresh
      tokenManager.reset();
      // Persist tokens using helper
      import('../utils/tokenManager').then(({ storeTokens }) => storeTokens(tokenData)).catch(() => {});
      tokenManager.scheduleRefresh(tokenData.expiresAt);

      // Update state
      setUser(data.user);
      setToken(data.token);
      setError(null);

      // Store in localStorage
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_data', JSON.stringify(data.user));
      localStorage.setItem('user_id', data.user.id);

      // Resume sync
      resumeSync();

      // Dispatch login event
      window.dispatchEvent(new Event('login'));
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      logError(err instanceof Error ? err : new Error(message));
      throw err;
    }
  };

  /**
   * ✅ Register new user
   */
  const register = async (data: any) => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMsg = result.error || result.message || 'Đăng ký thất bại';
        setError(errorMsg);
        throw new AppErrorClass(
          ErrorCode.INVALID_INPUT,
          errorMsg,
          result,
          response.status,
          'register'
        );
      }

      handleSuccessfulAuth(result.data || result);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      logError(err instanceof Error ? err : new Error(message));
      throw err;
    }
  };

  /**
   * ✅ Login user
   */
  const login = async (identifier: string, password: string) => {
    try {
      setError(null);
      const isEmail = identifier.includes('@');
      const payload = isEmail 
        ? { email: identifier, password } 
        : { username: identifier, password };

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMsg = result.error || result.message || 'Đăng nhập thất bại';
        setError(errorMsg);
        throw new AppErrorClass(
          ErrorCode.UNAUTHORIZED,
          errorMsg,
          result,
          response.status,
          'login'
        );
      }

      handleSuccessfulAuth(result.data || result);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      logError(err instanceof Error ? err : new Error(message));
      throw err;
    }
  };

  /**
   * ✅ Update user profile
   */
  const updateProfile = async (data: Partial<User>) => {
    try {
      setError(null);
      const currentToken = localStorage.getItem('auth_token');

      if (!currentToken) {
        throw new AppErrorClass(
          ErrorCode.UNAUTHORIZED,
          'Bạn chưa đăng nhập',
          null,
          401,
          'updateProfile'
        );
      }

      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMsg = result.error || result.message || 'Cập nhật thất bại';
        setError(errorMsg);
        throw new AppErrorClass(
          ErrorCode.INVALID_INPUT,
          errorMsg,
          result,
          response.status,
          'updateProfile'
        );
      }

      const updatedUser = result.data || result.user || result;
      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      logError(err instanceof Error ? err : new Error(message));
      throw err;
    }
  };

  /**
   * ✅ Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * ✅ Hook to use auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
