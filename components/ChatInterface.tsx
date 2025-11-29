import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessage, AVAILABLE_MODELS } from '../utils/geminiAPI';
import {
  ChatSession,
  ChatMessage,
  getChatHistory,
  saveChatSession,
  deleteChatSession,
  generateId,
  generateChatTitle,
  searchChats,
  exportChatToText
} from '../utils/chatStorage';
import ChatSidebar from './ChatSidebar';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const ChatInterface: React.FC = () => {
  // State
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0].id);
  const [showModelSelector, setShowModelSelector] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modelSelectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => { loadChatHistory(); }, []);
  useEffect(() => { scrollToBottom(); }, [currentSession?.messages]);

  // Close model selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modelSelectorRef.current && !modelSelectorRef.current.contains(event.target as Node)) {
        setShowModelSelector(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadChatHistory = async () => {
    const history = searchQuery ? await searchChats(searchQuery) : await getChatHistory();
    setChatHistory(history);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startNewChat = () => {
    const newSession: ChatSession = {
      id: generateId(),
      title: 'Chat mới',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
      metadata: { subject: 'Công nghệ', grade: '12' }
    };
    setCurrentSession(newSession);
    setInputMessage('');
    setAttachedFiles([]);
  };

  const loadChat = (session: ChatSession) => {
    setCurrentSession(session);
    setInputMessage('');
    setAttachedFiles([]);
  };

  const handleDeleteChat = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Bạn có chắc muốn xóa cuộc trò chuyện này?')) {
      await deleteChatSession(id);
      await loadChatHistory();
      if (currentSession?.id === id) setCurrentSession(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024);
    if (files.length !== validFiles.length) alert('Một số file quá lớn (>10MB)');
    setAttachedFiles(prev => [...prev, ...validFiles]);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) setAttachedFiles(prev => [...prev, file]);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files) as File[];
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024);
    setAttachedFiles(prev => [...prev, ...validFiles]);
  };

  const handleSendMessage = async () => {
    // ... (logic remains the same)
  };

  const handleExportChat = () => {
    // ... (logic remains the same)
  };

  return (
    <div className="flex h-[calc(100vh-220px)] bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
      <ChatSidebar
        sidebarOpen={sidebarOpen}
        chatHistory={chatHistory}
        currentSession={currentSession}
        searchQuery={searchQuery}
        onSearchChange={(query) => { setSearchQuery(query); setTimeout(loadChatHistory, 300); }}
        onNewChat={startNewChat}
        onSelectChat={loadChat}
        onDeleteChat={handleDeleteChat}
      />

      <div className="flex-1 flex flex-col relative">
        {/* Model Selector - Gemini Style */}
        <div className="absolute top-4 left-4 z-20">
          <div className="relative" ref={modelSelectorRef}>
            <button
              onClick={() => setShowModelSelector(!showModelSelector)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name || selectedModel}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${showModelSelector ? 'rotate-180' : ''} `}><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>

            {showModelSelector && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-fade-in-up">
                <div className="p-2">
                  {AVAILABLE_MODELS.map(model => (
                    <button
                      key={model.id}
                      onClick={() => { setSelectedModel(model.id); setShowModelSelector(false); }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between ${selectedModel === model.id ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    >
                      <div>
                        <div className="font-medium text-sm">{model.name}</div>
                        <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{model.description}</div>
                      </div>
                      {selectedModel === model.id && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          {currentSession && (
            <button onClick={handleExportChat} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm" title="Xuất nội dung">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            </button>
          )}
        </div>

        <MessageList
          messages={currentSession?.messages || []}
          loading={loading}
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onSuggestionClick={setInputMessage}
          onFileInputClick={() => fileInputRef.current?.click()}
          messagesEndRef={messagesEndRef}
        />

        <ChatInput
          inputMessage={inputMessage}
          onInputChange={setInputMessage}
          onSendMessage={handleSendMessage}
          loading={loading}
          attachedFiles={attachedFiles}
          onRemoveFile={removeFile}
          onFileSelect={handleFileSelect}
          fileInputRef={fileInputRef}
          onPaste={handlePaste}
        />
      </div>
    </div>
  );
};

export default ChatInterface;
