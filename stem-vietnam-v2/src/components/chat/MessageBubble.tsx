// Chú thích: Message Bubble Component - Hiển thị một tin nhắn
import { User, Sparkles, BookOpen, ExternalLink } from 'lucide-react';
import type { ChatMessage } from '../../types';

interface MessageBubbleProps {
    message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === 'user';

    return (
        <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser
                ? 'bg-primary-500 text-white'
                : 'bg-gradient-to-br from-violet-500 to-purple-600 text-white'
                }`}>
                {isUser ? <User size={16} /> : <Sparkles size={16} />}
            </div>

            {/* Content */}
            <div className={`flex-1 max-w-[85%] ${isUser ? 'text-right' : ''}`}>
                <div className={`inline-block rounded-2xl px-4 py-3 ${isUser
                    ? 'bg-primary-500 text-white rounded-tr-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-sm shadow-sm'
                    }`}>
                    {/* Message text with markdown-like formatting */}
                    <div className="whitespace-pre-wrap text-[15px] leading-relaxed">
                        {message.content}
                    </div>

                    {/* Attached files (if any) */}
                    {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {message.attachments.map((file, idx) => (
                                <div
                                    key={idx}
                                    className="text-xs px-2 py-1 rounded bg-white/20 dark:bg-black/20"
                                >
                                    📎 {file.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sources - Chỉ hiển thị cho assistant và khi có nguồn */}
                {!isUser && message.sourceChunks && message.sourceChunks.length > 0 && (
                    <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-2 font-medium">
                            <BookOpen size={12} />
                            Nguồn tham khảo
                        </p>
                        <div className="space-y-1">
                            {message.sourceChunks.slice(0, 3).map((chunk, idx) => (
                                <a
                                    key={idx}
                                    href={chunk.document.fileUrl || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline"
                                >
                                    <ExternalLink size={10} />
                                    [{idx + 1}] {chunk.document.title}
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Timestamp */}
                <p className={`text-[10px] text-slate-400 mt-1 ${isUser ? 'text-right' : ''}`}>
                    {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
            </div>
        </div>
    );
}
