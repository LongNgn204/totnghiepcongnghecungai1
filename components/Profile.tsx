import React, { useState } from 'react';
import { User, Mail, Calendar, Edit2, Save, X, Trophy, Clock, BookOpen } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  joinedAt: string;
  stats: {
    examsCompleted: number;
    studyTime: number;
    flashcardsLearned: number;
    currentStreak: number;
  };
}

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(() => {
    const stored = localStorage.getItem('user_profile');
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      id: localStorage.getItem('user_id') || 'user_123',
      name: 'Học Sinh',
      email: 'student@example.com',
      bio: 'Đang học tập chăm chỉ để đạt kết quả tốt!',
      avatar: '',
      joinedAt: new Date().toISOString(),
      stats: {
        examsCompleted: 0,
        studyTime: 0,
        flashcardsLearned: 0,
        currentStreak: 0
      }
    };
  });

  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    bio: profile.bio
  });

  const handleSave = () => {
    const updatedProfile = {
      ...profile,
      name: formData.name,
      email: formData.email,
      bio: formData.bio
    };
    setProfile(updatedProfile);
    localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
    setIsEditing(false);
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    return hours > 0 ? `${hours}h` : `${minutes}m`;
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="glass-panel border-0 p-8 text-white relative overflow-hidden rounded-3xl shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 opacity-90"></div>
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 scale-150">
          <User size={200} />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 flex items-center justify-center gap-3 tracking-tight">
            <User className="w-10 h-10" />
            Hồ Sơ Cá Nhân
          </h2>
          <p className="text-center text-white/90 text-lg max-w-2xl mx-auto">
            Quản lý thông tin và theo dõi tiến độ của bạn
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="glass-card overflow-hidden">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-primary-500 to-secondary-600 relative">
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        <div className="px-8 pb-8">
          {/* Avatar */}
          <div className="relative -mt-20 mb-6 flex justify-between items-end">
            <div className="w-40 h-40 rounded-full border-4 border-white dark:border-gray-800 shadow-2xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-white text-5xl font-bold relative z-10">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="mb-4 px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-bold flex items-center gap-2 shadow-lg hover:-translate-y-0.5"
              >
                <Edit2 className="w-4 h-4" />
                Chỉnh sửa
              </button>
            )}
          </div>

          {!isEditing ? (
            <div>
              {/* Display Mode */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{profile.name}</h1>
                <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-400">
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary-500" />
                    {profile.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-secondary-500" />
                    Tham gia: {new Date(profile.joinedAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>

              {profile.bio && (
                <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-primary-500" />
                    Giới thiệu
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{profile.bio}</p>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-800/30 hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-500 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <BookOpen className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">Bài thi</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{profile.stats.examsCompleted}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-2xl border border-green-200 dark:border-green-800/30 hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-500 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
                      <Clock className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-green-600 dark:text-green-400 font-bold uppercase tracking-wider">Thời gian</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatTime(profile.stats.studyTime)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-2xl border border-purple-200 dark:border-purple-800/30 hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className="bg-purple-500 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                      <Trophy className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider">Flashcards</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{profile.stats.flashcardsLearned}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 rounded-2xl border border-orange-200 dark:border-orange-800/30 hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-500 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                      <span className="text-2xl">🔥</span>
                    </div>
                    <div>
                      <p className="text-sm text-orange-600 dark:text-orange-400 font-bold uppercase tracking-wider">Streak</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{profile.stats.currentStreak}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              {/* Edit Mode */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Chỉnh sửa hồ sơ</h2>

              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Tên hiển thị
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
                    placeholder="Nhập tên của bạn"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Giới thiệu
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
                    rows={4}
                    placeholder="Viết vài dòng về bản thân..."
                  />
                </div>

                <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={handleSave}
                    className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-bold shadow-md flex items-center justify-center gap-2 hover:-translate-y-0.5"
                  >
                    <Save className="w-5 h-5" />
                    Lưu thay đổi
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: profile.name,
                        email: profile.email,
                        bio: profile.bio
                      });
                    }}
                    className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-bold flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Activity Info */}
      <div className="glass-card p-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary-600" />
          Thành tích
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 hover:shadow-md transition-all group">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform inline-block">🏆</div>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-bold">Học viên tích cực</p>
          </div>
          <div className="text-center p-6 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-900/30 hover:shadow-md transition-all group">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform inline-block">⭐</div>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-bold">Người mới</p>
          </div>
          <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-900/30 hover:shadow-md transition-all group">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform inline-block">📚</div>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-bold">Học giỏi</p>
          </div>
          <div className="text-center p-6 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-900/30 hover:shadow-md transition-all group">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform inline-block">🔥</div>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-bold">Kiên trì</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
