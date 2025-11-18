
import React, { useState, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ScrollToTop from './components/ScrollToTop';
import TechBadge from './components/TechBadge';
import LoadingSpinner from './components/LoadingSpinner';
import SyncStatus from './components/SyncStatus';

// Lazy load components for code splitting
const Home = lazy(() => import('./components/Home'));
const Product1 = lazy(() => import('./components/Product1'));
const Product2 = lazy(() => import('./components/Product2'));
const Product3 = lazy(() => import('./components/Product3'));
const Product4 = lazy(() => import('./components/Product4'));
const Product5 = lazy(() => import('./components/Product5'));
const Product6 = lazy(() => import('./components/Product6'));
const Product7 = lazy(() => import('./components/Product7'));
const Leaderboard = lazy(() => import('./components/Leaderboard'));
const PWASettings = lazy(() => import('./components/PWASettings'));
const SyncSettings = lazy(() => import('./components/SyncSettings'));
const ExamHistory = lazy(() => import('./components/ExamHistory'));
const ExamReview = lazy(() => import('./components/ExamReview'));

const App: React.FC = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(() => {
    return localStorage.getItem('disclaimer_accepted') !== 'true';
  });

  const acceptDisclaimer = () => {
    localStorage.setItem('disclaimer_accepted', 'true');
    setShowDisclaimer(false);
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-gray-50">
        {/* Skip to main content for accessibility */}
        <a href="#main-content" className="skip-to-main">
          Nhảy đến nội dung chính
        </a>
        {/* Disclaimer Banner */}
        {showDisclaimer && (
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white py-4 px-4 shadow-2xl sticky top-0 z-50 border-b-2 border-white/30 animate-slideDown">
            <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 flex-shrink-0">
                  <i className="fas fa-exclamation-triangle text-3xl"></i>
                </div>
                <div className="text-sm">
                  <p className="font-bold mb-2 text-lg flex items-center gap-2">
                    🎓 Công cụ hỗ trợ học tập môn Công nghệ THPT
                  </p>
                  <p className="text-orange-50 leading-relaxed">
                    Website sử dụng <span className="font-bold bg-white/20 px-2 py-0.5 rounded">AI Gemini 2.0</span> để tạo đề thi dựa trên SGK <strong>Kết nối tri thức</strong> và <strong>Cánh Diều</strong>. 
                    Đây là <span className="font-bold bg-white/20 px-2 py-0.5 rounded">phiên bản demo</span>, nội dung mang tính tham khảo, chưa chính xác 100%. 
                    Vui lòng kết hợp với tài liệu chính thức của Bộ GD&ĐT.
                  </p>
                </div>
              </div>
              <button
                onClick={acceptDisclaimer}
                className="px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 hover:scale-105 transition-all whitespace-nowrap shadow-lg"
              >
                <i className="fas fa-check-circle mr-2"></i>Đã hiểu
              </button>
            </div>
          </div>
        )}

        <Header />
        <main id="main-content" className="flex-grow container mx-auto px-4 py-8" role="main">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <LoadingSpinner 
                size="lg" 
                text="Đang tải trang..." 
                color="blue"
              />
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/san-pham-1" element={<Product1 />} />
              <Route path="/san-pham-2" element={<Product2 />} />
              <Route path="/san-pham-3" element={<Product3 />} />
              <Route path="/san-pham-4" element={<Product4 />} />
              <Route path="/san-pham-5" element={<Product5 />} />
              <Route path="/san-pham-6" element={<Product6 />} />
              <Route path="/san-pham-7" element={<Product7 />} />
              <Route path="/bang-xep-hang" element={<Leaderboard />} />
              <Route path="/pwa-settings" element={<PWASettings />} />
              <Route path="/sync-settings" element={<SyncSettings />} />
              <Route path="/lich-su" element={<ExamHistory />} />
              <Route path="/xem-lai/:id" element={<ExamReview />} />
            </Routes>
          </Suspense>
        </main>
        <ScrollToTop />
        <TechBadge />
        <SyncStatus />
        <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 shadow-2xl mt-auto border-t-2 border-blue-500/30">
            <div className="container mx-auto px-4 py-10">
              <div className="grid md:grid-cols-4 gap-8 text-white mb-8">
                <div className="space-y-4">
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                      <i className="fas fa-graduation-cap text-white"></i>
                    </div>
                    Về Chúng Tôi
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Nền tảng học tập thông minh sử dụng <span className="font-semibold text-blue-400">AI Gemini 2.0</span> để hỗ trợ học sinh luyện thi THPT môn Công Nghệ.
                  </p>
                  <div className="flex gap-3 mt-4">
                    <a href="#" className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center hover:scale-110 transition-transform">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center hover:scale-110 transition-transform">
                      <i className="fab fa-youtube"></i>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center hover:scale-110 transition-transform">
                      <i className="fab fa-telegram"></i>
                    </a>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-lg">
                      <i className="fas fa-link text-white"></i>
                    </div>
                    Liên Kết
                  </h3>
                  <ul className="space-y-3 text-sm text-gray-300">
                    <li><a href="/#/" className="hover:text-white transition-colors hover:translate-x-2 inline-block"><i className="fas fa-chevron-right text-xs mr-2 text-blue-400"></i> Trang Chủ</a></li>
                    <li><a href="/#/san-pham-1" className="hover:text-white transition-colors hover:translate-x-2 inline-block"><i className="fas fa-chevron-right text-xs mr-2 text-purple-400"></i> Chat AI</a></li>
                    <li><a href="/#/san-pham-2" className="hover:text-white transition-colors hover:translate-x-2 inline-block"><i className="fas fa-chevron-right text-xs mr-2 text-green-400"></i> Tạo Câu Hỏi</a></li>
                    <li><a href="/#/lich-su" className="hover:text-white transition-colors hover:translate-x-2 inline-block"><i className="fas fa-chevron-right text-xs mr-2 text-pink-400"></i> Lịch Sử Đề Thi</a></li>
                    <li><a href="/#/san-pham-3" className="hover:text-white transition-colors hover:translate-x-2 inline-block"><i className="fas fa-chevron-right text-xs mr-2 text-purple-400"></i> Đề Thi Công Nghiệp</a></li>
                    <li><a href="/#/san-pham-4" className="hover:text-white transition-colors hover:translate-x-2 inline-block"><i className="fas fa-chevron-right text-xs mr-2 text-green-400"></i> Đề Thi Nông Nghiệp</a></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">
                    <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-2 rounded-lg">
                      <i className="fas fa-envelope text-white"></i>
                    </div>
                    Liên Hệ
                  </h3>
                  <ul className="space-y-3 text-sm text-gray-300">
                    <li className="flex items-center gap-2">
                      <i className="fas fa-envelope text-blue-400"></i>
                      <a href="mailto:longhngn.hnue@gmail.com" className="hover:text-white transition-colors">longhngn.hnue@gmail.com</a>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-phone text-green-400"></i>
                      <a href="tel:0896636181" className="hover:text-white transition-colors">0896636181</a>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-clock text-purple-400"></i>
                      8:00 - 22:00 hàng ngày
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-lg">
                      <i className="fas fa-robot text-white"></i>
                    </div>
                    Công Nghệ
                  </h3>
                  <ul className="space-y-3 text-sm text-gray-300">
                    <li className="flex items-center gap-2">
                      <i className="fas fa-check-circle text-green-400"></i>
                      Google Gemini 2.0
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fab fa-react text-blue-400"></i>
                      React 19 + TypeScript
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-bolt text-yellow-400"></i>
                      Vite + Tailwind CSS
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-book text-pink-400"></i>
                      SGK KNTT & Cánh Diều
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-blue-500/30 pt-6 text-center space-y-3">
                <p className="text-sm text-white font-semibold">
                  <i className="fas fa-graduation-cap mr-2 text-blue-400"></i>
                  Ôn Thi THPT Quốc Gia - Công Nghệ với AI | Chương trình GDPT 2018
                </p>
                <p className="text-xs text-gray-400">
                  &copy; 2025 - Ý tưởng và phát triển bởi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-bold">Long Nguyễn 204</span>
                </p>
                <div className="flex justify-center gap-4 text-xs text-gray-500 mt-4">
                  <span className="flex items-center gap-1">
                    <i className="fas fa-heart text-red-400"></i>
                    Made with Love
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <i className="fas fa-code text-purple-400"></i>
                    Open Source
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <i className="fas fa-shield-alt text-green-400"></i>
                    Safe & Secure
                  </span>
                </div>
              </div>
            </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
