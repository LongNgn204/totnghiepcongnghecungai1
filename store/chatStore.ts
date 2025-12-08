/**
 * ✅ PHASE 2 - STEP 2.2: Chat Store with Zustand
 * 
 * Features:
 * - Chat sessions management
 * - Chat messages
 * - Session history
 * - Sync with backend
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  files?: Array<{
    name: string;
    type: string;
    size: number;
    url?: string;
  }>;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  model?: string;
  createdAt: number;
  updatedAt: number;
  lastMessageAt?: number;
}

interface ChatState {
  // Sessions
  sessions: ChatSession[];
  currentSessionId: string | null;
  setSessions: (sessions: ChatSession[]) => void;
  setCurrentSessionId: (id: string | null) => void;

  // Messages
  addMessage: (message: ChatMessage) => void;
  removeMessage: (sessionId: string, messageId: string) => void;
  updateMessage: (sessionId: string, messageId: string, content: string) => void;

  // Sessions management
  createSession: (session: ChatSession) => void;
  deleteSession: (id: string) => void;
  updateSession: (id: string, updates: Partial<ChatSession>) => void;

  // Getters
  getCurrentSession: () => ChatSession | null;
  getSessionMessages: (sessionId: string) => ChatMessage[];

  // Status
  isLoading: boolean;
  error: string | null;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Sync
  lastSyncTime: number;
  setLastSyncTime: (time: number) => void;

  // Clear
  clear: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // Initial state
      sessions: [],
      currentSessionId: null,
      isLoading: false,
      error: null,
      lastSyncTime: 0,

      // Setters
      setSessions: (sessions) => set({ sessions }),
      setCurrentSessionId: (id) => set({ currentSessionId: id }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // Add message
      addMessage: (message) => set((state) => ({
        sessions: state.sessions.map(session =>
          session.id === message.sessionId
            ? {
              ...session,
              messages: [...session.messages, message],
              updatedAt: Date.now(),
              lastMessageAt: message.timestamp,
            }
            : session
        ),
      })),

      // Remove message
      removeMessage: (sessionId, messageId) => set((state) => ({
        sessions: state.sessions.map(session =>
          session.id === sessionId
            ? {
              ...session,
              messages: session.messages.filter(m => m.id !== messageId),
              updatedAt: Date.now(),
            }
            : session
        ),
      })),

      // Update message
      updateMessage: (sessionId, messageId, content) => set((state) => ({
        sessions: state.sessions.map(session =>
          session.id === sessionId
            ? {
              ...session,
              messages: session.messages.map(m =>
                m.id === messageId ? { ...m, content } : m
              ),
              updatedAt: Date.now(),
            }
            : session
        ),
      })),

      // Create session
      createSession: (session) => set((state) => ({
        sessions: [session, ...state.sessions],
        currentSessionId: session.id,
      })),

      // Delete session
      deleteSession: (id) => set((state) => ({
        sessions: state.sessions.filter(s => s.id !== id),
        currentSessionId: state.currentSessionId === id ? null : state.currentSessionId,
      })),

      // Update session
      updateSession: (id, updates) => set((state) => ({
        sessions: state.sessions.map(session =>
          session.id === id
            ? { ...session, ...updates, updatedAt: Date.now() }
            : session
        ),
      })),

      // Get current session
      getCurrentSession: () => {
        const state = get();
        return state.sessions.find(s => s.id === state.currentSessionId) || null;
      },

      // Get session messages
      getSessionMessages: (sessionId) => {
        const state = get();
        const session = state.sessions.find(s => s.id === sessionId);
        return session?.messages || [];
      },

      // Sync
      setLastSyncTime: (time) => set({ lastSyncTime: time }),

      // Clear
      clear: () => set({
        sessions: [],
        currentSessionId: null,
        isLoading: false,
        error: null,
      }),
    }),
    {
      name: 'chat-store',
      version: 1,
      partialize: (state) => ({
        sessions: state.sessions,
        currentSessionId: state.currentSessionId,
      }),
    }
  )
);

export default useChatStore;

