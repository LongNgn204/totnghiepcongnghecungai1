// Utility for tracking study progress and statistics
export interface StudySession {
  id: string;
  date: string;
  duration: number; // minutes
  activity: 'exam' | 'chat' | 'flashcard' | 'lab';
  score?: number; // for exams
  cardsStudied?: number; // for flashcards
  questionsAsked?: number; // for chat
  subject: string;
  grade: string;
}

export interface StudyGoal {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'exam-score' | 'study-time' | 'flashcard-mastery' | 'custom';
  target: number; // target value (minutes, exams, cards, etc.)
  current: number; // current progress
  unit: 'minutes' | 'exams' | 'cards' | 'chats' | 'score' | 'decks';
  startDate: string;
  endDate: string;
  deadline?: string;
  completed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  requirement: number;
  currentProgress: number;
  category: 'exam' | 'chat' | 'flashcard' | 'streak' | 'total' | 'lab';
}

const SESSIONS_KEY = 'study_sessions';
const GOALS_KEY = 'study_goals';
const ACHIEVEMENTS_KEY = 'achievements';
const STREAK_KEY = 'study_streak';

// Generate ID
const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// ============= STUDY SESSIONS =============

export const recordStudySession = (session: Omit<StudySession, 'id' | 'date'>): void => {
  try {
    const sessions = getAllSessions();
    const newSession: StudySession = {
      ...session,
      id: generateId(),
      date: new Date().toISOString()
    };
    sessions.unshift(newSession);
    
    // Keep last 500 sessions
    if (sessions.length > 500) {
      sessions.splice(500);
    }
    
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    
    // Update streak
    updateStreak();
    
    // Check achievements
    checkAchievements();
  } catch (error) {
    console.error('Error recording session:', error);
  }
};

export const getAllSessions = (): StudySession[] => {
  try {
    const stored = localStorage.getItem(SESSIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting sessions:', error);
    return [];
  }
};

export const getSessionsByDateRange = (startDate: Date, endDate: Date): StudySession[] => {
  const sessions = getAllSessions();
  return sessions.filter(s => {
    const sessionDate = new Date(s.date);
    return sessionDate >= startDate && sessionDate <= endDate;
  });
};

export const getTodaySessions = (): StudySession[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getSessionsByDateRange(today, tomorrow);
};

export const getWeekSessions = (): StudySession[] => {
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  return getSessionsByDateRange(weekAgo, today);
};

export const getMonthSessions = (): StudySession[] => {
  const today = new Date();
  const monthAgo = new Date(today);
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  return getSessionsByDateRange(monthAgo, today);
};

// ============= STATISTICS =============

export const getOverallStats = () => {
  const sessions = getAllSessions();
  
  const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0);
  const examSessions = sessions.filter(s => s.activity === 'exam');
  const chatSessions = sessions.filter(s => s.activity === 'chat');
  const flashcardSessions = sessions.filter(s => s.activity === 'flashcard');
  
  const avgExamScore = examSessions.length > 0
    ? examSessions.reduce((sum, s) => sum + (s.score || 0), 0) / examSessions.length
    : 0;
  
  const totalCards = flashcardSessions.reduce((sum, s) => sum + (s.cardsStudied || 0), 0);
  const totalQuestions = chatSessions.reduce((sum, s) => sum + (s.questionsAsked || 0), 0);
  
  return {
    totalTime,
    totalSessions: sessions.length,
    examCount: examSessions.length,
    chatCount: chatSessions.length,
    flashcardCount: flashcardSessions.length,
    avgExamScore: avgExamScore.toFixed(1),
    totalCards,
    totalQuestions,
    streak: getStreak()
  };
};

export const getActivityBreakdown = () => {
  const sessions = getAllSessions();
  const byActivity = {
    exam: sessions.filter(s => s.activity === 'exam').length,
    chat: sessions.filter(s => s.activity === 'chat').length,
    flashcard: sessions.filter(s => s.activity === 'flashcard').length
  };
  
  return Object.entries(byActivity).map(([name, value]) => ({ name, value }));
};

