import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  getExamHistory, 
  deleteExamFromHistory, 
  clearExamHistory, 
  getExamStats,
  ExamHistory as ExamHistoryType 
} from '../utils/examStorage';

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
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700';
    if (percentage >= 50) return 'bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700';
    return 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-lg shadow-lg text-white">
        <h2 className="text-3xl font-bold text-center mb-2">
          <i className="fas fa-history mr-2"></i>
          Lịch Sử Đề Thi
        </h2>
        <p className="text-center text-indigo-100">
          Xem lại các đề thi đã làm và theo dõi tiến độ học tập
        </p>
      </div>

      {/* Statistics */}
      {stats && stats.totalExams > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
            <i className="fas fa-file-alt text-3xl text-blue-500 mb-2"></i>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalExams}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Đề đã làm</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
            <i className="fas fa-chart-line text-3xl text-green-500 mb-2"></i>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">{stats.averageScore.toFixed(1)}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Điểm TB</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
            <i className="fas fa-trophy text-3xl text-yellow-500 mb-2"></i>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">{stats.bestScore.toFixed(1)}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Điểm cao nhất</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
            <i className="fas fa-clock text-3xl text-purple-500 mb-2"></i>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalTimeSpent}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Phút học</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
            <i className="fas fa-industry text-3xl text-purple-500 mb-2"></i>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">{stats.industrialCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Công nghiệp</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
            <i className="fas fa-tractor text-3xl text-green-500 mb-2"></i>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">{stats.agricultureCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Nông nghiệp</div>
          </div>
        </div>
      )}

      {/* Filters & Actions */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <i className="fas fa-th-list mr-2"></i>Tất cả ({history.length})
            </button>
            <button
              onClick={() => setFilter('industrial')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'industrial'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <i className="fas fa-industry mr-2"></i>Công nghiệp
            </button>
            <button
              onClick={() => setFilter('agriculture')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'agriculture'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <i className="fas fa-tractor mr-2"></i>Nông nghiệp
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'score')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <option value="date">Sắp xếp: Mới nhất</option>
              <option value="score">Sắp xếp: Điểm cao nhất</option>
            </select>

            {history.length > 0 && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
              >
                <i className="fas fa-trash mr-2"></i>Xóa tất cả
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Exam List */}
      {sortedHistory.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-12 rounded-lg shadow text-center">
          <i className="fas fa-folder-open text-6xl text-gray-400 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Chưa có đề thi nào
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Bắt đầu làm đề thi để xem lịch sử và theo dõi tiến độ học tập
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/san-pham-3"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
            >
              <i className="fas fa-industry mr-2"></i>Đề Công nghiệp
            </Link>
            <Link
              to="/san-pham-4"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
            >
              <i className="fas fa-tractor mr-2"></i>Đề Nông nghiệp
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {sortedHistory.map((exam) => (
            <div
              key={exam.id}
              className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-all border-2 ${
                exam.isSubmitted ? 'border-green-200 dark:border-green-800' : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      exam.examType === 'industrial'
                        ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                        : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                    }`}>
                      <i className={`fas ${exam.examType === 'industrial' ? 'fa-industry' : 'fa-tractor'} mr-1`}></i>
                      {exam.examType === 'industrial' ? 'Công nghiệp' : 'Nông nghiệp'}
                    </span>
                    {!exam.isSubmitted && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300">
                        <i className="fas fa-pencil-alt mr-1"></i>Chưa nộp
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
                    {exam.examTitle}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>
                      <i className="fas fa-calendar-alt mr-1"></i>
                      {new Date(exam.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <span>
                      <i className="fas fa-clock mr-1"></i>
                      {exam.timeSpent} phút
                    </span>
                    <span>
                      <i className="fas fa-question-circle mr-1"></i>
                      {exam.totalQuestions} câu
                    </span>
                  </div>
                </div>

                {exam.isSubmitted && (
                  <div className={`px-6 py-4 rounded-lg border-2 ${getScoreBgColor(exam.percentage)}`}>
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                    title="Xem lại đề thi"
                  >
                    <i className="fas fa-eye mr-2"></i>Xem lại
                  </Link>
                  <button
                    onClick={() => handleDelete(exam.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                    title="Xóa đề thi này"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              <i className="fas fa-exclamation-triangle text-red-500 mr-2"></i>
              Xác nhận xóa
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Bạn có chắc muốn xóa <strong>tất cả {history.length} đề thi</strong> trong lịch sử? 
              Hành động này không thể hoàn tác!
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleClearAll}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
              >
                <i className="fas fa-trash mr-2"></i>Xóa tất cả
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-all"
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
