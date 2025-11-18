// Utility for managing flashcards
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
}

const STORAGE_KEY = 'flashcard_decks';
const MAX_DECKS = 50;

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

// Save deck
export const saveDeck = (deck: FlashcardDeck): void => {
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
  } catch (error) {
    console.error('Error saving deck:', error);
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

// Delete deck
export const deleteDeck = (id: string): void => {
  try {
    const decks = getAllDecks().filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
  } catch (error) {
    console.error('Error deleting deck:', error);
  }
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

// Record review result
export const recordReview = (deckId: string, cardId: string, correct: boolean): void => {
  const deck = getDeck(deckId);
  if (!deck) return;
  
  const cardIndex = deck.cards.findIndex(c => c.id === cardId);
  if (cardIndex === -1) return;
  
  const card = deck.cards[cardIndex];
  const { nextReview, newMasteryLevel } = calculateNextReview(card.masteryLevel, correct);
  
  deck.cards[cardIndex] = {
    ...card,
    lastReviewed: new Date().toISOString(),
    nextReview,
    masteryLevel: newMasteryLevel,
    reviewCount: card.reviewCount + 1,
    correctCount: correct ? card.correctCount + 1 : card.correctCount,
    incorrectCount: correct ? card.incorrectCount : card.incorrectCount + 1
  };
  
  saveDeck(deck);
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
