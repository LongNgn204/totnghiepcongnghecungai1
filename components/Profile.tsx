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
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-2xl shadow-lg text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
          <User size={200} />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-center mb-2">Hồ Sơ Cá Nhân</h2>
          <p className="text-center text-blue-100 text-lg">Quản lý thông tin và theo dõi tiến độ của bạn</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-2xl"></div>

        <div className="px-8 pb-8">
          {/* Avatar */}
          <div className="relative -mt-16 mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          </div>

          {!isEditing ? (
            <div>
              {/* Display Mode */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
                  <p className="text-gray-600 flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    {profile.email}
                  </p>
                  <p className="text-gray-500 text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    Tham gia: {new Date(profile.joinedAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold flex items-center gap-2 shadow-md"
                >
                  <Edit2 className="w-4 h-4" />
                  Chỉnh sửa
                </button>
              </div>

              {profile.bio && (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    Giới thiệu
                  </h3>
                  <p className="text-gray-600">{profile.bio}</p>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-700 font-medium">Bài thi</p>
                      <p className="text-2xl font-bold text-blue-900">{profile.stats.examsCompleted}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-green-700 font-medium">Thời gian</p>
                      <p className="text-2xl font-bold text-green-900">{formatTime(profile.stats.studyTime)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-purple-700 font-medium">Flashcards</p>
                      <p className="text-2xl font-bold text-purple-900">{profile.stats.flashcardsLearned}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🔥</span>
                    </div>
                    <div>
                      <p className="text-sm text-orange-700 font-medium">Streak</p>
                      <p className="text-2xl font-bold text-orange-900">{profile.stats.currentStreak}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Edit Mode */}
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Chỉnh sửa hồ sơ</h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Tên hiển thị
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    placeholder="Nhập tên của bạn"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Giới thiệu
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-50"
                    rows={4}
                    placeholder="Viết vài dòng về bản thân..."
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={handleSave}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-md flex items-center justify-center gap-2"
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
                    className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-bold flex items-center justify-center gap-2"
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-blue-600" />
          Thành tích
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-3xl mb-2">🏆</p>
            <p className="text-sm text-gray-600 font-medium">Học viên tích cực</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
            <p className="text-3xl mb-2">⭐</p>
            <p className="text-sm text-gray-600 font-medium">Người mới</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
            <p className="text-3xl mb-2">📚</p>
            <p className="text-sm text-gray-600 font-medium">Học giỏi</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-100">
            <p className="text-3xl mb-2">🔥</p>
            <p className="text-sm text-gray-600 font-medium">Kiên trì</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
