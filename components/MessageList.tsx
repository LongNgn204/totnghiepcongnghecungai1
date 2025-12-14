import React, { useState } from 'react';
import { ChatMessage } from '../utils/chatStorage';
import MessageContent from './MessageContent';
import FeedbackForm from './FeedbackForm';
import TextToSpeech from './TextToSpeech';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

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
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackMessageId, setFeedbackMessageId] = useState<string | null>(null);
  const [defaultRating, setDefaultRating] = useState<'up' | 'down' | undefined>(undefined);

  const openFeedback = (messageId: string, rating: 'up' | 'down') => {
    setFeedbackMessageId(messageId);
    setDefaultRating(rating);
    setFeedbackOpen(true);
  };

  return (
    <div
      className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-white dark:bg-gray-800"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 bg-blue-50/90 dark:bg-blue-900/90 z-50 flex items-center justify-center border-4 border-dashed border-blue-400 rounded-lg transition-all">
          <div className="text-center">
            <p className="text-2xl font-medium text-blue-600 dark:text-blue-300">Thả file vào đây</p>
          </div>
        </div>
      )}

      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-800 dark:text-gray-200">
          <h3 className="text-4xl font-medium mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Xin chào, tôi có thể giúp gì?</h3>
          <p className="text-center max-w-lg text-gray-500 dark:text-gray-400 mb-12 text-lg">
            Hỏi về Công nghệ, giải bài tập, hoặc tải lên hình ảnh để phân tích.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
            <SuggestionCard onClick={() => onSuggestionClick('Giải thích định luật Ohm?')} text="Giải thích định luật Ohm" />
            <SuggestionCard onClick={() => onSuggestionClick('Giải bài tập điện xoay chiều?')} text="Giải bài tập điện xoay chiều" />
            <SuggestionCard onClick={onFileInputClick} text="Phân tích hình ảnh sơ đồ" />
            <SuggestionCard onClick={() => onSuggestionClick('Lộ trình ôn thi THPT môn Công nghệ?')} text="Tư vấn lộ trình ôn thi" />
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.map((message) => (
            <div key={message.id} className={`flex flex-col group ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[90%] md:max-w-[80%] ${message.role === 'user' ? 'bg-blue-50 dark:bg-blue-900/50 rounded-3xl px-6 py-4 text-gray-800 dark:text-gray-200' : 'text-gray-900 dark:text-gray-100 px-0 py-0'}`}>
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-red-500 animate-pulse" />
                    <span className="font-medium text-sm text-gray-600 dark:text-gray-400">AI Assistant</span>
                  </div>
                )}

                <MessageContent content={message.content} />

                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {message.attachments.map((file, idx) => (
                      <div key={idx} className="group relative">
                        {file.preview ? (
                          <img
                            src={file.preview}
                            alt={file.name}
                            loading="lazy"
                            decoding="async"
                            className="max-w-[300px] max-h-[300px] rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-lg transition-shadow object-contain bg-white dark:bg-gray-800"
                            onClick={() => window.open(file.preview, '_blank')}
                          />
                        ) : (
                          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600">
                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center text-gray-500 dark:text-gray-300 font-bold text-xs">FILE</div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{file.name}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {message.role === 'assistant' && (
                  <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* TTS Component */}
                    <TextToSpeech 
                      text={message.content} 
                      language="vi-VN"
                      className="flex-shrink-0"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => openFeedback(message.id, 'up')} className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition-colors" title="Hữu ích">
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button onClick={() => openFeedback(message.id, 'down')} className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors" title="Chưa tốt">
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                      <button onClick={() => navigator.clipboard.writeText(message.content)} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" title="Sao chép">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex flex-col items-start animate-pulse">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-red-500" />
                <span className="font-medium text-sm text-gray-600 dark:text-gray-400">AI Assistant</span>
              </div>
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
      <FeedbackForm
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        messageId={feedbackMessageId || ''}
        defaultRating={defaultRating}
      />
    </div>
  );
};

const SuggestionCard: React.FC<{ onClick: () => void; text: string }> = ({ onClick, text }) => (
  <button
    onClick={onClick}
    className="p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-left transition-colors text-gray-700 dark:text-gray-300 font-medium border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
  >
    {text}
  </button>
);

export default MessageList;
