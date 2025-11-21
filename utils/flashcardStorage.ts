// Utility for managing flashcards with Backend Sync
import { flashcardsAPI } from './apiClient';

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  imageUrl?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  createdAt: string;
  lastReviewed?: string;
  nextReview?: string;
  reviewCount: number;
  correctCount: number;
  incorrectCount: number;
  masteryLevel: number; // 0-5, higher = better mastered
  ease_factor?: number;
  interval?: number;
  repetitions?: number;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  description: string;
  cards: Flashcard[];
  category: string; // Công nghiệp, Nông nghiệp, Chung
  grade: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  author: string;
  color?: string;
  is_public?: number;
}

const STORAGE_KEY = 'flashcard_decks';
const MAX_DECKS = 50;
const SYNC_ENABLED_KEY = 'flashcard_sync_enabled';

// Check if sync is enabled
export const isSyncEnabled = (): boolean => {
  const enabled = localStorage.getItem(SYNC_ENABLED_KEY);
  return enabled !== 'false'; // Default true
};

// Enable/disable sync
export const setSyncEnabled = (enabled: boolean): void => {
  localStorage.setItem(SYNC_ENABLED_KEY, enabled.toString());
};

// Generate unique ID
const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Spaced repetition algorithm (SM-2)
const calculateNextReview = (
  masteryLevel: number,
  correct: boolean
): { nextReview: string; newMasteryLevel: number } => {
  let newLevel = masteryLevel;
  
  if (correct) {
    newLevel = Math.min(5, masteryLevel + 1);
  } else {
    newLevel = Math.max(0, masteryLevel - 1);
  }
  
  // Calculate days until next review based on mastery level
  const daysUntilReview = [0, 1, 3, 7, 14, 30][newLevel];
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + daysUntilReview);
  
  return {
    nextReview: nextReview.toISOString(),
    newMasteryLevel: newLevel
  };
};

// Save deck with auto-sync
export const saveDeck = async (deck: FlashcardDeck): Promise<void> => {
  try {
    const decks = getAllDecks();
    const existingIndex = decks.findIndex(d => d.id === deck.id);
    
    deck.updatedAt = new Date().toISOString();
    
    if (existingIndex !== -1) {
      decks[existingIndex] = deck;
    } else {
      decks.unshift(deck);
      
      if (decks.length > MAX_DECKS) {
        decks.splice(MAX_DECKS);
      }
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
    
    // Sync to backend if enabled
    if (isSyncEnabled() && navigator.onLine) {
      try {
        if (existingIndex === -1) {
          // Create new deck on backend
          await flashcardsAPI.createDeck({
            id: deck.id,
            title: deck.title,
            description: deck.description,
            category: deck.category,
            grade: parseInt(deck.grade) || 12,
            is_public: deck.isPublic ? 1 : 0,
            color: deck.color || 'blue',
          });
          
          // Add cards to deck
          for (const card of deck.cards) {
            await flashcardsAPI.addCard(deck.id, {
              id: card.id,
              question: card.question,
              answer: card.answer,
              difficulty: card.difficulty,
              tags: card.tags,
            });
          }
          console.log('✅ Deck created on backend:', deck.id);
        }
        // Note: Updates are handled separately per card
      } catch (syncError) {
        console.warn('⚠️ Failed to sync deck to backend:', syncError);
      }
    }
  } catch (error) {
    console.error('Error saving deck:', error);
    throw error;
  }
};

// Get all decks
export const getAllDecks = (): FlashcardDeck[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting decks:', error);
    return [];
  }
};

// Get deck by ID
export const getDeck = (id: string): FlashcardDeck | null => {
  const decks = getAllDecks();
  return decks.find(d => d.id === id) || null;
};

// Delete deck with backend sync
export const deleteDeck = async (id: string): Promise<void> => {
  try {
    const decks = getAllDecks().filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
    
    // Delete from backend
    if (isSyncEnabled() && navigator.onLine) {
      try {
        await flashcardsAPI.deleteDeck(id);
        console.log('✅ Deck deleted from backend:', id);
      } catch (syncError) {
        console.warn('⚠️ Failed to delete deck from backend:', syncError);
      }
    }
  } catch (error) {
    console.error('Error deleting deck:', error);
    throw error;
  }
};

