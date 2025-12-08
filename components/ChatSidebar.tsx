import React from 'react';
import { ChatSession, groupChatsByTime } from '../utils/chatStorage';
import { VirtualList } from './VirtualList';

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
  const searchRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    const onFocusSearch = () => searchRef.current?.focus();
    window.addEventListener('focus-chat-search', onFocusSearch);
    return () => window.removeEventListener('focus-chat-search', onFocusSearch);
  }, []);

  return (
    <div
      className={`${sidebarOpen ? 'w-[280px]' : 'w-0'} transition-all duration-300 bg-gray-50 dark:bg-gray-900/50 flex flex-col overflow-hidden border-r border-gray-200 dark:border-gray-700`}
      role="complementary"
      aria-label="Sidebar trò chuyện"
    >
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-3 rounded-full transition-all flex items-center gap-3 font-medium text-sm mb-4 border border-gray-200 dark:border-gray-600"
          aria-label="Tạo cuộc trò chuyện mới"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Cuộc trò chuyện mới
        </button>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm"
            aria-label="Tìm kiếm cuộc trò chuyện"
            className="w-full pl-10 pr-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-full focus:bg-white dark:focus:bg-gray-600 focus:ring-1 focus:ring-blue-500 border-none text-sm transition-colors placeholder-gray-500 dark:placeholder-gray-400 text-gray-800 dark:text-gray-200"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {chatHistory.length === 0 && !searchQuery && (
          <div className="text-center py-8 px-4 text-gray-500 dark:text-gray-400 text-sm">
            Chưa có lịch sử trò chuyện
          </div>
        )}

        {Object.entries(groupedChats).map(([key, sessions]) => sessions.length > 0 && (
          <div key={key} className="mb-4">
            <h3 className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-2 px-4 uppercase tracking-wider">
              {key === 'today' ? 'Hôm nay' : key === 'yesterday' ? 'Hôm qua' : '7 ngày qua'}
            </h3>
            {sessions.length > 60 ? (
              <VirtualList
                items={sessions}
                height={360}
                itemHeight={44}
                overscan={8}
                ariaLabel={`Danh sách ${key}`}
                renderItem={(session) => (
                  <div
                    key={session.id}
                    onClick={() => onSelectChat(session)}
                    className={`group flex items-center justify-between px-4 py-2 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-all ${currentSession?.id === session.id ? 'bg-blue-100 dark:bg-blue-900/50 font-medium' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <svg className="flex-shrink-0 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                      <p className="text-sm truncate">{session.title}</p>
                    </div>
                    <button
                      onClick={(e) => onDeleteChat(session.id, e)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-white dark:hover:bg-gray-600 transition-all"
                      title="Xóa"
                      aria-label={`Xóa cuộc trò chuyện ${session.title}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </div>
                )}
                getKey={(s) => s.id}
              />
            ) : (
              sessions.map(session => (
                <div
                  key={session.id}
                  onClick={() => onSelectChat(session)}
                  className={`group flex items-center justify-between px-4 py-2 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-all ${currentSession?.id === session.id ? 'bg-blue-100 dark:bg-blue-900/50 font-medium' : 'text-gray-700 dark:text-gray-300'}`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <svg className="flex-shrink-0 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    <p className="text-sm truncate">{session.title}</p>
                  </div>
                  <button
                    onClick={(e) => onDeleteChat(session.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-white dark:hover:bg-gray-600 transition-all"
                    title="Xóa"
                    aria-label={`Xóa cuộc trò chuyện ${session.title}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
