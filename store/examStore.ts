/**
 * ✅ PHASE 2 - STEP 2.2: Exam Store with Zustand
 * 
 * Features:
 * - Exam history management
 * - Current exam state
 * - Exam results
 * - Pagination
 * - Sync with backend
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ExamHistoryItem {
  id: string;
  examId?: string;
  examTitle: string;
  examType: 'industrial' | 'agriculture' | 'custom';
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpent: number;
  createdAt: string;
  isSubmitted: boolean;
  answers?: Record<string, string>;
  feedback?: string;
}

interface ExamState {
  // History
  history: ExamHistoryItem[];
  setHistory: (items: ExamHistoryItem[]) => void;
  addToHistory: (item: ExamHistoryItem) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;

  // Current exam
  currentExamId: string | null;
  setCurrentExamId: (id: string | null) => void;

  // Pagination
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;

  // Filters
  filterType: 'all' | 'industrial' | 'agriculture' | 'custom';
  setFilterType: (type: 'all' | 'industrial' | 'agriculture' | 'custom') => void;

  // Status
  isLoading: boolean;
  error: string | null;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Getters
  getFilteredHistory: () => ExamHistoryItem[];
  getPaginatedHistory: () => ExamHistoryItem[];
  getTotalPages: () => number;
  getStats: () => {
    totalExams: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
    passedExams: number;
  };

  // Sync
  lastSyncTime: number;
  setLastSyncTime: (time: number) => void;
}

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      // Initial state
      history: [],
      currentExamId: null,
      page: 1,
      pageSize: 10,
      filterType: 'all',
      isLoading: false,
      error: null,
      lastSyncTime: 0,

      // Setters
      setHistory: (items) => set({ history: items }),
      setCurrentExamId: (id) => set({ currentExamId: id }),
      setPage: (page) => set({ page }),
      setPageSize: (size) => set({ pageSize: size, page: 1 }),
      setFilterType: (type) => set({ filterType: type, page: 1 }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // Add to history
      addToHistory: (item) => set((state) => ({
        history: [item, ...state.history],
      })),

      // Remove from history
      removeFromHistory: (id) => set((state) => ({
        history: state.history.filter(item => item.id !== id),
      })),

      // Clear history
      clearHistory: () => set({ history: [] }),

      // Get filtered history
      getFilteredHistory: () => {
        const state = get();
        if (state.filterType === 'all') {
          return state.history;
        }
        return state.history.filter(item => item.examType === state.filterType);
      },

      // Get paginated history
      getPaginatedHistory: () => {
        const state = get();
        const filtered = get().getFilteredHistory();
        const start = (state.page - 1) * state.pageSize;
        return filtered.slice(start, start + state.pageSize);
      },

      // Get total pages
      getTotalPages: () => {
        const state = get();
        const filtered = get().getFilteredHistory();
        return Math.ceil(filtered.length / state.pageSize);
      },

      // Get stats
      getStats: () => {
        const state = get();
        const filtered = get().getFilteredHistory();

        if (filtered.length === 0) {
          return {
            totalExams: 0,
            averageScore: 0,
            highestScore: 0,
            lowestScore: 0,
            passedExams: 0,
          };
        }

        const scores = filtered.map(item => item.score);
        const passedExams = filtered.filter(item => item.percentage >= 70).length;

        return {
          totalExams: filtered.length,
          averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
          highestScore: Math.max(...scores),
          lowestScore: Math.min(...scores),
          passedExams,
        };
      },

      // Sync
      setLastSyncTime: (time) => set({ lastSyncTime: time }),
    }),
    {
      name: 'exam-store',
      version: 1,
      partialize: (state) => ({
        history: state.history,
        pageSize: state.pageSize,
      }),
    }
  )
);

export default useExamStore;