export const getTimeByDay = () => {
  const sessions = getWeekSessions();
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const data: { [key: string]: number } = {};
  
  days.forEach(day => data[day] = 0);
  
  sessions.forEach(s => {
    const date = new Date(s.date);
    const dayIndex = date.getDay();
    data[days[dayIndex]] += s.duration;
  });
  
  return days.map(day => ({ day, minutes: data[day] }));
};

// ============= STREAK =============

export const updateStreak = (): void => {
  try {
    const streakData = getStreakData();
    const today = new Date().toDateString();
    
    if (streakData.lastStudyDate === today) {
      // Already studied today
      return;
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    if (streakData.lastStudyDate === yesterdayStr) {
      // Continuing streak
      streakData.currentStreak++;
    } else if (streakData.lastStudyDate !== today) {
      // Streak broken
      streakData.currentStreak = 1;
    }
    
    streakData.lastStudyDate = today;
    streakData.longestStreak = Math.max(streakData.currentStreak, streakData.longestStreak);
    
    localStorage.setItem(STREAK_KEY, JSON.stringify(streakData));
  } catch (error) {
    console.error('Error updating streak:', error);
  }
};

export const getStreak = (): number => {
  return getStreakData().currentStreak;
};

export const getLongestStreak = (): number => {
  return getStreakData().longestStreak;
};

const getStreakData = () => {
  try {
    const stored = localStorage.getItem(STREAK_KEY);
    return stored ? JSON.parse(stored) : {
      currentStreak: 0,
      longestStreak: 0,
      lastStudyDate: ''
    };
  } catch (error) {
    return { currentStreak: 0, longestStreak: 0, lastStudyDate: '' };
  }
};

// ============= GOALS =============

export const createGoal = (goal: Omit<StudyGoal, 'id' | 'current' | 'completed'>): void => {
  const goals = getAllGoals();
  const newGoal: StudyGoal = {
    ...goal,
    id: generateId(),
    current: 0,
    completed: false
  };
  goals.push(newGoal);
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
};

export const saveGoal = createGoal; // Alias for compatibility

export const updateGoal = (goalId: string, updates: Partial<StudyGoal>): void => {
  const goals = getAllGoals();
  const goalIndex = goals.findIndex(g => g.id === goalId);
  
  if (goalIndex !== -1) {
    goals[goalIndex] = { ...goals[goalIndex], ...updates };
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  }
};

export const updateGoalProgress = (goalId: string, progress: number): void => {
  const goals = getAllGoals();
  const goalIndex = goals.findIndex(g => g.id === goalId);
  
  if (goalIndex !== -1) {
    goals[goalIndex].current += progress;
    if (goals[goalIndex].current >= goals[goalIndex].target) {
      goals[goalIndex].completed = true;
    }
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  }
};

export const getAllGoals = (): StudyGoal[] => {
  try {
    const stored = localStorage.getItem(GOALS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
};

export const deleteGoal = (goalId: string): void => {
  const goals = getAllGoals().filter(g => g.id !== goalId);
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
};

// ============= ACHIEVEMENTS =============

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  // Lab achievements
  {
    id: 'lab_first_run',
    title: 'Chạy lần đầu',
    description: 'Nhấn Chạy Code trong Phòng Code lần đầu tiên',
    icon: 'fa-play',
    requirement: 1,
    currentProgress: 0,
    category: 'lab'
  },
  {
    id: 'lab_ten_runs',
    title: 'Thực hành chăm chỉ',
    description: 'Chạy code 10 lần trong Phòng Code',
    icon: 'fa-code',
    requirement: 10,
    currentProgress: 0,
    category: 'lab'
  },
  {
    id: 'lab_one_hour',
    title: '60 phút bền bỉ',
    description: 'Học coding tổng 60 phút',
    icon: 'fa-hourglass-half',
    requirement: 60,
    currentProgress: 0,
    category: 'lab'
  },
  {
    id: 'first_exam',
    title: 'Kỳ thi đầu tiên',
    description: 'Hoàn thành bài thi đầu tiên',
    icon: 'fa-graduation-cap',
    requirement: 1,
    currentProgress: 0,
    category: 'exam'
  },
  {
    id: 'exam_master',
    title: 'Bậc thầy thi cử',
    description: 'Hoàn thành 10 bài thi',
    icon: 'fa-trophy',
    requirement: 10,
    currentProgress: 0,
    category: 'exam'
  },
  {
    id: 'perfect_score',
    title: 'Điểm tuyệt đối',
    description: 'Đạt 100% trong 1 bài thi',
    icon: 'fa-star',
    requirement: 100,
    currentProgress: 0,
    category: 'exam'
  },
  {
    id: 'chat_rookie',
    title: 'Người mới AI',
    description: 'Đặt 10 câu hỏi cho AI',
    icon: 'fa-comments',
    requirement: 10,
    currentProgress: 0,
    category: 'chat'
  },
  {
    id: 'flashcard_learner',
    title: 'Học viên chăm chỉ',
    description: 'Ôn 50 flashcards',
    icon: 'fa-layer-group',
    requirement: 50,
    currentProgress: 0,
    category: 'flashcard'
  },
  {
    id: 'week_streak',
    title: 'Tuần kiên trì',
    description: 'Học liên tục 7 ngày',
    icon: 'fa-fire',
    requirement: 7,
    currentProgress: 0,
    category: 'streak'
  },
  {
    id: 'month_streak',
    title: 'Tháng cống hiến',
    description: 'Học liên tục 30 ngày',
    icon: 'fa-medal',
    requirement: 30,
    currentProgress: 0,
    category: 'streak'
  },
  {
    id: 'time_master',
    title: 'Chuyên gia thời gian',
    description: 'Học tổng cộng 100 giờ',
    icon: 'fa-clock',
    requirement: 6000, // 100 hours in minutes
    currentProgress: 0,
    category: 'total'
  }
];

export const getAchievements = (): Achievement[] => {
  try {
    const stored = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (!stored) {
      // Initialize with defaults
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(DEFAULT_ACHIEVEMENTS));
      return DEFAULT_ACHIEVEMENTS;
    }
    return JSON.parse(stored);
  } catch (error) {
    return DEFAULT_ACHIEVEMENTS;
  }
};

export const checkAchievements = (): void => {
  const achievements = getAchievements();
  const sessions = getAllSessions();
  const stats = getOverallStats();
  
  let updated = false;
  
  achievements.forEach(achievement => {
    if (achievement.unlockedAt) return; // Already unlocked
    
    let progress = 0;
    
    switch (achievement.category) {
      case 'exam':
        const examCount = sessions.filter(s => s.activity === 'exam').length;
        if (achievement.id === 'perfect_score') {
          const perfectScores = sessions.filter(s => s.activity === 'exam' && s.score === 100).length;
          progress = perfectScores > 0 ? 100 : 0;
        } else {
          progress = examCount;
        }
        break;
      
      case 'chat':
        progress = sessions.filter(s => s.activity === 'chat').reduce((sum, s) => sum + (s.questionsAsked || 0), 0);
        break;
      
      case 'flashcard':
        progress = sessions.filter(s => s.activity === 'flashcard').reduce((sum, s) => sum + (s.cardsStudied || 0), 0);
        break;
      
      case 'streak':
        progress = stats.streak;
        break;
      
      case 'total':
        progress = stats.totalTime;
        break;

      case 'lab': {
        const labSessions = sessions.filter(s => s.activity === 'lab');
        const labCount = labSessions.length;
        const labMinutes = labSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
        if (achievement.id === 'lab_one_hour') {
          progress = labMinutes; // requirement = 60
        } else if (achievement.id === 'lab_ten_runs') {
          progress = labCount; // requirement = 10
        } else if (achievement.id === 'lab_first_run') {
          progress = labCount > 0 ? 1 : 0; // requirement = 1
        } else {
          progress = labCount;
        }
        break;
      }
    }
    
    achievement.currentProgress = progress;
    
    if (progress >= achievement.requirement && !achievement.unlockedAt) {
      achievement.unlockedAt = new Date().toISOString();
      updated = true;
      
      // Show notification (optional)
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification('🎉 Thành tựu mới!', {
            body: `Bạn vừa mở khóa: ${achievement.title}`,
            icon: '/icon.png'
          });
        }
      }
    }
  });
  
  if (updated) {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  }
};

