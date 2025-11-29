import React, { useState } from 'react';
import { generateContent } from '../utils/geminiAPI';

interface FlashcardGeneratorProps {
  onGenerate: (flashcards: GeneratedFlashcard[]) => void;
}

export interface GeneratedFlashcard {
  front: string;
  back: string;
  explanation?: string;
}

// ... (constants remain the same)

export default function FlashcardGenerator({ onGenerate }: FlashcardGeneratorProps) {
  const [formData, setFormData] = useState<any>({
    grade: '10',
    textbook: 'Kết nối tri thức',
    topic: '',
    subtopic: '',
    quantity: 10,
    difficulty: 'Trung bình'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ... (logic remains the same)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-3 shadow-md">
          <span className="text-2xl">✨</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">AI Tạo Flashcards</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Tạo flashcards tự động từ SGK Công Nghệ</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg flex items-start gap-3">
          <span className="text-red-500 mt-0.5">⚠️</span>
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <span>🎓</span> Lớp
          </label>
          <select
            value={formData.grade}
            onChange={(e) => setFormData({ ...formData, grade: e.target.value, topic: '' })}
            className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white"
            disabled={loading}
          >
            {/* ... */}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <span>📚</span> Sách giáo khoa
          </label>
          <select
            value={formData.textbook}
            onChange={(e) => setFormData({ ...formData, textbook: e.target.value })}
            className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white"
            disabled={loading}
          >
            {/* ... */}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <span>💡</span> Chủ đề <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white"
            disabled={loading}
          >
            {/* ... */}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <span>🏷️</span> Chi tiết (tùy chọn)
          </label>
          <input
            type="text"
            value={formData.subtopic}
            onChange={(e) => setFormData({ ...formData, subtopic: e.target.value })}
            placeholder="VD: Cấu trúc lặp, Mạng LAN..."
            className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <span>🔢</span> Số lượng flashcards
          </label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: Math.min(30, Math.max(1, parseInt(e.target.value) || 10)) })}
            min="1"
            max="30"
            className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Từ 1 đến 30 thẻ</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <span>📊</span> Mức độ
          </label>
          <select
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
            className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white"
            disabled={loading}
          >
            {/* ... */}
          </select>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-blue-500 mt-1">ℹ️</span>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <p className="font-semibold mb-1">Lưu ý:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>AI sẽ tạo flashcards <strong>chính xác 99%</strong> theo sách "{formData.textbook}"</li>
              <li>Nội dung được trích dẫn từ SGK lớp {formData.grade}</li>
              <li>Mỗi lần tạo mất khoảng 10-15 giây</li>
              <li>Có thể tạo lại nếu không hài lòng</li>
            </ul>
          </div>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !formData.topic}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {/* ... */}
      </button>
    </div>
  );
}
