import React, { useState, useEffect } from 'react';
import { X, ThumbsUp, ThumbsDown } from 'lucide-react';
import { FeedbackRating, setFeedback, getFeedback } from '../utils/feedbackStorage';

interface FeedbackFormProps {
  open: boolean;
  onClose: () => void;
  messageId: string;
  defaultRating?: FeedbackRating;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ open, onClose, messageId, defaultRating }) => {
  const [rating, setRating] = useState<FeedbackRating | undefined>(defaultRating);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const existing = getFeedback(messageId);
    if (existing) {
      setRating(existing.rating);
      setComment(existing.comment || '');
    } else {
      setRating(defaultRating);
      setComment('');
    }
  }, [open, messageId, defaultRating]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;
    setFeedback(messageId, rating, comment.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="feedback-title">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 id="feedback-title" className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Góp ý chất lượng câu trả lời</h3>
          <button aria-label="Đóng" onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <button aria-pressed={rating==='up'} type="button" onClick={() => setRating('up')} className={`px-3 py-2 rounded-lg border inline-flex items-center gap-2 ${rating === 'up' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'}`}>
              <ThumbsUp className="w-4 h-4" /> Hữu ích
            </button>
            <button aria-pressed={rating==='down'} type="button" onClick={() => setRating('down')} className={`px-3 py-2 rounded-lg border inline-flex items-center gap-2 ${rating === 'down' ? 'bg-red-600 text-white border-red-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'}`}>
              <ThumbsDown className="w-4 h-4" /> Chưa tốt
            </button>
          </div>
          <div>
            <label htmlFor="feedback-comment" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Nhận xét (tuỳ chọn)</label>
            <textarea id="feedback-comment" value={comment} onChange={(e) => setComment(e.target.value)} rows={4} className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm p-2 text-gray-800 dark:text-gray-100" placeholder="Ví dụ: Thiếu bước giải, chưa có ví dụ, cần thêm bảng so sánh..." />
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="px-3 py-2 rounded-lg border text-sm border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">Hủy</button>
            <button type="submit" disabled={!rating} className="px-3 py-2 rounded-lg text-sm bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50">Gửi góp ý</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;

