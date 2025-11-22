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
import ChatHeader from './ChatHeader';
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

  const loadChatHistory = () => {
    const history = searchQuery ? searchChats(searchQuery) : getChatHistory();
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

  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Bạn có chắc muốn xóa cuộc trò chuyện này?')) {
      deleteChatSession(id);
      loadChatHistory();
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
    if (!inputMessage.trim() && attachedFiles.length === 0) return;
    if (loading) return;

    setLoading(true);
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

    const attachmentsWithPreview = await Promise.all(
      attachedFiles.map(async (f) => {
        const attachment: any = { name: f.name, type: f.type, size: f.size };
        if (f.type.startsWith('image/')) {
          try { attachment.preview = await fileToBase64(f); } catch (e) { console.error(e); }
        }
        return attachment;
      })
    );

    const userMessage: ChatMessage = {
      id: generateId(),
      timestamp: Date.now(),
      role: 'user',
      content: inputMessage,
      attachments: attachmentsWithPreview
    };

    session.messages.push(userMessage);
    session.updatedAt = Date.now();
    if (session.messages.length === 1) session.title = generateChatTitle(inputMessage);

    setCurrentSession({ ...session });
    setInputMessage('');
    const filesToSend = [...attachedFiles];
    setAttachedFiles([]);

    try {
      const systemInstruction = `
      🌟 **VAI TRÒ CỦA BẠN (SYSTEM PROMPT):**
      Bạn là **Trợ lý AI Chuyên gia Công nghệ (Expert AI Tech Tutor)**. Bạn không chỉ là một giáo viên, mà là một người hướng dẫn tận tâm, thông thái và cực kỳ am hiểu về kỹ thuật, công nghệ.

      🧠 **KIẾN THỨC CỐT LÕI (ĐƯỢC HUẤN LUYỆN SÂU):**
      1.  **Cơ khí động lực:** Động cơ đốt trong (xăng, diesel), cấu tạo 1 xy lanh/nhiều xy lanh, hệ thống truyền lực, phanh, lái. Hiểu rõ nguyên lý hoạt động của xe máy, ô tô.
      2.  **Kỹ thuật điện - điện tử:** Mạch điện tử cơ bản (R, L, C, Diode, Transistor), mạch khuếch đại, tạo xung, nguồn điện (DC-DC, AC-DC), vi điều khiển.
      3.  **Công nghệ nông nghiệp:** Trồng trọt công nghệ cao, thủy sản, lâm nghiệp bền vững.
      4.  **Thiết kế kỹ thuật:** Bản vẽ kỹ thuật, quy trình thiết kế, CAD.
      5.  **Chương trình mới:** Am hiểu sâu sắc bộ sách **Cánh Diều**, **Chân Trời Sáng Tạo**, **Kết Nối Tri Thức**.

      💬 **PHONG CÁCH GIAO TIẾP (QUAN TRỌNG):**
      -   **Tự nhiên & Gần gũi:** Hãy nói chuyện như một người anh/chị đi trước hoặc một chuyên gia thân thiện. Tránh dùng từ ngữ quá cứng nhắc như "Thưa em", "Thầy xin trả lời". Hãy dùng "Mình", "Tôi", hoặc xưng hô linh hoạt tùy ngữ cảnh.
      -   **Đi thẳng vào vấn đề:** Khi được hỏi (ví dụ: "Động cơ 1 xy lanh là gì?"), hãy trả lời trực tiếp định nghĩa và nguyên lý trước, sau đó mới mở rộng. Đừng vòng vo.
      -   **Giải thích dễ hiểu:** Dùng phép ẩn dụ thực tế (ví dụ: so sánh dòng điện với dòng nước, piston với bơm xe đạp).
      -   **Trình bày đẹp:** Dùng Markdown (Bold, Italic, List) để ngắt ý. Dùng LaTeX cho công thức.

      🚫 **NHỮNG ĐIỀU CẦN TRÁNH (ANTI-PATTERNS):**
      -   KHÔNG trả lời sai lệch chủ đề (Hallucination). Nếu hỏi về "Động cơ", TUYỆT ĐỐI KHÔNG nói về "Mạch điện" trừ khi có liên quan trực tiếp.
      -   KHÔNG bịa đặt kiến thức.
      
      🎨 **TẠO HÌNH ẢNH (IMAGE GENERATION):**
      -   Bạn CÓ THỂ tạo hình ảnh khi người dùng yêu cầu (ví dụ: "vẽ sơ đồ", "tạo ảnh động cơ", "minh họa...").
      -   Để tạo ảnh, hãy sử dụng cú pháp Markdown sau: ![Mô tả chi tiết](https://image.pollinations.ai/prompt/{Mô_tả_tiếng_Anh_được_URL_Encode}?width=1024&height=768&nologo=true)
      -   ** QUAN TRỌNG:** Bạn phải tự dịch mô tả sang tiếng Anh và URL Encode nó.
      - Ví dụ: Nếu người dùng yêu cầu "vẽ động cơ V8", bạn trả về: ![V8 engine 3d render](https://image.pollinations.ai/prompt/V8%20engine%203d%20render?width=1024&height=768&nologo=true)

      Bắt đầu cuộc trò chuyện ngay bây giờ.Hãy lắng nghe kỹ câu hỏi của người dùng và phản hồi chính xác nhất.
      `;

      // Pass history to the API for context
      const history = session.messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        content: msg.content
      }));

      // Prepend system instruction to the very first message of the history effectively (or handle via API if supported, but for now we treat it as context)
      const fullPrompt = `${systemInstruction} \n\nUser Question: ${inputMessage} `;

      const response = await sendChatMessage(fullPrompt, filesToSend, selectedModel, history);

      if (!response.success) throw new Error(response.error || 'Có lỗi xảy ra');

      const aiMessage: ChatMessage = {
        id: generateId(),
        timestamp: Date.now(),
        role: 'assistant',
        content: response.text
      };

      session.messages.push(aiMessage);
      session.updatedAt = Date.now();
      saveChatSession(session);
      setCurrentSession({ ...session });
      loadChatHistory();
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: generateId(),
        timestamp: Date.now(),
        role: 'assistant',
        content: `❌ Lỗi: ${error instanceof Error ? error.message : 'Không thể gửi tin nhắn'} `
      };
      session.messages.push(errorMessage);
      setCurrentSession({ ...session });
    } finally {
      setLoading(false);
    }
  };

  const handleExportChat = () => {
    if (!currentSession) return;
    const text = exportChatToText(currentSession);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat - ${currentSession.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
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
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700"
            >
              {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name || selectedModel}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition - transform ${showModelSelector ? 'rotate-180' : ''} `}><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>

            {showModelSelector && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up">
                <div className="p-2">
                  {AVAILABLE_MODELS.map(model => (
                    <button
                      key={model.id}
                      onClick={() => { setSelectedModel(model.id); setShowModelSelector(false); }}
                      className={`w - full text - left px - 3 py - 2.5 rounded - lg transition - colors flex items - center justify - between ${selectedModel === model.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'} `}
                    >
                      <div>
                        <div className="font-medium text-sm">{model.name}</div>
                        <div className="text-[11px] text-gray-500 mt-0.5">{model.description}</div>
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
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors bg-white/80 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          {currentSession && (
            <button onClick={handleExportChat} className="text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors bg-white/80 backdrop-blur-sm" title="Xuất nội dung">
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
