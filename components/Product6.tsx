import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import {
  getStats,
  getAllGoals,
  saveGoal,
  deleteGoal,
  getActivityChartData,
  getScoreTrendData,
  StudyGoal,
  StudyStats
} from '../utils/studyProgress';
import ProductTemplate from './layout/ProductTemplate';
import {
  Activity,
  TrendingUp,
  Target,
  Trophy,
  Plus,
  RefreshCcw,
  Bell,
  Clock,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const Product6: React.FC = () => {
  const [stats, setStats] = useState<StudyStats | null>(null);
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);
  const [scoreTrendData, setScoreTrendData] = useState<any[]>([]);
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<7 | 14 | 30>(7);

  // Form state
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState(0);
  const [newGoalType, setNewGoalType] = useState<'daily_time' | 'weekly_exams' | 'mastery_score'>('daily_time');
  const [newGoalDeadline, setNewGoalDeadline] = useState('');

  const loadData = () => {
    setStats(getStats());
    setGoals(getAllGoals());
    setActivityData(getActivityChartData(selectedPeriod));
    setScoreTrendData(getScoreTrendData());
  };

  useEffect(() => {
    loadData();
  }, [selectedPeriod]);

  const handleCreateGoal = () => {
    if (!newGoalTitle.trim() || newGoalTarget <= 0) return;

    const newGoal: StudyGoal = {
      id: Date.now().toString(),
      title: newGoalTitle,
      type: newGoalType,
      targetValue: newGoalTarget,
      currentValue: 0,
      deadline: newGoalDeadline ? new Date(newGoalDeadline).getTime() : undefined,
      status: 'in_progress',
      createdAt: Date.now()
    };

    saveGoal(newGoal);
    setNewGoalTitle('');
    setNewGoalTarget(0);
    setNewGoalDeadline('');
    setShowCreateGoal(false);
    loadData();
  };

  const handleDeleteGoal = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mục tiêu này?')) {
      deleteGoal(id);
      loadData();
    }
  };

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const sidebarContent = stats ? (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          Tổng quan nhanh
        </h4>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <span>Tổng giờ học</span>
            <span className="font-bold text-gray-900 dark:text-white">{(stats.totalStudyTime / 60).toFixed(1)}h</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <span>Chuỗi ngày</span>
            <span className="font-bold text-orange-500">{stats.streakDays} ngày 🔥</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <span>Điểm TB</span>
            <span className="font-bold text-emerald-500">{stats.averageScore.toFixed(1)}</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <span>Bài thi đã làm</span>
            <span className="font-bold text-blue-500">{stats.examsCompleted}</span>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 space-y-3">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-600" />
          Hành động nhanh
        </h4>
        <button
          onClick={() => setShowCreateGoal(true)}
          className="w-full btn-primary py-2.5 rounded-xl font-semibold shadow-md flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Thêm mục tiêu
        </button>
        <button
          onClick={loadData}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          <RefreshCcw className="w-4 h-4" />
          Cập nhật
        </button>
      </div>

      <div className="glass-card p-6 border-l-4 border-l-blue-500">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-500" />
          Gợi ý tiến độ
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 italic">
          {stats.streakDays > 3
            ? "Bạn đang giữ phong độ rất tốt! Hãy duy trì chuỗi ngày học tập này nhé."
            : "Cố gắng học ít nhất 15 phút mỗi ngày để xây dựng thói quen học tập bền vững."}
        </p>
      </div>
    </div>
  ) : null;

  if (!stats) {
    return (
      <ProductTemplate
        icon={<Activity className="w-28 h-28 text-white/40" />}
        title="Sản phẩm học tập số 6: Dashboard tiến độ"
        subtitle="Đang tải dữ liệu..."
        heroGradientFrom="from-indigo-700"
        heroGradientTo="to-blue-600"
        sidebar={<div></div>}
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" color="primary" />
        </div>
      </ProductTemplate>
    );
  }

  return (
    <ProductTemplate
      icon={<Activity className="w-28 h-28 text-white/40" />}
      title="Sản phẩm học tập số 6: Dashboard tiến độ"
      subtitle="Theo dõi thời gian học, điểm số và mục tiêu – đồng bộ offline-first, tối ưu cho mọi thiết bị"
      heroGradientFrom="from-indigo-700"
      heroGradientTo="to-blue-600"
      sidebar={sidebarContent}
    >
      <div className="space-y-8 animate-fade-in">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 border-l-4 border-l-blue-500">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-bold">Thời gian học</p>
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{(stats.totalStudyTime / 60).toFixed(1)}h</p>
            <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12% tuần này
            </p>
          </div>
          <div className="glass-card p-6 border-l-4 border-l-orange-500">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-bold">Chuỗi ngày</p>
              <Trophy className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.streakDays} ngày</p>
            <p className="text-xs text-gray-500 mt-1">Kỷ lục: {stats.longestStreak} ngày</p>
          </div>
          <div className="glass-card p-6 border-l-4 border-l-emerald-500">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-bold">Điểm trung bình</p>
              <Activity className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageScore.toFixed(1)}</p>
            <p className="text-xs text-green-500 mt-1">Trên mức trung bình</p>
          </div>
          <div className="glass-card p-6 border-l-4 border-l-purple-500">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-bold">Bài thi</p>
              <CheckCircle2 className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.examsCompleted}</p>
            <p className="text-xs text-gray-500 mt-1">Đã hoàn thành</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="glass-panel p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Hoạt động học tập
              </h3>
              <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                {[7, 14, 30].map((days) => (
                  <button
                    key={days}
                    onClick={() => setSelectedPeriod(days as any)}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${selectedPeriod === days
                        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                      }`}
                  >
                    {days} ngày
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="minutes" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTime)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Xu hướng điểm số
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Goals Section */}
        <div className="glass-card p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Target className="w-6 h-6 text-red-500" />
              Mục tiêu học tập
            </h3>
            <button
              onClick={() => setShowCreateGoal(true)}
              className="btn-primary px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Thêm mục tiêu
            </button>
          </div>

          {goals.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">Chưa có mục tiêu nào. Hãy đặt mục tiêu để phấn đấu!</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {goals.map(goal => (
                <div key={goal.id} className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all relative group">
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <span className="text-lg leading-none">×</span>
                  </button>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{goal.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {goal.type === 'daily_time' ? 'Thời gian học mỗi ngày' :
                          goal.type === 'weekly_exams' ? 'Bài thi mỗi tuần' : 'Điểm số mục tiêu'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${goal.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        goal.status === 'failed' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                      {goal.status === 'completed' ? 'Hoàn thành' :
                        goal.status === 'failed' ? 'Thất bại' : 'Đang thực hiện'}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Tiến độ</span>
                      <span className="font-bold text-gray-900 dark:text-white">{goal.currentValue} / {goal.targetValue}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (goal.currentValue / goal.targetValue) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {goal.deadline && (
                    <div className="mt-3 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>Hạn: {new Date(goal.deadline).toLocaleDateString('vi-VN')}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Goal Modal */}
        {showCreateGoal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="glass-panel w-full max-w-md p-6 animate-scale-in">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Thêm mục tiêu mới</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tên mục tiêu</label>
                  <input
                    type="text"
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="VD: Học 30 phút mỗi ngày"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Loại mục tiêu</label>
                  <select
                    value={newGoalType}
                    onChange={(e) => setNewGoalType(e.target.value as any)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="daily_time">Thời gian học (phút/ngày)</option>
                    <option value="weekly_exams">Số bài thi (bài/tuần)</option>
                    <option value="mastery_score">Điểm số mục tiêu (thang 10)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Giá trị mục tiêu</label>
                  <input
                    type="number"
                    value={newGoalTarget}
                    onChange={(e) => setNewGoalTarget(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hạn hoàn thành (tùy chọn)</label>
                  <input
                    type="date"
                    value={newGoalDeadline}
                    onChange={(e) => setNewGoalDeadline(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowCreateGoal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 font-bold hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleCreateGoal}
                    disabled={!newGoalTitle.trim() || newGoalTarget <= 0}
                    className="flex-1 btn-primary py-2.5 rounded-xl font-bold"
                  >
                    Tạo mục tiêu
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProductTemplate>
  );
};

export default Product6;
