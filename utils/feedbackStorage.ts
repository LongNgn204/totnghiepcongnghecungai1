export type FeedbackRating = 'up' | 'down';

export interface MessageFeedback {
  messageId: string;
  rating: FeedbackRating;
  comment?: string;
  createdAt: number;
}

const KEY = 'feedback.v1';

function loadAll(): Record<string, MessageFeedback> {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAll(map: Record<string, MessageFeedback>) {
  try { localStorage.setItem(KEY, JSON.stringify(map)); } catch {}
}

export function setFeedback(messageId: string, rating: FeedbackRating, comment?: string): MessageFeedback {
  const all = loadAll();
  const entry: MessageFeedback = { messageId, rating, comment, createdAt: Date.now() };
  all[messageId] = entry;
  saveAll(all);
  return entry;
}

export function getFeedback(messageId: string): MessageFeedback | undefined {
  const all = loadAll();
  return all[messageId];
}

export function getAllFeedback(): MessageFeedback[] {
  const all = loadAll();
  return Object.values(all);
}

