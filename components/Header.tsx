import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const activeLinkClass = "bg-blue-600 text-white";
  const inactiveLinkClass = "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-3 sm:mb-0">
            <i className="fas fa-graduation-cap text-3xl text-white mr-3"></i>
            <div>
              <h1 className="text-xl font-bold text-white">Ôn Thi THPT Quốc Gia - Công Nghệ</h1>
              <p className="text-xs text-blue-100">SGK Kết nối tri thức với cuộc sống & Cánh Diều</p>
            </div>
        </div>
        <nav className="flex items-center space-x-2 sm:space-x-3">
          <NavLink
            to="/"
            className={({ isActive }) => `${isActive ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-700'} px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
          >
            <i className="fas fa-home mr-1"></i> Trang Chủ
          </NavLink>
          <NavLink
            to="/san-pham-1"
            className={({ isActive }) => `${isActive ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-700'} px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
          >
            <i className="fas fa-comments mr-1"></i> Chat AI
          </NavLink>
          <NavLink
            to="/san-pham-2"
            className={({ isActive }) => `${isActive ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-700'} px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
          >
            <i className="fas fa-question-circle mr-1"></i> Câu hỏi
          </NavLink>
          <NavLink
            to="/san-pham-3"
            className={({ isActive }) => `${isActive ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-700'} px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
          >
            <i className="fas fa-industry mr-1"></i> Công nghiệp
          </NavLink>
          <NavLink
            to="/san-pham-4"
            className={({ isActive }) => `${isActive ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-700'} px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
          >
            <i className="fas fa-tractor mr-1"></i> Nông nghiệp
          </NavLink>
          <NavLink
            to="/lich-su"
            className={({ isActive }) => `${isActive ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-700'} px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
          >
            <i className="fas fa-history mr-1"></i> Lịch sử
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;