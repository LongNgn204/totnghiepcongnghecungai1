import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/apiClient';
import { useAppStore } from '../store/appStore';
import { getCache, setCache } from '../utils/cache';
import Pagination from './Pagination';
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
  Calendar,
  CheckCircle,
  Edit
} from 'lucide-react';

// Local type (compatible with local and remote shapes)
interface ExamHistoryType {
  id: string;
  examTitle: string;
  examType: string; // 'industrial' | 'agriculture'
  score: number;
  totalQuestions: number;
  percentage: number; // 0-100
  timeSpent: number; // minutes
  createdAt: string; // ISO string
  isSubmitted: boolean;
}

const CACHE_KEY = 'examHistory';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const ExamHistory: React.FC = () => {
  const {
    examHistory,
    setExamHistory,
    examPage,
    setExamPage,
    examPageSize,
    setExamPageSize,
  } = useAppStore();

  const [stats, setStats] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'industrial' | 'agriculture'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const normalizeRemote = (remote: any[]): ExamHistoryType[] =>
    (remote || []).map((e: any) => ({
        id: e.id,
      examTitle: e.title || e.examTitle,
      examType: e.subject === 'Công nghiệp' || e.examType === 'industrial' ? 'industrial' : 'agriculture',
      score: Number(e.score ?? 0),
      totalQuestions: Number(e.total_questions ?? e.totalQuestions ?? 0),
      percentage: e.total_questions ? (Number(e.score) / Number(e.total_questions)) * 100 : (e.percentage ?? 0),
      timeSpent: e.duration ? Math.round(e.duration / 60) : (e.timeSpent ?? 0),
      createdAt: e.created_at ? new Date(e.created_at).toISOString() : (e.createdAt || new Date().toISOString()),
        isSubmitted: true,
      }));

  const normalizeLocal = (local: any[]): ExamHistoryType[] =>
    (local || []).map((x: any) => ({
      id: String(x.id),
        examTitle: x.examTitle,
        examType: x.examType,
      score: Number(x.score ?? 0),
      totalQuestions: Number(x.totalQuestions ?? 0),
      percentage: Number(x.percentage ?? ((x.totalQuestions ? (x.score / x.totalQuestions) * 100 : 0))),
      timeSpent: Number(x.timeSpent ?? 0),
        createdAt: x.createdAt,
      isSubmitted: !!x.isSubmitted,
      }));

  const mergeByIdPreferNewest = (a: ExamHistoryType[], b: ExamHistoryType[]): ExamHistoryType[] => {
    const map = new Map<string, ExamHistoryType>();
    [...a, ...b].forEach(item => {
      const prev = map.get(item.id);
      if (!prev) { map.set(item.id, item); return; }
          const prevTime = new Date(prev.createdAt).getTime();
          const curTime = new Date(item.createdAt).getTime();
      map.set(item.id, curTime >= prevTime ? item : prev);
      });
    return Array.from(map.values()).sort((x, y) => new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime());
  };

  const loadHistory = async () => {
    setLoading(true);
    try {
      // 1) Load local first (offline-friendly)
      const localStored = await import('../utils/examStorage');
      const localExams = normalizeLocal(localStored.getExamHistory());

      // 2) If offline: try cache, else local only
      if (!navigator.onLine) {
        const cached = getCache<ExamHistoryType[]>(CACHE_KEY);
        setExamHistory(cached && cached.length ? cached : localExams);
        setLoading(false);
        return;
      }

      // 3) Remote fetch in parallel
      const [examsResponse, statsResponse] = await Promise.allSettled([
        api.exams.getAll({ limit: 200 }),
        api.progress?.getStats ? api.progress.getStats() : Promise.resolve({ data: null })
      ]);

      const remoteRaw = examsResponse.status === 'fulfilled' ? (examsResponse.value as any) : { exams: [] };
      const remoteArr = remoteRaw.exams || remoteRaw.data?.exams || remoteRaw.data || [];
      const remoteMapped = normalizeRemote(remoteArr);
      const merged = mergeByIdPreferNewest(localExams, remoteMapped);

      // 4) Save merged into store + cache
      setExamHistory(merged);
      setCache(CACHE_KEY, merged, CACHE_TTL);

      // 5) Stats (optional)
      const statsVal = statsResponse.status === 'fulfilled' ? (statsResponse.value as any) : null;
      setStats(statsVal?.data || statsVal || null);
    } catch (error) {
      console.error('Failed to load exam history:', error);
      // Fallback to cache or existing store data
      const cached = getCache<ExamHistoryType[]>(CACHE_KEY);
      if (cached && cached.length) setExamHistory(cached);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa đề thi này?')) {
      try {
        await api.exams.delete(id);
      } catch {
        // ignore
      } finally {
        // Remove locally as well
        setExamHistory(examHistory.filter(x => x.id !== id));
        setCache(CACHE_KEY, examHistory.filter(x => x.id !== id), CACHE_TTL);
      }
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ lịch sử? Hành động này không thể hoàn tác!')) {
      // Backend clear-all endpoint chưa có -> chỉ clear local/cache
      setExamHistory([]);
      setCache(CACHE_KEY, [], CACHE_TTL);
      setShowDeleteConfirm(false);
    }
  };

  // Derived lists
  const filteredHistory = useMemo(() => {
    const list = examHistory || [];
    if (filter === 'all') return list;
    return list.filter((exam) => exam.examType === filter);
  }, [examHistory, filter]);

  const sortedHistory = useMemo(() => {
    const list = [...filteredHistory];
    if (sortBy === 'date') {
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return list.sort((a, b) => b.percentage - a.percentage);
  }, [filteredHistory, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedHistory.length / examPageSize));
  const currentPage = Math.min(examPage, totalPages);
  const pageSliceStart = (currentPage - 1) * examPageSize;
  const pageSliceEnd = pageSliceStart + examPageSize;
  const paginatedHistory = sortedHistory.slice(pageSliceStart, pageSliceEnd);

  const submittedHistory = useMemo(() => examHistory.filter(e => e.isSubmitted), [examHistory]);
  const averageScore = submittedHistory.length
    ? (submittedHistory.reduce((sum, exam) => sum + exam.percentage, 0) / submittedHistory.length).toFixed(1)
    : null;
  const bestScore = submittedHistory.length
    ? Math.max(...submittedHistory.map(exam => exam.percentage)).toFixed(1)
    : null;
  const totalHistoryTime = submittedHistory.reduce((sum, exam) => sum + exam.timeSpent, 0);

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
              onClick={() => { setFilter('all'); setExamPage(1); }}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${filter === 'all'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              <FileText className="w-4 h-4" />
              Tất cả ({examHistory.length})
            </button>
            <button
              onClick={() => { setFilter('industrial'); setExamPage(1); }}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${filter === 'industrial'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              <Factory className="w-4 h-4" />
              Công nghiệp
            </button>
            <button
              onClick={() => { setFilter('agriculture'); setExamPage(1); }}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${filter === 'agriculture'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              <Tractor className="w-4 h-4" />
              Nông nghiệp
            </button>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value as 'date' | 'score'); setExamPage(1); }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-white font-medium focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="date">Sắp xếp: Mới nhất</option>
              <option value="score">Sắp xếp: Điểm cao nhất</option>
            </select>

            <select
              value={examPageSize}
              onChange={(e) => setExamPageSize(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-white font-medium focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value={5}>5/trang</option>
              <option value={10}>10/trang</option>
              <option value={20}>20/trang</option>
            </select>

            {examHistory.length > 0 && (
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
      {loading ? (
        <div className="glass-card p-16 text-center" role="status" aria-busy="true">Đang tải lịch sử...</div>
      ) : paginatedHistory.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <div className="bg-gray-50 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" aria-hidden>
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
              aria-label="Đi tới đề Công nghiệp"
            >
              <Factory className="w-5 h-5" />
              Đề Công nghiệp
            </Link>
            <Link
              to="/san-pham-4"
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all flex items-center gap-2 font-bold shadow-md hover:-translate-y-0.5"
              aria-label="Đi tới đề Nông nghiệp"
            >
              <Tractor className="w-5 h-5" />
              Đề Nông nghiệp
            </Link>
          </div>
        </div>
      ) : (
        <>
        <div className="grid gap-4">
            {paginatedHistory.map((exam) => (
            <div
              key={exam.id}
                className={`glass-card p-6 hover:shadow-lg transition-all border-2 ${exam.isSubmitted ? 'border-green-200 dark:border-green-800/30' : 'border-gray-200 dark:border-gray-700'}`}
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
                          day: '2-digit', month: '2-digit', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
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
                    aria-label={`Xem lại đề thi ${exam.examTitle}`}
                  >
                    <Eye className="w-4 h-4" />
                    Xem lại
                  </Link>
                  <button
                    onClick={() => handleDelete(exam.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all flex items-center justify-center shadow-md hover:-translate-y-0.5"
                    title="Xóa đề thi này"
                    aria-label={`Xóa đề thi ${exam.examTitle}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={examPageSize}
              totalItems={sortedHistory.length}
              onPageChange={setExamPage}
              onPageSizeChange={setExamPageSize}
              pageSizeOptions={[5, 10, 20, 50]}
            />
          )}
        </>
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
              Bạn có chắc muốn xóa <strong>tất cả {examHistory.length} đề thi</strong> trong lịch sử?
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
