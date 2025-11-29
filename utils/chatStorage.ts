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

const CHAT_STORAGE_KEY = 'chat_sessions';

/**
 * Tạo ID unique
 */
export const generateId = (): string => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * LOCAL STORAGE HELPERS (Offline-first)
 */
export const getLocalChatHistory = (): ChatSession[] => {
  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.warn('Failed to read local chat history', e);
    return [];
  }
};

export const saveLocalChatSession = (session: ChatSession): void => {
  try {
    const list = getLocalChatHistory();
    const idx = list.findIndex(s => s.id === session.id);
    const updated = { ...session, updatedAt: session.updatedAt || Date.now() };
    if (idx >= 0) list[idx] = updated; else list.unshift(updated);
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Failed to save local chat session', e);
  }
};

export const deleteLocalChatSession = (id: string): void => {
  try {
    const list = getLocalChatHistory().filter(s => s.id !== id);
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Failed to delete local chat session', e);
  }
};

const mergeSessions = (remote: ChatSession[], local: ChatSession[]): ChatSession[] => {
  const map = new Map<string, ChatSession>();
  [...local, ...remote].forEach(s => {
    const existing = map.get(s.id);
    if (!existing || (s.updatedAt || 0) > (existing.updatedAt || 0)) {
      map.set(s.id, s);
    }
  });
  return Array.from(map.values()).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
};

/**
 * Lấy lịch sử chat (merge local + server). Nếu offline hoặc API lỗi => trả local.
 */
export const getChatHistory = async (): Promise<ChatSession[]> => {
  const local = getLocalChatHistory();
  if (!navigator.onLine) return local;
  try {
    const response = await api.chat.getAll();
    const remote = response?.sessions || response?.data?.sessions || [];
    const merged = mergeSessions(remote, local);
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch (error) {
    console.error('Error loading chat history (fallback to local):', error);
    return local;
  }
};

/**
 * Lưu/upsert chat: luôn ghi local trước, rồi cố gắng sync server (upsert)
 */
export const saveChatSession = async (session: ChatSession): Promise<void> => {
  try {
    saveLocalChatSession(session);
    if (!navigator.onLine) return;
    try {
      await api.chat.update(session.id, session.messages);
    } catch (e: any) {
      await api.chat.create(session);
    }
  } catch (error) {
    console.error('Error saving chat session:', error);
  }
};

/** Lấy 1 session (merge ưu tiên remote) */
export const getChatSession = async (id: string): Promise<ChatSession | null> => {
  try {
    if (navigator.onLine) {
      const session = await api.chat.getById(id);
      if (session) {
        saveLocalChatSession(session);
        return session;
      }
    }
    return getLocalChatHistory().find(s => s.id === id) || null;
  } catch (error) {
    console.error('Error getting chat session:', error);
    return getLocalChatHistory().find(s => s.id === id) || null;
  }
};

/** Xóa 1 session (local trước, server sau) */
export const deleteChatSession = async (id: string): Promise<void> => {
  try {
    deleteLocalChatSession(id);
    if (navigator.onLine) {
      await api.chat.delete(id);
    }
  } catch (error) {
    console.error('Error deleting chat session:', error);
  }
};

/** Tạo title auto */
export const generateChatTitle = (firstMessage: string): string => {
  const maxLength = 50;
  const cleaned = firstMessage.trim().replace(/\n/g, ' ');
  return cleaned.length <= maxLength ? cleaned : cleaned.substring(0, maxLength) + '...';
};

/** Nhóm chat theo thời gian */
export const groupChatsByTime = (sessions: ChatSession[]) => {
  const now = Date.now();
  const today = new Date().setHours(0, 0, 0, 0);
  const yesterday = today - 24 * 60 * 60 * 1000;
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const monthAgo = now - 30 * 24 * 60 * 60 * 1000;
  return {
    today: sessions.filter(s => s.updatedAt >= today),
    yesterday: sessions.filter(s => s.updatedAt >= yesterday && s.updatedAt < today),
    lastWeek: sessions.filter(s => s.updatedAt >= weekAgo && s.updatedAt < yesterday),
    lastMonth: sessions.filter(s => s.updatedAt >= monthAgo && s.updatedAt < weekAgo),
    older: sessions.filter(s => s.updatedAt < monthAgo)
  };
};

/** Tìm kiếm (trên merged list) */
export const searchChats = async (query: string): Promise<ChatSession[]> => {
  const sessions = await getChatHistory();
  const lower = query.trim().toLowerCase();
  if (!lower) return sessions;
  return sessions.filter(s => s.title.toLowerCase().includes(lower) || s.messages.some(m => m.content.toLowerCase().includes(lower)));
};

/** Xuất chat ra text */
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
