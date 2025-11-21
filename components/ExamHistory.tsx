import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getExamHistory,
  deleteExamFromHistory,
  clearExamHistory,
  getExamStats,
  ExamHistory as ExamHistoryType
} from '../utils/examStorage';
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

const ExamHistory: React.FC = () => {
  const [history, setHistory] = useState<ExamHistoryType[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'industrial' | 'agriculture'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const data = getExamHistory();
    setHistory(data);
    setStats(getExamStats());
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa đề thi này?')) {
      deleteExamFromHistory(id);
      loadHistory();
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ lịch sử? Hành động này không thể hoàn tác!')) {
      clearExamHistory();
      setShowDeleteConfirm(false);
      loadHistory();
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
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-50 border-green-200';
    if (percentage >= 50) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-2xl shadow-lg text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
          <History size={200} />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-center mb-2 flex items-center justify-center gap-3">
            <History className="w-8 h-8" />
            Lịch Sử Đề Thi
          </h2>
          <p className="text-center text-blue-100 text-lg">
            Xem lại các đề thi đã làm và theo dõi tiến độ học tập
          </p>
        </div>
      </div>

      {/* Statistics */}
      {stats && stats.totalExams > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center hover:shadow-md transition-all">
            <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.totalExams}</div>
            <div className="text-sm text-gray-500 font-medium">Đề đã làm</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center hover:shadow-md transition-all">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.averageScore.toFixed(1)}%</div>
            <div className="text-sm text-gray-500 font-medium">Điểm TB</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center hover:shadow-md transition-all">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.bestScore.toFixed(1)}%</div>
            <div className="text-sm text-gray-500 font-medium">Cao nhất</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center hover:shadow-md transition-all">
            <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.totalTimeSpent}</div>
            <div className="text-sm text-gray-500 font-medium">Phút học</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center hover:shadow-md transition-all">
            <Factory className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.industrialCount}</div>
            <div className="text-sm text-gray-500 font-medium">Công nghiệp</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center hover:shadow-md transition-all">
            <Tractor className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.agricultureCount}</div>
            <div className="text-sm text-gray-500 font-medium">Nông nghiệp</div>
          </div>
        </div>
      )}

      {/* Filters & Actions */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${filter === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              <FileText className="w-4 h-4" />
              Tất cả ({history.length})
            </button>
            <button
              onClick={() => setFilter('industrial')}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${filter === 'industrial'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              <Factory className="w-4 h-4" />
              Công nghiệp
            </button>
            <button
              onClick={() => setFilter('agriculture')}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${filter === 'agriculture'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
              className="px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Sắp xếp: Mới nhất</option>
              <option value="score">Sắp xếp: Điểm cao nhất</option>
            </select>

            {history.length > 0 && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all flex items-center gap-2 font-bold"
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
        <div className="bg-white p-16 rounded-2xl shadow-sm border border-gray-200 text-center">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Chưa có đề thi nào
          </h3>
          <p className="text-gray-500 mb-8">
            Bắt đầu làm đề thi để xem lịch sử và theo dõi tiến độ học tập
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/san-pham-3"
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 font-bold shadow-md"
            >
              <Factory className="w-5 h-5" />
              Đề Công nghiệp
            </Link>
            <Link
              to="/san-pham-4"
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all flex items-center gap-2 font-bold shadow-md"
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
              className={`bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border-2 ${exam.isSubmitted ? 'border-green-200' : 'border-gray-200'
                }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${exam.examType === 'industrial'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-green-100 text-green-700'
                      }`}>
                      {exam.examType === 'industrial' ? <Factory className="w-3 h-3" /> : <Tractor className="w-3 h-3" />}
                      {exam.examType === 'industrial' ? 'Công nghiệp' : 'Nông nghiệp'}
                    </span>
                    {!exam.isSubmitted && (
                      <span className="px-3 py-1 rounded-full text-sm font-bold bg-yellow-100 text-yellow-700 flex items-center gap-1">
                        <Edit className="w-3 h-3" />
                        Chưa nộp
                      </span>
                    )}
                    {exam.isSubmitted && (
                      <span className="px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-700 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Đã hoàn thành
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {exam.examTitle}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 font-bold shadow-md"
                    title="Xem lại đề thi"
                  >
                    <Eye className="w-4 h-4" />
                    Xem lại
                  </Link>
                  <button
                    onClick={() => handleDelete(exam.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all flex items-center justify-center shadow-md"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              Xác nhận xóa
            </h3>
            <p className="text-gray-600 mb-6">
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
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-bold"
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
