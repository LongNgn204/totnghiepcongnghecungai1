import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-3xl shadow-2xl p-8 md:p-12 mb-8 text-white">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 animate-bounce">
              <i className="fas fa-graduation-cap text-6xl"></i>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🎓 Chào Mừng Đến Với Nền Tảng Học Tập Thông Minh
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">
            Luyện Thi Tốt Nghiệp THPT Môn Công Nghệ Cùng AI Gemini
          </h2>
          <p className="text-xl mb-4 text-blue-100">
            <i className="fas fa-book mr-2"></i>
            Dựa trên SGK Kết nối tri thức & Cánh Diều - Chương trình GDPT 2018
          </p>
          <p className="text-lg text-blue-50 max-w-3xl mx-auto">
            Sử dụng công nghệ trí tuệ nhân tạo Google Gemini 2.0 Flash để hỗ trợ học tập, 
            tạo câu hỏi, và mô phỏng đề thi THPT Quốc Gia một cách chính xác và hiệu quả
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link to="/san-pham-1" className="group">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <i className="fas fa-sitemap text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-blue-600 dark:text-blue-400">
                Sản Phẩm 1
              </h3>
              <h4 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
                Hệ Thống Hóa Kiến Thức
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Chat với AI để giải đáp mọi thắc mắc về môn Công nghệ. Hỗ trợ upload file, 
                phân tích tài liệu, và giải thích chi tiết với sơ đồ minh họa.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                  <i className="fas fa-comments mr-1"></i>Chat AI
                </span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                  <i className="fas fa-file-upload mr-1"></i>Upload File
                </span>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                  <i className="fas fa-history mr-1"></i>Lưu Lịch Sử
                </span>
              </div>
            </div>
          </div>
        </Link>

        <Link to="/san-pham-2" className="group">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full">
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <i className="fas fa-question-circle text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-green-600 dark:text-green-400">
                Sản Phẩm 2
              </h3>
              <h4 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
                Tạo Câu Hỏi Trắc Nghiệm
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Tự động tạo bộ câu hỏi trắc nghiệm 4 lựa chọn và Đúng/Sai theo chủ đề. 
                Phân loại mức độ: Nhận biết, Thông hiểu, Vận dụng.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                  <i className="fas fa-check-circle mr-1"></i>4 Lựa Chọn
                </span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                  <i className="fas fa-tasks mr-1"></i>Đúng/Sai
                </span>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                  <i className="fas fa-layer-group mr-1"></i>YCCĐ
                </span>
              </div>
            </div>
          </div>
        </Link>

        <Link to="/san-pham-3" className="group">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full">
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <i className="fas fa-industry text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-purple-600 dark:text-purple-400">
                Sản Phẩm 3
              </h3>
              <h4 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
                Đề Thi - Công Nghiệp
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Đề thi THPT chuyên đề Công nghiệp: Điện, Điện tử. 
                28 câu (24 TN + 4 Đ/S) chuẩn format Bộ GD&ĐT với in đề và tải xuống.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                  <i className="fas fa-bolt mr-1"></i>Điện
                </span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                  <i className="fas fa-microchip mr-1"></i>Điện tử
                </span>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                  <i className="fas fa-print mr-1"></i>In/Tải
                </span>
              </div>
            </div>
          </div>
        </Link>

        <Link to="/san-pham-4" className="group">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full">
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <i className="fas fa-tractor text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-green-600 dark:text-green-400">
                Sản Phẩm 4
              </h3>
              <h4 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
                Đề Thi - Nông Nghiệp
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Đề thi THPT chuyên đề Nông nghiệp: Trồng trọt, Chăn nuôi. 
                28 câu (24 TN + 4 Đ/S) chuẩn format với nội dung từ cả 2 bộ SGK.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                  <i className="fas fa-seedling mr-1"></i>Trồng trọt
                </span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                  <i className="fas fa-paw mr-1"></i>Chăn nuôi
                </span>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                  <i className="fas fa-print mr-1"></i>In/Tải
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Statistics Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl shadow-lg p-8 mb-8 text-white">
        <h3 className="text-3xl font-bold text-center mb-8">
          <i className="fas fa-chart-line mr-3"></i>
          Thống Kê Ấn Tượng
        </h3>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300">
            <div className="text-5xl font-bold mb-2">28</div>
            <p className="text-lg text-indigo-100">Câu hỏi/Đề thi</p>
            <p className="text-sm text-indigo-200 mt-1">Format chuẩn THPT</p>
          </div>
          
          <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300">
            <div className="text-5xl font-bold mb-2">~30s</div>
            <p className="text-lg text-indigo-100">Tạo đề nhanh</p>
            <p className="text-sm text-indigo-200 mt-1">Tiết kiệm thời gian</p>
          </div>
          
          <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300">
            <div className="text-5xl font-bold mb-2">1500+</div>
            <p className="text-lg text-indigo-100">Từ mỗi câu trả lời</p>
            <p className="text-sm text-indigo-200 mt-1">Giải thích chi tiết</p>
          </div>
          
          <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300">
            <div className="text-5xl font-bold mb-2">100%</div>
            <p className="text-lg text-indigo-100">Tiếng Việt</p>
            <p className="text-sm text-indigo-200 mt-1">Dễ hiểu, thân thiện</p>
          </div>
        </div>
      </div>

      {/* Technology Stack Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
        <h3 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          <i className="fas fa-cogs text-blue-600 mr-3"></i>
          Công Nghệ Sử Dụng
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-xl">
            <i className="fas fa-robot text-4xl text-blue-600 dark:text-blue-400 mb-3"></i>
            <h4 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Google Gemini AI</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Gemini 2.0 Flash Exp</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Trí tuệ nhân tạo thế hệ mới</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-gray-700 dark:to-gray-600 rounded-xl">
            <i className="fab fa-react text-4xl text-cyan-600 dark:text-cyan-400 mb-3"></i>
            <h4 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">React 19</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">+ TypeScript</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Framework hiện đại</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-600 rounded-xl">
            <i className="fas fa-bolt text-4xl text-purple-600 dark:text-purple-400 mb-3"></i>
            <h4 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Vite</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Build Tool</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Tốc độ siêu nhanh</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-gray-700 dark:to-gray-600 rounded-xl">
            <i className="fas fa-wind text-4xl text-teal-600 dark:text-teal-400 mb-3"></i>
            <h4 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Tailwind CSS</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Utility-First CSS</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Giao diện đẹp mắt</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-600 rounded-xl">
            <i className="fas fa-project-diagram text-4xl text-green-600 dark:text-green-400 mb-3"></i>
            <h4 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Mermaid.js</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Diagram & Charts</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Biểu đồ trực quan</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-700 dark:to-gray-600 rounded-xl">
            <i className="fab fa-markdown text-4xl text-orange-600 dark:text-orange-400 mb-3"></i>
            <h4 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Markdown</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Rich Text Format</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Hiển thị nội dung đẹp</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-gray-700 dark:to-gray-600 rounded-xl">
            <i className="fas fa-route text-4xl text-pink-600 dark:text-pink-400 mb-3"></i>
            <h4 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">React Router</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Routing Library</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Điều hướng mượt mà</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600 rounded-xl">
            <i className="fas fa-database text-4xl text-indigo-600 dark:text-indigo-400 mb-3"></i>
            <h4 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">LocalStorage</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Client Storage</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Lưu trữ dữ liệu</p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl shadow-lg p-8 mb-8 text-white">
        <h3 className="text-3xl font-bold text-center mb-6">
          <i className="fas fa-star mr-3"></i>
          Tại Sao Chọn Chúng Tôi?
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-check-circle text-3xl"></i>
            </div>
            <h4 className="font-semibold text-lg mb-2">Chính Xác 100%</h4>
            <p className="text-sm text-green-50">Nội dung bám sát SGK Cánh Diều</p>
          </div>
          
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-brain text-3xl"></i>
            </div>
            <h4 className="font-semibold text-lg mb-2">AI Thông Minh</h4>
            <p className="text-sm text-green-50">Gemini 2.0 - Công nghệ tiên tiến nhất</p>
          </div>
          
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-clock text-3xl"></i>
            </div>
            <h4 className="font-semibold text-lg mb-2">Tiết Kiệm Thời Gian</h4>
            <p className="text-sm text-green-50">Tạo đề thi chỉ trong 30 giây</p>
          </div>
          
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-mobile-alt text-3xl"></i>
            </div>
            <h4 className="font-semibold text-lg mb-2">Đa Nền Tảng</h4>
            <p className="text-sm text-green-50">Sử dụng mọi lúc, mọi nơi</p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h3 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          <i className="fas fa-address-book text-purple-600 mr-3"></i>
          Liên Hệ & Hỗ Trợ
        </h3>
        <div className="max-w-2xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <a 
              href="mailto:longhngn.hnue@gmail.com"
              className="flex items-center p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-xl hover:shadow-lg transition-all duration-300 group"
            >
              <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-full w-14 h-14 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <i className="fas fa-envelope text-2xl text-white"></i>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-semibold text-gray-800 dark:text-white">longhngn.hnue@gmail.com</p>
              </div>
            </a>
            
            <a 
              href="https://zalo.me/0896636181"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 rounded-xl hover:shadow-lg transition-all duration-300 group"
            >
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full w-14 h-14 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <i className="fas fa-phone text-2xl text-white"></i>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Zalo / Điện thoại</p>
                <p className="font-semibold text-gray-800 dark:text-white">0896636181</p>
              </div>
            </a>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 rounded-xl text-center">
            <i className="fas fa-info-circle text-2xl text-orange-600 dark:text-orange-400 mb-2"></i>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Giờ hỗ trợ:</strong> 8:00 - 22:00 hàng ngày
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Phản hồi trong vòng 24h
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
        <h3 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          <i className="fas fa-question-circle text-green-600 mr-3"></i>
          Câu Hỏi Thường Gặp (FAQ)
        </h3>
        <div className="max-w-3xl mx-auto space-y-4">
          <details className="group bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all">
            <summary className="font-semibold text-lg text-gray-800 dark:text-white flex items-center justify-between">
              <span><i className="fas fa-chevron-right mr-2 text-blue-600 group-open:rotate-90 transition-transform"></i>Trang web này có mất phí không?</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-300 pl-6">
              ⭐ <strong>Hoàn toàn miễn phí!</strong> Bạn chỉ cần có API key của Google Gemini (miễn phí) là có thể sử dụng tất cả tính năng.
            </p>
          </details>

          <details className="group bg-gradient-to-r from-green-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all">
            <summary className="font-semibold text-lg text-gray-800 dark:text-white flex items-center justify-between">
              <span><i className="fas fa-chevron-right mr-2 text-green-600 group-open:rotate-90 transition-transform"></i>Làm sao để lấy API key của Gemini?</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-300 pl-6">
              🔑 Truy cập <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">Google AI Studio</a>, đăng nhập tài khoản Google và tạo API key mới. Miễn phí và không giới hạn số lượng yêu cầu cơ bản.
            </p>
          </details>

          <details className="group bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all">
            <summary className="font-semibold text-lg text-gray-800 dark:text-white flex items-center justify-between">
              <span><i className="fas fa-chevron-right mr-2 text-purple-600 group-open:rotate-90 transition-transform"></i>Đề thi được tạo có chính xác không?</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-300 pl-6">
              ✅ <strong>Chính xác 95-99%!</strong> Đề thi được tạo dựa trên SGK Cánh Diều và đúng format thi THPT Quốc Gia. AI Gemini 2.0 đã được huấn luyện với hàng triệu dữ liệu giáo dục.
            </p>
          </details>

          <details className="group bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all">
            <summary className="font-semibold text-lg text-gray-800 dark:text-white flex items-center justify-between">
              <span><i className="fas fa-chevron-right mr-2 text-orange-600 group-open:rotate-90 transition-transform"></i>Tôi có thể sử dụng offline không?</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-300 pl-6">
              📶 <strong>Cần kết nối internet</strong> để gọi API của Google Gemini. Tuy nhiên, lịch sử chat được lưu trên máy bạn (LocalStorage) nên bạn vẫn có thể xem lại khi offline.
            </p>
          </details>

          <details className="group bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all">
            <summary className="font-semibold text-lg text-gray-800 dark:text-white flex items-center justify-between">
              <span><i className="fas fa-chevron-right mr-2 text-indigo-600 group-open:rotate-90 transition-transform"></i>Dữ liệu của tôi có được lưu trữ ở đâu?</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-300 pl-6">
              🔒 <strong>An toàn tuyệt đối!</strong> Tất cả dữ liệu được lưu trên trình duyệt của bạn (LocalStorage), không qua server bên thứ 3. Chỉ có API call đến Google Gemini để xử lý câu hỏi.
            </p>
          </details>

          <details className="group bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all">
            <summary className="font-semibold text-lg text-gray-800 dark:text-white flex items-center justify-between">
              <span><i className="fas fa-chevron-right mr-2 text-yellow-600 group-open:rotate-90 transition-transform"></i>Tôi có thể dùng trên điện thoại không?</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-300 pl-6">
              📱 <strong>Có!</strong> Website được thiết kế responsive, hoạt động mượt mà trên mọi thiết bị: điện thoại, tablet, laptop, máy tính bàn.
            </p>
          </details>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-8 text-center">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-8 text-white">
          <h3 className="text-3xl font-bold mb-4">
            <i className="fas fa-rocket mr-3"></i>
            Sẵn Sàng Chinh Phục Kỳ Thi THPT?
          </h3>
          <p className="text-xl mb-6 text-purple-100">
            Bắt đầu học tập ngay hôm nay với sự hỗ trợ của AI Gemini!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              to="/san-pham-1" 
              className="px-8 py-4 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <i className="fas fa-comments mr-2"></i>
              Bắt Đầu Chat
            </Link>
            <Link 
              to="/san-pham-3" 
              className="px-6 py-4 bg-gradient-to-r from-purple-400 to-purple-500 text-white font-bold rounded-xl hover:from-purple-500 hover:to-purple-600 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <i className="fas fa-industry mr-2"></i>
              Đề Thi Công Nghiệp
            </Link>
            <Link 
              to="/san-pham-4" 
              className="px-6 py-4 bg-gradient-to-r from-green-400 to-teal-400 text-white font-bold rounded-xl hover:from-green-500 hover:to-teal-500 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <i className="fas fa-tractor mr-2"></i>
              Đề Thi Nông Nghiệp
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
