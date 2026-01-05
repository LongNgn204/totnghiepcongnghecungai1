// Chú thích: Chat Page - Gemini-style UI với Sidebar và File Upload
import { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, Menu, X } from 'lucide-react';
import ChatSidebar from './ChatSidebar';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';
import { generateWithRAG } from '../../lib/rag/generator';
import { CHAT_PROMPT } from '../../lib/prompts';
import type { ChatMessage } from '../../types';
import type { Conversation, FileAttachment } from '../../types/chat';

// Chú thích: LocalStorage key
const STORAGE_KEY = 'stem-vietnam-chat-history';

// Chú thích: Load conversations từ localStorage
function loadConversations(): Conversation[] {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

// Chú thích: Save conversations vào localStorage
function saveConversations(conversations: Conversation[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

// Chú thích: Generate title từ first message
function generateTitle(message: string): string {
    const maxLength = 30;
    const cleaned = message.replace(/\n/g, ' ').trim();
    return cleaned.length > maxLength ? cleaned.slice(0, maxLength) + '...' : cleaned;
}

export default function ChatPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Chú thích: Load saved conversations on mount
    useEffect(() => {
        const saved = loadConversations();
        setConversations(saved);
        if (saved.length > 0) {
            setActiveId(saved[0].id);
        }
    }, []);

    // Chú thích: Save whenever conversations change
    useEffect(() => {
        if (conversations.length > 0) {
            saveConversations(conversations);
        }
    }, [conversations]);

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

        try {
            // Chú thích: Gọi AI (TODO: xử lý files)
            const response = await generateWithRAG({
                query: message,
                systemPrompt: CHAT_PROMPT,
            });

            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.text,
                timestamp: Date.now(),
                sourceChunks: response.sourceChunks,
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
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                        <Sparkles size={16} className="text-white animate-pulse" />
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 border border-slate-200 dark:border-slate-700 shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                            <span className="text-sm text-slate-500">Đang suy nghĩ...</span>
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
