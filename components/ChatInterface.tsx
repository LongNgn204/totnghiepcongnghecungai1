import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessage } from '../utils/geminiAPI';
import {
  ChatSession,
  ChatMessage,
  getChatHistory,
  saveChatSession,
  deleteChatSession,
  generateId,
  generateChatTitle,
  groupChatsByTime,
  searchChats,
  exportChatToText
} from '../utils/chatStorage';

// Simple Markdown formatter
const formatMarkdown = (text: string): string => {
  let html = text;
  
  // Escape HTML
  html = html.replace(/&/g, '&amp;')
             .replace(/</g, '&lt;')
             .replace(/>/g, '&gt;');
  
  // Headers (phải làm trước để tránh conflict với bold)
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-blue-600 dark:text-blue-400">$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  
  // Code blocks (backticks với language)
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code>$2</code></pre>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">$1</code>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-500 hover:underline" target="_blank">$1</a>');
  
  // Lists (unordered)
  html = html.replace(/^\s*[-•]\s+(.*)$/gim, '<li class="ml-4">• $1</li>');
  
  // Lists (ordered)
  html = html.replace(/^\s*\d+\.\s+(.*)$/gim, '<li class="ml-4">$1</li>');
  
  // Line breaks
  html = html.replace(/\n\n/g, '<br/><br/>');
  html = html.replace(/\n/g, '<br/>');
  
  // Horizontal rules
  html = html.replace(/^━+$/gm, '<hr class="my-4 border-gray-300 dark:border-gray-600"/>');
  html = html.replace(/^─+$/gm, '<hr class="my-2 border-gray-200 dark:border-gray-700"/>');
  
  return html;
};

const ChatInterface: React.FC = () => {
  // State
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load chat history
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const loadChatHistory = () => {
    const history = searchQuery ? searchChats(searchQuery) : getChatHistory();
    setChatHistory(history);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Tạo chat mới
  const startNewChat = () => {
    const newSession: ChatSession = {
      id: generateId(),
      title: 'Chat mới',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
      metadata: {
        subject: 'Công nghệ',
        grade: '12'
      }
    };
    setCurrentSession(newSession);
    setInputMessage('');
    setAttachedFiles([]);
  };

  // Load chat từ lịch sử
  const loadChat = (session: ChatSession) => {
    setCurrentSession(session);
    setInputMessage('');
    setAttachedFiles([]);
  };

  // Xóa chat
  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Bạn có chắc muốn xóa cuộc trò chuyện này?')) {
      deleteChatSession(id);
      loadChatHistory();
      if (currentSession?.id === id) {
        setCurrentSession(null);
      }
    }
  };

  // Handle file upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    const validFiles = files.filter((file: File) => {
      // Giới hạn 10MB per file
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} quá lớn (>10MB)`);
        return false;
      }
      return true;
    });
    setAttachedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Gửi message
  const handleSendMessage = async () => {
    if (!inputMessage.trim() && attachedFiles.length === 0) return;
    if (loading) return;

    setLoading(true);

    // Tạo session mới nếu chưa có
    let session = currentSession;
    if (!session) {
      session = {
        id: generateId(),
        title: generateChatTitle(inputMessage),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: []
      };
    }

    // Thêm user message
    const userMessage: ChatMessage = {
      id: generateId(),
      timestamp: Date.now(),
      role: 'user',
      content: inputMessage,
      attachments: attachedFiles.map(f => ({
        name: f.name,
        type: f.type,
        size: f.size
      }))
    };

    session.messages.push(userMessage);
    session.updatedAt = Date.now();
    
    // Update title nếu là message đầu tiên
    if (session.messages.length === 1) {
      session.title = generateChatTitle(inputMessage);
    }

    setCurrentSession({ ...session });
    setInputMessage('');
    const filesToSend = [...attachedFiles];
    setAttachedFiles([]);

    try {
      // Tạo context prompt
      const contextPrompt = `🎓 Bạn là Giáo Viên AI chuyên sâu về môn **Công nghệ THPT** theo Chương trình GDPT 2018.

