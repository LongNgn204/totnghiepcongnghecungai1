import React from 'react';

interface ChatHeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  title: string;
  onExport: () => void;
  showExport: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  sidebarOpen,
  onToggleSidebar,
  title,
  onExport,
  showExport
}) => {
  return (
    <div className="bg-white p-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium text-gray-700">{title}</h2>
          <span className="px-2 py-0.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs rounded-full font-medium">Gemini 2.5 Pro</span>
        </div>
      </div>
      {showExport && (
        <button onClick={onExport} className="text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors" title="Xuất nội dung">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        </button>
      )}
    </div>
  );
};

export default ChatHeader;
