import React, { useState, useEffect } from 'react';
import ChatInterface from './ChatInterface';
import ProductTemplate from './layout/ProductTemplate';
import { MessageSquare, FileText, Clock, Search, Download, CornerDownLeft, Lightbulb, HelpCircle, FileQuestion, Zap, Scale, RefreshCw } from 'lucide-react';
import syncManager from '../utils/syncManager';

const Product1: React.FC = () => {
  const [lastSync, setLastSync] = useState<string>('');

  const updateLastSync = () => {
    const timestamp = syncManager.getLastSyncTime();
    if (timestamp > 0) {
      const date = new Date(timestamp);
      setLastSync(date.toLocaleString('vi-VN'));
    } else {
      setLastSync('Chưa đồng bộ');
    }
  };

  useEffect(() => {
    updateLastSync();
    window.addEventListener('sync-completed', updateLastSync);
    return () => {
      window.removeEventListener('sync-completed', updateLastSync);
    };
  }, []);

  const sidebar = (
    <>
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-sm font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-yellow-500" />
          Mẹo sử dụng
        </h3>
        <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-2"><MessageSquare className="w-4 h-4 text-primary-600 mt-0.5" /> Nhấn “Chat mới” để bắt đầu hội thoại mới.</li>
          <li className="flex items-start gap-2"><FileText className="w-4 h-4 text-primary-600 mt-0.5" /> Dùng 📎 để đính kèm PDF, DOCX, ảnh.</li>
          <li className="flex items-start gap-2"><Clock className="w-4 h-4 text-primary-600 mt-0.5" /> Lịch sử được lưu tự động (offline-first).</li>
          <li className="flex items-start gap-2"><Search className="w-4 h-4 text-primary-600 mt-0.5" /> Tìm kiếm nhanh theo tiêu đề/nội dung.</li>
          <li className="flex items-start gap-2"><Download className="w-4 h-4 text-primary-600 mt-0.5" /> Xuất nội dung chat dạng .txt.</li>
          <li className="flex items-start gap-2"><CornerDownLeft className="w-4 h-4 text-primary-600 mt-0.5" /> Enter gửi, Shift+Enter xuống dòng.</li>
        </ul>
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <RefreshCw className="w-3 h-3" />
          <span>Đồng bộ cuối: {lastSync}</span>
        </div>
      </div>
      <div className="glass-card p-6 rounded-2xl mt-4">
        <h3 className="text-sm font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-primary-600" />
          Câu hỏi gợi ý
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-100 dark:border-primary-800/30 hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors cursor-pointer">Giải thích nguyên lý máy biến áp ba pha?</li>
          <li className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-100 dark:border-primary-800/30 hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors cursor-pointer">Giải bài tập mạch điện ba pha P=10kW, cosφ=0.8</li>
          <li className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-100 dark:border-primary-800/30 hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors cursor-pointer">Phân tích đề thi trong file PDF</li>
          <li className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-100 dark:border-primary-800/30 hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors cursor-pointer">So sánh diode và transistor</li>
        </ul>
      </div>
    </>
  );

  return (
    <ProductTemplate
      icon={<MessageSquare size={200} />}
      title="Sản phẩm học tập số 1: Trò chuyện với AI"
      subtitle="Hỏi đáp về Công nghệ (SGK KNTT & Cánh Diều), đính kèm file để phân tích, lịch sử chat offline-first"
      heroGradientFrom="from-primary-600"
      heroGradientTo="to-secondary-600"
      sidebar={sidebar}
    >
      <div className="animate-fade-in">
        <ChatInterface />
      </div>

      <div className="glass-card p-8 rounded-2xl">
        <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-primary-600" />
          Ví dụ câu hỏi hay
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800/30 hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1">
            <div className="flex items-center gap-2 mb-2">
              <FileQuestion className="w-5 h-5 text-primary-600" />
              <p className="text-sm font-bold text-primary-800 dark:text-primary-300">Lý thuyết</p>
            </div>
            <p className="text-gray-700 dark:text-gray-300 group-hover:text-primary-700 dark:group-hover:text-primary-200 transition-colors">Giải thích nguyên lý hoạt động của máy biến áp ba pha</p>
          </div>
          <div className="p-5 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800/30 hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-primary-600" />
              <p className="text-sm font-bold text-primary-800 dark:text-primary-300">Bài tập</p>
            </div>
            <p className="text-gray-700 dark:text-gray-300 group-hover:text-primary-700 dark:group-hover:text-primary-200 transition-colors">Giải bài tập về mạch điện ba pha, P=10kW, cosφ=0.8</p>
          </div>
          <div className="p-5 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800/30 hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-primary-600" />
              <p className="text-sm font-bold text-primary-800 dark:text-primary-300">Phân tích file</p>
            </div>
            <p className="text-gray-700 dark:text-gray-300 group-hover:text-primary-700 dark:group-hover:text-primary-200 transition-colors">Phân tích đề thi trong file PDF và đưa ra hướng giải</p>
          </div>
          <div className="p-5 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800/30 hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Scale className="w-5 h-5 text-primary-600" />
              <p className="text-sm font-bold text-primary-800 dark:text-primary-300">So sánh</p>
            </div>
            <p className="text-gray-700 dark:text-gray-300 group-hover:text-primary-700 dark:group-hover:text-primary-200 transition-colors">So sánh điốt và transistor</p>
          </div>
        </div>
      </div>
    </ProductTemplate>
  );
};

export default Product1;
