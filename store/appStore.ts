import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ExamHistoryItem {
  id: string;
  examTitle: string;
  examType: 'industrial' | 'agriculture' | string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpent: number;
  createdAt: string;
  isSubmitted: boolean;
}

interface AppState {
  // Exams
  examHistory: ExamHistoryItem[];
  setExamHistory: (items: ExamHistoryItem[]) => void;
  addExamHistory: (item: ExamHistoryItem) => void;
  removeExamHistory: (id: string) => void;
  clearExamHistory: () => void;

  // Pagination state for exam history (client-side)
  examPage: number;
  examPageSize: number;
  setExamPage: (page: number) => void;
  setExamPageSize: (size: number) => void;

  // Last sync time
  lastSyncTime: number;
  setLastSyncTime: (ts: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      examHistory: [],
      setExamHistory: (items) => set({ examHistory: items }),
      addExamHistory: (item) => set((state) => ({ examHistory: [item, ...state.examHistory] })),
      removeExamHistory: (id) => set((state) => ({ examHistory: state.examHistory.filter((x) => x.id !== id) })),
      clearExamHistory: () => set({ examHistory: [] }),

      examPage: 1,
      examPageSize: 10,
      setExamPage: (page) => set({ examPage: page }),
      setExamPageSize: (size) => set({ examPageSize: size, examPage: 1 }),

      lastSyncTime: 0,
      setLastSyncTime: (ts) => set({ lastSyncTime: ts }),
    }),
    {
      name: 'app-store',
      version: 1,
      partialize: (state) => ({
        examHistory: state.examHistory,
        examPageSize: state.examPageSize,
        lastSyncTime: state.lastSyncTime,
      }),
    }
  )
);

