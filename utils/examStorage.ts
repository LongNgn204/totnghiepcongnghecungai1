// Utility for storing and retrieving exam history
export interface ExamHistory {
  id: string;
  examTitle: string;
  examType: 'industrial' | 'agriculture'; // Công nghiệp / Nông nghiệp
  questions: any[];
  userAnswers: { [key: number]: string | boolean };
  score: number;
  totalQuestions: number;
  timeSpent: number; // in minutes
  percentage: number;
  createdAt: string;
  isSubmitted: boolean;
}

const STORAGE_KEY = 'exam_history';
const MAX_HISTORY = 50; // Giới hạn 50 đề thi lưu trữ

export const saveExamToHistory = (exam: ExamHistory): void => {
  try {
    const history = getExamHistory();
    history.unshift(exam); // Thêm vào đầu danh sách
    
    // Giới hạn số lượng
    if (history.length > MAX_HISTORY) {
      history.splice(MAX_HISTORY);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving exam to history:', error);
  }
};

export const getExamHistory = (): ExamHistory[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting exam history:', error);
    return [];
  }
};

export const getExamById = (id: string): ExamHistory | null => {
  const history = getExamHistory();
  return history.find(exam => exam.id === id) || null;
};

export const deleteExamFromHistory = (id: string): void => {
  try {
    const history = getExamHistory();
    const filtered = history.filter(exam => exam.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting exam from history:', error);
  }
};

export const clearExamHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing exam history:', error);
  }
};

export const getExamStats = () => {
  const history = getExamHistory();
  const submitted = history.filter(e => e.isSubmitted);
  
  if (submitted.length === 0) {
    return {
      totalExams: 0,
      averageScore: 0,
      bestScore: 0,
      totalTimeSpent: 0,
      industrialCount: 0,
      agricultureCount: 0
    };
  }
  
  const totalScore = submitted.reduce((sum, e) => sum + e.percentage, 0);
  const bestScore = Math.max(...submitted.map(e => e.percentage));
  const totalTimeSpent = submitted.reduce((sum, e) => sum + e.timeSpent, 0);
  const industrialCount = submitted.filter(e => e.examType === 'industrial').length;
  const agricultureCount = submitted.filter(e => e.examType === 'agriculture').length;
  
  return {
    totalExams: submitted.length,
    averageScore: totalScore / submitted.length,
    bestScore,
    totalTimeSpent,
    industrialCount,
    agricultureCount
  };
};
