import React, { useState, useEffect } from 'react';
import {
  getStudyGroups,
  createStudyGroup,
  getStudyGroup,
  joinStudyGroup,
  leaveStudyGroup,
  addGroupMessage,
  addResourceToGroup,
  getSharedResources,
  getUserProfile,
  StudyGroup,
  GroupMessage,
} from '../utils/shareUtils';

const Product7: React.FC = () => {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [user] = useState(getUserProfile());

  // Form states
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupCategory, setGroupCategory] = useState('Công nghệ');
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = () => {
    setGroups(getStudyGroups());
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) return;

    createStudyGroup({
      name: groupName,
      description: groupDescription,
      createdBy: user.id,
      category: groupCategory,
      isPublic,
    });

    setGroupName('');
    setGroupDescription('');
    setShowCreateModal(false);
    loadGroups();
  };

  const handleJoinGroup = (groupId: string) => {
    const success = joinStudyGroup(groupId);
    if (success) {
      loadGroups();
      const group = getStudyGroup(groupId);
      if (group) setSelectedGroup(group);
    }
  };

  const handleLeaveGroup = (groupId: string) => {
    leaveStudyGroup(groupId);
    setSelectedGroup(null);
    loadGroups();
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedGroup) return;

    addGroupMessage(selectedGroup.id, newMessage);
    setNewMessage('');
    
    // Refresh selected group
    const updated = getStudyGroup(selectedGroup.id);
    if (updated) setSelectedGroup(updated);
  };

  const isUserInGroup = (group: StudyGroup): boolean => {
    return group.members.some(m => m.id === user.id);
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Nhóm Học Tập
              </h1>
              <p className="text-gray-600 mt-1">Học cùng nhau, tiến bộ hơn mỗi ngày</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <i className="fas fa-plus mr-2"></i>
              Tạo nhóm mới
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Groups List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                <i className="fas fa-users mr-2 text-indigo-500"></i>
                Danh sách nhóm
              </h2>
              
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {groups.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <i className="fas fa-users text-4xl mb-2 opacity-50"></i>
                    <p>Chưa có nhóm nào</p>
                    <p className="text-sm">Hãy tạo nhóm đầu tiên!</p>
                  </div>
                ) : (
                  groups.map(group => {
                    const isMember = isUserInGroup(group);
                    const isSelected = selectedGroup?.id === group.id;
                    
                    return (
                      <div
                        key={group.id}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50 shadow-md'
                            : 'border-gray-200 hover:border-indigo-300 hover:shadow-sm'
                        }`}
                        onClick={() => {
                          const g = getStudyGroup(group.id);
                          if (g) setSelectedGroup(g);
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                              {group.name}
                              {!group.isPublic && (
                                <i className="fas fa-lock text-xs text-gray-400"></i>
                              )}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{group.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span>
                              <i className="fas fa-user-friends mr-1"></i>
                              {group.members.length}
                            </span>
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold">
                              {group.category}
                            </span>
                          </div>
                          
                          {!isMember && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleJoinGroup(group.id);
                              }}
                              className="px-3 py-1 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors"
                            >
                              Tham gia
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Group Details */}
          <div className="lg:col-span-2">
            {selectedGroup ? (
              <div className="bg-white rounded-2xl shadow-xl h-full flex flex-col">
                {/* Group Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900">{selectedGroup.name}</h2>
                      <p className="text-gray-600 mt-1">{selectedGroup.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                        <span>
                          <i className="fas fa-user-friends mr-1 text-indigo-500"></i>
                          {selectedGroup.members.length} thành viên
                        </span>
                        <span>
                          <i className="fas fa-calendar mr-1 text-purple-500"></i>
                          {formatDate(selectedGroup.createdAt)}
                        </span>
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold">
                          {selectedGroup.category}
                        </span>
                      </div>
                    </div>
                    
                    {isUserInGroup(selectedGroup) && (
                      <button
                        onClick={() => handleLeaveGroup(selectedGroup.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold"
                      >
                        <i className="fas fa-sign-out-alt mr-2"></i>
                        Rời nhóm
                      </button>
                    )}
                  </div>
                </div>

                {/* Members List */}
                <div className="p-6 border-b border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-3">
                    <i className="fas fa-users mr-2 text-indigo-500"></i>
                    Thành viên
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedGroup.members.map(member => (
                      <div
                        key={member.id}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg"
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                          {member.role === 'admin' && (
                            <span className="text-xs text-indigo-600 font-semibold">Quản trị viên</span>
                          )}
                        </div>
                        <span className="ml-2 text-xs text-gray-600">
                          {member.points} điểm
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat */}
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="p-6 pb-2">
                    <h3 className="font-bold text-gray-900">
                      <i className="fas fa-comments mr-2 text-purple-500"></i>
                      Trò chuyện nhóm
                    </h3>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                    {selectedGroup.chat.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <i className="fas fa-comment-dots text-4xl mb-2 opacity-50"></i>
                        <p>Chưa có tin nhắn nào</p>
                        <p className="text-sm">Hãy bắt đầu cuộc trò chuyện!</p>
                      </div>
                    ) : (
                      selectedGroup.chat.map(msg => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.userId === user.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                              msg.userId === user.id
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            {msg.userId !== user.id && (
                              <p className="text-xs font-semibold mb-1 opacity-80">{msg.userName}</p>
                            )}
                            <p className="text-sm">{msg.message}</p>
                            <p
                              className={`text-xs mt-1 ${
                                msg.userId === user.id ? 'text-white/70' : 'text-gray-500'
                              }`}
                            >
                              {formatDate(msg.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Message Input */}
                  {isUserInGroup(selectedGroup) && (
                    <div className="p-6 pt-2 border-t border-gray-200">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Nhập tin nhắn..."
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <i className="fas fa-paper-plane"></i>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <i className="fas fa-hand-point-left text-6xl mb-4 opacity-50"></i>
                  <p className="text-xl">Chọn một nhóm để xem chi tiết</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white">Tạo nhóm học tập</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên nhóm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="VD: Học nhóm Công nghệ lớp 9"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  placeholder="Mô tả về nhóm học tập..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Danh mục
                </label>
                <select
                  value={groupCategory}
                  onChange={(e) => setGroupCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="Công nghệ">Công nghệ</option>
                  <option value="Nông nghiệp">Nông nghiệp</option>
                  <option value="Chung">Chung</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="w-4 h-4 text-indigo-500 rounded"
                  />
                  <span className="text-sm text-gray-700">Công khai (Mọi người có thể tham gia)</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateGroup}
                  disabled={!groupName.trim()}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Tạo nhóm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product7;