📚 **SGK THAM KHẢO:**
   • Sách Kết nối tri thức với cuộc sống (KNTT)
   • Sách Cánh Diều (CD)
   ➡️ Sử dụng nội dung từ CẢ 2 BỘ SÁCH để trả lời đầy đủ và chính xác nhất!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 NHIỆM VỤ CỦA BẠN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣ **TRẢ LỜI CHI TIẾT & TRỰC QUAN:**
   • Giải thích từng bước, từ cơ bản đến nâng cao
   • Sử dụng nhiều ví dụ thực tế, số liệu cụ thể
   • Vẽ sơ đồ, bảng so sánh (dùng ký tự đặc biệt: ┌─┐│└┘├┤┬┴┼━│)
   • Dùng emoji để dễ nhìn: 🔧⚡🔌💡📊⚙️🎯✅❌
   • **QUAN TRỌNG:** Dùng Markdown formatting (heading, bold, list, code block, table)

2️⃣ **NỘI DUNG PHONG PHÚ:**
   • **Khái niệm:** Định nghĩa rõ ràng với thuật ngữ chuyên ngành
   • **Cấu tạo:** Mô tả chi tiết các bộ phận, nguyên lý hoạt động
   • **Công thức:** Ghi đầy đủ công thức toán học (√, ², ³, π, Δ, ≈, ±)
   • **Ví dụ số:** Tính toán cụ thể với bước giải chi tiết
   • **Hình ảnh minh họa (Text-art):** Vẽ sơ đồ mạch điện, linh kiện
   • **Ứng dụng thực tế:** Nơi sử dụng trong đời sống
   • **Lưu ý quan trọng:** Những điểm dễ nhầm, dễ sai
   • **YCCĐ:** Yêu cầu cần đạt theo SGK Kết nối tri thức & Cánh Diều

3️⃣ **PHÂN TÍCH FILE (nếu có đính kèm):**
   • Đọc và hiểu toàn bộ nội dung file
   • Trích dẫn những phần quan trọng
   • Giải thích chi tiết từng phần trong file
   • Đưa ra đáp án hoặc phân tích bài toán trong file

4️⃣ **FORMAT XUẤT (BẮT BUỘC):**

