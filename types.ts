export enum QuestionLevel {
  KNOW = 'Nhận biết',
  UNDERSTAND = 'Thông hiểu',
  APPLY = 'Vận dụng',
}

export interface QuestionMC {
  id: number;
  type?: 'multiple_choice' | 'mc'; // Allow both for compatibility
  question: string;
  options: string[];
  answer: string;
  requirement?: string;
  level?: QuestionLevel;
  explanation?: string;
  // Aliases
  text?: string;
  correctAnswer?: string;
}

export interface QuestionTF {
  id: number;
  type?: 'true_false' | 'tf'; // Allow both
  question: string;
  requirement?: string;
  level?: QuestionLevel;
  statements: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation?: string;
  }[];
  // Aliases
  text?: string;
  explanation?: string;
}

export interface MemberAssignment {
  memberName: string;
  mcQuestions: number[];
  tfQuestions: number[];
}