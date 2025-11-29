import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';
import {
  GraduationCap,
  MessageSquare,
  FileQuestion,
  BookOpen,
  CheckCircle,
  Zap,
  Rocket,
  ArrowRight,
  Cpu,
  Users,
  Phone,
  Mail,
  HelpCircle,
  Sparkles
} from 'lucide-react';

const Home: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartLearning = () => {
    if (user) {
      navigate('/san-pham-1');
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden mb-16 glass-panel border-0 p-1">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10 dark:from-primary-900/20 dark:to-secondary-900/20"></div>

        <div className="relative z-10 px-6 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100/50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-8 animate-fade-in border border-primary-200/50 dark:border-primary-700/30 backdrop-blur-sm">
            <Sparkles size={16} />
            <span>Hỗ trợ bởi Gemini 2.5 Pro</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-gray-900 dark:text-white animate-slide-up">
            Ôn Thi THPT <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500 dark:from-primary-400 dark:to-secondary-400">Công Nghệ</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Hệ thống luyện thi thông minh, bám sát chương trình GDPT 2018.
            <br className="hidden md:block" />
            Biến việc học trở nên thú vị và hiệu quả hơn bao giờ hết.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <button
              onClick={handleStartLearning}
              className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2 group"
            >
              Bắt Đầu Ngay <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <Link to="/san-pham-3" className="btn-secondary text-lg px-8 py-4 flex items-center justify-center gap-2">
              <FileQuestion size={20} /> Làm Đề Thi Thử
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm font-medium text-gray-500 dark:text-gray-400 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <CheckCircle size={16} className="text-green-500" /> SGK KNTT & Cánh Diều
            </span>
            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <CheckCircle size={16} className="text-green-500" /> Miễn phí 100%
            </span>
          </div>
        </div>
      </div>

      {/* Value Proposition Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-20">
        <div className="glass-card p-8 rounded-2xl group hover:-translate-y-2 transition-transform duration-300">
          <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
            <Rocket size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Mục Tiêu</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Giúp học sinh nắm vững kiến thức cốt lõi, phát triển tư duy và đạt điểm số tối đa trong kỳ thi THPT Quốc gia.
          </p>
        </div>

        <div className="glass-card p-8 rounded-2xl group hover:-translate-y-2 transition-transform duration-300">
          <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
            <Users size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Đối Tượng</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Học sinh lớp 10, 11, 12 theo học bộ sách Kết nối tri thức hoặc Cánh diều, và giáo viên cần nguồn tài liệu.
          </p>
        </div>

        <div className="glass-card p-8 rounded-2xl group hover:-translate-y-2 transition-transform duration-300">
          <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
            <Zap size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Phương Pháp</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Kết hợp học lý thuyết qua Chat AI, luyện tập với ngân hàng câu hỏi thông minh và theo dõi tiến độ.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="space-y-24 mb-24">
        {/* Feature 1 */}
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-bold">
              <BookOpen size={16} /> Chương Trình Chuẩn
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Đầy Đủ Chương Trình Học Tập
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Hệ thống bao phủ toàn bộ kiến thức của hai bộ sách giáo khoa phổ biến nhất hiện nay, cập nhật liên tục.
            </p>
            <ul className="space-y-4">
              {['Công nghệ Công nghiệp: Điện, Điện tử...', 'Công nghệ Nông nghiệp: Trồng trọt, Lâm nghiệp...', 'Cập nhật theo văn bản mới nhất của Bộ GD&ĐT'].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                  <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 glass-panel p-8 rounded-3xl aspect-video flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 overflow-hidden relative group">
            <img
              src="/assets/images/feature-1.png"
              alt="Đầy Đủ Chương Trình Học Tập"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-2xl shadow-sm"
            />
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-bold">
              <MessageSquare size={16} /> Trợ Lý Ảo
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Hỏi Đáp Với AI Gemini 2.5 Pro
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Không còn nỗi lo "bí" bài. Trợ lý AI của chúng tôi sẵn sàng giải đáp mọi thắc mắc 24/7.
            </p>
            <ul className="space-y-4">
              {['Giải thích khái niệm khó hiểu đơn giản, trực quan.', 'Phân tích đề bài và hướng dẫn giải chi tiết.', 'Gợi ý tài liệu tham khảo mở rộng.'].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                  <CheckCircle className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 glass-panel p-8 rounded-3xl aspect-video flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 overflow-hidden relative group">
            <img
              src="/assets/images/feature-2.png"
              alt="Hỏi Đáp Với AI Gemini 2.5 Pro"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-2xl shadow-sm"
            />
          </div>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-bold">
              <FileQuestion size={16} /> Luyện Thi
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Tạo Đề Thi Tự Động
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Công cụ mạnh mẽ giúp bạn làm chủ phòng thi với kho đề vô tận và chấm điểm tức thì.
            </p>
            <ul className="space-y-4">
              {['Tùy chỉnh cấu trúc, độ khó, phạm vi kiến thức.', 'Chấm điểm tự động và nhận xét chi tiết.', 'Lưu lịch sử làm bài để theo dõi tiến bộ.'].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                  <CheckCircle className="text-purple-500 mt-1 flex-shrink-0" size={20} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 glass-panel p-8 rounded-3xl aspect-video flex items-center justify-center bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20">
            <FileQuestion size={120} className="text-purple-200 dark:text-purple-800/50" />
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="mb-20">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
            <Cpu className="text-primary-600" /> Công Nghệ Lõi
          </h3>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {['Google Gemini 2.5 Pro', 'React 19', 'TypeScript', 'Vite'].map((tech) => (
            <div key={tech} className="px-6 py-3 glass-panel rounded-full text-gray-600 dark:text-gray-300 font-medium flex items-center gap-2 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors">
              <span className="w-2 h-2 bg-primary-500 rounded-full"></span> {tech}
            </div>
          ))}
        </div>
      </div>

      {/* Contact & FAQ */}
      <div className="grid md:grid-cols-2 gap-8 mb-20">
        <div className="glass-card p-8 rounded-2xl">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Phone className="text-primary-600" /> Liên Hệ Hỗ Trợ
          </h3>
          <div className="space-y-4">
            <a href="mailto:longhngn.hnue@gmail.com" className="flex items-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
              <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <Mail size={20} className="text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-white">longhngn.hnue@gmail.com</p>
              </div>
            </a>
            <a href="https://zalo.me/0896636181" className="flex items-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
              <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <Phone size={20} className="text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Zalo / Hotline</p>
                <p className="font-medium text-gray-900 dark:text-white">0896636181</p>
              </div>
            </a>
          </div>
        </div>

        <div className="glass-card p-8 rounded-2xl">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <HelpCircle className="text-primary-600" /> Câu Hỏi Thường Gặp
          </h3>
          <div className="space-y-4">
            {[
              { q: 'Sử dụng có mất phí không?', a: 'Hoàn toàn miễn phí. Dự án phi lợi nhuận hỗ trợ cộng đồng.' },
              { q: 'Đăng ký tài khoản thế nào?', a: 'Nhấn nút "Đăng nhập" → chọn tab "Đăng ký". Chỉ cần Email.' },
              { q: 'Đề thi có chuẩn không?', a: 'Đề thi được AI tạo dựa trên SGK chuẩn của Bộ GD&ĐT.' }
            ].map((item, i) => (
              <details key={i} className="group bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700/50">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-gray-700 dark:text-gray-200">
                  <span>{item.q}</span>
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="px-4 pb-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-700/50 pt-3">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border-0 p-12 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 opacity-90"></div>
        <div className="relative z-10">
          <h3 className="text-3xl font-bold mb-4 text-white">Sẵn Sàng Chinh Phục Kỳ Thi?</h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
            Tham gia cùng hàng ngàn học sinh khác và nâng cao điểm số môn Công nghệ ngay hôm nay.
          </p>
          <button
            onClick={handleStartLearning}
            className="bg-white text-primary-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Trải Nghiệm Ngay
          </button>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
};

export default Home;