export const getUnlockedAchievements = (): Achievement[] => {
  return getAchievements().filter(a => a.unlockedAt);
};

export const getLockedAchievements = (): Achievement[] => {
  return getAchievements().filter(a => !a.unlockedAt);
};

// ============= DASHBOARD STATS =============

export interface StudyStats {
  totalStudyTime: number;
  totalExams: number;
  averageScore: number;
  currentStreak: number;
  longestStreak: number;
  flashcardsLearned: number;
  chatSessions: number;
  weeklyActiveDays: number;
  monthlyActiveDays: number;
}

export const getStats = (): StudyStats => {
  const sessions = getAllSessions();
  const streakData = getStreakData();
  
  const examSessions = sessions.filter(s => s.activity === 'exam');
  const totalExams = examSessions.length;
  const averageScore = totalExams > 0
    ? examSessions.reduce((sum, s) => sum + (s.score || 0), 0) / totalExams
    : 0;
  
  const totalStudyTime = sessions.reduce((sum, s) => sum + s.duration, 0);
  const flashcardsLearned = sessions
    .filter(s => s.activity === 'flashcard')
    .reduce((sum, s) => sum + (s.cardsStudied || 0), 0);
  const chatSessions = sessions.filter(s => s.activity === 'chat').length;
  
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const weeklyActiveDays = new Set(
    sessions
      .filter(s => new Date(s.date) >= weekAgo)
      .map(s => new Date(s.date).toDateString())
  ).size;
  
  const monthlyActiveDays = new Set(
    sessions
      .filter(s => new Date(s.date) >= monthAgo)
      .map(s => new Date(s.date).toDateString())
  ).size;
  
  return {
    totalStudyTime,
    totalExams,
    averageScore: Math.round(averageScore * 10) / 10,
    currentStreak: streakData.currentStreak,
    longestStreak: streakData.longestStreak,
    flashcardsLearned,
    chatSessions,
    weeklyActiveDays,
    monthlyActiveDays,
  };
};

export const getAllActivities = getAllSessions; // Alias

export const getActivityChartData = (days: number = 7) => {
  const sessions = getAllSessions();
  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  
  const data = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(now.getTime() - (days - 1 - i) * 24 * 60 * 60 * 1000);
    const dateStr = date.toLocaleDateString('vi-VN', { month: 'numeric', day: 'numeric' });
    
    const daySessions = sessions.filter(s => {
      const sessionDate = new Date(s.date);
      return sessionDate.toDateString() === date.toDateString();
    });
    
    data.push({
      date: dateStr,
      Thi: daySessions.filter(s => s.activity === 'exam').length,
      Chat: daySessions.filter(s => s.activity === 'chat').length,
      Flashcard: daySessions.filter(s => s.activity === 'flashcard').length,
    });
  }
  
  return data;
};

export const getScoreTrendData = () => {
  const sessions = getAllSessions();
  const examSessions = sessions
    .filter(s => s.activity === 'exam' && s.score !== undefined)
    .slice(0, 10)
    .reverse();
  
  return examSessions.map((s, index) => ({
    name: `Bài ${index + 1}`,
    score: s.score || 0,
  }));
};
