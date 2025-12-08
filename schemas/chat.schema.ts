/**
 * ✅ PHASE 2 - STEP 2.1: Chat Schemas with Zod
 * 
 * Validate:
 * - Chat message
 * - Chat session
 * - Chat history
 */

import { z } from 'zod';

/**
 * ✅ Chat message schema
 */
export const ChatMessageSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1, 'Nội dung không được để trống'),
  timestamp: z.number(),
  files: z.array(z.object({
    name: z.string(),
    type: z.string(),
    size: z.number(),
    url: z.string().optional(),
  })).optional(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

/**
 * ✅ Chat session schema
 */
export const ChatSessionSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Tiêu đề không được để trống').max(200),
  messages: z.array(ChatMessageSchema).optional(),
  totalMessages: z.number().min(0),
  model: z.string().optional(),
  createdAt: z.number(),
  updatedAt: z.number().optional(),
  lastMessageAt: z.number().optional(),
});

export type ChatSession = z.infer<typeof ChatSessionSchema>;

/**
 * ✅ Send chat message request schema
 */
export const SendChatMessageRequestSchema = z.object({
  sessionId: z.string(),
  message: z.string().min(1).max(10000),
  files: z.array(z.object({
    name: z.string(),
    type: z.string(),
    size: z.number(),
  })).optional(),
  model: z.string().optional(),
});

export type SendChatMessageRequest = z.infer<typeof SendChatMessageRequestSchema>;

/**
 * ✅ Create chat session request schema
 */
export const CreateChatSessionRequestSchema = z.object({
  title: z.string().min(1).max(200),
  model: z.string().optional(),
});

export type CreateChatSessionRequest = z.infer<typeof CreateChatSessionRequestSchema>;

/**
 * ✅ Update chat session request schema
 */
export const UpdateChatSessionRequestSchema = z.object({
  title: z.string().min(1).max(200).optional(),
});

export type UpdateChatSessionRequest = z.infer<typeof UpdateChatSessionRequestSchema>;

/**
 * ✅ Chat response schema
 */
export const ChatResponseSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  role: z.enum(['user', 'assistant']),
  content: z.string(),
  timestamp: z.number(),
});

export type ChatResponse = z.infer<typeof ChatResponseSchema>;

/**
 * ✅ Validate send chat message request
 */
export function validateSendChatMessageRequest(data: unknown): SendChatMessageRequest {
  return SendChatMessageRequestSchema.parse(data);
}

/**
 * ✅ Validate create chat session request
 */
export function validateCreateChatSessionRequest(data: unknown): CreateChatSessionRequest {
  return CreateChatSessionRequestSchema.parse(data);
}

/**
 * ✅ Validate update chat session request
 */
export function validateUpdateChatSessionRequest(data: unknown): UpdateChatSessionRequest {
  return UpdateChatSessionRequestSchema.parse(data);
}

/**
 * ✅ Validate chat message
 */
export function validateChatMessage(data: unknown): ChatMessage {
  return ChatMessageSchema.parse(data);
}

/**
 * ✅ Validate chat session
 */
export function validateChatSession(data: unknown): ChatSession {
  return ChatSessionSchema.parse(data);
}

/**
 * ✅ Validate chat response
 */
export function validateChatResponse(data: unknown): ChatResponse {
  return ChatResponseSchema.parse(data);
}

/**
 * ✅ Safe validation (returns null on error)
 */
export function safeValidateSendChatMessageRequest(data: unknown): SendChatMessageRequest | null {
  try {
    return SendChatMessageRequestSchema.parse(data);
  } catch (error) {
    console.error('Send chat message request validation error:', error);
    return null;
  }
}

export function safeValidateCreateChatSessionRequest(data: unknown): CreateChatSessionRequest | null {
  try {
    return CreateChatSessionRequestSchema.parse(data);
  } catch (error) {
    console.error('Create chat session request validation error:', error);
    return null;
  }
}

export function safeValidateUpdateChatSessionRequest(data: unknown): UpdateChatSessionRequest | null {
  try {
    return UpdateChatSessionRequestSchema.parse(data);
  } catch (error) {
    console.error('Update chat session request validation error:', error);
    return null;
  }
}

export function safeValidateChatMessage(data: unknown): ChatMessage | null {
  try {
    return ChatMessageSchema.parse(data);
  } catch (error) {
    console.error('Chat message validation error:', error);
    return null;
  }
}

export function safeValidateChatSession(data: unknown): ChatSession | null {
  try {
    return ChatSessionSchema.parse(data);
  } catch (error) {
    console.error('Chat session validation error:', error);
    return null;
  }
}

export function safeValidateChatResponse(data: unknown): ChatResponse | null {
  try {
    return ChatResponseSchema.parse(data);
  } catch (error) {
    console.error('Chat response validation error:', error);
    return null;
  }
}

export default {
  ChatMessageSchema,
  ChatSessionSchema,
  SendChatMessageRequestSchema,
  CreateChatSessionRequestSchema,
  UpdateChatSessionRequestSchema,
  ChatResponseSchema,
  validateSendChatMessageRequest,
  validateCreateChatSessionRequest,
  validateUpdateChatSessionRequest,
  validateChatMessage,
  validateChatSession,
  validateChatResponse,
  safeValidateSendChatMessageRequest,
  safeValidateCreateChatSessionRequest,
  safeValidateUpdateChatSessionRequest,
  safeValidateChatMessage,
  safeValidateChatSession,
  safeValidateChatResponse,
};

