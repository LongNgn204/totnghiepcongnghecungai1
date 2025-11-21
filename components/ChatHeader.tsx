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
    <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="text-gray-600 hover:text-blue-600 text-xl">
          ☰
        </button>
        <div className="flex items-center gap-3">
          <div className="text-2xl">🤖</div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <p className="text-xs text-gray-600">Trợ lý học tập thông minh</p>
          </div>
        </div>
      </div>
      {showExport && (
        <button onClick={onExport} className="text-gray-600 hover:text-blue-600 flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-100">
          💾 <span className="text-sm">Xuất file</span>
        </button>
      )}
    </div>
  );
};

export default ChatHeader;
