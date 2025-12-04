import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Loader2,
  Calendar,
  Clock,
  Activity,
  Target,
  Trophy,
  Zap,
  BookOpen,
  MessageSquare,
  FileQuestion,
  TrendingUp,
  Award
} from 'lucide-react';
import { api } from '../utils/apiClient';

interface DashboardStats {
  streak: number;
  weeklyProgress: number;
  avgScore: number;
  recentActivity: any[];
  chartData: number[];
}

const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState('Học Sinh');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sessionTime, setSessionTime] = useState(0);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const profile = localStorage.getItem('user_profile');
    if (profile) {
      try {
        const parsed = JSON.parse(profile);
        setUserName(parsed.name || 'Học Sinh');
      } catch (e) {
        console.error(e);
      }
    }

    // Real-time clock and session timer
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setSessionTime(prev => prev + 1);
    }, 1000);

    // Fetch real stats
    const fetchStats = async () => {
      try {
        const data = await api.dashboard.stats();
        if (data) {
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        // Set default stats to prevent loading state
        setStats({
          streak: 0,
          weeklyProgress: 0,
          avgScore: 0,
          recentActivity: [],
          chartData: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Hero Section with Glassmorphism */}
      <div className="relative overflow-hidden rounded-3xl glass-panel border-0 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 opacity-90"></div>
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-secondary-400/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold border border-white/10 flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                LIVE LEARNING CENTER
              </span>
              <span className="text-white/90 text-sm font-medium flex items-center gap-1">
                <Calendar size={14} />
                {currentTime.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
              Xin chào, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">
                {userName}
              </span>
            </h1>

            <p className="text-indigo-100 text-lg max-w-xl mb-8 leading-relaxed">
              Hôm nay là một ngày tuyệt vời để bứt phá giới hạn! AI Gemini đã sẵn sàng hỗ trợ bạn.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 min-w-[160px] hover:bg-white/20 transition-colors cursor-default">
                <div className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                  <Clock size={12} /> Thời gian học
                </div>
                <div className="text-3xl font-mono font-bold tracking-wider">{formatTime(sessionTime)}</div>
              </div>
            </div>
          </div>

          {/* AI Mascot Placeholder (Using Icon for now) */}
          <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0 animate-float flex items-center justify-center">
            <div className="absolute inset-0 bg-white/10 rounded-full blur-2xl"></div>
            <Zap size={120} className="text-yellow-300 drop-shadow-lg" />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Stats & Progress */}
        <div className="lg:col-span-2 space-y-8">
          {/* Live Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              icon={TrendingUp}
              label="Chuỗi ngày học"
              value={`${stats?.streak || 0} Ngày`}
              trend={stats?.streak ? "Đang duy trì" : "Bắt đầu ngay"}
              color="text-yellow-600 dark:text-yellow-400"
              bg="bg-yellow-50 dark:bg-yellow-900/20"
            />
            <StatCard
              icon={Target}
              label="Mục tiêu tuần"
              value={`${stats?.weeklyProgress || 0}%`}
              trend={stats?.weeklyProgress === 100 ? "Hoàn thành" : "Cố lên!"}
              color="text-red-600 dark:text-red-400"
              bg="bg-red-50 dark:bg-red-900/20"
            />
            <StatCard
              icon={Award}
              label="Điểm trung bình"
              value={stats?.avgScore || "--"}
              trend={stats?.avgScore ? "Điểm số" : "Chưa có điểm"}
              color="text-purple-600 dark:text-purple-400"
              bg="bg-purple-50 dark:bg-purple-900/20"
            />
          </div>

          {/* Learning Activity Chart */}
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Activity className="text-primary-500" size={20} />
                Hoạt động học tập (7 ngày qua)
              </h3>
            </div>

            <div className="h-64 flex items-end justify-between gap-2 px-2">
              {stats?.chartData && stats.chartData.length > 0 ? (
                stats.chartData.map((duration, i) => {
                  const maxVal = Math.max(...stats.chartData, 3600);
                  const height = Math.round((duration / maxVal) * 100);
                  const dayLabel = new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('vi-VN', { weekday: 'short' });

                  return (
                    <div key={i} className="w-full flex flex-col items-center gap-2 group cursor-pointer">
                      <div className="relative w-full h-full flex items-end">
                        <div
                          className="w-full bg-primary-100 dark:bg-primary-900/30 rounded-t-xl relative overflow-hidden transition-all duration-500 ease-out group-hover:bg-primary-200 dark:group-hover:bg-primary-800/50"
                          style={{ height: `${height}%`, minHeight: duration > 0 ? '4px' : '0' }}
                          title={`${Math.round(duration / 60)} phút`}
                        >
                          <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-primary-600 to-primary-400 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {dayLabel}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Chưa có dữ liệu biểu đồ
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <Clock className="text-primary-500" size={20} />
              Hoạt động gần đây
            </h3>
            <div className="space-y-4">
              {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 group cursor-pointer p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <div className={`p-3 rounded-2xl ${item.type === 'exam' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'bg-purple-50 dark:bg-purple-900/20 text-purple-600'} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                      {item.type === 'exam' ? <FileQuestion size={20} /> : <BookOpen size={20} />}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-primary-600 transition-colors">{item.title}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.type === 'exam' ? `Điểm: ${item.value}` : `Đã học: ${item.value} thẻ`}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-gray-400 whitespace-nowrap">
                      {new Date(item.timestamp).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">Chưa có hoạt động nào gần đây.</p>
                  <Link to="/san-pham-1" className="inline-block px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                    Bắt đầu học ngay
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Quick Actions & Focus */}
        <div className="space-y-8">
          {/* Focus Area */}
          <div className="glass-card p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 dark:bg-orange-900/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 relative z-10 flex items-center gap-2">
              <Target className="text-orange-500" size={24} />
              Trọng tâm hôm nay
            </h3>

            <div className="space-y-4 relative z-10 text-center py-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Hãy chọn một chủ đề để bắt đầu tập trung.</p>
              <Link to="/san-pham-2" className="block w-full py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 hover:border-primary-400 hover:text-primary-500 transition-all font-medium">
                + Tạo mục tiêu mới
              </Link>
            </div>
          </div>

          {/* Quick Access Grid */}
          <div className="grid grid-cols-2 gap-4">
            <QuickAction to="/san-pham-1" icon={MessageSquare} label="Chat AI" color="text-blue-600 dark:text-blue-400" bg="bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40" />
            <QuickAction to="/san-pham-2" icon={FileQuestion} label="Tạo Đề" color="text-green-600 dark:text-green-400" bg="bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40" />
            <QuickAction to="/san-pham-3" icon={Zap} label="Công Nghiệp" color="text-purple-600 dark:text-purple-400" bg="bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40" />
            <QuickAction to="/san-pham-4" icon={Trophy} label="Nông Nghiệp" color="text-teal-600 dark:text-teal-400" bg="bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/40" />
            <QuickAction to="/product8" icon={BookOpen} label="Tủ Sách" color="text-orange-600 dark:text-orange-400" bg="bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ icon: Icon, label, value, trend, color, bg }: any) => (
  <div className="glass-card p-5 rounded-2xl hover:-translate-y-1 cursor-default">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${bg} ${color} shadow-sm`}>
        <Icon size={20} />
      </div>
      <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-lg border border-green-100 dark:border-green-800/30">{trend}</span>
    </div>
    <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{value}</div>
    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</div>
  </div>
);

const QuickAction = ({ to, icon: Icon, label, color, bg }: any) => (
  <Link to={to} className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 ${bg} ${color} hover:scale-105 hover:shadow-lg border border-transparent hover:border-current/10 glass-card`}>
    <Icon size={32} className="mb-2 drop-shadow-sm" />
    <span className="font-bold text-sm">{label}</span>
  </Link>
);

export default Dashboard;
