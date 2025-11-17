import React from 'react';
import ChatInterface from './ChatInterface';

const Product1: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg shadow-lg text-white">
        <h2 className="text-3xl font-bold text-center mb-2">
          <i className="fas fa-comments mr-2"></i>
          Sản phẩm học tập số 1: Trò chuyện với AI
        </h2>
        <p className="text-center text-blue-100">
          Hỏi AI bất kỳ câu hỏi nào về Công nghệ (SGK KNTT & Cánh Diều) - Upload file để phân tích - Lịch sử chat được lưu tự động
        </p>
      </div>

      <ChatInterface />

      <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-3 text-blue-800 dark:text-blue-200 flex items-center">
          <i className="fas fa-lightbulb mr-2"></i>
          Hướng dẫn sử dụng
        </h3>
        <div className="space-y-2 text-gray-700 dark:text-gray-300">
          <p><i className="fas fa-check text-green-500 mr-2"></i><strong>Chat mới:</strong> Click nút "Chat mới" ở sidebar</p>
          <p><i className="fas fa-check text-green-500 mr-2"></i><strong>Upload file:</strong> Click icon 📎 để đính kèm PDF, DOCX, hình ảnh</p>
          <p><i className="fas fa-check text-green-500 mr-2"></i><strong>Lịch sử:</strong> Tất cả chat được lưu tự động, click vào để xem lại</p>
          <p><i className="fas fa-check text-green-500 mr-2"></i><strong>Tìm kiếm:</strong> Dùng ô search để tìm chat cũ</p>
          <p><i className="fas fa-check text-green-500 mr-2"></i><strong>Xuất file:</strong> Click "Xuất file" để tải chat ra file text</p>
          <p><i className="fas fa-check text-green-500 mr-2"></i><strong>Enter:</strong> Gửi tin nhắn | <strong>Shift+Enter:</strong> Xuống dòng</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          <i className="fas fa-question-circle mr-2"></i>
          Ví dụ câu hỏi hay
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">Lý thuyết:</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              "Giải thích nguyên lý hoạt động của máy biến áp ba pha trong hệ thống điện"
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">Bài tập:</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              "Giải bài tập về mạch điện ba pha, công suất P = 10kW, cosφ = 0.8"
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">Phân tích file:</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              "Phân tích đề thi trong file PDF và đưa ra hướng giải chi tiết"
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">So sánh:</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              "So sánh điốt và transistor về cấu tạo, nguyên lý và ứng dụng"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product1;
