// Chú thích: Chat Page - Hỏi đáp với AI sử dụng RAG
import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Sparkles, BookOpen } from 'lucide-react';
import { generateWithRAG } from '../../lib/rag/generator';
import { CHAT_PROMPT } from '../../lib/prompts';
import type { ChatMessage } from '../../types';

export default function ChatPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Chú thích: Auto scroll khi có message mới
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: Date.now(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Chú thích: Gọi RAG pipeline
            const response = await generateWithRAG({
                query: input,
                systemPrompt: CHAT_PROMPT,
            });

            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.text,
                timestamp: Date.now(),
                sourceChunks: response.sourceChunks,
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('[chat] error:', error);
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.',
                timestamp: Date.now(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <Sparkles className="text-primary-500" />
                    Chat AI - Hỏi Đáp Kiến Thức
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Hỏi bất kỳ điều gì về môn Công nghệ THPT
                </p>
            </div>

            {/* Messages area */}
            <div className="flex-1 glass-panel p-4 overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                        <Sparkles size={48} className="mb-4 opacity-50" />
                        <p className="text-lg font-medium">Bắt đầu cuộc trò chuyện</p>
                        <p className="text-sm mt-2">Hỏi về bất kỳ kiến thức Công nghệ nào!</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user'
                                    ? 'bg-primary-600 text-white rounded-tr-none'
                                    : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-tl-none'
                                    }`}
                            >
                                <p className="whitespace-pre-wrap">{msg.content}</p>

                                {/* Chú thích: Hiển thị nguồn RAG nếu có - với link click được */}
                                {msg.sourceChunks && msg.sourceChunks.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-2">
                                            <BookOpen size={12} />
                                            Nguồn tham khảo:
                                        </p>
                                        <div className="space-y-1">
                                            {msg.sourceChunks.slice(0, 3).map((chunk, idx) => (
                                                <a
                                                    key={idx}
                                                    href={chunk.document.url || '#'}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-primary-500 hover:text-primary-600 hover:underline block cursor-pointer"
                                                >
                                                    [{idx + 1}] {chunk.document.title}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white dark:bg-slate-700 rounded-2xl rounded-tl-none p-4 border border-slate-200 dark:border-slate-600">
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent" />
                                <span className="text-slate-500">Đang suy nghĩ...</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="mt-4">
                <div className="flex gap-2">
                    <button className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                        <Paperclip size={20} />
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Nhập câu hỏi của bạn..."
                        className="input-field flex-1"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="btn-primary px-6"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
