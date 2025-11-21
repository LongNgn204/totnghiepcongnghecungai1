import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState('Học Sinh');

  useEffect(() => {
    try {
      const profile = localStorage.getItem('user_profile');
      if (profile) {
        const parsed = JSON.parse(profile);
        setUserName(parsed.name || 'Học Sinh');
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-blue-50 rounded-full p-4 text-4xl">
            👤
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Chào mừng trở lại, {userName}! 👋
            </h1>
            <p className="text-gray-600 text-lg mt-2">
              Sẵn sàng chinh phục môn Công Nghệ THPT cùng AI Gemini
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions - Main Features */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          ⚡ Chức Năng Chính
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Chat AI */}
          <Link to="/san-pham-1" className="group">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all border border-gray-200 hover:border-blue-400 h-full">
              <div className="bg-blue-50 rounded-xl w-16 h-16 flex items-center justify-center mb-4 text-3xl group-hover:scale-110 transition-transform">
                💬
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Chat AI</h3>
              <p className="text-gray-600 text-sm">
                Hỏi đáp với AI, upload file, giải thích chi tiết
              </p>
            </div>
          </Link>

          {/* Tạo Câu Hỏi */}
          <Link to="/san-pham-2" className="group">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all border border-gray-200 hover:border-green-400 h-full">
              <div className="bg-green-50 rounded-xl w-16 h-16 flex items-center justify-center mb-4 text-3xl group-hover:scale-110 transition-transform">
                ❓
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Tạo Câu Hỏi</h3>
              <p className="text-gray-600 text-sm">
                Tự động tạo đề 4 lựa chọn, Đúng/Sai, YCCĐ
              </p>
            </div>
          </Link>

          {/* Đề Công Nghiệp */}
          <Link to="/san-pham-3" className="group">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all border border-gray-200 hover:border-purple-400 h-full">
              <div className="bg-purple-50 rounded-xl w-16 h-16 flex items-center justify-center mb-4 text-3xl group-hover:scale-110 transition-transform">
                ⚙️
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Đề Công Nghiệp</h3>
              <p className="text-gray-600 text-sm">
                Điện + Điện tử, 28 câu chuẩn format
              </p>
            </div>
          </Link>

          {/* Đề Nông Nghiệp */}
          <Link to="/san-pham-4" className="group">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all border border-gray-200 hover:border-teal-400 h-full">
              <div className="bg-teal-50 rounded-xl w-16 h-16 flex items-center justify-center mb-4 text-3xl group-hover:scale-110 transition-transform">
                🌾
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Đề Nông Nghiệp</h3>
              <p className="text-gray-600 text-sm">
                Trồng trọt + Chăn nuôi, 28 câu format SGK
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Secondary Features */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          📚 Công Cụ Học Tập
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Flashcards */}
          <Link to="/san-pham-5" className="group">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all border border-gray-200 h-full">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-pink-50 rounded-lg w-12 h-12 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🗂️
                </div>
                <h3 className="text-lg font-bold text-gray-800">Flashcards</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Học theo phương pháp lặp lại ngắt quãng, AI tạo thẻ tự động
              </p>
            </div>
          </Link>

          {/* Dashboard Stats */}
          <Link to="/san-pham-6" className="group">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all border border-gray-200 h-full">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-indigo-50 rounded-lg w-12 h-12 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  📈
                </div>
                <h3 className="text-lg font-bold text-gray-800">Thống Kê</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Theo dõi tiến độ học tập, xem biểu đồ chi tiết
              </p>
            </div>
          </Link>

          {/* Nhóm Học */}
          <Link to="/san-pham-7" className="group">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all border border-gray-200 h-full">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-orange-50 rounded-lg w-12 h-12 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  👥
                </div>
                <h3 className="text-lg font-bold text-gray-800">Nhóm Học</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Tạo nhóm, chia sẻ tài liệu, học cùng bạn bè
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          🔗 Truy Cập Nhanh
        </h2>
        <div className="grid md:grid-cols-4 gap-4">
          <Link to="/lich-su" className="flex items-center gap-3 bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-all border border-gray-200">
            <span className="text-2xl">📜</span>
            <span className="font-semibold text-gray-800">Lịch Sử</span>
          </Link>

          <Link to="/bang-xep-hang" className="flex items-center gap-3 bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-all border border-gray-200">
            <span className="text-2xl">🏆</span>
            <span className="font-semibold text-gray-800">Bảng Xếp Hạng</span>
          </Link>

          <Link to="/profile" className="flex items-center gap-3 bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-all border border-gray-200">
            <span className="text-2xl">👤</span>
            <span className="font-semibold text-gray-800">Hồ Sơ</span>
          </Link>

          <Link to="/pwa-settings" className="flex items-center gap-3 bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-all border border-gray-200">
            <span className="text-2xl">⚙️</span>
            <span className="font-semibold text-gray-800">Cài Đặt</span>
          </Link>
        </div>
      </div>

      {/* How to Use Guide */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          📖 Hướng Dẫn Sử Dụng
        </h2>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="bg-blue-100 text-blue-600 rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl">
                1
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                💬 Chat AI - Hỏi Đáp Thông Minh
              </h3>
              <p className="text-gray-600 mb-3">
                Nhấn vào <strong>"Chat AI"</strong> để bắt đầu trò chuyện với AI Gemini. Bạn có thể:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>Hỏi bất kỳ câu hỏi nào về môn Công Nghệ</li>
                <li>Upload file PDF/DOC để AI phân tích và tóm tắt</li>
                <li>Yêu cầu giải thích chi tiết với sơ đồ minh họa</li>
                <li>Xem lại lịch sử chat đã lưu</li>
              </ul>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="bg-green-100 text-green-600 rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl">
                2
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                ❓ Tạo Câu Hỏi - Luyện Tập Linh Hoạt
              </h3>
              <p className="text-gray-600 mb-3">
                Vào <strong>"Tạo Câu Hỏi"</strong> để AI tự động sinh đề theo yêu cầu:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li><strong>4 Lựa Chọn:</strong> Trắc nghiệm ABCD chuẩn format THPT</li>
                <li><strong>Đúng/Sai:</strong> Câu hỏi Đúng/Sai nhanh gọn</li>
                <li><strong>YCCĐ:</strong> Yêu cầu cần đạt theo SGK</li>
                <li>Chọn chủ đề, số lượng câu, mức độ khó</li>
              </ul>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="bg-purple-100 text-purple-600 rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl">
                3
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                ⚙️ Đề Công Nghiệp - Luyện Đề Chuyên Sâu
              </h3>
              <p className="text-gray-600 mb-3">
                Chọn <strong>"Đề Công Nghiệp"</strong> để làm đề thi mô phỏng:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>28 câu (24 Trắc nghiệm + 4 Đúng/Sai) chuẩn Bộ GD&ĐT</li>
                <li>Chọn chủ đề: Điện hoặc Điện tử</li>
                <li>In đề hoặc tải xuống PDF</li>
                <li>Xem đáp án + giải thích chi tiết</li>
              </ul>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="bg-teal-100 text-teal-600 rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl">
                4
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                🌾 Đề Nông Nghiệp - Thực Hành Đầy Đủ
              </h3>
              <p className="text-gray-600 mb-3">
                Tương tự, vào <strong>"Đề Nông Nghiệp"</strong> để làm đề:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>28 câu chuẩn format (24 TN + 4 Đ/S)</li>
                <li>Chủ đề: Trồng trọt hoặc Chăn nuôi</li>
                <li>Nội dung từ cả 2 bộ SGK</li>
                <li>Hỗ trợ in/tải như Đề Công Nghiệp</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tips Box */}
        <div className="mt-8 bg-yellow-50 rounded-xl p-6 border-l-4 border-yellow-500">
          <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            💡 Mẹo Học Tập Hiệu Quả
          </h4>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-500">✅</span>
              <span><strong>Học đều đặn:</strong> Mỗi ngày 30-60 phút tốt hơn học dồn 5-6 tiếng</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✅</span>
              <span><strong>Ôn tập thường xuyên:</strong> Dùng Flashcards mỗi ngày để ghi nhớ lâu</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✅</span>
              <span><strong>Làm đề thử:</strong> Làm ít nhất 3-5 đề mô phỏng trước kỳ thi</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✅</span>
              <span><strong>Hỏi khi chưa hiểu:</strong> Chat AI luôn sẵn sàng giải đáp 24/7</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2 text-gray-800">
          📊 Thống Kê Nhanh
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
            <div className="text-3xl font-bold mb-1 text-blue-600">0</div>
            <div className="text-sm text-gray-600">Đề đã làm</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
            <div className="text-3xl font-bold mb-1 text-green-600">0</div>
            <div className="text-sm text-gray-600">Câu hỏi đã trả lời</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
            <div className="text-3xl font-bold mb-1 text-purple-600">0</div>
            <div className="text-sm text-gray-600">Flashcards đã học</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
            <div className="text-3xl font-bold mb-1 text-orange-600">0h</div>
            <div className="text-sm text-gray-600">Thời gian học</div>
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 mt-4 flex items-center justify-center gap-2">
          ℹ️ Số liệu sẽ được cập nhật khi bạn bắt đầu sử dụng
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
