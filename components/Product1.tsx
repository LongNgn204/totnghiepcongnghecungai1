import React from 'react';
import ChatInterface from './ChatInterface';
import { MessageSquare, FileText, Clock, Search, Download, CornerDownLeft, Lightbulb, CheckCircle, HelpCircle, FileQuestion, Zap, Scale } from 'lucide-react';

const Product1: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-2xl shadow-lg text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
          <MessageSquare size={200} />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-center mb-3 flex items-center justify-center gap-3">
            <MessageSquare className="w-8 h-8" />
            Sản phẩm học tập số 1: Trò chuyện với AI
          </h2>
          <p className="text-center text-blue-100 max-w-2xl mx-auto text-lg">
            Hỏi AI bất kỳ câu hỏi nào về Công nghệ (SGK KNTT & Cánh Diều) - Upload file để phân tích - Lịch sử chat được lưu tự động
          </p>
        </div>
      </div>

      <ChatInterface />

      {/* Instructions Section */}
      <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm">
        <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          Hướng dẫn sử dụng hiệu quả
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
              <MessageSquare size={20} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Chat mới</p>
              <p className="text-sm text-gray-600 mt-1">Click nút "Chat mới" ở sidebar để bắt đầu hội thoại mới.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Upload file</p>
              <p className="text-sm text-gray-600 mt-1">Click icon 📎 để đính kèm PDF, DOCX, hình ảnh cần phân tích.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Lịch sử</p>
              <p className="text-sm text-gray-600 mt-1">Tất cả chat được lưu tự động, click vào sidebar để xem lại.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
              <Search size={20} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Tìm kiếm</p>
              <p className="text-sm text-gray-600 mt-1">Dùng ô search để tìm lại các đoạn chat cũ nhanh chóng.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
              <Download size={20} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Xuất file</p>
              <p className="text-sm text-gray-600 mt-1">Click "Xuất file" để tải nội dung chat về máy dạng text.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
              <CornerDownLeft size={20} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Phím tắt</p>
              <p className="text-sm text-gray-600 mt-1">Enter để gửi, Shift+Enter để xuống dòng.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Examples Section */}
      <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm">
        <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-blue-600" />
          Ví dụ câu hỏi hay
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-blue-50 rounded-xl border border-blue-100 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-center gap-2 mb-2">
              <FileQuestion className="w-5 h-5 text-blue-600" />
              <p className="text-sm font-bold text-blue-800">Lý thuyết</p>
            </div>
            <p className="text-gray-700 group-hover:text-blue-700 transition-colors">
              "Giải thích nguyên lý hoạt động của máy biến áp ba pha trong hệ thống điện"
            </p>
          </div>

          <div className="p-5 bg-blue-50 rounded-xl border border-blue-100 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <p className="text-sm font-bold text-blue-800">Bài tập</p>
            </div>
            <p className="text-gray-700 group-hover:text-blue-700 transition-colors">
              "Giải bài tập về mạch điện ba pha, công suất P = 10kW, cosφ = 0.8"
            </p>
          </div>

          <div className="p-5 bg-blue-50 rounded-xl border border-blue-100 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <p className="text-sm font-bold text-blue-800">Phân tích file</p>
            </div>
            <p className="text-gray-700 group-hover:text-blue-700 transition-colors">
              "Phân tích đề thi trong file PDF và đưa ra hướng giải chi tiết"
            </p>
          </div>

          <div className="p-5 bg-blue-50 rounded-xl border border-blue-100 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-center gap-2 mb-2">
              <Scale className="w-5 h-5 text-blue-600" />
              <p className="text-sm font-bold text-blue-800">So sánh</p>
            </div>
            <p className="text-gray-700 group-hover:text-blue-700 transition-colors">
              "So sánh điốt và transistor về cấu tạo, nguyên lý và ứng dụng"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product1;
