import { z } from 'zod';

// Shared enums as literals since zod can't import TS enums directly
export const QuestionLevelEnum = z.enum(['Nhận biết', 'Thông hiểu', 'Vận dụng']);

export const StatementSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  isCorrect: z.boolean(),
  explanation: z.string().optional(),
});

export const MCQuestionSchema = z.object({
  question: z.string().min(1),
  options: z.array(z.string()).length(4),
  answer: z.string().min(1),
  requirement: z.string().optional(),
  level: QuestionLevelEnum.optional(),
  explanation: z.string().optional(),
});

export const TFQuestionSchema = z.object({
  question: z.string().min(1),
  statements: z.array(StatementSchema).length(4),
  requirement: z.string().optional(),
  level: QuestionLevelEnum.optional(),
  explanation: z.string().optional(),
});

export const ExamDataSchema = z.object({
  mcQuestions: z.array(MCQuestionSchema).default([]),
  tfQuestions: z.array(TFQuestionSchema).default([]),
});

// Schemas for Product3 mixed array response
const BaseGeneratedSchema = z.object({
  id: z.number().optional(),
  text: z.string().optional(),
  question: z.string().optional(),
  explanation: z.string().optional(),
  requirement: z.string().optional(),
  level: QuestionLevelEnum.optional(),
  type: z.enum(['multiple_choice', 'true_false', 'mc', 'tf']).optional(),
});

export const GeneratedMCQuestionSchema = BaseGeneratedSchema.extend({
  options: z.array(z.string()).length(4),
  correctAnswer: z.string().min(1).optional(),
  answer: z.string().min(1).optional(),
}).refine((d) => !!(d.text || d.question), {
  message: 'Thiếu nội dung câu hỏi',
});

export const GeneratedTFQuestionSchema = BaseGeneratedSchema.extend({
  statements: z.array(StatementSchema).length(4),
}).refine((d) => !!(d.text || d.question), {
  message: 'Thiếu nội dung câu hỏi',
});

export const GeneratedQuestionSchema = z.union([
  GeneratedMCQuestionSchema,
  GeneratedTFQuestionSchema,
]);

export const GeneratedQuestionArraySchema = z.array(GeneratedQuestionSchema).min(1);

// Types inferred from schemas
export type Statement = z.infer<typeof StatementSchema>;
export type MCQuestion = z.infer<typeof MCQuestionSchema>;
export type TFQuestion = z.infer<typeof TFQuestionSchema>;
export type ExamData = z.infer<typeof ExamDataSchema>;
export type GeneratedQuestion = z.infer<typeof GeneratedQuestionSchema>;

