import React, { useState, useEffect } from 'react';
import { getLeaderboard, LeaderboardEntry } from '../utils/shareUtils';

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = () => {
    setLeaderboard(getLeaderboard());
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 p-4 rounded-full mb-4">
              <i className="fas fa-trophy text-4xl text-white"></i>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
              Bảng Xếp Hạng
            </h1>
            <p className="text-gray-600 mt-2">Cùng nhau thi đua học tập!</p>
          </div>

          {/* Filters */}
          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilter('week')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${
                filter === 'week'
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tuần này
            </button>
            <button
              onClick={() => setFilter('month')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${
                filter === 'month'
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tháng này
            </button>
          </div>
        </div>

        {/* Top 3 */}
        {leaderboard.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* 2nd Place */}
            <div className="md:order-1 order-2">
              <div className="bg-white rounded-2xl shadow-xl p-6 transform md:translate-y-8">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {leaderboard[1].userName.charAt(0)}
                    </div>
                    <div className="absolute -top-2 -right-2 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-lg">
                      🥈
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{leaderboard[1].userName}</h3>
                  <p className="text-3xl font-bold text-gray-600 mt-2">{leaderboard[1].points}</p>
                  <p className="text-sm text-gray-500">điểm</p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Bài thi</p>
                      <p className="font-bold text-gray-900">{leaderboard[1].examsCompleted}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Flashcards</p>
                      <p className="font-bold text-gray-900">{leaderboard[1].flashcardsLearned}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Thời gian</p>
                      <p className="font-bold text-gray-900">{formatTime(leaderboard[1].studyTime)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 1st Place */}
            <div className="md:order-2 order-1">
              <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 rounded-2xl shadow-2xl p-6 transform scale-105">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-orange-500 shadow-lg">
                      {leaderboard[0].userName.charAt(0)}
                    </div>
                    <div className="absolute -top-2 -right-2 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full w-16 h-16 flex items-center justify-center text-3xl shadow-xl animate-pulse">
                      👑
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white">{leaderboard[0].userName}</h3>
                  <p className="text-4xl font-bold text-white mt-2">{leaderboard[0].points}</p>
                  <p className="text-sm text-white/80">điểm</p>
                  
                  <div className="mt-4 pt-4 border-t border-white/30 grid grid-cols-3 gap-2 text-sm text-white">
                    <div>
                      <p className="text-white/80 text-xs">Bài thi</p>
                      <p className="font-bold text-lg">{leaderboard[0].examsCompleted}</p>
                    </div>
                    <div>
                      <p className="text-white/80 text-xs">Flashcards</p>
                      <p className="font-bold text-lg">{leaderboard[0].flashcardsLearned}</p>
                    </div>
                    <div>
                      <p className="text-white/80 text-xs">Thời gian</p>
                      <p className="font-bold text-lg">{formatTime(leaderboard[0].studyTime)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="md:order-3 order-3">
              <div className="bg-white rounded-2xl shadow-xl p-6 transform md:translate-y-8">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {leaderboard[2].userName.charAt(0)}
                    </div>
                    <div className="absolute -top-2 -right-2 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-lg">
                      🥉
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{leaderboard[2].userName}</h3>
                  <p className="text-3xl font-bold text-orange-600 mt-2">{leaderboard[2].points}</p>
                  <p className="text-sm text-gray-500">điểm</p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Bài thi</p>
                      <p className="font-bold text-gray-900">{leaderboard[2].examsCompleted}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Flashcards</p>
                      <p className="font-bold text-gray-900">{leaderboard[2].flashcardsLearned}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Thời gian</p>
                      <p className="font-bold text-gray-900">{formatTime(leaderboard[2].studyTime)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rest of Leaderboard */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 p-4">
            <h2 className="text-xl font-bold text-white text-center">
              Xếp hạng chi tiết
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Hạng</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Học sinh</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Điểm</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Bài thi</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Flashcards</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Thời gian học</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Huy hiệu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <i className="fas fa-trophy text-4xl mb-2 opacity-50"></i>
                      <p>Chưa có dữ liệu xếp hạng</p>
                      <p className="text-sm">Hãy bắt đầu học để lên bảng xếp hạng!</p>
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((entry, index) => (
                    <tr
                      key={entry.userId}
                      className={`hover:bg-gray-50 transition-colors ${
                        index < 3 ? 'bg-yellow-50/30' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-lg font-bold ${
                              index === 0
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
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                              index === 0
                                ? 'bg-gradient-to-br from-yellow-400 to-orange-400'
                                : index === 1
                                ? 'bg-gradient-to-br from-gray-300 to-gray-400'
                                : index === 2
                                ? 'bg-gradient-to-br from-orange-300 to-orange-400'
                                : 'bg-gradient-to-br from-indigo-500 to-purple-500'
                            }`}
                          >
                            {entry.userName.charAt(0)}
                          </div>
                          <span className="font-semibold text-gray-900">{entry.userName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-lg font-bold text-orange-600">{entry.points}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-700">{entry.examsCompleted}</td>
                      <td className="px-6 py-4 text-center text-gray-700">{entry.flashcardsLearned}</td>
                      <td className="px-6 py-4 text-center text-gray-700">{formatTime(entry.studyTime)}</td>
                      <td className="px-6 py-4 text-center text-2xl">{entry.badge || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Badges Info */}
        <div className="mt-6 bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            <i className="fas fa-award mr-2 text-yellow-500"></i>
            Hệ thống huy hiệu
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-yellow-50 rounded-xl">
              <div className="text-4xl mb-2">🥇</div>
              <p className="font-semibold text-gray-900">Nhất bảng</p>
              <p className="text-sm text-gray-600">Top 1</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-4xl mb-2">🥈</div>
              <p className="font-semibold text-gray-900">Á quân</p>
              <p className="text-sm text-gray-600">Top 2</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <div className="text-4xl mb-2">🥉</div>
              <p className="font-semibold text-gray-900">Hạng Ba</p>
              <p className="text-sm text-gray-600">Top 3</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-4xl mb-2">⭐</div>
              <p className="font-semibold text-gray-900">Siêu sao</p>
              <p className="text-sm text-gray-600">≥ 1000 điểm</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-4xl mb-2">🌟</div>
              <p className="font-semibold text-gray-900">Ngôi sao</p>
              <p className="text-sm text-gray-600">≥ 500 điểm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