// Sync decks from backend
export const syncDecksFromBackend = async (): Promise<FlashcardDeck[]> => {
  if (!isSyncEnabled() || !navigator.onLine) {
    console.log('🔌 Sync disabled or offline, using local data');
    return getAllDecks();
  }

  try {
    console.log('🔄 Syncing flashcard decks from backend...');
    const response = await flashcardsAPI.getAllDecks({ limit: 100 });
    const backendDecks = response.data.decks || [];
    
    // Fetch cards for each deck
    const decksWithCards: FlashcardDeck[] = [];
    for (const deck of backendDecks) {
      try {
        const detailResponse = await flashcardsAPI.getDeck(deck.id);
        const fullDeck = detailResponse.data;
        
        decksWithCards.push({
          id: fullDeck.id,
          title: fullDeck.title,
          description: fullDeck.description || '',
          category: fullDeck.category,
          grade: fullDeck.grade?.toString() || '12',
          createdAt: new Date(fullDeck.created_at).toISOString(),
          updatedAt: new Date(fullDeck.updated_at).toISOString(),
          isPublic: Boolean(fullDeck.is_public),
          author: 'Bạn',
          color: fullDeck.color || 'blue',
          cards: (fullDeck.cards || []).map((card: any) => ({
            id: card.id,
            question: card.question,
            answer: card.answer,
            difficulty: card.difficulty || 'medium',
            tags: card.tags || [],
            createdAt: new Date(card.created_at).toISOString(),
            lastReviewed: card.last_reviewed ? new Date(card.last_reviewed).toISOString() : undefined,
            nextReview: card.next_review ? new Date(card.next_review).toISOString() : undefined,
            reviewCount: card.review_count || 0,
            correctCount: card.correct_count || 0,
            incorrectCount: card.review_count - card.correct_count || 0,
            masteryLevel: card.mastery_level || 0,
            ease_factor: card.ease_factor,
            interval: card.interval,
            repetitions: card.repetitions,
          })),
        });
      } catch (error) {
        console.warn(`Failed to fetch cards for deck ${deck.id}:`, error);
      }
    }
    
    // Merge with local data
    const localDecks = getAllDecks();
    const merged = mergeDecks(decksWithCards, localDecks);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    console.log(`✅ Synced ${decksWithCards.length} decks from backend`);
    
    return merged;
  } catch (error) {
    console.error('❌ Failed to sync decks from backend:', error);
    return getAllDecks();
  }
};

// Merge decks
const mergeDecks = (backendDecks: FlashcardDeck[], localDecks: FlashcardDeck[]): FlashcardDeck[] => {
  const backendIds = new Set(backendDecks.map(d => d.id));
  const localOnlyDecks = localDecks.filter(d => !backendIds.has(d.id));
  
  const merged = [...backendDecks, ...localOnlyDecks];
  merged.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  
  return merged.slice(0, MAX_DECKS);
};

// Create new deck
export const createDeck = (
  title: string,
  description: string,
  category: string,
  grade: string
): FlashcardDeck => {
  return {
    id: generateId(),
    title,
    description,
    cards: [],
    category,
    grade,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublic: false,
    author: 'Bạn'
  };
};

// Add card to deck
export const addCardToDeck = (deckId: string, card: Omit<Flashcard, 'id' | 'createdAt' | 'reviewCount' | 'correctCount' | 'incorrectCount' | 'masteryLevel'>): void => {
  const deck = getDeck(deckId);
  if (!deck) return;
  
  const newCard: Flashcard = {
    ...card,
    id: generateId(),
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    correctCount: 0,
    incorrectCount: 0,
    masteryLevel: 0
  };
  
  deck.cards.push(newCard);
  saveDeck(deck);
};

// Update card
export const updateCard = (deckId: string, cardId: string, updates: Partial<Flashcard>): void => {
  const deck = getDeck(deckId);
  if (!deck) return;
  
  const cardIndex = deck.cards.findIndex(c => c.id === cardId);
  if (cardIndex === -1) return;
  
  deck.cards[cardIndex] = { ...deck.cards[cardIndex], ...updates };
  saveDeck(deck);
};

