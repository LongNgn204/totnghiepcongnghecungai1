// Chú thích: Zustand store cho app state
import { create } from 'zustand';

interface AppState {
    // Theme
    isDarkMode: boolean;
    toggleDarkMode: () => void;

    // Loading states
    isLoading: boolean;
    setLoading: (loading: boolean) => void;

    // Toast/notifications
    notification: { type: 'success' | 'error' | 'info'; message: string } | null;
    showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
    clearNotification: () => void;
}

export const useAppStore = create<AppState>((set) => ({
    // Chú thích: Luôn tắt dark mode
    isDarkMode: false,

    toggleDarkMode: () => { },

    isLoading: false,
    setLoading: (loading) => set({ isLoading: loading }),

    notification: null,
    showNotification: (type, message) => {
        set({ notification: { type, message } });
        // Chú thích: Auto clear sau 3s
        setTimeout(() => set({ notification: null }), 3000);
    },
    clearNotification: () => set({ notification: null }),
}));
