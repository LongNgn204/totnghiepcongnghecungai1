import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../utils/shareUtils';
import { api } from '../utils/apiClient';
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Star,
  Clock,
  FileText,
  Layers,
  TrendingUp,
  Filter
} from 'lucide-react';

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await api.leaderboard.get();
      // Ensure data is in correct format or map it
      // Assuming backend returns { leaderboard: LeaderboardEntry[] } or similar
      // If backend returns array directly:
      const entries = Array.isArray(data) ? data : (data.leaderboard || []);

      // Map backend fields to frontend interface if needed
      // Backend: user_id, name, points, exams_completed, flashcards_learned, study_time
      // Frontend: userId, userName, points, examsCompleted, flashcardsLearned, studyTime

      const mappedEntries = entries.map((e: any) => ({
        userId: e.user_id || e.userId,
        userName: e.name || e.userName,
        points: e.points || 0,
        examsCompleted: e.exams_completed || e.examsCompleted || 0,
        flashcardsLearned: e.flashcards_learned || e.flashcardsLearned || 0,
        studyTime: e.study_time || e.studyTime || 0,
        rank: e.rank || 0,
        badge: e.badge
      }));

      setLeaderboard(mappedEntries);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="glass-panel border-0 p-8 text-white relative overflow-hidden rounded-3xl shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 opacity-90"></div>
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 scale-150">
          <Trophy size={200} />
        </div>
        <div className="relative z-10">
          <div className="text-center">
            <div className="inline-block bg-white/20 backdrop-blur-sm p-4 rounded-full mb-4 border-2 border-white/30 shadow-lg">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">Bảng Xếp Hạng</h1>
            <p className="text-white/90 text-lg">Cùng nhau thi đua học tập!</p>
          </div>

          {/* Filters */}
          <div className="flex justify-center gap-3 mt-8">
            <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-2xl inline-flex mx-auto border border-white/20">
              <button
                onClick={() => setFilter('all')}
                className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${filter === 'all'
                  ? 'bg-white text-primary-600 shadow-lg'
                  : 'text-white hover:bg-white/10'
                  }`}
              >
                <TrendingUp className="w-4 h-4" />
                Tất cả
              </button>
              <button
                onClick={() => setFilter('week')}
                className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${filter === 'week'
                  ? 'bg-white text-primary-600 shadow-lg'
                  : 'text-white hover:bg-white/10'
                  }`}
              >
                <Clock className="w-4 h-4" />
                Tuần này
              </button>
              <button
                onClick={() => setFilter('month')}
                className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${filter === 'month'
                  ? 'bg-white text-primary-600 shadow-lg'
                  : 'text-white hover:bg-white/10'
                  }`}
              >
                <Star className="w-4 h-4" />
                Tháng này
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 */}
      {leaderboard.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* 2nd Place */}
          <div className="md:order-1 order-2">
            <div className="glass-card p-6 transform hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gray-400"></div>
              <div className="text-center pt-4">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center text-gray-700 dark:text-white text-3xl font-bold shadow-inner border-4 border-white dark:border-gray-800">
                    {leaderboard[1].userName.charAt(0)}
                  </div>
                  <div className="absolute -top-3 -right-3 bg-gray-400 rounded-full w-10 h-10 flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800">
                    <span className="text-white font-bold">2</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate px-2">{leaderboard[1].userName}</h3>
                <p className="text-3xl font-bold text-gray-500 dark:text-gray-400 mt-1">{leaderboard[1].points}</p>
                <p className="text-sm text-gray-400 font-medium">điểm</p>

                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Bài thi</p>
                    <p className="font-bold text-gray-900 dark:text-white">{leaderboard[1].examsCompleted}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Thẻ</p>
                    <p className="font-bold text-gray-900 dark:text-white">{leaderboard[1].flashcardsLearned}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Giờ</p>
                    <p className="font-bold text-gray-900 dark:text-white">{formatTime(leaderboard[1].studyTime)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 1st Place */}
          <div className="md:order-2 order-1">
            <div className="glass-panel border-0 p-8 transform scale-110 hover:scale-115 transition-all duration-300 relative overflow-hidden shadow-2xl z-10">
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/20 to-transparent"></div>
              <div className="absolute top-0 left-0 w-full h-1.5 bg-yellow-400"></div>
              <div className="text-center relative z-10">
                <div className="relative inline-block mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/50 dark:to-yellow-800/50 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-400 text-5xl font-bold shadow-inner border-4 border-white dark:border-gray-800">
                    {leaderboard[0].userName.charAt(0)}
                  </div>
                  <div className="absolute -top-6 -right-4">
                    <Crown className="w-14 h-14 text-yellow-400 drop-shadow-lg animate-bounce" />
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-md whitespace-nowrap">
                    TOP 1
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white truncate px-2">{leaderboard[0].userName}</h3>
                <p className="text-5xl font-bold text-yellow-500 mt-2">{leaderboard[0].points}</p>
                <p className="text-sm text-yellow-600/80 dark:text-yellow-400/80 font-medium">điểm</p>

                <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50 grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">Bài thi</p>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">{leaderboard[0].examsCompleted}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">Thẻ</p>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">{leaderboard[0].flashcardsLearned}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">Giờ</p>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">{formatTime(leaderboard[0].studyTime)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="md:order-3 order-3">
            <div className="glass-card p-6 transform hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-orange-400"></div>
              <div className="text-center pt-4">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 text-3xl font-bold shadow-inner border-4 border-white dark:border-gray-800">
                    {leaderboard[2].userName.charAt(0)}
                  </div>
                  <div className="absolute -top-3 -right-3 bg-orange-400 rounded-full w-10 h-10 flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800">
                    <span className="text-white font-bold">3</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate px-2">{leaderboard[2].userName}</h3>
                <p className="text-3xl font-bold text-orange-500 mt-1">{leaderboard[2].points}</p>
                <p className="text-sm text-orange-400/80 font-medium">điểm</p>

                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Bài thi</p>
                    <p className="font-bold text-gray-900 dark:text-white">{leaderboard[2].examsCompleted}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Thẻ</p>
                    <p className="font-bold text-gray-900 dark:text-white">{leaderboard[2].flashcardsLearned}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Giờ</p>
                    <p className="font-bold text-gray-900 dark:text-white">{formatTime(leaderboard[2].studyTime)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rest of Leaderboard */}
      <div className="glass-card overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600/10 to-secondary-600/10 p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6 text-primary-600" />
            Xếp hạng chi tiết
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">Hạng</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">Học sinh</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-white">Điểm</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-white">Bài thi</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-white">Flashcards</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-white">Thời gian học</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-white">Huy hiệu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-gray-500 dark:text-gray-400">
                    <div className="bg-gray-50 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white mb-1">Chưa có dữ liệu xếp hạng</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Hãy bắt đầu học để lên bảng xếp hạng!</p>
                  </td>
                </tr>
              ) : (
                leaderboard.map((entry, index) => (
                  <tr
                    key={entry.userId}
                    className={`hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-colors ${index < 3 ? 'bg-primary-50/20 dark:bg-primary-900/5' : ''
                      }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-lg font-bold ${index === 0
                            ? 'text-yellow-500'
                            : index === 1
                              ? 'text-gray-400'
                              : index === 2
                                ? 'text-orange-400'
                                : 'text-gray-600 dark:text-gray-400'
                            }`}
                        >
                          #{entry.rank}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${index === 0
                            ? 'bg-gradient-to-br from-yellow-400 to-yellow-500'
                            : index === 1
                              ? 'bg-gradient-to-br from-gray-400 to-gray-500'
                              : index === 2
                                ? 'bg-gradient-to-br from-orange-400 to-orange-500'
                                : 'bg-gradient-to-br from-primary-400 to-secondary-500'
                            }`}
                        >
                          {entry.userName.charAt(0)}
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white">{entry.userName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{entry.points}</span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-700 dark:text-gray-300 font-medium">{entry.examsCompleted}</td>
                    <td className="px-6 py-4 text-center text-gray-700 dark:text-gray-300 font-medium">{entry.flashcardsLearned}</td>
                    <td className="px-6 py-4 text-center text-gray-700 dark:text-gray-300 font-medium">{formatTime(entry.studyTime)}</td>
                    <td className="px-6 py-4 text-center">
                      {entry.badge ? (
                        <span className="text-2xl" title={entry.badge}>{entry.badge}</span>
                      ) : (
                        <span className="text-gray-300 dark:text-gray-600 font-medium">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Badges Info */}
      <div className="glass-card p-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Award className="w-6 h-6 text-primary-600" />
          Hệ thống huy hiệu
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="text-center p-6 bg-yellow-50 dark:bg-yellow-900/10 rounded-2xl border border-yellow-100 dark:border-yellow-900/30 hover:shadow-md transition-all group">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Crown className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <p className="font-bold text-gray-900 dark:text-white">Nhất bảng</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Top 1</p>
          </div>
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group">
            <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Medal className="w-8 h-8 text-gray-600 dark:text-gray-400" />
            </div>
            <p className="font-bold text-gray-900 dark:text-white">Á quân</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Top 2</p>
          </div>
          <div className="text-center p-6 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-900/30 hover:shadow-md transition-all group">
            <div className="bg-orange-100 dark:bg-orange-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Award className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <p className="font-bold text-gray-900 dark:text-white">Hạng Ba</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Top 3</p>
          </div>
          <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-900/30 hover:shadow-md transition-all group">
            <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Star className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="font-bold text-gray-900 dark:text-white">Siêu sao</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">≥ 1000 điểm</p>
          </div>
          <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 hover:shadow-md transition-all group">
            <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="font-bold text-gray-900 dark:text-white">Ngôi sao</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">≥ 500 điểm</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
