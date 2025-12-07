import React, { useState, useEffect, lazy, Suspense } from 'react';
import { generateContent } from '../utils/geminiAPI';
import { getErrorMessage } from '../utils/errorHandler';
import QuestionCard from './QuestionCard';
import { saveExamToHistory, getExamHistory, ExamHistory, deleteExamFromHistory } from '../utils/examStorage';
import syncManager from '../utils/syncManager';
import LoadingSpinner from './LoadingSpinner';
import { ExamSkeleton } from './Skeleton';
import CountdownTimer from './CountdownTimer';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/apiClient';
import ProductTemplate from './layout/ProductTemplate';
import { FileText, Clock3, ShieldCheck, Sparkles, History as HistoryIcon, RefreshCw } from 'lucide-react';
import { QuestionMC, QuestionTF } from '../types';
import { GeneratedQuestionArraySchema } from '../utils/validation';

const ExamReviewModal = lazy(() => import('./ExamReviewModal'));

const Product3: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [grade, setGrade] = useState('12');
  const [difficulty, setDifficulty] = useState('Khó');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState<(QuestionMC | QuestionTF)[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [examTitle, setExamTitle] = useState('');
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: any }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [examHistory, setExamHistory] = useState<ExamHistory[]>([]);
  const [selectedExam, setSelectedExam] = useState<ExamHistory | null>(null);
  const [lastSync, setLastSync] = useState<string>('');

  const { user } = useAuth();

  const updateLastSync = () => {
    const timestamp = syncManager.getLastSyncTime();
    if (timestamp > 0) {
      setLastSync(new Date(timestamp).toLocaleString('vi-VN'));
    } else {
      setLastSync('Chưa đồng bộ');
    }
  };

  const loadHistory = () => {
    const history = getExamHistory().filter(e => e.examType === 'industrial');
    setExamHistory(history);
    updateLastSync();
  };

  useEffect(() => {
    loadHistory();
    window.addEventListener('sync-completed', loadHistory);
    return () => {
      window.removeEventListener('sync-completed', loadHistory);
    };
  }, []);

  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory();
    }
  }, [activeTab]);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setQuestions([]);
    setHasGenerated(false);
    setUserAnswers({});
    setIsSubmitted(false);
    setStartTime(null);
    setEndTime(null);

    try {
      const prompt = `Tạo một đề thi trắc nghiệm môn Công nghệ lớp ${grade} phần Công nghiệp, độ khó ${difficulty}, theo cấu trúc mới nhất của Bộ GD&ĐT năm 2025.
      Đề thi gồm 2 phần:
      Phần 1: 24 câu hỏi trắc nghiệm nhiều lựa chọn (4 phương án A, B, C, D, chọn 1 phương án đúng).
      Phần 2: 4 câu hỏi trắc nghiệm đúng sai (Mỗi câu hỏi có 4 ý a, b, c, d, mỗi ý phải trả lời là Đúng hoặc Sai).
      Nội dung câu hỏi phải bám sát chương trình Công nghệ lớp ${grade} phần Công nghiệp.
      Đảm bảo câu hỏi rõ ràng, chính xác, không trùng lặp.
      Trả về kết quả dưới dạng JSON array, mỗi phần tử là một object câu hỏi có cấu trúc như sau:
      {
        "id": number,
        "type": "multiple_choice" | "true_false",
        "text": "Nội dung câu hỏi",
        "options": ["A. ...", "B. ...", "C. ...", "D. ..."] (chỉ dành cho multiple_choice),
        "correctAnswer": "A" | "B" | "C" | "D" (chỉ dành cho multiple_choice),
        "statements": [ (chỉ dành cho true_false)
          { "id": "a", "text": "Ý a", "isCorrect": boolean, "explanation": "..." },
          { "id": "b", "text": "Ý b", "isCorrect": boolean, "explanation": "..." },
          { "id": "c", "text": "Ý c", "isCorrect": boolean, "explanation": "..." },
          { "id": "d", "text": "Ý d", "isCorrect": boolean, "explanation": "..." }
        ],
        "explanation": "Giải thích chi tiết đáp án"
      }`;

      const response = await generateContent(prompt);
      if (!response.success) throw new Error(response.error || 'AI không phản hồi');

      // Extract JSON array safely (supports code blocks)
      const extractJSONArray = (text: string): string | null => {
        const codeBlock = text.match(/```json\n([\s\S]*?)```/i) || text.match(/```\n([\s\S]*?)```/i);
        if (codeBlock && codeBlock[1]) return codeBlock[1];
        const arrMatch = text.match(/\[[\s\S]*\]/);
        return arrMatch ? arrMatch[0] : null;
      };

      const jsonText = extractJSONArray(response.text);
      if (!jsonText) throw new Error('AI không trả về đúng định dạng JSON (mảng câu hỏi).');

      let raw: any;
      try { raw = JSON.parse(jsonText); } catch { throw new Error('Lỗi parse JSON từ phản hồi AI.'); }

      const parsed = GeneratedQuestionArraySchema.safeParse(raw);
      if (!parsed.success) {
        throw new Error('Dữ liệu AI không hợp lệ. Vui lòng thử lại với chủ đề/định dạng khác.');
      }

      // Normalize to our internal types
      const typedQuestions = parsed.data.map((q: any, idx: number) => {
        const base: any = {
          id: idx + 1,
          question: q.question || q.text || '',
          explanation: q.explanation,
          requirement: q.requirement,
          level: q.level,
        };
        if (q.options) {
          return { ...base, options: q.options, answer: q.answer || q.correctAnswer, type: 'mc' } as QuestionMC;
        }
        if (q.statements) {
          return { ...base, statements: q.statements, type: 'tf' } as QuestionTF;
        }
        return base;
      });

      setQuestions(typedQuestions);
      setHasGenerated(true);
      setExamTitle(`Đề thi Công nghiệp Lớp ${grade} - ${difficulty} - ${new Date().toLocaleDateString('vi-VN')}`);
      setStartTime(Date.now());
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi tạo đề thi.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, answer: any) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn nộp bài?')) return;

    setIsSubmitted(true);
    setEndTime(Date.now());

    // Calculate score
    let score = 0;
    let totalPossibleScore = 0;

    questions.forEach(q => {
      if (q.type === 'multiple_choice' || q.type === 'mc') {
        totalPossibleScore += 1;
        const qMc = q as QuestionMC;
        const correct = qMc.answer || qMc.correctAnswer;
        if (userAnswers[q.id] === correct) {
          score += 1;
        }
      } else {
        totalPossibleScore += 4;
        const qTf = q as QuestionTF;
        const userAns = userAnswers[q.id] as { [key: string]: boolean } | undefined;
        if (userAns && qTf.statements) {
          qTf.statements.forEach(stmt => {
            if (userAns[stmt.id] === stmt.isCorrect) {
              score += 1;
            }
          });
        }
      }
    });

    const percentage = totalPossibleScore > 0 ? Math.round((score / totalPossibleScore) * 100) : 0;
    const timeSpent = startTime ? Math.round((Date.now() - startTime) / 60000) : 0;

    const newExam: ExamHistory = {
      id: Date.now().toString(),
      examTitle: examTitle,
      createdAt: new Date().toISOString(),
      score: score,
      totalQuestions: questions.length,
      timeSpent: timeSpent,
      questions: questions,
      userAnswers: userAnswers,
      examType: 'industrial',
      isSubmitted: true,
      percentage: percentage
    };

    saveExamToHistory(newExam);

    // Sync to backend if logged in
    if (user) {
      try {
        await api.exams.create({
          title: newExam.examTitle,
          description: `Đề thi Công nghiệp - Lớp ${grade} - ${difficulty}`,
          questions: newExam.questions,
          settings: {
            timeLimit: 50,
            passingScore: 50,
            maxAttempts: 1
          },
          type: 'industrial'
        });
        // Also save the result
        // Note: submitResult might not be available on api.exams if it wasn't defined in apiClient.ts
        // I will assume it is or catch the error.
        if (api.exams.submitResult) {
          await api.exams.submitResult({
            examId: newExam.id,
            score: newExam.score,
            totalQuestions: newExam.totalQuestions,
            answers: Object.entries(newExam.userAnswers).map(([k, v]) => ({ questionId: k, answer: v })),
            timeSpent: newExam.timeSpent,
            completedAt: new Date().toISOString()
          });
        }
        loadHistory();
      } catch (e) {
        console.error("Failed to sync exam to backend:", e);
      }
    }

    loadHistory();
  };

  const handleViewHistoryExam = (exam: ExamHistory) => {
    setSelectedExam(exam);
  };

  const handleDeleteExam = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đề thi này?')) {
      deleteExamFromHistory(id);
      loadHistory();
      if (selectedExam?.id === id) {
        setSelectedExam(null);
      }
    }
  };

  const submittedHistory = examHistory.filter(e => e.isSubmitted);
  const averageScore = submittedHistory.length
    ? (submittedHistory.reduce((sum, exam) => sum + exam.percentage, 0) / submittedHistory.length).toFixed(1)
    : null;
  const bestScore = submittedHistory.length
    ? Math.max(...submittedHistory.map(exam => exam.percentage)).toFixed(1)
    : null;
  const totalHistoryTime = submittedHistory.reduce((sum, exam) => sum + exam.timeSpent, 0);

  const sidebarContent = (
    <div className="space-y-6">
      {/* Configuration Card */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">⚙️</span> Cấu hình đề thi
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Lớp học
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            >
              <option value="10">Lớp 10</option>
              <option value="11">Lớp 11</option>
              <option value="12">Lớp 12</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Độ khó
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            >
              <option value="Dễ">Dễ</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Khó">Khó</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full btn-primary py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang tạo...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Tạo đề thi mô phỏng
              </>
            )}
          </button>
        </div>
      </div>

      <div className="glass-card p-6">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          Chuẩn đề thi THPT
        </h4>
        <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>24 câu trắc nghiệm (4 lựa chọn)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>4 câu đúng/sai (16 ý nhỏ)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Thời gian làm bài: 50 phút</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Phủ kín nội dung chương trình</span>
          </li>
        </ul>
      </div>

      <div className="glass-card p-6">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          ⌨️ Phím tắt hữu ích
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
            <kbd className="font-mono font-bold bg-white dark:bg-gray-700 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-600">←</kbd> Câu trước
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
            <kbd className="font-mono font-bold bg-white dark:bg-gray-700 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-600">→</kbd> Câu sau
          </div>
        </div>
      </div>

      <div className="glass-card p-6 border-l-4 border-l-primary-500">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <HistoryIcon className="w-4 h-4 text-primary-600" />
          Thống kê gần nhất
        </h4>
        {submittedHistory.length ? (
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <span>Điểm trung bình</span>
              <span className="font-bold text-gray-900 dark:text-white">{averageScore}%</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <span>Điểm cao nhất</span>
              <span className="font-bold text-gray-900 dark:text-white">{bestScore}%</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <span>Thời gian ôn tập</span>
              <span className="font-bold text-gray-900 dark:text-white">{totalHistoryTime} phút</span>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <RefreshCw className="w-3 h-3 animate-spin-slow" />
              <span>Đồng bộ cuối: {lastSync}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            Chưa có bài thi nào được lưu. Hãy tạo đề và nộp bài để xem thống kê ở đây!
          </p>
        )}
      </div>
    </div>
  );

  return (
    <ProductTemplate
      icon={<FileText className="w-28 h-28 text-white/40" />}
      title="Sản phẩm học tập số 3: Tạo đề thi mô phỏng"
      subtitle="Đề thi chuẩn tốt nghiệp THPT Quốc Gia - 28 câu (24 TN + 4 Đ/S), 50 phút | Công cụ hỗ trợ học tập - Nội dung tham khảo"
      heroGradientFrom="from-indigo-600"
      heroGradientTo="to-sky-700"
      sidebar={sidebarContent}
    >
      {error && (
        <div role="alert" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">{error}</div>
      )}
      {questions.length === 0 && !loading && (
        <div className="glass-card p-12 text-center animate-fade-in">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-sky-100 dark:from-indigo-900/30 dark:to-sky-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <span className="text-5xl">🏭</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Bắt đầu tạo đề thi Công nghiệp</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-8 text-lg">
            Chọn lớp, độ khó và nhấn "Tạo đề thi mô phỏng" ở cột bên phải để AI tạo ra một đề thi hoàn chỉnh theo đúng cấu trúc của Bộ GD&ĐT.
          </p>
          <div className="flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-4xl" title="Công nghệ">⚡️</span>
            <span className="text-4xl" title="Kỹ thuật">🔌</span>
            <span className="text-4xl" title="Sản xuất">🏭</span>
          </div>
        </div>
      )}

      {loading && (
        <div className="glass-card p-12 flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
          <LoadingSpinner size="lg" color="primary" />
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 font-medium animate-pulse">
            Đang khởi tạo đề thi mô phỏng...
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            AI đang phân tích chương trình học và tạo câu hỏi phù hợp
          </p>
        </div>
      )}

      {questions.length > 0 && !isSubmitted && (
        <div className="space-y-6 animate-fade-in">
          <div className="glass-panel p-6 sticky top-20 z-30 flex justify-between items-center shadow-lg backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{examTitle}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {questions.length} câu hỏi • 50 phút
              </p>
            </div>
            <div className="flex items-center gap-4">
              <CountdownTimer initialMinutes={50} onTimeUp={handleSubmit} />
              <button
                onClick={handleSubmit}
                className="btn-primary px-6 py-2.5 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                Nộp bài
              </button>
            </div>
          </div>

          <div className="space-y-6 pb-20">
            {questions.map((q, index) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={index}
                type={q.type as 'mc' | 'tf'}
                userAnswer={userAnswers[q.id]}
                onAnswerChange={handleAnswerChange}
                isSubmitted={isSubmitted}
              />
            ))}
          </div>
        </div>
      )}

      {isSubmitted && (
        <div className="space-y-8 animate-fade-in">
          <div className="glass-card p-8 text-center border-t-4 border-t-green-500">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🏆</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Kết quả bài thi</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Bạn đã hoàn thành bài thi mô phỏng</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Điểm số (thang 10)</p>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {(examHistory[0]?.percentage / 10).toFixed(1)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Số câu đúng</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {examHistory[0]?.score}/{examHistory[0]?.totalQuestions}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Thời gian làm bài</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {examHistory[0]?.timeSpent} phút
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setQuestions([]);
                  setHasGenerated(false);
                }}
                className="px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              >
                Quay lại
              </button>
              <button
                onClick={() => {
                  // Logic to review answers (could be a modal or scroll down)
                  const element = document.getElementById('review-section');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-primary px-6 py-2.5 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                Xem chi tiết đáp án
              </button>
            </div>
          </div>

          <div id="review-section" className="space-y-6 pb-20">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white px-2">Chi tiết bài làm</h3>
            {questions.map((q, index) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={index}
                type={q.type as 'mc' | 'tf'}
                userAnswer={userAnswers[q.id]}
                onAnswerChange={handleAnswerChange}
                isSubmitted={isSubmitted}
                showResult={true}
              />
            ))}
          </div>
        </div>
      )}
    </ProductTemplate>
  );
};

export default Product3;
