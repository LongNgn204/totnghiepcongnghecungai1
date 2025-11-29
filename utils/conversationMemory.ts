import type { ChatMessage } from './chatStorage';

/**
 * Very light conversation memory: summarizes last N messages (both roles)
 * into a short bullet list capped by maxLen.
 */
export function summarizeMessages(messages: ChatMessage[], maxItems = 6, maxLen = 500): string {
  if (!messages || messages.length === 0) return '';
  const recent = messages.slice(-maxItems);
  const bullets = recent.map(m => {
    const role = m.role === 'user' ? 'Người dùng' : 'AI';
    const text = (m.content || '').replace(/\s+/g, ' ').trim();
    return `- ${role}: ${text.slice(0, 140)}${text.length > 140 ? '…' : ''}`;
  });
  let summary = bullets.join('\n');
  if (summary.length > maxLen) {
    summary = summary.slice(0, maxLen - 1) + '…';
  }
  return summary;
}

export function buildContextPrefix(messages: ChatMessage[]): string {
  const summary = summarizeMessages(messages);
  if (!summary) return '';
  return `Tóm tắt ngữ cảnh (gần đây):\n${summary}\n\n`;
}
