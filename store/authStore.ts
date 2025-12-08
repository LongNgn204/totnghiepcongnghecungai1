/**
 * ✅ PHASE 2 - STEP 2.2: Authentication Store with Zustand
 * 
 * Features:
 * - User state management
 * - Token management
 * - Auth status
 * - Sync with backend
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  createdAt: number;
  lastLogin?: number;
  isAdmin?: boolean;
}

interface AuthState {
  // User
  user: User | null;
  setUser: (user: User | null) => void;

  // Token
  token: string | null;
  setToken: (token: string | null) => void;

  // Auth status
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  clearError: () => void;

  // Sync
  lastSyncTime: number;
  setLastSyncTime: (time: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      lastSyncTime: 0,

      // Setters
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // Actions
      login: (user, token) => set({
        user,
        token,
        isAuthenticated: true,
        error: null,
      }),

      logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      }),

      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null,
      })),

      clearError: () => set({ error: null }),

      setLastSyncTime: (time) => set({ lastSyncTime: time }),
    }),
    {
      name: 'auth-store',
      version: 1,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;

