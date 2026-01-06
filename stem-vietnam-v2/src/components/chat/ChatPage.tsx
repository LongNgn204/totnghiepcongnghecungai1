// Chú thích: Chat Page - Gemini-style UI với Sidebar và File Upload
import { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, Menu, X, BrainCircuit, Clock } from 'lucide-react';
import ChatSidebar from './ChatSidebar';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';
import { sendChatMessage } from '../../lib/api'; // Chú thích: Gọi trực tiếp API, KHÔNG dùng RAG
import type { ChatMessage } from '../../types';
import type { Conversation, FileAttachment } from '../../types/chat';
import { useAuthStore } from '../../lib/auth';

// Chú thích: LocalStorage key prefix
const STORAGE_PREFIX = 'stem-vietnam-chat-history';

function getStorageKey(userId: string) {
    return `${STORAGE_PREFIX}-${userId}`;
}

// Chú thích: Load conversations từ localStorage theo userId
function loadConversations(userId: string): Conversation[] {
    try {
        const data = localStorage.getItem(getStorageKey(userId));
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

// Chú thích: Save conversations vào localStorage theo userId
function saveConversations(userId: string, conversations: Conversation[]) {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(conversations));
}

// Chú thích: Generate title từ first message
function generateTitle(message: string): string {
    const maxLength = 30;
    const cleaned = message.replace(/\n/g, ' ').trim();
    return cleaned.length > maxLength ? cleaned.slice(0, maxLength) + '...' : cleaned;
}

export default function ChatPage() {
    const { user } = useAuthStore();
    // Chú thích: Đã bỏ useDefaultLibrary - Chat AI không dùng RAG nữa
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [thinkingStep, setThinkingStep] = useState<string>('Đang suy nghĩ...');
    const [elapsedTime, setElapsedTime] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Chú thích: Load saved conversations on mount or user change
    useEffect(() => {
        if (!user?.id) return;

        const saved = loadConversations(user.id);
        setConversations(saved);
        if (saved.length > 0) {
            setActiveId(saved[0].id);
        } else {
            setActiveId(null);
        }
    }, [user?.id]);

    // Chú thích: Save whenever conversations change
    useEffect(() => {
        if (user?.id && conversations.length > 0) {
            saveConversations(user.id, conversations);
        }
    }, [conversations, user?.id]);

    // Chú thích: Auto scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversations, activeId]);

    // Chú thích: Get active conversation
    const activeConversation = conversations.find(c => c.id === activeId);
    const messages = activeConversation?.messages || [];

    // Chú thích: Create new conversation
    const handleNewConversation = useCallback(() => {
        const newConv: Conversation = {
            id: Date.now().toString(),
            title: 'Cuộc trò chuyện mới',
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        setConversations(prev => [newConv, ...prev]);
        setActiveId(newConv.id);
    }, []);

    // Chú thích: Delete conversation
    const handleDeleteConversation = useCallback((id: string) => {
        setConversations(prev => {
            const filtered = prev.filter(c => c.id !== id);
            if (activeId === id && filtered.length > 0) {
                setActiveId(filtered[0].id);
            } else if (filtered.length === 0) {
                setActiveId(null);
            }
            return filtered;
        });
    }, [activeId]);

    // Chú thích: Send message
    const handleSend = async (message: string, files: FileAttachment[]) => {
        if (!message.trim() && files.length === 0) return;

        // Chú thích: Nếu chưa có conversation, tạo mới
        let currentId = activeId;
        if (!currentId) {
            const newConv: Conversation = {
                id: Date.now().toString(),
                title: generateTitle(message),
                messages: [],
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };
            setConversations(prev => [newConv, ...prev]);
            setActiveId(newConv.id);
            currentId = newConv.id;
        }

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: message,
            timestamp: Date.now(),
            attachments: files.map(f => ({ name: f.file.name, type: f.type, url: URL.createObjectURL(f.file) })),
        };

        // Chú thích: Add user message
        setConversations(prev => prev.map(c => {
            if (c.id === currentId) {
                const isFirstMessage = c.messages.length === 0;
                return {
                    ...c,
                    title: isFirstMessage ? generateTitle(message) : c.title,
                    messages: [...c.messages, userMessage],
                    updatedAt: Date.now(),
                };
            }
            return c;
        }));

        setIsLoading(true);
        const startTime = Date.now();
        setThinkingStep('Phân tích câu hỏi...');
        setElapsedTime(0);

        // Timer effect
        const timerInterval = setInterval(() => {
            setElapsedTime((Date.now() - startTime) / 1000);
        }, 100);

        // Simulation of thinking steps
        setTimeout(() => setThinkingStep('Tìm kiếm thông tin...'), 800);
        setTimeout(() => setThinkingStep('Tổng hợp câu trả lời...'), 2000);

        try {
            // Chú thích: Lấy lịch sử chat gần nhất (6 tin nhắn) để AI nhớ context
            const currentMessages = conversations.find(c => c.id === currentId)?.messages || [];
            const chatHistory = currentMessages.slice(-6).map(m =>
                `${m.role === 'user' ? 'User' : 'AI'}: ${m.content.slice(0, 500)}`
            ).join('\n');

            // Chú thích: Gọi trực tiếp API - KHÔNG dùng RAG, chỉ dùng Google Search
            // Gửi chat history trong message để AI nhớ ngữ cảnh
            const fullMessage = chatHistory
                ? `[Lịch sử hội thoại gần nhất]\n${chatHistory}\n\n[Câu hỏi mới]\n${message}`
                : message;

            const response = await sendChatMessage(fullMessage);

            if (!response.success || !response.response) {
                throw new Error(response.error || 'Failed to get response');
            }

            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.response,
                timestamp: Date.now(),
                // KHÔNG có sourceChunks vì không dùng RAG
            };

            setConversations(prev => prev.map(c => {
                if (c.id === currentId) {
                    return {
                        ...c,
                        messages: [...c.messages, assistantMessage],
                        updatedAt: Date.now(),
                    };
                }
                return c;
            }));
        } catch (error) {
            clearInterval(timerInterval); // Chú thích: Fix memory leak - clear timer khi error
            console.error('[chat] error:', error);
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.',
                timestamp: Date.now(),
            };
            setConversations(prev => prev.map(c => {
                if (c.id === currentId) {
                    return { ...c, messages: [...c.messages, errorMessage] };
                }
                return c;
            }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-4rem)] flex bg-slate-100 dark:bg-slate-900 -m-6 -mt-4">
            {/* Sidebar */}
            <div className={`transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-0 overflow-hidden'}`}>
                <ChatSidebar
                    conversations={conversations}
                    activeId={activeId}
                    onSelect={setActiveId}
                    onNew={handleNewConversation}
                    onDelete={handleDeleteConversation}
                />
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                            <Sparkles size={16} className="text-white" />
                        </div>
                        <div>
                            <h1 className="font-semibold text-slate-900 dark:text-white">Học Công Nghệ AI</h1>
                            <p className="text-xs text-slate-500">Powered by Gemini + Google Search</p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg">
                                <Sparkles size={36} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                Xin chào! Tôi là STEM AI
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 max-w-md">
                                Tôi có thể giúp bạn với mọi câu hỏi - từ kiến thức Công nghệ THPT đến tin tức mới nhất.
                                Hãy hỏi bất cứ điều gì!
                            </p>
                            <div className="mt-6 flex flex-wrap gap-2 justify-center">
                                {['Mạng máy tính là gì?', 'Tin tức AI hôm nay', 'Giải thích TCP/IP'].map(q => (
                                    <button
                                        key={q}
                                        onClick={() => handleSend(q, [])}
                                        className="px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map(msg => (
                                <MessageBubble key={msg.id} message={msg} />
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-none p-4 shadow-sm border border-slate-100 dark:border-slate-700 max-w-[80%]">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center animate-pulse">
                                                    <BrainCircuit className="text-primary-600 animate-spin-slow" size={18} />
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-0.5">
                                                    <Clock size={10} className="text-slate-400" />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                                    {thinkingStep}
                                                </p>
                                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                                    <span>{elapsedTime.toFixed(1)}s</span>
                                                    <span>•</span>
                                                    <span className="text-primary-500">Google Search</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                    <ChatInput
                        onSend={handleSend}
                        isLoading={isLoading}
                        placeholder="Nhập câu hỏi của bạn..."
                    />
                </div>
            </div>
        </div>
    );
}
