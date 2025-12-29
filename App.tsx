// Initialize sync manager in App component
import React, { Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import SyncStatus from './components/SyncStatus';
import SyncToastListener from './components/SyncToastListener';
import NetworkStatus from './components/NetworkStatus';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import UpdateNotification from './components/UpdateNotification';
import syncManager from './utils/syncManager';
import {
  Facebook,
  Youtube,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  Info,
  Cloud,
  CloudOff,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Lazy load components
const Home = React.lazy(() => import('./components/Home'));
const Product1 = React.lazy(() => import('./components/Product1'));
const Product2 = React.lazy(() => import('./components/Product2'));
const Product3 = React.lazy(() => import('./components/Product3'));
const Product4 = React.lazy(() => import('./components/Product4'));
const Product5 = React.lazy(() => import('./components/Product5'));
const Product6 = React.lazy(() => import('./components/Product6'));
const Product7 = React.lazy(() => import('./components/Product7'));
const Product8 = React.lazy(() => import('./components/Product8'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const Flashcards = React.lazy(() => import('./components/Flashcards'));
const Leaderboard = React.lazy(() => import('./components/Leaderboard'));
const ExamHistory = React.lazy(() => import('./components/ExamHistory'));
const Profile = React.lazy(() => import('./components/Profile'));
const PWASettings = React.lazy(() => import('./components/PWASettings'));
const CodingLab = React.lazy(() => import('./components/CodingLab'));
const PrivacyPolicy = React.lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('./components/TermsOfService'));
const NotFound = React.lazy(() => import('./components/NotFound'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      <p className="text-gray-500 font-medium">Đang tải dữ liệu...</p>
    </div>
  </div>
);

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

  // Keyboard shortcuts (Ctrl/Cmd+K -> focus chat search)
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        window.dispatchEvent(new Event('focus-chat-search'));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

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
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 bg-blue-600 text-white px-3 py-2 rounded">Bỏ qua tới nội dung chính</a>
        <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
        <UpdateNotification />
        <SyncToastListener />
        <Header />

        {/* Live region for status updates */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {syncStatus === 'syncing' && 'Đang đồng bộ dữ liệu.'}
          {syncStatus === 'success' && 'Đồng bộ thành công.'}
          {syncStatus === 'error' && 'Đồng bộ thất bại.'}
        </div>

        <main id="main-content" className="flex-1 pt-16" role="main">
          {/* Disclaimer Banner */}
          {/* Disclaimer Banner Removed */}

          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/san-pham-1" element={<ProtectedRoute><ErrorBoundary componentName="Product1"><Product1 /></ErrorBoundary></ProtectedRoute>} />
              <Route path="/san-pham-2" element={<ProtectedRoute><ErrorBoundary componentName="Product2"><Product2 /></ErrorBoundary></ProtectedRoute>} />
              <Route path="/san-pham-3" element={
                <ProtectedRoute>
                  <ErrorBoundary componentName="Product3">
                    <Product3 />
                  </ErrorBoundary>
                </ProtectedRoute>
              } />
              <Route path="/san-pham-4" element={<ProtectedRoute><ErrorBoundary componentName="Product4"><Product4 /></ErrorBoundary></ProtectedRoute>} />
              <Route path="/san-pham-5" element={<ProtectedRoute><ErrorBoundary componentName="Product5"><Product5 /></ErrorBoundary></ProtectedRoute>} />
              <Route path="/product6" element={<ProtectedRoute><ErrorBoundary componentName="Product6"><Product6 /></ErrorBoundary></ProtectedRoute>} />
              <Route path="/product7" element={<ProtectedRoute><ErrorBoundary componentName="Product7"><Product7 /></ErrorBoundary></ProtectedRoute>} />
              <Route path="/product8" element={<ProtectedRoute><ErrorBoundary componentName="Product8"><Product8 /></ErrorBoundary></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><ErrorBoundary componentName="Dashboard"><Dashboard /></ErrorBoundary></ProtectedRoute>} />
              <Route path="/flashcards" element={<ProtectedRoute><ErrorBoundary componentName="Flashcards"><Flashcards /></ErrorBoundary></ProtectedRoute>} />
              <Route path="/leaderboard" element={<ProtectedRoute><ErrorBoundary componentName="Leaderboard"><Leaderboard /></ErrorBoundary></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><ErrorBoundary componentName="ExamHistory"><ExamHistory /></ErrorBoundary></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ErrorBoundary componentName="Profile"><Profile /></ErrorBoundary></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><ErrorBoundary componentName="PWASettings"><PWASettings /></ErrorBoundary></ProtectedRoute>} />
              <Route path="/home/coding-lab" element={<ProtectedRoute><ErrorBoundary componentName="CodingLab"><CodingLab /></ErrorBoundary></ProtectedRoute>} />

              {/* Public Pages */}
              <Route path="/privacy" element={<ErrorBoundary componentName="PrivacyPolicy"><PrivacyPolicy /></ErrorBoundary>} />
              <Route path="/terms" element={<ErrorBoundary componentName="TermsOfService"><TermsOfService /></ErrorBoundary>} />

              {/* 404 */}
              <Route path="*" element={<ErrorBoundary componentName="NotFound"><NotFound /></ErrorBoundary>} />
            </Routes>
          </Suspense>
        </main>

        <SyncStatus />

        {/* Professional Footer */}
        {/* Professional Footer - Dark Theme */}
        <footer className="bg-[#0f172a] border-t border-slate-800 pt-16 pb-8 text-slate-300">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              {/* About */}
              <div className="col-span-1 md:col-span-1 space-y-6">
                <h3 className="font-bold text-white text-xl flex items-center gap-2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded-lg text-sm">OT</span>
                  Về Chúng Tôi
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  <span className="text-blue-400 font-bold">STEM Vietnam</span> - Nền tảng học tập thông minh tiên phong sử dụng <span className="text-purple-400 font-medium">Gemini 2.5 Pro</span>.
                </p>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <p className="text-xs text-slate-400">
                    Dựa trên 2 bộ sách chuẩn: <br />
                    <span className="text-white font-semibold">• Kết nối tri thức</span> <br />
                    <span className="text-white font-semibold">• Cánh Diều</span>
                  </p>
                </div>
                <div className="flex gap-4">
                  <a href="#" className="p-2 bg-slate-800 rounded-full text-blue-400 hover:bg-blue-600 hover:text-white transition-all border border-slate-700 hover:border-blue-500">
                    <Facebook size={20} />
                  </a>
                  <a href="#" className="p-2 bg-slate-800 rounded-full text-red-400 hover:bg-red-600 hover:text-white transition-all border border-slate-700 hover:border-red-500">
                    <Youtube size={20} />
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="font-bold text-white text-lg mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                  Liên Kết
                </h3>
                <ul className="space-y-3">
                  <li><Link to="/" className="text-slate-400 hover:text-blue-400 transition-colors text-sm flex items-center gap-2 hover:translate-x-1 duration-200">Trang chủ</Link></li>
                  <li><Link to="/san-pham-1" className="text-slate-400 hover:text-blue-400 transition-colors text-sm flex items-center gap-2 hover:translate-x-1 duration-200">Chat AI</Link></li>
                  <li><Link to="/san-pham-2" className="text-slate-400 hover:text-blue-400 transition-colors text-sm flex items-center gap-2 hover:translate-x-1 duration-200">Tạo đề thi</Link></li>
                  <li><Link to="/flashcards" className="text-slate-400 hover:text-blue-400 transition-colors text-sm flex items-center gap-2 hover:translate-x-1 duration-200">Flashcards</Link></li>
                </ul>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-bold text-white text-lg mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                  Tính Năng
                </h3>
                <ul className="space-y-3">
                  <li className="text-slate-400 text-sm flex items-center gap-3">
                    <CheckCircle size={16} className="text-green-400" />
                    Tạo đề thi tự động
                  </li>
                  <li className="text-slate-400 text-sm flex items-center gap-3">
                    <CheckCircle size={16} className="text-green-400" />
                    Chat với AI 24/7
                  </li>
                  <li className="text-slate-400 text-sm flex items-center gap-3">
                    <CheckCircle size={16} className="text-green-400" />
                    Flashcards thông minh
                  </li>
                  <li className="text-slate-400 text-sm flex items-center gap-3">
                    <CheckCircle size={16} className="text-green-400" />
                    Theo dõi tiến độ
                  </li>
                  <li className="text-slate-400 text-sm flex items-center gap-3">
                    <Cloud size={16} className="text-blue-400" />
                    Đồng bộ đa thiết bị
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="font-bold text-white text-lg mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                  Liên Hệ
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-slate-400 text-sm group">
                    <div className="p-2 bg-slate-800 rounded-lg text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                      <Mail size={16} />
                    </div>
                    <span className="mt-1">stu725114073@hnue.edu.vn</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-400 text-sm group">
                    <div className="p-2 bg-slate-800 rounded-lg text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                      <Phone size={16} />
                    </div>
                    <span className="mt-1">0896636181</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-400 text-sm group">
                    <div className="p-2 bg-slate-800 rounded-lg text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                      <Clock size={16} />
                    </div>
                    <span className="mt-1">T2-T7: 8:00 - 21:00</span>
                  </li>
                  <li className="pt-4 flex gap-4 border-t border-slate-800 mt-4">
                    <Link to="/privacy" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">Chính sách bảo mật</Link>
                    <Link to="/terms" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">Điều khoản</Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-slate-800 text-center">
              <p className="text-slate-500 text-sm">
                © 2025 <span className="text-blue-400 font-medium">STEM Vietnam</span>. Powered by <span className="text-purple-400 font-medium">Google Gemini 2.5 Pro</span>.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
