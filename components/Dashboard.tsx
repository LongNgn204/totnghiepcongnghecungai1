import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Loader2
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
        const data = await api.dashboard.getStats();
        if (data) {
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 space-y-8 animate-fade-in">
      {/* Hero Section with Glassmorphism & AI Mascot */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold border border-white/10 flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                LIVE LEARNING CENTER
              </span>
              <span className="text-white/90 text-sm font-medium flex items-center gap-1">
                <img src="/images/icon-calendar.png" alt="Calendar" className="w-4 h-4 object-contain invert brightness-0 filter" />
                {currentTime.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight leading-tight">
              Xin chào, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">
                {userName}
              </span>
            </h1>

            <p className="text-indigo-100 text-lg max-w-xl mb-8 leading-relaxed">
              Hôm nay là một ngày tuyệt vời để bứt phá giới hạn! AI Gemini đã sẵn sàng hỗ trợ bạn chinh phục mọi thử thách.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 min-w-[160px] hover:bg-white/20 transition-colors cursor-default">
                <div className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                  <img src="/images/icon-clock.png" alt="Clock" className="w-3 h-3 object-contain invert brightness-0 filter" /> Thời gian học
                </div>
                <div className="text-3xl font-mono font-bold tracking-wider">{formatTime(sessionTime)}</div>
              </div>
            </div>
          </div>

          {/* AI Mascot Image */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 flex-shrink-0 animate-float">
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/50 to-transparent rounded-full blur-xl transform translate-y-10"></div>
            <img
              src="/images/ai_mascot.png"
              alt="AI Assistant"
              className="w-full h-full object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
            />
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
              image="/images/icon-streak.png"
              label="Chuỗi ngày học"
              value={`${stats?.streak || 0} Ngày`}
              trend={stats?.streak ? "Đang duy trì" : "Bắt đầu ngay"}
              color="bg-yellow-50 text-yellow-700"
            />
            <StatCard
              image="/images/icon-target.png"
              label="Mục tiêu tuần"
              value={`${stats?.weeklyProgress || 0}%`}
              trend={stats?.weeklyProgress === 100 ? "Hoàn thành" : "Cố lên!"}
              color="bg-red-50 text-red-700"
            />
            <StatCard
              image="/images/icon-trophy.png"
              label="Điểm trung bình"
              value={stats?.avgScore || "--"}
              trend={stats?.avgScore ? "Điểm số" : "Chưa có điểm"}
              color="bg-purple-50 text-purple-700"
            />
          </div>

          {/* Learning Activity Chart */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <img src="/images/icon-activity.png" alt="Activity" className="w-5 h-5 object-contain" />
                Hoạt động học tập (7 ngày qua)
              </h3>
            </div>

            <div className="h-64 flex items-end justify-between gap-2 px-2">
              {stats?.chartData && stats.chartData.length > 0 ? (
                stats.chartData.map((duration, i) => {
                  // Normalize height (max 100%) based on max value or default 3600s (1 hour)
                  const maxVal = Math.max(...stats.chartData, 3600);
                  const height = Math.round((duration / maxVal) * 100);
                  const dayLabel = new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('vi-VN', { weekday: 'short' });

                  return (
                    <div key={i} className="w-full flex flex-col items-center gap-2 group cursor-pointer">
                      <div className="relative w-full h-full flex items-end">
                        <div
                          className="w-full bg-blue-100 rounded-t-xl relative overflow-hidden transition-all duration-500 ease-out group-hover:bg-blue-200"
                          style={{ height: `${height}%`, minHeight: duration > 0 ? '4px' : '0' }}
                          title={`${Math.round(duration / 60)} phút`}
                        >
                          <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-blue-600 to-blue-400 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-gray-400 group-hover:text-blue-600 transition-colors">
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
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <img src="/images/icon-clock.png" alt="Recent" className="w-5 h-5 object-contain" />
              Hoạt động gần đây
            </h3>
            <div className="space-y-6">
              {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 group cursor-pointer p-2 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className={`p-3 rounded-2xl ${item.type === 'exam' ? 'bg-blue-50' : 'bg-purple-50'} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                      <img
                        src={item.type === 'exam' ? "/images/icon-activity-exam.png" : "/images/icon-activity-learn.png"}
                        alt="Activity Icon"
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                      <p className="text-sm text-gray-500">
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
                  <Link to="/san-pham-1" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Bắt đầu học ngay
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Quick Actions & Focus */}
        <div className="space-y-8">
          {/* Focus Area (Empty State) */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 relative overflow-hidden hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <h3 className="text-xl font-bold text-gray-800 mb-6 relative z-10 flex items-center gap-2">
              <img src="/images/icon-target.png" alt="Target" className="w-6 h-6 object-contain" />
              Trọng tâm hôm nay
            </h3>

            <div className="space-y-4 relative z-10 text-center py-4">
              <p className="text-gray-500 text-sm">Hãy chọn một chủ đề để bắt đầu tập trung.</p>
              <Link to="/san-pham-2" className="block w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-all font-medium">
                + Tạo mục tiêu mới
              </Link>
            </div>
          </div>

          {/* Quick Access Grid */}
          <div className="grid grid-cols-2 gap-4">
            <QuickAction to="/san-pham-1" image="/images/icon-chat-ai.png" label="Chat AI" color="bg-blue-50 hover:bg-blue-100 text-blue-600" />
            <QuickAction to="/san-pham-2" image="/images/icon-create-questions.png" label="Tạo Đề" color="bg-green-50 hover:bg-green-100 text-green-600" />
            <QuickAction to="/san-pham-3" image="/images/icon-industrial-tech.png" label="Công Nghiệp" color="bg-purple-50 hover:bg-purple-100 text-purple-600" />
            <QuickAction to="/san-pham-4" image="/images/icon-agricultural-tech.png" label="Nông Nghiệp" color="bg-teal-50 hover:bg-teal-100 text-teal-600" />
            <QuickAction to="/flashcards" image="/images/icon-flashcards.png" label="Flashcards" color="bg-pink-50 hover:bg-pink-100 text-pink-600" />
            <QuickAction to="/product8" image="/images/icon-bookshelf.png" label="Tủ Sách" color="bg-orange-50 hover:bg-orange-100 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ image, label, value, trend, color }: any) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1 cursor-default">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color} shadow-sm`}>
        <img src={image} alt={label} className="w-8 h-8 object-contain" />
      </div>
      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg border border-green-100">{trend}</span>
    </div>
    <div className="text-2xl font-bold text-gray-800 mb-1">{value}</div>
    <div className="text-xs text-gray-500 font-medium">{label}</div>
  </div>
);

const QuickAction = ({ to, image, label, color }: any) => (
  <Link to={to} className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 ${color} hover:scale-105 hover:shadow-lg border border-transparent hover:border-current/10`}>
    <img src={image} alt={label} className="w-12 h-12 mb-2 object-contain drop-shadow-sm" />
    <span className="font-bold text-sm">{label}</span>
  </Link>
);

export default Dashboard;
