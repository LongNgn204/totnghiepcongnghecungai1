/**
 * ✅ PHASE 2 - STEP 2.1: Flashcard Schemas with Zod
 * 
 * Validate:
 * - Flashcard deck
 * - Flashcard card
 * - Study progress
 */

import { z } from 'zod';

/**
 * ✅ Flashcard card schema
 */
export const FlashcardCardSchema = z.object({
  id: z.string(),
  deckId: z.string(),
  front: z.string().min(1, 'Mặt trước không được để trống'),
  back: z.string().min(1, 'Mặt sau không được để trống'),
  example: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  createdAt: z.number(),
  updatedAt: z.number().optional(),
});

export type FlashcardCard = z.infer<typeof FlashcardCardSchema>;

/**
 * ✅ Flashcard deck schema
 */
export const FlashcardDeckSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Tiêu đề không được để trống').max(200),
  description: z.string().max(1000).optional(),
  category: z.string().optional(),
  cards: z.array(FlashcardCardSchema).optional(),
  totalCards: z.number().min(0),
  createdAt: z.number(),
  updatedAt: z.number().optional(),
  createdBy: z.string().optional(),
});

export type FlashcardDeck = z.infer<typeof FlashcardDeckSchema>;

/**
 * ✅ Study progress schema
 */
export const StudyProgressSchema = z.object({
  cardId: z.string(),
  deckId: z.string(),
  correct: z.number().min(0),
  incorrect: z.number().min(0),
  lastReviewedAt: z.number(),
  nextReviewAt: z.number(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
});

export type StudyProgress = z.infer<typeof StudyProgressSchema>;

/**
 * ✅ Create flashcard deck request schema
 */
export const CreateFlashcardDeckRequestSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  category: z.string().optional(),
});

export type CreateFlashcardDeckRequest = z.infer<typeof CreateFlashcardDeckRequestSchema>;

/**
 * ✅ Create flashcard card request schema
 */
export const CreateFlashcardCardRequestSchema = z.object({
  deckId: z.string(),
  front: z.string().min(1),
  back: z.string().min(1),
  example: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
});

export type CreateFlashcardCardRequest = z.infer<typeof CreateFlashcardCardRequestSchema>;

/**
 * ✅ Update flashcard card request schema
 */
export const UpdateFlashcardCardRequestSchema = z.object({
  front: z.string().min(1).optional(),
  back: z.string().min(1).optional(),
  example: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
});

export type UpdateFlashcardCardRequest = z.infer<typeof UpdateFlashcardCardRequestSchema>;

/**
 * ✅ Record study progress request schema
 */
export const RecordStudyProgressRequestSchema = z.object({
  cardId: z.string(),
  deckId: z.string(),
  correct: z.boolean(),
});

export type RecordStudyProgressRequest = z.infer<typeof RecordStudyProgressRequestSchema>;

/**
 * ✅ Validate create flashcard deck request
 */
export function validateCreateFlashcardDeckRequest(data: unknown): CreateFlashcardDeckRequest {
  return CreateFlashcardDeckRequestSchema.parse(data);
}

/**
 * ✅ Validate create flashcard card request
 */
export function validateCreateFlashcardCardRequest(data: unknown): CreateFlashcardCardRequest {
  return CreateFlashcardCardRequestSchema.parse(data);
}

/**
 * ✅ Validate update flashcard card request
 */
export function validateUpdateFlashcardCardRequest(data: unknown): UpdateFlashcardCardRequest {
  return UpdateFlashcardCardRequestSchema.parse(data);
}

/**
 * ✅ Validate record study progress request
 */
export function validateRecordStudyProgressRequest(data: unknown): RecordStudyProgressRequest {
  return RecordStudyProgressRequestSchema.parse(data);
}

/**
 * ✅ Validate flashcard deck
 */
export function validateFlashcardDeck(data: unknown): FlashcardDeck {
  return FlashcardDeckSchema.parse(data);
}

/**
 * ✅ Validate flashcard card
 */
export function validateFlashcardCard(data: unknown): FlashcardCard {
  return FlashcardCardSchema.parse(data);
}

/**
 * ✅ Validate study progress
 */
export function validateStudyProgress(data: unknown): StudyProgress {
  return StudyProgressSchema.parse(data);
}

/**
 * ✅ Safe validation (returns null on error)
 */
export function safeValidateCreateFlashcardDeckRequest(data: unknown): CreateFlashcardDeckRequest | null {
  try {
    return CreateFlashcardDeckRequestSchema.parse(data);
  } catch (error) {
    console.error('Create flashcard deck request validation error:', error);
    return null;
  }
}

export function safeValidateCreateFlashcardCardRequest(data: unknown): CreateFlashcardCardRequest | null {
  try {
    return CreateFlashcardCardRequestSchema.parse(data);
  } catch (error) {
    console.error('Create flashcard card request validation error:', error);
    return null;
  }
}

export function safeValidateUpdateFlashcardCardRequest(data: unknown): UpdateFlashcardCardRequest | null {
  try {
    return UpdateFlashcardCardRequestSchema.parse(data);
  } catch (error) {
    console.error('Update flashcard card request validation error:', error);
    return null;
  }
}

export function safeValidateRecordStudyProgressRequest(data: unknown): RecordStudyProgressRequest | null {
  try {
    return RecordStudyProgressRequestSchema.parse(data);
  } catch (error) {
    console.error('Record study progress request validation error:', error);
    return null;
  }
}

export function safeValidateFlashcardDeck(data: unknown): FlashcardDeck | null {
  try {
    return FlashcardDeckSchema.parse(data);
  } catch (error) {
    console.error('Flashcard deck validation error:', error);
    return null;
  }
}

export function safeValidateFlashcardCard(data: unknown): FlashcardCard | null {
  try {
    return FlashcardCardSchema.parse(data);
  } catch (error) {
    console.error('Flashcard card validation error:', error);
    return null;
  }
}

export function safeValidateStudyProgress(data: unknown): StudyProgress | null {
  try {
    return StudyProgressSchema.parse(data);
  } catch (error) {
    console.error('Study progress validation error:', error);
    return null;
  }
}

export default {
  FlashcardCardSchema,
  FlashcardDeckSchema,
  StudyProgressSchema,
  CreateFlashcardDeckRequestSchema,
  CreateFlashcardCardRequestSchema,
  UpdateFlashcardCardRequestSchema,
  RecordStudyProgressRequestSchema,
  validateCreateFlashcardDeckRequest,
  validateCreateFlashcardCardRequest,
  validateUpdateFlashcardCardRequest,
  validateRecordStudyProgressRequest,
  validateFlashcardDeck,
  validateFlashcardCard,
  validateStudyProgress,
  safeValidateCreateFlashcardDeckRequest,
  safeValidateCreateFlashcardCardRequest,
  safeValidateUpdateFlashcardCardRequest,
  safeValidateRecordStudyProgressRequest,
  safeValidateFlashcardDeck,
  safeValidateFlashcardCard,
  safeValidateStudyProgress,
};

