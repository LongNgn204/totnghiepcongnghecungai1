// Initialize sync manager in App component
import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Product1 from './components/Product1';
import Product2 from './components/Product2';
import Product3 from './components/Product3'; // Full version restored
import Product4 from './components/Product4';
import ErrorBoundary from './components/ErrorBoundary';
import Product5 from './components/Product5';
import Product6 from './components/Product6';
import Product7 from './components/Product7';
import Product8 from './components/Product8';
import Dashboard from './components/Dashboard';
import Flashcards from './components/Flashcards';
import Leaderboard from './components/Leaderboard';
import ExamHistory from './components/ExamHistory';
import Profile from './components/Profile';
import PWASettings from './components/PWASettings';
import ProtectedRoute from './components/ProtectedRoute';
import syncManager from './utils/syncManager';
import {
  Facebook,
  Youtube,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Cloud,
  CloudOff,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';

const App: React.FC = () => {
  // Firebase authentication removed - not needed for this educational app
  const navigate = useNavigate();
  const location = useLocation();
  const [syncStatus, setSyncStatus] = React.useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSyncTime, setLastSyncTime] = React.useState<number>(0);
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Initialize sync manager
  React.useEffect(() => {
    // Load last sync time
    setLastSyncTime(syncManager.getLastSyncTime());

    // Listen for sync events
    const handleSyncComplete = (e: CustomEvent) => {
      setSyncStatus('success');
      setLastSyncTime(e.detail.lastSyncTime);
      setTimeout(() => setSyncStatus('idle'), 3000);
    };

    const handleSyncError = () => {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    };

    window.addEventListener('sync-completed', handleSyncComplete as EventListener);
    window.addEventListener('sync-error', handleSyncError);

    // Listen for online/offline
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial sync if online
    if (navigator.onLine && syncManager.isEnabled()) {
      setTimeout(() => {
        setSyncStatus('syncing');
        syncManager.syncAll().then(() => {
          setSyncStatus('success');
          setTimeout(() => setSyncStatus('idle'), 3000);
        }).catch(() => {
          setSyncStatus('error');
          setTimeout(() => setSyncStatus('idle'), 3000);
        });
      }, 1000);
    }

    return () => {
      window.removeEventListener('sync-completed', handleSyncComplete as EventListener);
      window.removeEventListener('sync-error', handleSyncError);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleManualSync = () => {
    if (syncStatus === 'syncing') return;

    setSyncStatus('syncing');
    syncManager.syncAll().then(() => {
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }).catch(() => {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    });
  };

  const formatLastSync = () => {
    if (!lastSyncTime) return 'Chưa đồng bộ';

    const diff = Date.now() - lastSyncTime;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    return new Date(lastSyncTime).toLocaleDateString('vi-VN');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Disclaimer Banner */}
        <div className="bg-blue-50 border-b border-blue-100 py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-start gap-3">
            <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="text-sm text-blue-900 font-medium">
                Hệ thống ôn thi THPT môn Công nghệ - Phiên bản thử nghiệm
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Nội dung được hỗ trợ bởi AI Gemini 2.5 Pro. Vui lòng đối chiếu với SGK để đảm bảo độ chính xác tuyệt đối.
              </p>
            </div>

            {/* Sync Status */}
            <div className="flex items-center gap-3">
              {isOnline ? (
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <Cloud size={16} />
                  <span className="hidden sm:inline">Online</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CloudOff size={16} />
                  <span className="hidden sm:inline">Offline</span>
                </div>
              )}

              <button
                onClick={handleManualSync}
                disabled={!isOnline || syncStatus === 'syncing'}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${syncStatus === 'syncing'
                  ? 'bg-blue-100 text-blue-600 cursor-wait'
                  : syncStatus === 'success'
                    ? 'bg-green-100 text-green-600'
                    : syncStatus === 'error'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  } disabled:opacity-50`}
                title={`Lần cuối: ${formatLastSync()}`}
              >
                <RefreshCw size={14} className={syncStatus === 'syncing' ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">
                  {syncStatus === 'syncing' ? 'Đang đồng bộ...' :
                    syncStatus === 'success' ? 'Đã đồng bộ' :
                      syncStatus === 'error' ? 'Lỗi sync' :
                        'Đồng bộ'}
                </span>
              </button>
            </div>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/san-pham-1" element={<Product1 />} />
          <Route path="/san-pham-2" element={<Product2 />} />
          <Route path="/san-pham-3" element={
            <ErrorBoundary componentName="Product3">
              <Product3 />
            </ErrorBoundary>
          } />
          <Route path="/san-pham-4" element={<Product4 />} />
          <Route path="/san-pham-5" element={<Product5 />} />
          <Route path="/product6" element={<ProtectedRoute><Product6 /></ProtectedRoute>} />
          <Route path="/product7" element={<ProtectedRoute><Product7 /></ProtectedRoute>} />
          <Route path="/product8" element={<ProtectedRoute><Product8 /></ProtectedRoute>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/history" element={<ExamHistory />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<PWASettings />} />
        </Routes>
      </main>

      {/* Professional Footer */}
      <footer className="bg-white border-t border-gray-200 pt-12 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* About */}
            <div className="col-span-1 md:col-span-1">
              <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <span className="bg-blue-600 text-white p-1 rounded">OT</span>
                Về Chúng Tôi
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                <span className="text-blue-600 font-bold">Ôn Thi THPT QG môn Công Nghệ</span> - Nền tảng học tập thông minh sử dụng <span className="text-blue-600 font-medium">Gemini 2.5 Pro</span>.
              </p>
              <p className="text-gray-500 text-xs mb-4">
                Dựa trên 2 bộ sách <span className="font-semibold">KẾT NỐI TRI THỨC VỚI CUỘC SỐNG</span> & <span className="font-semibold">CÁNH DIỀU</span>
              </p>
              <div className="flex gap-3">
                <a href="#" className="p-2 bg-gray-100 rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                  <Facebook size={18} />
                </a>
                <a href="#" className="p-2 bg-gray-100 rounded-full text-red-600 hover:bg-red-600 hover:text-white transition-all">
                  <Youtube size={18} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-4">Liên Kết</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">Trang chủ</Link></li>
                <li><Link to="/san-pham-1" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">Chat AI</Link></li>
                <li><Link to="/san-pham-2" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">Tạo đề</Link></li>
                <li><Link to="/flashcards" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">Flashcards</Link></li>
              </ul>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-4">Tính Năng</h3>
              <ul className="space-y-2">
                <li className="text-gray-500 text-sm flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  Tạo đề thi tự động
                </li>
                <li className="text-gray-500 text-sm flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  Chat với AI
                </li>
                <li className="text-gray-500 text-sm flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  Flashcards thông minh
                </li>
                <li className="text-gray-500 text-sm flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  Theo dõi tiến độ
                </li>
                <li className="text-gray-500 text-sm flex items-center gap-2">
                  <Cloud size={16} className="text-blue-500" />
                  Đồng bộ đa thiết bị
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-4">Liên Hệ</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-gray-500 text-sm">
                  <Mail size={16} className="mt-1 text-blue-600 flex-shrink-0" />
                  <span>stu725114073@hnue.edu.vn</span>
                </li>
                <li className="flex items-start gap-2 text-gray-500 text-sm">
                  <Phone size={16} className="mt-1 text-blue-600 flex-shrink-0" />
                  <span>0896636181</span>
                </li>
                <li className="flex items-start gap-2 text-gray-500 text-sm">
                  <Clock size={16} className="mt-1 text-blue-600 flex-shrink-0" />
                  <span>T2-T7: 8:00 - 21:00</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-500 text-sm">
              © 2025 <span className="text-blue-600 font-medium">Ôn Thi THPT QG môn Công Nghệ</span>. Được hỗ trợ bởi <span className="text-blue-600 font-medium">Google Gemini 2.5 Pro</span>.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
