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
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-2xl shadow-lg text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
          <Trophy size={200} />
        </div>
        <div className="relative z-10">
          <div className="text-center">
            <div className="inline-block bg-white/20 backdrop-blur-sm p-4 rounded-full mb-4 border-2 border-white/30">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Bảng Xếp Hạng</h1>
            <p className="text-blue-100 text-lg">Cùng nhau thi đua học tập!</p>
          </div>

          {/* Filters */}
          <div className="flex justify-center gap-3 mt-8 bg-white/10 backdrop-blur-sm p-2 rounded-xl inline-flex mx-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-lg font-bold transition-all duration-300 flex items-center gap-2 ${filter === 'all'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-white hover:bg-white/20'
                }`}
            >
              <TrendingUp className="w-4 h-4" />
              Tất cả
            </button>
            <button
              onClick={() => setFilter('week')}
              className={`px-6 py-2 rounded-lg font-bold transition-all duration-300 flex items-center gap-2 ${filter === 'week'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-white hover:bg-white/20'
                }`}
            >
              <Clock className="w-4 h-4" />
              Tuần này
            </button>
            <button
              onClick={() => setFilter('month')}
              className={`px-6 py-2 rounded-lg font-bold transition-all duration-300 flex items-center gap-2 ${filter === 'month'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-white hover:bg-white/20'
                }`}
            >
              <Star className="w-4 h-4" />
              Tháng này
            </button>
          </div>
        </div>
      </div>

      {/* Top 3 */}
      {leaderboard.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 2nd Place */}
          <div className="md:order-1 order-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transform md:translate-y-8 hover:shadow-lg transition-all">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md">
                    {leaderboard[1].userName.charAt(0)}
                  </div>
                  <div className="absolute -top-2 -right-2 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                    <Medal className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{leaderboard[1].userName}</h3>
                <p className="text-3xl font-bold text-gray-600 mt-2">{leaderboard[1].points}</p>
                <p className="text-sm text-gray-500 font-medium">điểm</p>

                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs font-medium">Bài thi</p>
                    <p className="font-bold text-gray-900">{leaderboard[1].examsCompleted}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-medium">Flashcards</p>
                    <p className="font-bold text-gray-900">{leaderboard[1].flashcardsLearned}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-medium">Thời gian</p>
                    <p className="font-bold text-gray-900">{formatTime(leaderboard[1].studyTime)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 1st Place */}
          <div className="md:order-2 order-1">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 transform scale-105 hover:scale-110 transition-all">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-blue-600 shadow-xl">
                    {leaderboard[0].userName.charAt(0)}
                  </div>
                  <div className="absolute -top-2 -right-2 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full w-16 h-16 flex items-center justify-center shadow-xl animate-pulse">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white">{leaderboard[0].userName}</h3>
                <p className="text-4xl font-bold text-white mt-2">{leaderboard[0].points}</p>
                <p className="text-sm text-blue-100 font-medium">điểm</p>

                <div className="mt-4 pt-4 border-t border-white/30 grid grid-cols-3 gap-2 text-sm text-white">
                  <div>
                    <p className="text-blue-100 text-xs font-medium">Bài thi</p>
                    <p className="font-bold text-lg">{leaderboard[0].examsCompleted}</p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-xs font-medium">Flashcards</p>
                    <p className="font-bold text-lg">{leaderboard[0].flashcardsLearned}</p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-xs font-medium">Thời gian</p>
                    <p className="font-bold text-lg">{formatTime(leaderboard[0].studyTime)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="md:order-3 order-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transform md:translate-y-8 hover:shadow-lg transition-all">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md">
                    {leaderboard[2].userName.charAt(0)}
                  </div>
                  <div className="absolute -top-2 -right-2 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{leaderboard[2].userName}</h3>
                <p className="text-3xl font-bold text-orange-600 mt-2">{leaderboard[2].points}</p>
                <p className="text-sm text-gray-500 font-medium">điểm</p>

                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs font-medium">Bài thi</p>
                    <p className="font-bold text-gray-900">{leaderboard[2].examsCompleted}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-medium">Flashcards</p>
                    <p className="font-bold text-gray-900">{leaderboard[2].flashcardsLearned}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-medium">Thời gian</p>
                    <p className="font-bold text-gray-900">{formatTime(leaderboard[2].studyTime)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rest of Leaderboard */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
          <h2 className="text-xl font-bold text-white text-center flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6" />
            Xếp hạng chi tiết
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Hạng</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Học sinh</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Điểm</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Bài thi</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Flashcards</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Thời gian học</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Huy hiệu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-gray-500">
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="w-10 h-10 text-gray-300" />
                    </div>
                    <p className="font-medium text-gray-900 mb-1">Chưa có dữ liệu xếp hạng</p>
                    <p className="text-sm text-gray-500">Hãy bắt đầu học để lên bảng xếp hạng!</p>
                  </td>
                </tr>
              ) : (
                leaderboard.map((entry, index) => (
                  <tr
                    key={entry.userId}
                    className={`hover:bg-blue-50 transition-colors ${index < 3 ? 'bg-blue-50/30' : ''
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
                                : 'text-gray-600'
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
                            ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                            : index === 1
                              ? 'bg-gradient-to-br from-gray-300 to-gray-400'
                              : index === 2
                                ? 'bg-gradient-to-br from-orange-300 to-orange-400'
                                : 'bg-gradient-to-br from-blue-400 to-indigo-500'
                            }`}
                        >
                          {entry.userName.charAt(0)}
                        </div>
                        <span className="font-bold text-gray-900">{entry.userName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-lg font-bold text-blue-600">{entry.points}</span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-700 font-medium">{entry.examsCompleted}</td>
                    <td className="px-6 py-4 text-center text-gray-700 font-medium">{entry.flashcardsLearned}</td>
                    <td className="px-6 py-4 text-center text-gray-700 font-medium">{formatTime(entry.studyTime)}</td>
                    <td className="px-6 py-4 text-center">
                      {entry.badge ? (
                        <span className="text-2xl">{entry.badge}</span>
                      ) : (
                        <span className="text-gray-300 font-medium">-</span>
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Award className="w-6 h-6 text-blue-600" />
          Hệ thống huy hiệu
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="text-center p-6 bg-yellow-50 rounded-2xl border border-yellow-100 hover:shadow-md transition-all">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Crown className="w-8 h-8 text-yellow-600" />
            </div>
            <p className="font-bold text-gray-900">Nhất bảng</p>
            <p className="text-sm text-gray-600 mt-1">Top 1</p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-all">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Medal className="w-8 h-8 text-gray-600" />
            </div>
            <p className="font-bold text-gray-900">Á quân</p>
            <p className="text-sm text-gray-600 mt-1">Top 2</p>
          </div>
          <div className="text-center p-6 bg-orange-50 rounded-2xl border border-orange-100 hover:shadow-md transition-all">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-8 h-8 text-orange-600" />
            </div>
            <p className="font-bold text-gray-900">Hạng Ba</p>
            <p className="text-sm text-gray-600 mt-1">Top 3</p>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-2xl border border-purple-100 hover:shadow-md transition-all">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-8 h-8 text-purple-600" />
            </div>
            <p className="font-bold text-gray-900">Siêu sao</p>
            <p className="text-sm text-gray-600 mt-1">≥ 1000 điểm</p>
          </div>
          <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-100 hover:shadow-md transition-all">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <p className="font-bold text-gray-900">Ngôi sao</p>
            <p className="text-sm text-gray-600 mt-1">≥ 500 điểm</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
