
import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Product1 from './components/Product1';
import Product2 from './components/Product2';
import Product3 from './components/Product3';
import Product4 from './components/Product4';
import ExamHistory from './components/ExamHistory';
import ExamReview from './components/ExamReview';
import ScrollToTop from './components/ScrollToTop';
import TechBadge from './components/TechBadge';

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
      <div className="min-h-screen flex flex-col font-sans text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900">
        {/* Disclaimer Banner */}
        {showDisclaimer && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 px-4 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <i className="fas fa-info-circle text-2xl mt-0.5"></i>
                <div className="text-sm">
                  <p className="font-bold mb-1">🎓 Công cụ hỗ trợ học tập môn Công nghệ THPT</p>
                  <p className="text-amber-50">
                    Website sử dụng AI để tạo đề thi dựa trên SGK <strong>Kết nối tri thức</strong> và <strong>Cánh Diều</strong>. 
                    Đây là <strong>phiên bản demo</strong>, nội dung mang tính tham khảo, chưa chính xác 100%. 
                    Vui lòng kết hợp với tài liệu chính thức của Bộ GD&ĐT.
                  </p>
                </div>
              </div>
              <button
                onClick={acceptDisclaimer}
                className="px-4 py-2 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-all whitespace-nowrap"
              >
                <i className="fas fa-check mr-2"></i>Đã hiểu
              </button>
            </div>
          </div>
        )}

        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/san-pham-1" element={<Product1 />} />
            <Route path="/san-pham-2" element={<Product2 />} />
            <Route path="/san-pham-3" element={<Product3 />} />
            <Route path="/san-pham-4" element={<Product4 />} />
            <Route path="/lich-su" element={<ExamHistory />} />
            <Route path="/xem-lai/:id" element={<ExamReview />} />
          </Routes>
        </main>
        <ScrollToTop />
        <TechBadge />
        <footer className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg mt-auto">
            <div className="container mx-auto px-4 py-8">
              <div className="grid md:grid-cols-4 gap-8 text-white">
                <div>
                  <h3 className="font-bold text-lg mb-3 flex items-center">
                    <i className="fas fa-graduation-cap mr-2"></i>
                    Về Chúng Tôi
                  </h3>
                  <p className="text-sm text-blue-100">
                    Nền tảng học tập thông minh sử dụng AI Gemini 2.0 để hỗ trợ học sinh luyện thi THPT môn Công Nghệ.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-3 flex items-center">
                    <i className="fas fa-link mr-2"></i>
                    Liên Kết
                  </h3>
                  <ul className="space-y-2 text-sm text-blue-100">
                    <li><a href="/#/" className="hover:text-white transition-colors"><i className="fas fa-home mr-1"></i> Trang Chủ</a></li>
                    <li><a href="/#/san-pham-1" className="hover:text-white transition-colors"><i className="fas fa-comments mr-1"></i> Chat AI</a></li>
                    <li><a href="/#/san-pham-2" className="hover:text-white transition-colors"><i className="fas fa-question-circle mr-1"></i> Tạo Câu Hỏi</a></li>
                    <li><a href="/#/lich-su" className="hover:text-white transition-colors"><i className="fas fa-history mr-1"></i> Lịch Sử Đề Thi</a></li>
                    <li><a href="/#/san-pham-3" className="hover:text-white transition-colors"><i className="fas fa-industry mr-1"></i> Đề Thi Công Nghiệp</a></li>
                    <li><a href="/#/san-pham-4" className="hover:text-white transition-colors"><i className="fas fa-tractor mr-1"></i> Đề Thi Nông Nghiệp</a></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-3 flex items-center">
                    <i className="fas fa-envelope mr-2"></i>
                    Liên Hệ
                  </h3>
                  <ul className="space-y-2 text-sm text-blue-100">
                    <li><i className="fas fa-envelope mr-2"></i>longhngn.hnue@gmail.com</li>
                    <li><i className="fas fa-phone mr-2"></i>0896636181</li>
                    <li><i className="fas fa-clock mr-2"></i>8:00 - 22:00 hàng ngày</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-3 flex items-center">
                    <i className="fas fa-robot mr-2"></i>
                    Công Nghệ
                  </h3>
                  <ul className="space-y-2 text-sm text-blue-100">
                    <li><i className="fas fa-check mr-2"></i>Google Gemini 2.0</li>
                    <li><i className="fab fa-react mr-2"></i>React 19 + TypeScript</li>
                    <li><i className="fas fa-bolt mr-2"></i>Vite + Tailwind CSS</li>
                    <li><i className="fas fa-book mr-2"></i>SGK Cánh Diều</li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-blue-400 mt-6 pt-6 text-center">
                <p className="text-sm text-white">
                  <i className="fas fa-graduation-cap mr-2"></i>
                  Ôn Thi THPT Quốc Gia - Công Nghệ với AI | Chương trình GDPT 2018
                </p>
                <p className="text-xs text-blue-100 mt-2">
                  &copy; 2025 - Nền tảng học tập thông minh cùng AI. Phát triển với ❤️ bởi AI Education Team
                </p>
                <div className="flex justify-center gap-4 mt-3">
                  <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-100 hover:text-white transition-colors">
                    <i className="fas fa-robot text-xl"></i>
                  </a>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-blue-100 hover:text-white transition-colors">
                    <i className="fab fa-github text-xl"></i>
                  </a>
                </div>
              </div>
            </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
