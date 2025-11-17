
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Product1 from './components/Product1';
import Product2 from './components/Product2';
import Product3 from './components/Product3';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col font-sans text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/san-pham-1" element={<Product1 />} />
            <Route path="/san-pham-2" element={<Product2 />} />
            <Route path="/san-pham-3" element={<Product3 />} />
          </Routes>
        </main>
        <footer className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg mt-auto">
            <div className="container mx-auto px-4 py-4 text-center text-white">
                <p className="text-sm">
                  <i className="fas fa-graduation-cap mr-2"></i>
                  Ôn Thi THPT Quốc Gia - Công Nghệ với AI | SGK Cánh Diều | Chương trình GDPT 2018
                </p>
                <p className="text-xs text-blue-100 mt-1">
                  &copy; 2025 - Nền tảng học tập thông minh cùng AI
                </p>
            </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
