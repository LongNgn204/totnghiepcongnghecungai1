/**
 * ✅ PHASE 2 - STEP 2.1: AI Schemas with Zod
 * 
 * Validate:
 * - AI generation request/response
 * - Prompt enhancement
 * - Model configuration
 */

import { z } from 'zod';

/**
 * ✅ Generation config schema
 */
export const GenerationConfigSchema = z.object({
  temperature: z.number().min(0).max(2).optional(),
  topK: z.number().min(1).optional(),
  topP: z.number().min(0).max(1).optional(),
  maxOutputTokens: z.number().min(1).optional(),
});

export type GenerationConfig = z.infer<typeof GenerationConfigSchema>;

/**
 * ✅ Safety setting schema
 */
export const SafetySettingSchema = z.object({
  category: z.string(),
  threshold: z.enum(['BLOCK_NONE', 'BLOCK_ONLY_HIGH', 'BLOCK_MEDIUM_AND_ABOVE', 'BLOCK_LOW_AND_ABOVE']),
});

export type SafetySetting = z.infer<typeof SafetySettingSchema>;

/**
 * ✅ AI generate request schema
 */
export const AIGenerateRequestSchema = z.object({
  prompt: z.string().min(1, 'Prompt không được để trống').max(10000),
  modelId: z.string().optional(),
  generationConfig: GenerationConfigSchema.optional(),
  safetySettings: z.array(SafetySettingSchema).optional(),
});

export type AIGenerateRequest = z.infer<typeof AIGenerateRequestSchema>;

/**
 * ✅ AI generate response schema
 */
export const AIGenerateResponseSchema = z.object({
  text: z.string(),
  success: z.boolean(),
  error: z.string().optional(),
  modelUsed: z.string().optional(),
  tokensUsed: z.number().optional(),
});

export type AIGenerateResponse = z.infer<typeof AIGenerateResponseSchema>;

/**
 * ✅ AI chat request schema
 */
export const AIChatRequestSchema = z.object({
  message: z.string().min(1).max(10000),
  sessionId: z.string().optional(),
  files: z.array(z.object({
    name: z.string(),
    type: z.string(),
    size: z.number(),
  })).optional(),
  modelId: z.string().optional(),
  generationConfig: GenerationConfigSchema.optional(),
});

export type AIChatRequest = z.infer<typeof AIChatRequestSchema>;

/**
 * ✅ AI chat response schema
 */
export const AIChatResponseSchema = z.object({
  text: z.string(),
  success: z.boolean(),
  error: z.string().optional(),
  sessionId: z.string().optional(),
  modelUsed: z.string().optional(),
  tokensUsed: z.number().optional(),
});

export type AIChatResponse = z.infer<typeof AIChatResponseSchema>;

/**
 * ✅ Prompt enhancement request schema
 */
export const PromptEnhancementRequestSchema = z.object({
  prompt: z.string().min(1).max(10000),
  style: z.enum(['detailed', 'concise', 'creative', 'technical']).optional(),
  language: z.string().optional(),
});

export type PromptEnhancementRequest = z.infer<typeof PromptEnhancementRequestSchema>;

/**
 * ✅ Prompt enhancement response schema
 */
export const PromptEnhancementResponseSchema = z.object({
  original: z.string(),
  enhanced: z.string(),
  suggestions: z.array(z.string()).optional(),
});

export type PromptEnhancementResponse = z.infer<typeof PromptEnhancementResponseSchema>;

/**
 * ✅ Model info schema
 */
export const ModelInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  maxTokens: z.number().optional(),
  costPer1kTokens: z.number().optional(),
  available: z.boolean().optional(),
});

export type ModelInfo = z.infer<typeof ModelInfoSchema>;

/**
 * ✅ Validate AI generate request
 */
export function validateAIGenerateRequest(data: unknown): AIGenerateRequest {
  return AIGenerateRequestSchema.parse(data);
}

/**
 * ✅ Validate AI chat request
 */
export function validateAIChatRequest(data: unknown): AIChatRequest {
  return AIChatRequestSchema.parse(data);
}

/**
 * ✅ Validate prompt enhancement request
 */
export function validatePromptEnhancementRequest(data: unknown): PromptEnhancementRequest {
  return PromptEnhancementRequestSchema.parse(data);
}

/**
 * ✅ Validate AI generate response
 */
export function validateAIGenerateResponse(data: unknown): AIGenerateResponse {
  return AIGenerateResponseSchema.parse(data);
}

/**
 * ✅ Validate AI chat response
 */
export function validateAIChatResponse(data: unknown): AIChatResponse {
  return AIChatResponseSchema.parse(data);
}

/**
 * ✅ Validate prompt enhancement response
 */
export function validatePromptEnhancementResponse(data: unknown): PromptEnhancementResponse {
  return PromptEnhancementResponseSchema.parse(data);
}

/**
 * ✅ Safe validation (returns null on error)
 */
export function safeValidateAIGenerateRequest(data: unknown): AIGenerateRequest | null {
  try {
    return AIGenerateRequestSchema.parse(data);
  } catch (error) {
    console.error('AI generate request validation error:', error);
    return null;
  }
}

export function safeValidateAIChatRequest(data: unknown): AIChatRequest | null {
  try {
    return AIChatRequestSchema.parse(data);
  } catch (error) {
    console.error('AI chat request validation error:', error);
    return null;
  }
}

export function safeValidatePromptEnhancementRequest(data: unknown): PromptEnhancementRequest | null {
  try {
    return PromptEnhancementRequestSchema.parse(data);
  } catch (error) {
    console.error('Prompt enhancement request validation error:', error);
    return null;
  }
}

export function safeValidateAIGenerateResponse(data: unknown): AIGenerateResponse | null {
  try {
    return AIGenerateResponseSchema.parse(data);
  } catch (error) {
    console.error('AI generate response validation error:', error);
    return null;
  }
}

export function safeValidateAIChatResponse(data: unknown): AIChatResponse | null {
  try {
    return AIChatResponseSchema.parse(data);
  } catch (error) {
    console.error('AI chat response validation error:', error);
    return null;
  }
}

export function safeValidatePromptEnhancementResponse(data: unknown): PromptEnhancementResponse | null {
  try {
    return PromptEnhancementResponseSchema.parse(data);
  } catch (error) {
    console.error('Prompt enhancement response validation error:', error);
    return null;
  }
}

export default {
  GenerationConfigSchema,
  SafetySettingSchema,
  AIGenerateRequestSchema,
  AIGenerateResponseSchema,
  AIChatRequestSchema,
  AIChatResponseSchema,
  PromptEnhancementRequestSchema,
  PromptEnhancementResponseSchema,
  ModelInfoSchema,
  validateAIGenerateRequest,
  validateAIChatRequest,
  validatePromptEnhancementRequest,
  validateAIGenerateResponse,
  validateAIChatResponse,
  validatePromptEnhancementResponse,
  safeValidateAIGenerateRequest,
  safeValidateAIChatRequest,
  safeValidatePromptEnhancementRequest,
  safeValidateAIGenerateResponse,
  safeValidateAIChatResponse,
  safeValidatePromptEnhancementResponse,
};

