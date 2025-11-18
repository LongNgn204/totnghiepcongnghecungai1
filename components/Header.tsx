import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-2xl sticky top-0 z-50 border-b-2 border-white/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 group-hover:scale-110 transition-transform">
              <i className="fas fa-graduation-cap text-3xl text-white"></i>
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-white">Ôn Thi THPT - Công Nghệ</h1>
              <p className="text-xs text-blue-100">
                <i className="fas fa-book-open text-[8px]"></i> SGK KNTT & Cánh Diều
              </p>
            </div>
          </NavLink>

          <nav className="hidden lg:flex items-center gap-2">
            <NavLink to="/dashboard" className={({ isActive }) => `${isActive ? 'bg-white text-blue-600 shadow-lg' : 'text-white hover:bg-white/20'} px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2`}>
              <i className="fas fa-home"></i> Bảng điều khiển
            </NavLink>
            
            <NavLink to="/san-pham-1" className={({ isActive }) => `${isActive ? 'bg-white text-purple-600 shadow-lg' : 'text-white hover:bg-white/20'} px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2`}>
              <i className="fas fa-comments"></i> Chat AI
            </NavLink>
            
            <NavLink to="/san-pham-2" className={({ isActive }) => `${isActive ? 'bg-white text-green-600 shadow-lg' : 'text-white hover:bg-white/20'} px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2`}>
              <i className="fas fa-question-circle"></i> Tạo đề
            </NavLink>
            
            <NavLink to="/san-pham-3" className={({ isActive }) => `${isActive ? 'bg-white text-blue-600 shadow-lg' : 'text-white hover:bg-white/20'} px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2`}>
              <i className="fas fa-industry"></i> Công nghiệp
            </NavLink>
            
            <NavLink to="/san-pham-4" className={({ isActive }) => `${isActive ? 'bg-white text-green-600 shadow-lg' : 'text-white hover:bg-white/20'} px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2`}>
              <i className="fas fa-tractor"></i> Nông nghiệp
            </NavLink>
            
            <NavLink to="/san-pham-5" className={({ isActive }) => `${isActive ? 'bg-white text-pink-600 shadow-lg' : 'text-white hover:bg-white/20'} px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2`}>
              <i className="fas fa-layer-group"></i> Flashcards
            </NavLink>
            
            <NavLink to="/san-pham-6" className={({ isActive }) => `${isActive ? 'bg-white text-indigo-600 shadow-lg' : 'text-white hover:bg-white/20'} px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2`}>
              <i className="fas fa-chart-line"></i> Dashboard
            </NavLink>
            
            <NavLink to="/san-pham-7" className={({ isActive }) => `${isActive ? 'bg-white text-purple-600 shadow-lg' : 'text-white hover:bg-white/20'} px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2`}>
              <i className="fas fa-users"></i> Nhóm học
            </NavLink>
            
            <NavLink to="/bang-xep-hang" className={({ isActive }) => `${isActive ? 'bg-white text-yellow-600 shadow-lg' : 'text-white hover:bg-white/20'} px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2`}>
              <i className="fas fa-trophy"></i> BXH
            </NavLink>
            
            <NavLink to="/lich-su" className={({ isActive }) => `${isActive ? 'bg-white text-orange-600 shadow-lg' : 'text-white hover:bg-white/20'} px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2`}>
              <i className="fas fa-history"></i> Lịch sử
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-white hover:bg-white/20 p-2 rounded-lg transition-all">
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
            
            {!isAuthenticated ? (
              // Login button when not authenticated
              <NavLink 
                to="/login" 
                className="hidden lg:flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-5 py-2 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
              >
                <i className="fas fa-sign-in-alt"></i>
                Đăng nhập
              </NavLink>
            ) : (
              // User menu when authenticated
              user && (
                <div className="hidden lg:block relative" ref={userMenuRef}>
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-xl transition-all">
                    <img src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}&background=random`} alt={user.displayName} className="w-8 h-8 rounded-full border-2 border-white" />
                    <span className="text-white font-semibold text-sm">{user.displayName}</span>
                    <i className={`fas fa-chevron-down text-white text-xs transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}></i>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl overflow-hidden z-50">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-3">
                        <p className="text-white font-semibold">{user.displayName}</p>
                        <p className="text-white/80 text-sm">{user.email}</p>
                      </div>
                      <div className="py-2">
                        <NavLink to="/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition" onClick={() => setUserMenuOpen(false)}>
                          <i className="fas fa-user text-blue-500"></i>
                          <span className="text-gray-700">Hồ sơ cá nhân</span>
                        </NavLink>
                        <NavLink to="/admin-dashboard" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition" onClick={() => setUserMenuOpen(false)}>
                          <i className="fas fa-shield-alt text-red-500"></i>
                          <span className="text-gray-700">Admin Dashboard</span>
                        </NavLink>
                        <button onClick={() => { logout(); setUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition text-left">
                          <i className="fas fa-sign-out-alt text-red-500"></i>
                          <span className="text-red-600 font-semibold">Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-2">
            {!isAuthenticated ? (
              // Login button for mobile when not authenticated
              <NavLink 
                to="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-white text-blue-600 rounded-lg transition-all font-semibold shadow-lg justify-center"
              >
                <i className="fas fa-sign-in-alt"></i>
                <span>Đăng nhập</span>
              </NavLink>
            ) : (
              // User info card when authenticated
              user && (
                <div className="bg-white/10 rounded-lg p-3 mb-2 flex items-center gap-3">
                  <img src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}&background=random`} alt={user.displayName} className="w-10 h-10 rounded-full border-2 border-white" />
                  <div>
                    <p className="text-white font-semibold text-sm">{user.displayName}</p>
                    <p className="text-white/70 text-xs">{user.email}</p>
                  </div>
                </div>
              )
            )}
            <MobileNavLink to="/dashboard" icon="fa-home" onClick={() => setMobileMenuOpen(false)}>Bảng điều khiển</MobileNavLink>
            <MobileNavLink to="/san-pham-1" icon="fa-comments" onClick={() => setMobileMenuOpen(false)}>Chat AI</MobileNavLink>
            <MobileNavLink to="/san-pham-2" icon="fa-question-circle" onClick={() => setMobileMenuOpen(false)}>Tạo đề</MobileNavLink>
            <MobileNavLink to="/san-pham-3" icon="fa-industry" onClick={() => setMobileMenuOpen(false)}>Công nghiệp</MobileNavLink>
            <MobileNavLink to="/san-pham-4" icon="fa-tractor" onClick={() => setMobileMenuOpen(false)}>Nông nghiệp</MobileNavLink>
            <MobileNavLink to="/san-pham-5" icon="fa-layer-group" onClick={() => setMobileMenuOpen(false)}>Flashcards</MobileNavLink>
            <MobileNavLink to="/san-pham-6" icon="fa-chart-line" onClick={() => setMobileMenuOpen(false)}>Dashboard</MobileNavLink>
            <MobileNavLink to="/san-pham-7" icon="fa-users" onClick={() => setMobileMenuOpen(false)}>Nhóm học</MobileNavLink>
            <MobileNavLink to="/bang-xep-hang" icon="fa-trophy" onClick={() => setMobileMenuOpen(false)}>BXH</MobileNavLink>
            <MobileNavLink to="/lich-su" icon="fa-history" onClick={() => setMobileMenuOpen(false)}>Lịch sử</MobileNavLink>
            <MobileNavLink to="/admin-dashboard" icon="fa-shield-alt" onClick={() => setMobileMenuOpen(false)}>Admin Dashboard</MobileNavLink>
            {isAuthenticated && user && (
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-lg transition-all">
                <i className="fas fa-sign-out-alt"></i>
                <span className="font-semibold">Đăng xuất</span>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

function MobileNavLink({ to, icon, children, onClick }: { to: string; icon: string; children: React.ReactNode; onClick: () => void; }) {
  return (
    <NavLink to={to} onClick={onClick} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-white text-blue-600 shadow-lg font-semibold' : 'text-white hover:bg-white/20'}`}>
      <i className={`fas ${icon} w-5`}></i>
      <span>{children}</span>
    </NavLink>
  );
}

export default Header;
