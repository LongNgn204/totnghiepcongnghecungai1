/**
 * ✅ PHASE 2 - STEP 2.2: Flashcard Store with Zustand
 * 
 * Features:
 * - Flashcard decks management
 * - Flashcard cards
 * - Study progress
 * - Sync with backend
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FlashcardCard {
  id: string;
  deckId: string;
  front: string;
  back: string;
  example?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  createdAt: number;
  updatedAt?: number;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  description?: string;
  category?: string;
  cards: FlashcardCard[];
  totalCards: number;
  createdAt: number;
  updatedAt?: number;
}

export interface StudyProgress {
  cardId: string;
  deckId: string;
  correct: number;
  incorrect: number;
  lastReviewedAt: number;
  nextReviewAt: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface FlashcardState {
  // Decks
  decks: FlashcardDeck[];
  setDecks: (decks: FlashcardDeck[]) => void;
  addDeck: (deck: FlashcardDeck) => void;
  removeDeck: (id: string) => void;
  updateDeck: (id: string, updates: Partial<FlashcardDeck>) => void;

  // Current deck
  currentDeckId: string | null;
  setCurrentDeckId: (id: string | null) => void;
  getCurrentDeck: () => FlashcardDeck | null;

  // Cards
  addCard: (deckId: string, card: FlashcardCard) => void;
  removeCard: (deckId: string, cardId: string) => void;
  updateCard: (deckId: string, cardId: string, updates: Partial<FlashcardCard>) => void;
  getCards: (deckId: string) => FlashcardCard[];

  // Study progress
  progress: StudyProgress[];
  recordProgress: (progress: StudyProgress) => void;
  getProgress: (cardId: string) => StudyProgress | null;
  getProgressStats: (deckId: string) => {
    totalCards: number;
    masteredCards: number;
    learningCards: number;
    newCards: number;
    averageCorrect: number;
  };

  // Current card
  currentCardIndex: number;
  setCurrentCardIndex: (index: number) => void;

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

export const useFlashcardStore = create<FlashcardState>()(
  persist(
    (set, get) => ({
      // Initial state
      decks: [],
      currentDeckId: null,
      progress: [],
      currentCardIndex: 0,
      isLoading: false,
      error: null,
      lastSyncTime: 0,

      // Setters
      setDecks: (decks) => set({ decks }),
      setCurrentDeckId: (id) => set({ currentDeckId: id }),
      setCurrentCardIndex: (index) => set({ currentCardIndex: index }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // Add deck
      addDeck: (deck) => set((state) => ({
        decks: [deck, ...state.decks],
      })),

      // Remove deck
      removeDeck: (id) => set((state) => ({
        decks: state.decks.filter(d => d.id !== id),
        currentDeckId: state.currentDeckId === id ? null : state.currentDeckId,
      })),

      // Update deck
      updateDeck: (id, updates) => set((state) => ({
        decks: state.decks.map(d =>
          d.id === id ? { ...d, ...updates, updatedAt: Date.now() } : d
        ),
      })),

      // Get current deck
      getCurrentDeck: () => {
        const state = get();
        return state.decks.find(d => d.id === state.currentDeckId) || null;
      },

      // Add card
      addCard: (deckId, card) => set((state) => ({
        decks: state.decks.map(d =>
          d.id === deckId
            ? {
              ...d,
              cards: [...d.cards, card],
              totalCards: d.totalCards + 1,
              updatedAt: Date.now(),
            }
            : d
        ),
      })),

      // Remove card
      removeCard: (deckId, cardId) => set((state) => ({
        decks: state.decks.map(d =>
          d.id === deckId
            ? {
              ...d,
              cards: d.cards.filter(c => c.id !== cardId),
              totalCards: d.totalCards - 1,
              updatedAt: Date.now(),
            }
            : d
        ),
      })),

      // Update card
      updateCard: (deckId, cardId, updates) => set((state) => ({
        decks: state.decks.map(d =>
          d.id === deckId
            ? {
              ...d,
              cards: d.cards.map(c =>
                c.id === cardId ? { ...c, ...updates, updatedAt: Date.now() } : c
              ),
              updatedAt: Date.now(),
            }
            : d
        ),
      })),

      // Get cards
      getCards: (deckId) => {
        const state = get();
        const deck = state.decks.find(d => d.id === deckId);
        return deck?.cards || [];
      },

      // Record progress
      recordProgress: (prog) => set((state) => {
        const existing = state.progress.find(p => p.cardId === prog.cardId);
        return {
          progress: existing
            ? state.progress.map(p => p.cardId === prog.cardId ? prog : p)
            : [...state.progress, prog],
        };
      }),

      // Get progress
      getProgress: (cardId) => {
        const state = get();
        return state.progress.find(p => p.cardId === cardId) || null;
      },

      // Get progress stats
      getProgressStats: (deckId) => {
        const state = get();
        const cards = get().getCards(deckId);

        if (cards.length === 0) {
          return {
            totalCards: 0,
            masteredCards: 0,
            learningCards: 0,
            newCards: 0,
            averageCorrect: 0,
          };
        }

        let masteredCards = 0;
        let learningCards = 0;
        let newCards = 0;
        let totalCorrect = 0;

        for (const card of cards) {
          const progress = state.progress.find(p => p.cardId === card.id);
          if (!progress) {
            newCards++;
          } else {
            const correctRate = progress.correct / (progress.correct + progress.incorrect);
            if (correctRate >= 0.8) {
              masteredCards++;
            } else {
              learningCards++;
            }
            totalCorrect += progress.correct;
          }
        }

        return {
          totalCards: cards.length,
          masteredCards,
          learningCards,
          newCards,
          averageCorrect: cards.length > 0 ? Math.round((totalCorrect / cards.length) * 100) : 0,
        };
      },

      // Sync
      setLastSyncTime: (time) => set({ lastSyncTime: time }),

      // Clear
      clear: () => set({
        decks: [],
        currentDeckId: null,
        progress: [],
        currentCardIndex: 0,
        isLoading: false,
        error: null,
      }),
    }),
    {
      name: 'flashcard-store',
      version: 1,
      partialize: (state) => ({
        decks: state.decks,
        progress: state.progress,
      }),
    }
  )
);

export default useFlashcardStore;

