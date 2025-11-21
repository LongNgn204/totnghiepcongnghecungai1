import React from 'react';
import { ChatMessage } from '../utils/chatStorage';
import MessageContent from './MessageContent';

interface MessageListProps {
  messages: ChatMessage[];
  loading: boolean;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onSuggestionClick: (msg: string) => void;
  onFileInputClick: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  loading,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onSuggestionClick,
  onFileInputClick,
  messagesEndRef
}) => {
  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm z-50 flex items-center justify-center border-4 border-dashed border-blue-500 rounded-lg">
          <div className="text-center bg-white p-6 rounded-xl shadow-xl">
            <div className="text-6xl mb-4">📂</div>
            <p className="text-xl font-bold text-blue-700">Thả file vào đây</p>
          </div>
        </div>
      )}

      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-700">
          <div className="text-7xl mb-6">💬</div>
          <h3 className="text-2xl font-bold mb-3">Bắt đầu trò chuyện</h3>
          <p className="text-center max-w-md text-gray-600 mb-8">
            Hỏi AI về kiến thức Công nghệ, giải bài tập, hoặc upload file để phân tích.
          </p>
          <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
            <button onClick={() => onSuggestionClick('Giải thích định luật Ohm?')} className="bg-white p-4 rounded-xl shadow hover:shadow-md text-left border border-gray-200 hover:border-blue-300 transition-all">
              💡 <span className="font-semibold">Giải thích kiến thức</span>
            </button>
            <button onClick={() => onSuggestionClick('Giải bài tập điện xoay chiều?')} className="bg-white p-4 rounded-xl shadow hover:shadow-md text-left border border-gray-200 hover:border-purple-300 transition-all">
              🧮 <span className="font-semibold">Giải bài tập</span>
            </button>
            <button onClick={onFileInputClick} className="bg-white p-4 rounded-xl shadow hover:shadow-md text-left border border-gray-200 hover:border-pink-300 transition-all">
              🖼️ <span className="font-semibold">Phân tích hình ảnh</span>
            </button>
            <button onClick={() => onSuggestionClick('Lộ trình ôn thi THPT?')} className="bg-white p-4 rounded-xl shadow hover:shadow-md text-left border border-gray-200 hover:border-green-300 transition-all">
              📅 <span className="font-semibold">Tư vấn học tập</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {messages.map(message => (
            <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && <div className="text-2xl mt-1">🤖</div>}
              <div className={`max-w-3xl ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900 border border-gray-200'} rounded-2xl px-6 py-4 shadow-md`}>
                {message.role === 'assistant' && (
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
                    <span className="text-sm font-bold text-blue-600">AI Assistant</span>
                    <button onClick={() => navigator.clipboard.writeText(message.content)} className="text-gray-400 hover:text-blue-500" title="Copy">📋</button>
                  </div>
                )}
                
                <MessageContent content={message.content} />

                {message.attachments?.map((file, idx) => (
                  <div key={idx} className="mt-2">
                    {file.preview ? (
                      <img src={file.preview} alt={file.name} className="max-w-xs rounded-lg border border-gray-300 cursor-pointer" onClick={() => window.open(file.preview, '_blank')} />
                    ) : (
                      <div className="flex items-center gap-2 bg-gray-100 p-2 rounded text-sm text-gray-800">
                        📄 {file.name}
                      </div>
                    )}
                  </div>
                ))}
                <div className={`mt-2 text-xs opacity-60 text-right ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                  {new Date(message.timestamp).toLocaleTimeString('vi-VN')}
                </div>
              </div>
              {message.role === 'user' && <div className="text-2xl mt-1">👤</div>}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="text-2xl">🤖</div>
              <div className="bg-white rounded-2xl px-6 py-4 shadow-md border border-gray-200">
                <span className="text-gray-500 font-medium">Đang suy nghĩ...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default MessageList;
