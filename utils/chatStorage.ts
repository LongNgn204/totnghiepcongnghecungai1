import { api } from './apiClient';

export interface ChatMessage {
  id: string;
  timestamp: number;
  role: 'user' | 'assistant';
  content: string;
  attachments?: {
    name: string;
    type: string;
    size: number;
    preview?: string;
  }[];
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  metadata?: {
    subject?: string;
    grade?: string;
  };
}

/**
 * Tạo ID unique
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Lấy tất cả chat sessions từ API
 */
export const getChatHistory = async (): Promise<ChatSession[]> => {
  try {
    const response = await api.chat.getAll();
    if (response && response.sessions) {
      return response.sessions;
    }
    return [];
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
};

/**
 * Lưu hoặc cập nhật chat session lên API
 */
export const saveChatSession = async (session: ChatSession): Promise<void> => {
  try {
    // Check if session exists (simple check by ID or just try create/update)
    // For simplicity, we can try to get it first or just use create/update endpoints
    // But our API has create (POST) and update (PUT)
    // We need to know if it's new or existing.
    // Usually the UI knows. But here we can check if we can fetch it.
    // Or better, we can just always use a "save" logic if the backend supports upsert, 
    // but our backend has distinct POST /api/chat/sessions and PUT /api/chat/sessions/:id

    // We will try to update, if 404 then create.
    try {
      await api.chat.update(session.id, session.messages);
    } catch (e: any) {
      // If update fails, maybe it doesn't exist, try create
      await api.chat.create(session);
    }
  } catch (error) {
    console.error('Error saving chat session:', error);
  }
};

/**
 * Lấy một session cụ thể
 */
export const getChatSession = async (id: string): Promise<ChatSession | null> => {
  try {
    const session = await api.chat.getById(id);
    return session;
  } catch (error) {
    console.error('Error getting chat session:', error);
    return null;
  }
};

/**
 * Xóa một session
 */
export const deleteChatSession = async (id: string): Promise<void> => {
  try {
    await api.chat.delete(id);
  } catch (error) {
    console.error('Error deleting chat session:', error);
  }
};

/**
 * Tạo title tự động từ câu hỏi đầu tiên
 */
export const generateChatTitle = (firstMessage: string): string => {
  const maxLength = 50;
  const cleaned = firstMessage.trim().replace(/\n/g, ' ');

  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  return cleaned.substring(0, maxLength) + '...';
};

/**
 * Nhóm chat theo thời gian
 */
export const groupChatsByTime = (sessions: ChatSession[]) => {
  const now = Date.now();
  const today = new Date().setHours(0, 0, 0, 0);
  const yesterday = today - (24 * 60 * 60 * 1000);
  const weekAgo = now - (7 * 24 * 60 * 60 * 1000);
  const monthAgo = now - (30 * 24 * 60 * 60 * 1000);

  return {
    today: sessions.filter(s => s.updatedAt >= today),
    yesterday: sessions.filter(s => s.updatedAt >= yesterday && s.updatedAt < today),
    lastWeek: sessions.filter(s => s.updatedAt >= weekAgo && s.updatedAt < yesterday),
    lastMonth: sessions.filter(s => s.updatedAt >= monthAgo && s.updatedAt < weekAgo),
    older: sessions.filter(s => s.updatedAt < monthAgo)
  };
};

/**
 * Search chat sessions
 */
export const searchChats = async (query: string): Promise<ChatSession[]> => {
  if (!query.trim()) return getChatHistory();

  // Our API supports search
  // But for now let's fetch all and filter if API search is not robust enough
  // Actually API has search param.
  // return fetchAPI(`/api/chat/sessions?search=${query}`);
  // But api.chat.getAll doesn't expose params yet in the client wrapper fully (it defaults).
  // Let's update apiClient to support params or just filter client side for now.
  // Since we want to be fast, let's fetch all and filter.
  const sessions = await getChatHistory();
  const lowerQuery = query.toLowerCase();
  return sessions.filter(session => {
    return session.title.toLowerCase().includes(lowerQuery) ||
      session.messages.some(m => m.content.toLowerCase().includes(lowerQuery));
  });
};

/**
 * Export chat session to text
 */
export const exportChatToText = (session: ChatSession): string => {
  let text = `${session.title}\n`;
  text += `Ngày tạo: ${new Date(session.createdAt).toLocaleString('vi-VN')}\n\n`;
  text += '='.repeat(50) + '\n\n';

  session.messages.forEach(msg => {
    const role = msg.role === 'user' ? 'BẠN' : 'AI';
    const time = new Date(msg.timestamp).toLocaleTimeString('vi-VN');
    text += `[${time}] ${role}:\n${msg.content}\n\n`;
  });

  return text;
};
