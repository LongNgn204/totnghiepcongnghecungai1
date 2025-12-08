/**
 * ✅ PHASE 2 - STEP 2.1: Exam Schemas with Zod
 * 
 * Validate:
 * - Exam creation
 * - Exam submission
 * - Exam history
 * - Questions
 */

import { z } from 'zod';

/**
 * ✅ Question option schema
 */
export const QuestionOptionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, 'Tùy chọn không được để trống'),
  isCorrect: z.boolean().optional(),
});

export type QuestionOption = z.infer<typeof QuestionOptionSchema>;

/**
 * ✅ Multiple choice question schema
 */
export const MCQuestionSchema = z.object({
  id: z.string(),
  question: z.string().min(1, 'Câu hỏi không được để trống'),
  options: z.array(QuestionOptionSchema).min(2, 'Phải có ít nhất 2 tùy chọn'),
  correctAnswer: z.string(),
  explanation: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
});

export type MCQuestion = z.infer<typeof MCQuestionSchema>;

/**
 * ✅ True/False question schema
 */
export const TrueFalseQuestionSchema = z.object({
  id: z.string(),
  question: z.string().min(1, 'Câu hỏi không được để trống'),
  correctAnswer: z.boolean(),
  explanation: z.string().optional(),
});

export type TrueFalseQuestion = z.infer<typeof TrueFalseQuestionSchema>;

/**
 * ✅ Short answer question schema
 */
export const ShortAnswerQuestionSchema = z.object({
  id: z.string(),
  question: z.string().min(1, 'Câu hỏi không được để trống'),
  correctAnswers: z.array(z.string()).min(1, 'Phải có ít nhất 1 câu trả lời đúng'),
  explanation: z.string().optional(),
});

export type ShortAnswerQuestion = z.infer<typeof ShortAnswerQuestionSchema>;

/**
 * ✅ Exam schema
 */
export const ExamSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Tiêu đề không được để trống').max(200),
  description: z.string().max(1000).optional(),
  type: z.enum(['industrial', 'agriculture', 'custom']),
  duration: z.number().min(1, 'Thời gian phải lớn hơn 0').max(480, 'Thời gian tối đa 480 phút'),
  questions: z.array(MCQuestionSchema).min(1, 'Phải có ít nhất 1 câu hỏi'),
  totalQuestions: z.number(),
  passingScore: z.number().min(0).max(100).optional(),
  createdAt: z.number(),
  updatedAt: z.number().optional(),
  createdBy: z.string().optional(),
});

export type Exam = z.infer<typeof ExamSchema>;

/**
 * ✅ Exam history item schema
 */
export const ExamHistoryItemSchema = z.object({
  id: z.string(),
  examId: z.string().optional(),
  examTitle: z.string(),
  examType: z.enum(['industrial', 'agriculture', 'custom']),
  score: z.number().min(0).max(100),
  totalQuestions: z.number(),
  percentage: z.number().min(0).max(100),
  timeSpent: z.number().min(0),
  createdAt: z.string(),
  isSubmitted: z.boolean(),
  answers: z.record(z.string()).optional(),
  feedback: z.string().optional(),
});

export type ExamHistoryItem = z.infer<typeof ExamHistoryItemSchema>;

/**
 * ✅ Create exam request schema
 */
export const CreateExamRequestSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  type: z.enum(['industrial', 'agriculture', 'custom']),
  duration: z.number().min(1).max(480),
  questions: z.array(MCQuestionSchema).min(1),
  passingScore: z.number().min(0).max(100).optional(),
});

export type CreateExamRequest = z.infer<typeof CreateExamRequestSchema>;

/**
 * ✅ Submit exam request schema
 */
export const SubmitExamRequestSchema = z.object({
  examId: z.string(),
  answers: z.record(z.string()),
  timeSpent: z.number().min(0),
});

export type SubmitExamRequest = z.infer<typeof SubmitExamRequestSchema>;

/**
 * ✅ Exam result schema
 */
export const ExamResultSchema = z.object({
  id: z.string(),
  examId: z.string(),
  userId: z.string(),
  score: z.number().min(0).max(100),
  percentage: z.number().min(0).max(100),
  totalQuestions: z.number(),
  correctAnswers: z.number(),
  timeSpent: z.number(),
  passed: z.boolean(),
  answers: z.record(z.string()),
  feedback: z.string().optional(),
  createdAt: z.number(),
});

export type ExamResult = z.infer<typeof ExamResultSchema>;

/**
 * ✅ Validate create exam request
 */
export function validateCreateExamRequest(data: unknown): CreateExamRequest {
  return CreateExamRequestSchema.parse(data);
}

/**
 * ✅ Validate submit exam request
 */
export function validateSubmitExamRequest(data: unknown): SubmitExamRequest {
  return SubmitExamRequestSchema.parse(data);
}

/**
 * ✅ Validate exam
 */
export function validateExam(data: unknown): Exam {
  return ExamSchema.parse(data);
}

/**
 * ✅ Validate exam history item
 */
export function validateExamHistoryItem(data: unknown): ExamHistoryItem {
  return ExamHistoryItemSchema.parse(data);
}

/**
 * ✅ Validate exam result
 */
export function validateExamResult(data: unknown): ExamResult {
  return ExamResultSchema.parse(data);
}

/**
 * ✅ Safe validation (returns null on error)
 */
export function safeValidateCreateExamRequest(data: unknown): CreateExamRequest | null {
  try {
    return CreateExamRequestSchema.parse(data);
  } catch (error) {
    console.error('Create exam request validation error:', error);
    return null;
  }
}

export function safeValidateSubmitExamRequest(data: unknown): SubmitExamRequest | null {
  try {
    return SubmitExamRequestSchema.parse(data);
  } catch (error) {
    console.error('Submit exam request validation error:', error);
    return null;
  }
}

export function safeValidateExam(data: unknown): Exam | null {
  try {
    return ExamSchema.parse(data);
  } catch (error) {
    console.error('Exam validation error:', error);
    return null;
  }
}

export function safeValidateExamHistoryItem(data: unknown): ExamHistoryItem | null {
  try {
    return ExamHistoryItemSchema.parse(data);
  } catch (error) {
    console.error('Exam history item validation error:', error);
    return null;
  }
}

export function safeValidateExamResult(data: unknown): ExamResult | null {
  try {
    return ExamResultSchema.parse(data);
  } catch (error) {
    console.error('Exam result validation error:', error);
    return null;
  }
}

export default {
  QuestionOptionSchema,
  MCQuestionSchema,
  TrueFalseQuestionSchema,
  ShortAnswerQuestionSchema,
  ExamSchema,
  ExamHistoryItemSchema,
  CreateExamRequestSchema,
  SubmitExamRequestSchema,
  ExamResultSchema,
  validateCreateExamRequest,
  validateSubmitExamRequest,
  validateExam,
  validateExamHistoryItem,
  validateExamResult,
  safeValidateCreateExamRequest,
  safeValidateSubmitExamRequest,
  safeValidateExam,
  safeValidateExamHistoryItem,
  safeValidateExamResult,
};

