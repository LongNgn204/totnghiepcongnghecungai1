import React from 'react';
import ProductTemplate from './layout/ProductTemplate';
import { BookOpen, Construction } from 'lucide-react';

// Chú thích: Component placeholder cho Product7 - chức năng Bài giảng đang được phát triển
const Product7: React.FC = () => {
  return (
    <ProductTemplate
      icon={<BookOpen className="w-28 h-28 text-white/40" />}
      title="Sản phẩm học tập số 7: Tổng hợp Bài giảng"
      subtitle="Tài liệu học tập theo chương trình SGK Công nghệ THPT"
      heroGradientFrom="from-emerald-700"
      heroGradientTo="to-teal-600"
    >
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center animate-fade-in">
        {/* Icon placeholder */}
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
          <Construction className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
        </div>

        {/* Thông báo đang phát triển */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Đang phát triển
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
          Chức năng Tổng hợp Bài giảng đang được xây dựng.
          Tài liệu sẽ được cập nhật theo chương trình SGK Kết nối tri thức và Cánh Diều.
        </p>

        {/* Gợi ý sử dụng các tính năng khác */}
        <div className="glass-card p-6 max-w-md">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            Trong khi chờ đợi
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Bạn có thể sử dụng <strong>Chat AI</strong> để hỏi đáp kiến thức,
            hoặc <strong>Flashcards</strong> để ôn tập hiệu quả.
          </p>
        </div>
      </div>
    </ProductTemplate>
  );
};

export default Product7;