\`\`\`markdown
## 📌 TÓM TẮT NHANH
[2-3 câu tóm tắt ngắn gọn]

## 🎯 KIẾN THỨC CHI TIẾT

### 1. Khái niệm
[Định nghĩa + giải thích]

### 2. Cấu tạo / Nguyên lý
[Mô tả chi tiết]

### 3. Công thức & Tính toán
[Công thức + ví dụ số cụ thể]

### 4. Sơ đồ minh họa
\`\`\`
[Vẽ sơ đồ bằng ký tự]
\`\`\`

### 5. Ví dụ thực tế
[Bài toán cụ thể với lời giải]

### 6. Ứng dụng
[Trong đời sống, công nghiệp]

### 7. Lưu ý quan trọng
⚠️ [Điểm cần chú ý]

### 8. YCCĐ (Yêu cầu cần đạt)
📖 [Theo SGK Kết nối tri thức & Cánh Diều]
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 CÂU HỎI TỪ HỌC SINH:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"${inputMessage}"

${filesToSend.length > 0 ? `\n📎 File đính kèm: ${filesToSend.map(f => f.name).join(', ')}\n➡️ Hãy phân tích chi tiết nội dung trong file này.` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎓 **LƯU Ý:** 
- Trả lời SIÊU CHI TIẾT, dài từ 500-1500 từ
- Nhiều ví dụ, sơ đồ, hình minh họa
- Dễ hiểu cho học sinh THPT
- Sử dụng hết khả năng token để giải thích đầy đủ nhất!`;

      // Gọi API
      const response = await sendChatMessage(contextPrompt, filesToSend);

      if (!response.success) {
        throw new Error(response.error || 'Có lỗi xảy ra');
      }

      // Thêm AI response
      const aiMessage: ChatMessage = {
        id: generateId(),
        timestamp: Date.now(),
        role: 'assistant',
        content: response.text
      };

      session.messages.push(aiMessage);
      session.updatedAt = Date.now();

      // Lưu vào localStorage
      saveChatSession(session);
      setCurrentSession({ ...session });
      loadChatHistory();

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: generateId(),
        timestamp: Date.now(),
        role: 'assistant',
        content: `❌ Lỗi: ${error instanceof Error ? error.message : 'Không thể gửi tin nhắn'}`
      };
      session.messages.push(errorMessage);
      setCurrentSession({ ...session });
    } finally {
      setLoading(false);
    }
  };

  // Export chat
  const handleExportChat = () => {
    if (!currentSession) return;
    
    const text = exportChatToText(currentSession);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${currentSession.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Group chats by time
  const groupedChats = groupChatsByTime(chatHistory);

  return (
    <div className="flex h-[calc(100vh-180px)] bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={startNewChat}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 font-semibold"
          >
            <i className="fas fa-plus"></i>
            Chat mới
          </button>
          
          {/* Search */}
          <div className="mt-3 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setTimeout(loadChatHistory, 300);
              }}
              placeholder="Tìm kiếm..."
              className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {groupedChats.today.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">HÔM NAY</h3>
              {groupedChats.today.map(session => (
                <div
                  key={session.id}
                  onClick={() => loadChat(session)}
                  className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group ${currentSession?.id === session.id ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {session.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {session.messages.length} tin nhắn
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteChat(session.id, e)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 ml-2"
                    >
                      <i className="fas fa-trash text-xs"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {groupedChats.yesterday.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">HÔM QUA</h3>
              {groupedChats.yesterday.map(session => (
                <div
                  key={session.id}
                  onClick={() => loadChat(session)}
                  className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group ${currentSession?.id === session.id ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {session.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {session.messages.length} tin nhắn
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteChat(session.id, e)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 ml-2"
                    >
                      <i className="fas fa-trash text-xs"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {groupedChats.lastWeek.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">7 NGÀY QUA</h3>
              {groupedChats.lastWeek.map(session => (
                <div
                  key={session.id}
                  onClick={() => loadChat(session)}
                  className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group ${currentSession?.id === session.id ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {session.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {session.messages.length} tin nhắn
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteChat(session.id, e)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 ml-2"
                    >
                      <i className="fas fa-trash text-xs"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <i className="fas fa-bars"></i>
            </button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {currentSession?.title || 'Chọn hoặc tạo chat mới'}
            </h2>
          </div>
          {currentSession && (
            <button
              onClick={handleExportChat}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center gap-2"
            >
              <i className="fas fa-download"></i>
              <span className="text-sm">Xuất file</span>
            </button>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!currentSession || currentSession.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <i className="fas fa-comments text-6xl mb-4 text-gray-300 dark:text-gray-600"></i>
              <h3 className="text-xl font-semibold mb-2">Bắt đầu trò chuyện</h3>
              <p className="text-center max-w-md">
                Hỏi AI về bất kỳ kiến thức Công nghệ nào từ SGK Cánh Diều.<br/>
                Bạn cũng có thể upload file PDF, DOCX, hình ảnh để AI phân tích.
              </p>
            </div>
          ) : (
            <>
              {currentSession.messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-3xl ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'} rounded-2xl px-6 py-4 shadow-md`}>
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                        <i className="fas fa-robot"></i>
                        AI Assistant
                      </div>
                    )}
                    
                    <div className="prose dark:prose-invert max-w-none">
                      <div 
                        className="markdown-content whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ 
                          __html: formatMarkdown(message.content) 
                        }}
                      />
                    </div>

                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.attachments.map((file, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm bg-black/10 rounded px-3 py-2">
                            <i className="fas fa-file"></i>
                            <span>{file.name}</span>
                            <span className="text-xs opacity-70">({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-2 text-xs opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString('vi-VN')}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl px-6 py-4 shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                      </div>
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        AI đang suy nghĩ và chuẩn bị câu trả lời chi tiết...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          {/* Attached Files */}
          {attachedFiles.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-2 rounded-lg text-sm">
                  <i className="fas fa-file"></i>
                  <span>{file.name}</span>
                  <button
                    onClick={() => removeFile(idx)}
                    className="text-red-600 hover:text-red-800 ml-1"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              accept="image/*,application/pdf,.doc,.docx,.txt"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Đính kèm file"
            >
              <i className="fas fa-paperclip"></i>
            </button>
            
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Nhập câu hỏi... (Shift+Enter để xuống dòng)"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
              rows={1}
              disabled={loading}
            />
            
            <button
              onClick={handleSendMessage}
              disabled={loading || (!inputMessage.trim() && attachedFiles.length === 0)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-paper-plane"></i>
              )}
            </button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            AI có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
