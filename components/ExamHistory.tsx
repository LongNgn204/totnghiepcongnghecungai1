import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/apiClient';
import {
  History,
  FileText,
  TrendingUp,
  Trophy,
  Clock,
  Factory,
  Tractor,
  Eye,
  Trash2,
  AlertTriangle,
  Filter,
  Calendar,
  CheckCircle,
  Edit
} from 'lucide-react';

// Define types locally or import from shared types if available
interface ExamHistoryType {
  id: string;
  examTitle: string;
  examType: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpent: number;
  createdAt: string;
  isSubmitted: boolean;
}

const ExamHistory: React.FC = () => {
  const [history, setHistory] = useState<ExamHistoryType[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'industrial' | 'agriculture'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      // Always read local first (offline-friendly)
      const localStored = await import('../utils/examStorage');
      const localExams = localStored.getExamHistory() as any[];

      // If offline -> show local immediately
      if (!navigator.onLine) {
        setHistory(localExams as any);
        return;
      }

      // Fetch remote in parallel
      const [examsResponse, statsResponse] = await Promise.allSettled([
        api.exams.getAll(100),
        api.exams.getStats()
      ]);

      const remoteExamsRaw = examsResponse.status === 'fulfilled' ? (examsResponse.value as any) : { exams: [] };
      const stats = statsResponse.status === 'fulfilled' ? (statsResponse.value as any) : null;

      // Normalize remote shape -> ExamHistoryType
      const remoteMapped: ExamHistoryType[] = (remoteExamsRaw.exams || remoteExamsRaw.data?.exams || []).map((e: any) => ({
        id: e.id,
        examTitle: e.title,
        examType: e.subject === 'Công nghiệp' ? 'industrial' : 'agriculture',
        score: e.score,
        totalQuestions: e.total_questions,
        percentage: e.total_questions ? (e.score / e.total_questions) * 100 : 0,
        timeSpent: e.duration ? Math.round(e.duration / 60) : 0,
        createdAt: e.created_at ? new Date(e.created_at).toISOString() : new Date().toISOString(),
        isSubmitted: true,
      }));

      // Normalize local shape -> ExamHistoryType (already similar)
      const localMapped: ExamHistoryType[] = (localExams || []).map((x: any) => ({
        id: x.id,
        examTitle: x.examTitle,
        examType: x.examType,
        score: x.score,
        totalQuestions: x.totalQuestions,
        percentage: x.percentage,
        timeSpent: x.timeSpent,
        createdAt: x.createdAt,
        isSubmitted: x.isSubmitted,
      }));

      // Merge by id, prefer newer createdAt
      const mergedMap = new Map<string, ExamHistoryType>();
      [...localMapped, ...remoteMapped].forEach(item => {
        const prev = mergedMap.get(item.id);
        if (!prev) {
          mergedMap.set(item.id, item);
        } else {
          const prevTime = new Date(prev.createdAt).getTime();
          const curTime = new Date(item.createdAt).getTime();
          mergedMap.set(item.id, curTime >= prevTime ? item : prev);
        }
      });

      const merged = Array.from(mergedMap.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setHistory(merged);
      setStats(stats);
    } catch (error) {
      console.error('Failed to load exam history:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa đề thi này?')) {
      try {
        await api.exams.delete(id);
        loadHistory();
      } catch (error) {
        console.error('Failed to delete exam:', error);
      }
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ lịch sử? Hành động này không thể hoàn tác!')) {
      // Backend doesn't have clear all yet, or we loop delete
      // For now, just clear local state or implement clear all endpoint
      // Assuming we can't clear all easily via API without endpoint
      alert('Tính năng xóa tất cả đang được cập nhật.');
      setShowDeleteConfirm(false);
    }
  };

  const filteredHistory = history.filter(exam => {
    if (filter === 'all') return true;
    return exam.examType === filter;
  });

  const sortedHistory = [...filteredHistory].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return b.percentage - a.percentage;
    }
  });

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30';
    if (percentage >= 50) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/30';
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30';
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="glass-panel border-0 p-8 text-white relative overflow-hidden rounded-3xl shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 opacity-90"></div>
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 scale-150">
          <History size={200} />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 flex items-center justify-center gap-3 tracking-tight">
            <History className="w-10 h-10" />
            Lịch Sử Đề Thi
          </h2>
          <p className="text-center text-white/90 text-lg max-w-2xl mx-auto">
            Xem lại các đề thi đã làm và theo dõi tiến độ học tập
          </p>
        </div>
      </div>

      {/* Statistics */}
      {stats && stats.totalExams > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="glass-card p-6 text-center hover:shadow-md transition-all hover:-translate-y-1">
            <FileText className="w-8 h-8 text-primary-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalExams}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Đề đã làm</div>
          </div>
          <div className="glass-card p-6 text-center hover:shadow-md transition-all hover:-translate-y-1">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageScore.toFixed(1)}%</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Điểm TB</div>
          </div>
          <div className="glass-card p-6 text-center hover:shadow-md transition-all hover:-translate-y-1">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.bestScore.toFixed(1)}%</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Cao nhất</div>
          </div>
          <div className="glass-card p-6 text-center hover:shadow-md transition-all hover:-translate-y-1">
            <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTimeSpent}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Phút học</div>
          </div>
          <div className="glass-card p-6 text-center hover:shadow-md transition-all hover:-translate-y-1">
            <Factory className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.industrialCount}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Công nghiệp</div>
          </div>
          <div className="glass-card p-6 text-center hover:shadow-md transition-all hover:-translate-y-1">
            <Tractor className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.agricultureCount}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Nông nghiệp</div>
          </div>
        </div>
      )}

      {/* Filters & Actions */}
      <div className="glass-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${filter === 'all'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              <FileText className="w-4 h-4" />
              Tất cả ({history.length})
            </button>
            <button
              onClick={() => setFilter('industrial')}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${filter === 'industrial'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              <Factory className="w-4 h-4" />
              Công nghiệp
            </button>
            <button
              onClick={() => setFilter('agriculture')}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${filter === 'agriculture'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              <Tractor className="w-4 h-4" />
              Nông nghiệp
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'score')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-white font-medium focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="date">Sắp xếp: Mới nhất</option>
              <option value="score">Sắp xếp: Điểm cao nhất</option>
            </select>

            {history.length > 0 && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all flex items-center gap-2 font-bold shadow-md"
              >
                <Trash2 className="w-4 h-4" />
                Xóa tất cả
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Exam List */}
      {sortedHistory.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <div className="bg-gray-50 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Chưa có đề thi nào
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Bắt đầu làm đề thi để xem lịch sử và theo dõi tiến độ học tập
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/san-pham-3"
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 font-bold shadow-md hover:-translate-y-0.5"
            >
              <Factory className="w-5 h-5" />
              Đề Công nghiệp
            </Link>
            <Link
              to="/san-pham-4"
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all flex items-center gap-2 font-bold shadow-md hover:-translate-y-0.5"
            >
              <Tractor className="w-5 h-5" />
              Đề Nông nghiệp
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {sortedHistory.map((exam) => (
            <div
              key={exam.id}
              className={`glass-card p-6 hover:shadow-lg transition-all border-2 ${exam.isSubmitted ? 'border-green-200 dark:border-green-800/30' : 'border-gray-200 dark:border-gray-700'
                }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${exam.examType === 'industrial'
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                      : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      }`}>
                      {exam.examType === 'industrial' ? <Factory className="w-3 h-3" /> : <Tractor className="w-3 h-3" />}
                      {exam.examType === 'industrial' ? 'Công nghiệp' : 'Nông nghiệp'}
                    </span>
                    {!exam.isSubmitted && (
                      <span className="px-3 py-1 rounded-full text-sm font-bold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 flex items-center gap-1">
                        <Edit className="w-3 h-3" />
                        Chưa nộp
                      </span>
                    )}
                    {exam.isSubmitted && (
                      <span className="px-3 py-1 rounded-full text-sm font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Đã hoàn thành
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {exam.examTitle}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(exam.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {exam.timeSpent} phút
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {exam.totalQuestions} câu
                    </span>
                  </div>
                </div>

                {exam.isSubmitted && (
                  <div className={`px-6 py-4 rounded-xl border-2 ${getScoreBgColor(exam.percentage)}`}>
                    <div className={`text-3xl font-bold ${getScoreColor(exam.percentage)}`}>
                      {exam.score}/{exam.totalQuestions}
                    </div>
                    <div className={`text-sm font-medium ${getScoreColor(exam.percentage)}`}>
                      {exam.percentage.toFixed(1)}% ({((exam.score / exam.totalQuestions) * 10).toFixed(1)}/10)
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Link
                    to={`/xem-lai/${exam.id}`}
                    className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all flex items-center gap-2 font-bold shadow-md hover:-translate-y-0.5"
                    title="Xem lại đề thi"
                  >
                    <Eye className="w-4 h-4" />
                    Xem lại
                  </Link>
                  <button
                    onClick={() => handleDelete(exam.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all flex items-center justify-center shadow-md hover:-translate-y-0.5"
                    title="Xóa đề thi này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass-panel p-8 max-w-md w-full shadow-2xl animate-scale-in">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              Xác nhận xóa
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Bạn có chắc muốn xóa <strong>tất cả {history.length} đề thi</strong> trong lịch sử?
              Hành động này không thể hoàn tác!
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleClearAll}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2 font-bold shadow-md"
              >
                <Trash2 className="w-5 h-5" />
                Xóa tất cả
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all font-bold"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamHistory;
