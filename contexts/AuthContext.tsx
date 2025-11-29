// AuthContext.tsx - Handles authentication state and integrates sync pause on 401
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { resumeSync, pauseSync } from '../utils/syncManager';

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
  login: (identifier: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    const currentToken = localStorage.getItem('auth_token');
    if (currentToken) {
      fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      }).catch(err => console.error('Logout error:', err));
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_id');
    pauseSync();
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        setToken(storedToken);
        try {
          const response = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const result = await response.json();
            const userData = result.data || result;
            setUser(userData);
            localStorage.setItem('user_data', JSON.stringify(userData));
            resumeSync(); // Resume sync if token is valid
          } else {
            logout();
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          logout();
        }
      } else {
        pauseSync(); // Ensure sync is paused if no token
      }
      setLoading(false);
    };
    initAuth();

    const handleAuthError = () => logout();
    window.addEventListener('auth-error', handleAuthError);

    return () => {
      window.removeEventListener('auth-error', handleAuthError);
    };
  }, [logout]);

  const handleSuccessfulAuth = (data: any) => {
    if (!data.user || !data.token) throw new Error('Dữ liệu xác thực không hợp lệ');
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user_data', JSON.stringify(data.user));
    localStorage.setItem('user_id', data.user.id);
    resumeSync();
  };

  const register = async (email: string, password: string, displayName: string) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, displayName }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Đăng ký thất bại');
    handleSuccessfulAuth(result.data || result);
  };

  const login = async (identifier: string, password: string) => {
    const isEmail = identifier.includes('@');
    const payload = isEmail ? { email: identifier, password } : { username: identifier, password };
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Đăng nhập thất bại');
    handleSuccessfulAuth(result.data || result);
  };

  const updateProfile = async (data: Partial<User>) => {
    const currentToken = localStorage.getItem('auth_token');
    if (!currentToken) throw new Error('Not authenticated');
    const response = await fetch(`${API_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Cập nhật thất bại');
    setUser(result.user);
    localStorage.setItem('user_data', JSON.stringify(result.user));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
