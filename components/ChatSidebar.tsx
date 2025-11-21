import React from 'react';
import { ChatSession, groupChatsByTime } from '../utils/chatStorage';

interface ChatSidebarProps {
  sidebarOpen: boolean;
  chatHistory: ChatSession[];
  currentSession: ChatSession | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewChat: () => void;
  onSelectChat: (session: ChatSession) => void;
  onDeleteChat: (id: string, e: React.MouseEvent) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  sidebarOpen,
  chatHistory,
  currentSession,
  searchQuery,
  onSearchChange,
  onNewChat,
  onSelectChat,
  onDeleteChat
}) => {
  const groupedChats = groupChatsByTime(chatHistory);

  return (
    <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-200 flex flex-col overflow-hidden`}>
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <button onClick={onNewChat} className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 font-semibold shadow-md">
          ➕ Chat mới
        </button>
        <div className="mt-3 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="🔍 Tìm kiếm..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin scrollbar-thumb-gray-300">
        {chatHistory.length === 0 && !searchQuery && (
          <div className="text-center py-8 px-4 text-gray-500">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-sm">Chưa có lịch sử chat</p>
          </div>
        )}

        {Object.entries(groupedChats).map(([key, sessions]) => sessions.length > 0 && (
          <div key={key}>
            <h3 className="text-xs font-bold text-gray-500 mb-2 px-2 uppercase">
              {key === 'today' ? '🕐 Hôm nay' : key === 'yesterday' ? '📅 Hôm qua' : '🗓️ 7 ngày qua'}
            </h3>
            {sessions.map(session => (
              <div
                key={session.id}
                onClick={() => onSelectChat(session)}
                className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-all group relative ${currentSession?.id === session.id ? 'bg-blue-50 border border-blue-200' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">💬 {session.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{session.messages.length} tin nhắn</p>
                  </div>
                  <button onClick={(e) => onDeleteChat(session.id, e)} className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 ml-2">
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
