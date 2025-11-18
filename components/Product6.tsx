import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import {
  getStats,
  getAllActivities,
  getAllGoals,
  saveGoal,
  updateGoal,
  deleteGoal,
  getActivityChartData,
  getScoreTrendData,
  StudyGoal,
  StudyStats
} from '../utils/studyProgress';

const Product6: React.FC = () => {
  const [stats, setStats] = useState<StudyStats | null>(null);
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);
  const [scoreTrendData, setScoreTrendData] = useState<any[]>([]);
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<7 | 14 | 30>(7);

  const [goalForm, setGoalForm] = useState({
    title: '',
    description: '',
    type: 'exam-score' as StudyGoal['type'],
    target: 80,
    current: 0,
    unit: '%',
    deadline: ''
  });

  useEffect(() => {
    loadData();
  }, [selectedPeriod]);

  const loadData = () => {
    setStats(getStats());
    setGoals(getAllGoals());
    setActivityData(getActivityChartData(selectedPeriod));
    setScoreTrendData(getScoreTrendData());
  };

  const handleCreateGoal = () => {
    if (!goalForm.title.trim()) {
      alert('Vui lòng nhập tên mục tiêu');
      return;
    }

    saveGoal({
      title: goalForm.title,
      description: goalForm.description,
      type: goalForm.type,
      target: goalForm.target,
      unit: goalForm.unit as 'minutes' | 'exams' | 'cards' | 'chats' | 'score' | 'decks',
      startDate: new Date().toISOString(),
      endDate: goalForm.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: goalForm.deadline
    });

    loadData();
    setShowCreateGoal(false);
    setGoalForm({
      title: '',
      description: '',
      type: 'exam-score',
      target: 80,
      current: 0,
      unit: '%',
      deadline: ''
    });
  };

  const handleToggleGoal = (goal: StudyGoal) => {
    updateGoal(goal.id, { completed: !goal.completed });
    loadData();
  };

  const handleDeleteGoal = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa mục tiêu này?')) {
      deleteGoal(id);
      loadData();
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (!stats) {
    return <div className="flex items-center justify-center h-96">
      <i className="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
    </div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-lg shadow-lg text-white">
        <h2 className="text-3xl font-bold text-center mb-2">
          <i className="fas fa-chart-line mr-2"></i>
          Dashboard - Theo Dõi Tiến Độ Học Tập
        </h2>
        <p className="text-center text-indigo-100">
          Phân tích thống kê, đặt mục tiêu và theo dõi sự tiến bộ của bạn
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-2">
            <i className="fas fa-clock text-3xl opacity-75"></i>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Tổng</span>
          </div>
          <div className="text-3xl font-bold">{Math.round(stats.totalStudyTime / 60)}h</div>
          <div className="text-sm opacity-90 mt-1">Thời gian học</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-2">
            <i className="fas fa-file-alt text-3xl opacity-75"></i>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Đề</span>
          </div>
          <div className="text-3xl font-bold">{stats.totalExams}</div>
          <div className="text-sm opacity-90 mt-1">Đề thi đã làm</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-2">
            <i className="fas fa-star text-3xl opacity-75"></i>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">TB</span>
          </div>
          <div className="text-3xl font-bold">{stats.averageScore.toFixed(1)}%</div>
          <div className="text-sm opacity-90 mt-1">Điểm trung bình</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-2">
            <i className="fas fa-fire text-3xl opacity-75"></i>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Streak</span>
          </div>
          <div className="text-3xl font-bold">{stats.currentStreak}</div>
          <div className="text-sm opacity-90 mt-1">Ngày liên tục</div>
        </div>
      </div>

      {/* More Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-md border-2 border-gray-200">
          <div className="text-center">
            <i className="fas fa-layer-group text-2xl text-pink-600 mb-2"></i>
            <div className="text-2xl font-bold text-gray-800">{stats.flashcardsLearned}</div>
            <div className="text-xs text-gray-600 mt-1">Flashcards ôn</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md border-2 border-gray-200">
          <div className="text-center">
            <i className="fas fa-comments text-2xl text-blue-600 mb-2"></i>
            <div className="text-2xl font-bold text-gray-800">{stats.chatSessions}</div>
            <div className="text-xs text-gray-600 mt-1">Chat sessions</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md border-2 border-gray-200">
          <div className="text-center">
            <i className="fas fa-calendar-week text-2xl text-green-600 mb-2"></i>
            <div className="text-2xl font-bold text-gray-800">{stats.weeklyActiveDays}/7</div>
            <div className="text-xs text-gray-600 mt-1">Ngày học/tuần</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md border-2 border-gray-200">
          <div className="text-center">
            <i className="fas fa-trophy text-2xl text-yellow-600 mb-2"></i>
            <div className="text-2xl font-bold text-gray-800">{stats.longestStreak}</div>
            <div className="text-xs text-gray-600 mt-1">Kỷ lục streak</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <i className="fas fa-chart-bar text-blue-600"></i>
              Hoạt động học tập
            </h3>
            <div className="flex gap-2">
              {[7, 14, 30].map(days => (
                <button
                  key={days}
                  onClick={() => setSelectedPeriod(days as any)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                    selectedPeriod === days
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {days}d
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Thi" fill="#3b82f6" />
              <Bar dataKey="Chat" fill="#10b981" />
              <Bar dataKey="Flashcard" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Score Trend */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-chart-line text-green-600"></i>
            Xu hướng điểm số
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={scoreTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="exam" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Area type="monotone" dataKey="score" stroke="#10b981" fill="#10b98133" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Goals Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <i className="fas fa-bullseye text-red-600"></i>
            Mục tiêu học tập
          </h3>
          <button
            onClick={() => setShowCreateGoal(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
          >
            <i className="fas fa-plus mr-2"></i>
            Tạo mục tiêu mới
          </button>
        </div>

        {goals.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-bullseye text-gray-300 text-6xl mb-4"></i>
            <p className="text-gray-600 text-lg">Chưa có mục tiêu nào</p>
            <p className="text-gray-500 text-sm mt-2">Đặt mục tiêu để theo dõi tiến độ học tập!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {goals.map(goal => {
              const progress = Math.min((goal.current / goal.target) * 100, 100);
              const isOverdue = new Date(goal.deadline) < new Date() && !goal.completed;
              
              return (
                <div
                  key={goal.id}
                  className={`p-5 rounded-xl border-2 transition-all ${
                    goal.completed
                      ? 'bg-green-50 border-green-300'
                      : isOverdue
                      ? 'bg-red-50 border-red-300'
                      : 'bg-gray-50 border-gray-300 hover:border-indigo-400'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <button
                          onClick={() => handleToggleGoal(goal)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            goal.completed
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-400 hover:border-indigo-600'
                          }`}
                        >
                          {goal.completed && <i className="fas fa-check text-white text-xs"></i>}
                        </button>
                        <h4 className={`text-lg font-bold ${goal.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {goal.title}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 ml-9">{goal.description}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="text-red-500 hover:text-red-700 transition-all p-2"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>

                  <div className="ml-9">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Tiến độ</span>
                      <span className="font-bold text-gray-800">
                        {goal.current} / {goal.target} {goal.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          goal.completed
                            ? 'bg-green-500'
                            : progress >= 80
                            ? 'bg-blue-500'
                            : progress >= 50
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className={`${isOverdue ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                        <i className="far fa-calendar mr-1"></i>
                        Deadline: {new Date(goal.deadline).toLocaleDateString('vi-VN')}
                      </span>
                      <span className="font-bold text-gray-700">
                        {progress.toFixed(0)}% hoàn thành
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Goal Modal */}
      {showCreateGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 animate-scale-in max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              <i className="fas fa-bullseye text-red-600 mr-2"></i>
              Tạo mục tiêu mới
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên mục tiêu *
                </label>
                <input
                  type="text"
                  value={goalForm.title}
                  onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                  placeholder="VD: Đạt điểm trung bình 80%"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={goalForm.description}
                  onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                  placeholder="Mô tả chi tiết về mục tiêu"
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Loại mục tiêu
                  </label>
                  <select
                    value={goalForm.type}
                    onChange={(e) => setGoalForm({ ...goalForm, type: e.target.value as any })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="exam-score">Điểm thi</option>
                    <option value="study-time">Thời gian học</option>
                    <option value="flashcard-mastery">Thành thạo flashcard</option>
                    <option value="custom">Tùy chỉnh</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={goalForm.deadline}
                    onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mục tiêu
                  </label>
                  <input
                    type="number"
                    value={goalForm.target}
                    onChange={(e) => setGoalForm({ ...goalForm, target: Number(e.target.value) })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Đơn vị
                  </label>
                  <input
                    type="text"
                    value={goalForm.unit}
                    onChange={(e) => setGoalForm({ ...goalForm, unit: e.target.value })}
                    placeholder="%, phút, thẻ..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowCreateGoal(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateGoal}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
              >
                <i className="fas fa-check mr-2"></i>
                Tạo mục tiêu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product6;
