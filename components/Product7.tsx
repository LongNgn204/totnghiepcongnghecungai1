import React, { useState, useEffect } from 'react';
import {
  getStudyGroups,
  createStudyGroup,
  joinStudyGroup,
  leaveStudyGroup,
  addGroupMessage,
  StudyGroup,
  GroupMessage,
} from '../utils/shareUtils';
import ProductTemplate from './layout/ProductTemplate';
import { Users, UserPlus, MessageCircle, ShieldCheck, Sparkles, FolderOpen, RefreshCcw, Plus, Send, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Product7: React.FC = () => {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const { user } = useAuth();

  const loadGroups = () => {
    const allGroups = getStudyGroups();
    setGroups(allGroups);
    if (selectedGroup) {
      const updated = allGroups.find(g => g.id === selectedGroup.id);
      if (updated) setSelectedGroup(updated);
    }
  };

  useEffect(() => {
    loadGroups();
    const interval = setInterval(loadGroups, 5000); // Poll for updates
    return () => clearInterval(interval);
  }, []);

  const handleCreateGroup = () => {
    if (!newGroupName.trim() || !user) return;
    createStudyGroup(newGroupName, newGroupDescription, user.id);
    setNewGroupName('');
    setNewGroupDescription('');
    setShowCreateModal(false);
    loadGroups();
  };

  const handleJoinGroup = (groupId: string) => {
    if (!user) return;
    joinStudyGroup(groupId, user.id);
    loadGroups();
  };

  const handleLeaveGroup = (groupId: string) => {
    if (!user || !window.confirm('Bạn có chắc muốn rời nhóm này?')) return;
    leaveStudyGroup(groupId, user.id);
    if (selectedGroup?.id === groupId) setSelectedGroup(null);
    loadGroups();
  };

  const handleSendMessage = () => {
    if (!selectedGroup || !messageInput.trim() || !user) return;
    addGroupMessage(selectedGroup.id, user.id, user.name || 'User', messageInput);
    setMessageInput('');
    loadGroups();
  };

  const sidebarContent = (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-600" />
          Tổng quan cộng đồng
        </h4>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <span>Tổng số nhóm</span>
            <span className="font-bold text-gray-900 dark:text-white">{groups.length}</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <span>Nhóm của bạn</span>
            <span className="font-bold text-blue-500">
              {user ? groups.filter(g => g.members.includes(user.id)).length : 0}
            </span>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 space-y-3">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          Hành động nhanh
        </h4>
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full btn-primary py-2.5 rounded-xl font-semibold shadow-md flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tạo nhóm mới
        </button>
        <button
          onClick={loadGroups}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          <RefreshCcw className="w-4 h-4" />
          Làm mới
        </button>
      </div>

      {selectedGroup && (
        <div className="glass-card p-6 border-l-4 border-l-blue-500">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-blue-600" />
            Nhóm đang chọn
          </h4>
          <p className="font-bold text-gray-900 dark:text-white mb-1">{selectedGroup.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{selectedGroup.description}</p>
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{selectedGroup.members.length} thành viên</span>
            <button
              onClick={() => handleLeaveGroup(selectedGroup.id)}
              className="text-red-500 hover:text-red-600 flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" /> Rời nhóm
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <ProductTemplate
      icon={<Users className="w-28 h-28 text-white/40" />}
      title="Sản phẩm học tập số 7: Nhóm học tập & chia sẻ tài nguyên"
      subtitle="Kết nối bạn bè, trao đổi kiến thức và đồng bộ tài nguyên học tập theo thời gian thực"
      heroGradientFrom="from-sky-700"
      heroGradientTo="to-blue-600"
      sidebar={sidebarContent}
    >
      <div className="space-y-8 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)] min-h-[600px]">
          {/* Group List */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="glass-panel p-4 flex-1 overflow-y-auto">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm py-2 z-10">
                <Users className="w-5 h-5 text-blue-600" />
                Danh sách nhóm
              </h2>
              <div className="space-y-3">
                {groups.map(group => (
                  <div
                    key={group.id}
                    onClick={() => setSelectedGroup(group)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedGroup?.id === group.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-500 shadow-md'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm'
                      }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900 dark:text-white">{group.name}</h3>
                      {user && !group.members.includes(user.id) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJoinGroup(group.id);
                          }}
                          className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                          title="Tham gia nhóm"
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">{group.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Users className="w-3 h-3" />
                      <span>{group.members.length} thành viên</span>
                    </div>
                  </div>
                ))}
                {groups.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Chưa có nhóm nào. Hãy tạo nhóm mới!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {selectedGroup ? (
              <div className="glass-panel h-full flex flex-col overflow-hidden">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedGroup.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedGroup.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[...Array(Math.min(3, selectedGroup.members.length))].map((_, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-bold">
                          {String.fromCharCode(65 + i)}
                        </div>
                      ))}
                      {selectedGroup.members.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-bold text-gray-500">
                          +{selectedGroup.members.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/50">
                  {selectedGroup.messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                      <MessageCircle className="w-12 h-12 mb-2 opacity-50" />
                      <p>Chưa có tin nhắn nào. Hãy bắt đầu trò chuyện!</p>
                    </div>
                  ) : (
                    selectedGroup.messages.map(msg => (
                      <div key={msg.id} className={`flex flex-col ${msg.senderId === user?.id ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl p-3 ${msg.senderId === user?.id
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-tl-none'
                          }`}>
                          {msg.senderId !== user?.id && (
                            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">{msg.senderName}</p>
                          )}
                          <p className="text-sm">{msg.content}</p>
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1 px-1">
                          {new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder={user ? "Nhập tin nhắn..." : "Đăng nhập để chat"}
                      disabled={!user || !selectedGroup.members.includes(user.id)}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!user || !messageInput.trim() || !selectedGroup.members.includes(user.id)}
                      className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  {!user && (
                    <p className="text-xs text-center text-red-500 mt-2">Vui lòng đăng nhập để tham gia trò chuyện.</p>
                  )}
                  {user && !selectedGroup.members.includes(user.id) && (
                    <p className="text-xs text-center text-blue-500 mt-2 cursor-pointer hover:underline" onClick={() => handleJoinGroup(selectedGroup.id)}>
                      Bạn chưa tham gia nhóm này. Nhấn để tham gia.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="glass-panel h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                  <Users className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Chọn một nhóm để bắt đầu</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                  Tham gia các nhóm học tập để trao đổi kiến thức, chia sẻ tài liệu và cùng nhau tiến bộ.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Create Group Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="glass-panel w-full max-w-md p-6 animate-scale-in">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tạo nhóm học tập mới</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tên nhóm</label>
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="VD: Ôn thi THPT Quốc gia 2025"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mô tả</label>
                  <textarea
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Mô tả mục đích hoạt động của nhóm..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 font-bold hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleCreateGroup}
                    disabled={!newGroupName.trim()}
                    className="flex-1 btn-primary py-2.5 rounded-xl font-bold"
                  >
                    Tạo nhóm
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

export default Product7;
