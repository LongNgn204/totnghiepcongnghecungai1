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
import {
  BarChart2,
  Clock,
  FileText,
  Star,
  Flame,
  Layers,
  MessageSquare,
  Calendar,
  Trophy,
  Target,
  Plus,
  Check,
  Trash2,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

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

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (!stats) {
    return <div className="flex items-center justify-center h-96">
      <div className="animate-spin text-blue-600">
        <Activity size={48} />
      </div>
    </div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-2xl shadow-lg text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
          <TrendingUp size={200} />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-center mb-3 flex items-center justify-center gap-3">
            <BarChart2 className="w-8 h-8" />
            Dashboard - Theo Dõi Tiến Độ Học Tập
          </h2>
          <p className="text-center text-blue-100 max-w-2xl mx-auto text-lg">
            Phân tích thống kê, đặt mục tiêu và theo dõi sự tiến bộ của bạn
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 opacity-75" />
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-medium">Tổng</span>
          </div>
          <div className="text-4xl font-bold mb-1">{Math.round(stats.totalStudyTime / 60)}h</div>
          <div className="text-sm opacity-90 font-medium">Thời gian học</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8 opacity-75" />
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-medium">Đề</span>
          </div>
          <div className="text-4xl font-bold mb-1">{stats.totalExams}</div>
          <div className="text-sm opacity-90 font-medium">Đề thi đã làm</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <Star className="w-8 h-8 opacity-75" />
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-medium">TB</span>
          </div>
          <div className="text-4xl font-bold mb-1">{stats.averageScore.toFixed(1)}%</div>
          <div className="text-sm opacity-90 font-medium">Điểm trung bình</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <Flame className="w-8 h-8 opacity-75" />
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-medium">Streak</span>
          </div>
          <div className="text-4xl font-bold mb-1">{stats.currentStreak}</div>
          <div className="text-sm opacity-90 font-medium">Ngày liên tục</div>
        </div>
      </div>

      {/* More Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:border-blue-300 transition-all">
          <div className="text-center">
            <Layers className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900">{stats.flashcardsLearned}</div>
            <div className="text-sm text-gray-500 font-medium mt-1">Flashcards ôn</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:border-blue-300 transition-all">
          <div className="text-center">
            <MessageSquare className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900">{stats.chatSessions}</div>
            <div className="text-sm text-gray-500 font-medium mt-1">Chat sessions</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:border-blue-300 transition-all">
          <div className="text-center">
            <Calendar className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900">{stats.weeklyActiveDays}/7</div>
            <div className="text-sm text-gray-500 font-medium mt-1">Ngày học/tuần</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:border-blue-300 transition-all">
          <div className="text-center">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900">{stats.longestStreak}</div>
            <div className="text-sm text-gray-500 font-medium mt-1">Kỷ lục streak</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Activity Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart2 className="w-6 h-6 text-blue-600" />
              Hoạt động học tập
            </h3>
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              {[7, 14, 30].map(days => (
                <button
                  key={days}
                  onClick={() => setSelectedPeriod(days as any)}
                  className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${selectedPeriod === days
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {days}d
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                cursor={{ fill: '#f3f4f6' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="Thi" name="Thi thử" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Chat" name="Hỏi AI" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Flashcard" name="Ôn thẻ" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Score Trend */}
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            Xu hướng điểm số
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={scoreTrendData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="exam" stroke="#9ca3af" fontSize={12} />
              <YAxis domain={[0, 100]} stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Area
                type="monotone"
                dataKey="score"
                name="Điểm số"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorScore)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Goals Section */}
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Target className="w-8 h-8 text-red-600" />
            Mục tiêu học tập
          </h3>
          <button
            onClick={() => setShowCreateGoal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-md flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Tạo mục tiêu mới
          </button>
        </div>

        {goals.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">Chưa có mục tiêu nào</p>
            <p className="text-gray-500 text-sm mt-2">Đặt mục tiêu để theo dõi tiến độ học tập!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {goals.map(goal => {
              const progress = Math.min((goal.current / goal.target) * 100, 100);
              const isOverdue = new Date(goal.deadline) < new Date() && !goal.completed;

              return (
                <div
                  key={goal.id}
                  className={`p-6 rounded-2xl border transition-all ${goal.completed
                    ? 'bg-green-50 border-green-200'
                    : isOverdue
                      ? 'bg-red-50 border-red-200'
                      : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                    }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <button
                          onClick={() => handleToggleGoal(goal)}
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${goal.completed
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-300 hover:border-blue-500 text-transparent hover:text-blue-500'
                            }`}
                        >
                          {goal.completed && <Check className="w-5 h-5 text-white" />}
                        </button>
                        <h4 className={`text-lg font-bold ${goal.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {goal.title}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 ml-11">{goal.description}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="text-gray-400 hover:text-red-500 transition-all p-2 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="ml-11">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 font-medium">Tiến độ</span>
                      <span className="font-bold text-gray-900">
                        {goal.current} / {goal.target} {goal.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${goal.completed
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

                    <div className="flex items-center justify-between mt-3 text-xs">
                      <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                        <Calendar className="w-3 h-3" />
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 animate-scale-in max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-600" />
              Tạo mục tiêu mới
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Tên mục tiêu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={goalForm.title}
                  onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                  placeholder="VD: Đạt điểm trung bình 80%"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={goalForm.description}
                  onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                  placeholder="Mô tả chi tiết về mục tiêu"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Loại mục tiêu
                  </label>
                  <select
                    value={goalForm.type}
                    onChange={(e) => setGoalForm({ ...goalForm, type: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  >
                    <option value="exam-score">Điểm thi</option>
                    <option value="study-time">Thời gian học</option>
                    <option value="flashcard-mastery">Thành thạo flashcard</option>
                    <option value="custom">Tùy chỉnh</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={goalForm.deadline}
                    onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Mục tiêu
                  </label>
                  <input
                    type="number"
                    value={goalForm.target}
                    onChange={(e) => setGoalForm({ ...goalForm, target: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Đơn vị
                  </label>
                  <input
                    type="text"
                    value={goalForm.unit}
                    onChange={(e) => setGoalForm({ ...goalForm, unit: e.target.value })}
                    placeholder="%, phút, thẻ..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => setShowCreateGoal(false)}
                className="flex-1 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-bold"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateGoal}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-md flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
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