// Delete card
export const deleteCard = (deckId: string, cardId: string): void => {
  const deck = getDeck(deckId);
  if (!deck) return;
  
  deck.cards = deck.cards.filter(c => c.id !== cardId);
  saveDeck(deck);
};

// Record review result with backend sync
export const recordReview = async (deckId: string, cardId: string, correct: boolean): Promise<void> => {
  const deck = getDeck(deckId);
  if (!deck) return;
  
  const cardIndex = deck.cards.findIndex(c => c.id === cardId);
  if (cardIndex === -1) return;
  
  const card = deck.cards[cardIndex];
  const { nextReview, newMasteryLevel } = calculateNextReview(card.masteryLevel, correct);
  
  const updatedCard = {
    ...card,
    lastReviewed: new Date().toISOString(),
    nextReview,
    masteryLevel: newMasteryLevel,
    reviewCount: card.reviewCount + 1,
    correctCount: correct ? card.correctCount + 1 : card.correctCount,
    incorrectCount: correct ? card.incorrectCount : card.incorrectCount + 1
  };
  
  deck.cards[cardIndex] = updatedCard;
  await saveDeck(deck);
  
  // Sync card review data to backend
  if (isSyncEnabled() && navigator.onLine) {
    try {
      await flashcardsAPI.updateCard(cardId, {
        ease_factor: 2.5,
        interval: 0,
        repetitions: updatedCard.reviewCount,
        mastery_level: newMasteryLevel,
        review_count: updatedCard.reviewCount,
        correct_count: updatedCard.correctCount,
        next_review: new Date(nextReview).getTime(),
        last_reviewed: new Date().getTime(),
      });
      console.log('✅ Card review synced:', cardId);
    } catch (syncError) {
      console.warn('⚠️ Failed to sync card review:', syncError);
    }
  }
};

// Get cards due for review
export const getCardsForReview = (deckId: string): Flashcard[] => {
  const deck = getDeck(deckId);
  if (!deck) return [];
  
  const now = new Date();
  return deck.cards.filter(card => {
    if (!card.nextReview) return true; // Never reviewed
    return new Date(card.nextReview) <= now;
  });
};

// Get deck statistics
export const getDeckStats = (deckId: string) => {
  const deck = getDeck(deckId);
  if (!deck) return null;
  
  const totalCards = deck.cards.length;
  const masteredCards = deck.cards.filter(c => c.masteryLevel >= 4).length;
  const learningCards = deck.cards.filter(c => c.masteryLevel > 0 && c.masteryLevel < 4).length;
  const newCards = deck.cards.filter(c => c.masteryLevel === 0).length;
  const dueCards = getCardsForReview(deckId).length;
  
  const totalReviews = deck.cards.reduce((sum, c) => sum + c.reviewCount, 0);
  const totalCorrect = deck.cards.reduce((sum, c) => sum + c.correctCount, 0);
  const accuracy = totalReviews > 0 ? (totalCorrect / totalReviews) * 100 : 0;
  
  return {
    totalCards,
    masteredCards,
    learningCards,
    newCards,
    dueCards,
    totalReviews,
    accuracy: accuracy.toFixed(1)
  };
};

// Search decks
export const searchDecks = (query: string): FlashcardDeck[] => {
  if (!query.trim()) return getAllDecks();
  
  const lowerQuery = query.toLowerCase();
  return getAllDecks().filter(deck =>
    deck.title.toLowerCase().includes(lowerQuery) ||
    deck.description.toLowerCase().includes(lowerQuery) ||
    deck.cards.some(c => 
      c.question.toLowerCase().includes(lowerQuery) ||
      c.answer.toLowerCase().includes(lowerQuery)
    )
  );
};

// Export deck to JSON
export const exportDeckToJSON = (deckId: string): string => {
  const deck = getDeck(deckId);
  if (!deck) return '';
  
  return JSON.stringify(deck, null, 2);
};

// Import deck from JSON
export const importDeckFromJSON = (jsonString: string): boolean => {
  try {
    const deck = JSON.parse(jsonString) as FlashcardDeck;
    deck.id = generateId(); // New ID for imported deck
    deck.createdAt = new Date().toISOString();
    deck.updatedAt = new Date().toISOString();
    saveDeck(deck);
    return true;
  } catch (error) {
    console.error('Error importing deck:', error);
    return false;
  }
};
