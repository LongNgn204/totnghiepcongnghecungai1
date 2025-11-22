import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Auto-login with stored token
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('user_data');

      if (storedToken) {
        setToken(storedToken);
        // Optimistically set user if available
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            console.error('Error parsing stored user:', e);
          }
        }

        try {
          // Verify token and get latest user info
          const response = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            // Update stored user data
            localStorage.setItem('user_data', JSON.stringify(data.user));
          } else {
            // Token invalid, clear it
            // localStorage.removeItem('auth_token');
            // localStorage.removeItem('user_data');
            // setUser(null);
            // setToken(null);
            // Keep the local state for now to prevent flashing, let the API calls fail if needed
            // or maybe we should logout? Let's logout to be safe if token is definitely invalid
            if (response.status === 401) {
              localStorage.removeItem('auth_token');
              localStorage.removeItem('user_data');
              setUser(null);
              setToken(null);
            }
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          // Don't logout on network error, keep offline access if possible
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const register = async (email: string, password: string, displayName: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, displayName })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Đăng ký thất bại');
      }

      // Backend returns: { success: true, data: { user, token }, message }
      const data = result.data || result;

      // Validate response data
      if (!data.user || !data.token) {
        throw new Error('Dữ liệu đăng ký không hợp lệ');
      }

      // Auto login after register
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_data', JSON.stringify(data.user));
      localStorage.setItem('user_id', data.user.id);
    } catch (error: any) {
      console.error('Register error:', error);
      throw new Error(error.message || 'Đăng ký thất bại');
    }
  };

  const login = async (identifier: string, password: string) => {
    try {
      // Determine if identifier is email or username
      const isEmail = identifier.includes('@');
      const payload = isEmail
        ? { email: identifier, password }
        : { username: identifier, password };

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Đăng nhập thất bại');
      }

      // Backend returns: { success: true, data: { user, token }, message }
      const data = result.data || result;

      // Validate response data
      if (!data.user || !data.token) {
        throw new Error('Dữ liệu đăng nhập không hợp lệ');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_data', JSON.stringify(data.user));
      localStorage.setItem('user_id', data.user.id);
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Đăng nhập thất bại');
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('user_id');
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Cập nhật thất bại');
      }

      setUser(result.user);
      localStorage.setItem('user_data', JSON.stringify(result.user));
    } catch (error: any) {
      throw new Error(error.message || 'Cập nhật thất bại');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      updateProfile,
      isAuthenticated: !!user
    }}>
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
