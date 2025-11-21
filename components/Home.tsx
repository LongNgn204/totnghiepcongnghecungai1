import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  MessageSquare,
  FileQuestion,
  Settings,
  BookOpen,
  CheckCircle,
  Zap,
  Clock,
  Smartphone,
  Mail,
  Phone,
  HelpCircle,
  Rocket,
  ArrowRight,
  Cpu
} from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden mb-12 bg-white border border-gray-100 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 opacity-50"></div>
        <div className="relative z-10 p-12 md:p-20 text-center">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-blue-100 rounded-full">
              <GraduationCap size={64} className="text-blue-600" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
            Nền Tảng Ôn Thi THPT <span className="text-blue-600">Công Nghệ</span>
          </h1>

          <h2 className="text-xl md:text-2xl font-medium mb-8 text-gray-600 max-w-3xl mx-auto">
            Hệ thống luyện thi thông minh được hỗ trợ bởi <span className="text-blue-600 font-bold">Gemini 2.5 Pro</span>.
            Bám sát chương trình GDPT 2018.
          </h2>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link to="/san-pham-1" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 flex items-center gap-2 transform hover:-translate-y-1">
              Bắt Đầu Học Ngay <ArrowRight size={20} />
            </Link>
            <Link to="/san-pham-3" className="bg-white text-gray-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all border border-gray-200 shadow-sm hover:shadow-md flex items-center gap-2">
              <FileQuestion size={20} /> Làm Đề Thi Thử
            </Link>
          </div>

          <div className="mt-10 flex justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> SGK KNTT & Cánh Diều</span>
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> AI Gemini 2.5 Pro</span>
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Miễn phí 100%</span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <Link to="/san-pham-1" className="group">
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all p-8 h-full border border-gray-100 hover:border-blue-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <MessageSquare size={100} className="text-blue-600" />
            </div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <MessageSquare size={28} className="text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Chat AI</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Giải đáp thắc mắc tức thì với trợ lý AI. Hỗ trợ phân tích tài liệu và giải thích chi tiết.
              </p>
            </div>
          </div>
        </Link>

        <Link to="/san-pham-2" className="group">
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all p-8 h-full border border-gray-100 hover:border-blue-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <FileQuestion size={100} className="text-blue-600" />
            </div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <FileQuestion size={28} className="text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Tạo Câu Hỏi</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Tự động tạo câu hỏi trắc nghiệm theo chủ đề và mức độ nhận thức mong muốn.
              </p>
            </div>
          </div>
        </Link>

        <Link to="/san-pham-3" className="group">
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all p-8 h-full border border-gray-100 hover:border-blue-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Settings size={100} className="text-blue-600" />
            </div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <Settings size={28} className="text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Đề Công Nghiệp</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Bộ đề thi chuẩn cấu trúc THPT chuyên đề Công nghiệp (Điện, Điện tử).
              </p>
            </div>
          </div>
        </Link>

        <Link to="/san-pham-4" className="group">
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all p-8 h-full border border-gray-100 hover:border-blue-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <BookOpen size={100} className="text-blue-600" />
            </div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <BookOpen size={28} className="text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Đề Nông Nghiệp</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Bộ đề thi chuẩn cấu trúc THPT chuyên đề Nông nghiệp (Trồng trọt, Chăn nuôi).
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Statistics Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 mb-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Con Số Ấn Tượng</h3>
          <p className="text-gray-500">Hiệu quả đã được kiểm chứng qua thực tế</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2 text-blue-600">28</div>
            <p className="font-medium text-gray-700">Câu hỏi/Đề</p>
            <p className="text-sm text-gray-400 mt-1">Chuẩn format 2025</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2 text-blue-600">30s</div>
            <p className="font-medium text-gray-700">Tốc độ tạo đề</p>
            <p className="text-sm text-gray-400 mt-1">Siêu nhanh</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2 text-blue-600">100%</div>
            <p className="font-medium text-gray-700">Tiếng Việt</p>
            <p className="text-sm text-gray-400 mt-1">Thân thiện</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2 text-blue-600">Free</div>
            <p className="font-medium text-gray-700">Chi phí</p>
            <p className="text-sm text-gray-400 mt-1">Trọn đời</p>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Cpu className="text-blue-600" /> Công Nghệ Lõi
          </h3>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="px-6 py-3 bg-white rounded-full border border-gray-200 text-gray-600 font-medium shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Google Gemini 2.5 Pro
          </div>
          <div className="px-6 py-3 bg-white rounded-full border border-gray-200 text-gray-600 font-medium shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span> React 19
          </div>
          <div className="px-6 py-3 bg-white rounded-full border border-gray-200 text-gray-600 font-medium shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span> TypeScript
          </div>
          <div className="px-6 py-3 bg-white rounded-full border border-gray-200 text-gray-600 font-medium shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Vite
          </div>
        </div>
      </div>

      {/* Contact & Support - Light Theme */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Phone className="text-blue-600" /> Liên Hệ Hỗ Trợ
          </h3>
          <div className="space-y-4">
            <a href="mailto:longhngn.hnue@gmail.com" className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors group">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mr-4 group-hover:scale-110 transition-transform">
                <Mail size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">longhngn.hnue@gmail.com</p>
              </div>
            </a>
            <a href="https://zalo.me/0896636181" className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors group">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mr-4 group-hover:scale-110 transition-transform">
                <Phone size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Zalo / Hotline</p>
                <p className="font-medium text-gray-900">0896636181</p>
              </div>
            </a>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <HelpCircle className="text-blue-600" /> Câu Hỏi Thường Gặp
          </h3>
          <div className="space-y-3">
            <details className="group">
              <summary className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors font-medium text-gray-700">
                <span>Sử dụng có mất phí không?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="px-3 pb-3 text-sm text-gray-500 leading-relaxed">
                Hoàn toàn miễn phí. Dự án phi lợi nhuận hỗ trợ cộng đồng học sinh THPT.
              </p>
            </details>
            <div className="h-px bg-gray-100"></div>
            <details className="group">
              <summary className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors font-medium text-gray-700">
                <span>Đăng ký tài khoản thế nào?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="px-3 pb-3 text-sm text-gray-500 leading-relaxed">
                Nhấn nút "Đăng nhập" góc phải → chọn tab "Đăng ký". Chỉ cần Email là đủ.
              </p>
            </details>
            <div className="h-px bg-gray-100"></div>
            <details className="group">
              <summary className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors font-medium text-gray-700">
                <span>Đề thi có chuẩn không?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="px-3 pb-3 text-sm text-gray-500 leading-relaxed">
                Đề thi được AI tạo dựa trên SGK chuẩn của Bộ GD&ĐT (Cánh Diều, KNTT).
              </p>
            </details>
          </div>
        </div>
      </div>

      {/* CTA Section - Professional Blue Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-12 text-center text-white mb-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/pattern.png')] opacity-10"></div>
        <div className="relative z-10">
          <h3 className="text-3xl font-bold mb-4">Sẵn Sàng Chinh Phục Kỳ Thi?</h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
            Tham gia cùng hàng ngàn học sinh khác và nâng cao điểm số môn Công nghệ ngay hôm nay.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/san-pham-1" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-all shadow-md">
              Trải Nghiệm Ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
