import React, { useState, useEffect } from 'react';
import {
  getPWAStatus,
  registerServiceWorker,
  setupInstallPrompt,
  showInstallPrompt,
  addOnlineListener,
  clearAllCaches,
  getCacheSize,
  requestNotificationPermission,
  showNotification,
  PWAStatus,
} from '../utils/pwaUtils';
import syncManager from '../utils/syncManager';
import { Cloud, CloudOff, RefreshCw, Check } from 'lucide-react';

const PWASettings: React.FC = () => {
  const [pwaStatus, setPwaStatus] = useState<PWAStatus>(getPWAStatus());
  const [canInstall, setCanInstall] = useState(false);
  const [cacheSize, setCacheSize] = useState(0);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Register service worker
    registerServiceWorker();

    // Setup install prompt
    setupInstallPrompt((canInstall) => {
      setCanInstall(canInstall);
    });

    // Online/Offline listener
    const removeListener = addOnlineListener((isOnline) => {
      setPwaStatus((prev) => ({ ...prev, isOnline }));
    });

    // Load cache size
    updateCacheSize();

    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    return removeListener;
  }, []);

  const updateCacheSize = async () => {
    const size = await getCacheSize();
    setCacheSize(size);
  };

  const handleInstall = async () => {
    const installed = await showInstallPrompt();
    if (installed) {
      setCanInstall(false);
      setPwaStatus((prev) => ({ ...prev, isInstalled: true }));
    }
  };

  const handleClearCache = async () => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả dữ liệu đã lưu?')) {
      await clearAllCaches();
      await updateCacheSize();
      alert('Đã xóa cache thành công!');
    }
  };

  const handleRequestNotification = async () => {
    const permission = await requestNotificationPermission();
    setNotificationPermission(permission);

    if (permission === 'granted') {
      await showNotification('Thông báo đã được bật!', {
        body: 'Bạn sẽ nhận được thông báo về hoạt động học tập',
        icon: '/icons/icon-192x192.png',
      });
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="glass-panel border-0 p-8 text-white relative overflow-hidden rounded-3xl shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 opacity-90"></div>
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 scale-150">
          <span className="text-9xl">📱</span>
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 flex items-center justify-center gap-3 tracking-tight">
            <span className="text-4xl">📱</span>
            Cài đặt PWA
          </h2>
          <p className="text-center text-white/90 text-lg max-w-2xl mx-auto">
            Progressive Web App & Offline Mode - Trải nghiệm ứng dụng mượt mà mọi lúc mọi nơi
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Online Status */}
          <div className="glass-card p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Trạng thái kết nối</h2>
              <div
                className={`w-4 h-4 rounded-full ${pwaStatus.isOnline ? 'bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                  }`}
              ></div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <span className="text-gray-600 dark:text-gray-400">Kết nối Internet</span>
                <span className={`font-bold ${pwaStatus.isOnline ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {pwaStatus.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <span className="text-gray-600 dark:text-gray-400">Service Worker</span>
                <span className="font-bold text-primary-600 dark:text-primary-400">
                  {('serviceWorker' in navigator) ? 'Hỗ trợ' : 'Không hỗ trợ'}
                </span>
              </div>
              {!pwaStatus.isOnline && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30 rounded-xl">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300 flex items-center">
                    <span className="mr-2">⚠️</span>
                    Đang offline. Một số tính năng có thể bị giới hạn.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Install Status */}
          <div className="glass-card p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Cài đặt ứng dụng</h2>
              <span className={`text-2xl ${pwaStatus.isInstalled ? 'text-green-500' : 'text-gray-400'}`}>
                📥
              </span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <span className="text-gray-600 dark:text-gray-400">Đã cài đặt</span>
                <span className={`font-bold ${pwaStatus.isInstalled ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                  {pwaStatus.isInstalled ? 'Có' : 'Chưa'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <span className="text-gray-600 dark:text-gray-400">Chế độ Standalone</span>
                <span className={`font-bold ${pwaStatus.isStandalone ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                  {pwaStatus.isStandalone ? 'Có' : 'Không'}
                </span>
              </div>
              {canInstall && !pwaStatus.isInstalled && (
                <button
                  onClick={handleInstall}
                  className="w-full mt-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center"
                >
                  <span className="mr-2">📥</span>
                  Cài đặt ứng dụng
                </button>
              )}
              {pwaStatus.isInstalled && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-xl">
                  <p className="text-sm text-green-800 dark:text-green-300 flex items-center">
                    <span className="mr-2">✅</span>
                    Ứng dụng đã được cài đặt thành công!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cache Management */}
        <div className="glass-card p-6 hover:shadow-lg transition-all">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="mr-2 text-primary-500">💾</span>
            Quản lý dữ liệu offline
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
              <div>
                <p className="font-bold text-gray-900 dark:text-white">Dung lượng đã dùng</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Dữ liệu được lưu trữ cục bộ</p>
              </div>
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">{formatBytes(cacheSize)}</span>
            </div>

            <button
              onClick={handleClearCache}
              className="w-full bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-all hover:shadow-md hover:-translate-y-0.5 flex items-center justify-center"
            >
              <span className="mr-2">🗑️</span>
              Xóa tất cả dữ liệu đã lưu
            </button>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-xl">
              <p className="text-sm text-blue-800 dark:text-blue-300 flex items-center">
                <span className="mr-2">ℹ️</span>
                Dữ liệu offline giúp bạn sử dụng ứng dụng khi không có Internet.
                Bao gồm: Bài thi, Flashcards, Lịch sử chat.
              </p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-card p-6 hover:shadow-lg transition-all">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="mr-2 text-purple-500">🔔</span>
            Thông báo
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
              <div>
                <p className="font-bold text-gray-900 dark:text-white">Quyền thông báo</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Nhận nhắc nhở học tập</p>
              </div>
              <span
                className={`px-3 py-1 rounded-lg font-bold text-sm ${notificationPermission === 'granted'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : notificationPermission === 'denied'
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
              >
                {notificationPermission === 'granted'
                  ? 'Đã bật'
                  : notificationPermission === 'denied'
                    ? 'Đã chặn'
                    : 'Chưa bật'}
              </span>
            </div>

            {notificationPermission !== 'granted' && (
              <button
                onClick={handleRequestNotification}
                disabled={notificationPermission === 'denied'}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <span className="mr-2">🔔</span>
                {notificationPermission === 'denied' ? 'Đã bị chặn' : 'Bật thông báo'}
              </button>
            )}

            {notificationPermission === 'denied' && (
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/30 rounded-xl">
                <p className="text-sm text-orange-800 dark:text-orange-300 flex items-center">
                  <span className="mr-2">⚠️</span>
                  Thông báo đã bị chặn. Vui lòng bật lại trong cài đặt trình duyệt.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Cloud Sync Settings */}
        <div className="glass-card p-6 hover:shadow-lg transition-all">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Cloud className="w-6 h-6 text-primary-500 mr-2" />
            Đồng bộ Cloud
          </h2>
          <div className="space-y-4">
            {/* Enable/Disable Sync */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
              <div>
                <p className="font-bold text-gray-900 dark:text-white">Bật đồng bộ tự động</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tự động đồng bộ dữ liệu với cloud</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={syncManager.isEnabled()}
                  onChange={(e) => {
                    syncManager.saveConfig({ enabled: e.target.checked });
                    setPwaStatus({ ...pwaStatus }); // Force re-render
                  }}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            {/* Sync Interval */}
            {syncManager.isEnabled() && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-xl">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Tần suất đồng bộ tự động
                </label>
                <select
                  value={syncManager.getConfig().syncInterval / 60000}
                  onChange={(e) => {
                    syncManager.saveConfig({ syncInterval: parseInt(e.target.value) * 60000 });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none"
                >
                  <option value="1">Mỗi 1 phút</option>
                  <option value="5">Mỗi 5 phút</option>
                  <option value="10">Mỗi 10 phút</option>
                  <option value="30">Mỗi 30 phút</option>
                  <option value="60">Mỗi 1 giờ</option>
                </select>
              </div>
            )}

            {/* Manual Sync Button */}
            <button
              onClick={() => {
                const btn = document.getElementById('manual-sync-btn');
                if (btn) btn.classList.add('animate-spin');

                syncManager.syncAll().then(() => {
                  if (btn) btn.classList.remove('animate-spin');
                  alert('Đồng bộ thành công!');
                }).catch((error) => {
                  if (btn) btn.classList.remove('animate-spin');
                  alert('Lỗi đồng bộ: ' + error.message);
                });
              }}
              disabled={!pwaStatus.isOnline || !syncManager.isEnabled()}
              className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <RefreshCw id="manual-sync-btn" className="w-5 h-5" />
              Đồng bộ ngay
            </button>

            {/* Last Sync Time */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Lần đồng bộ cuối:</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {(() => {
                    const lastSync = syncManager.getLastSyncTime();
                    if (!lastSync) return 'Chưa đồng bộ';

                    const diff = Date.now() - lastSync;
                    const minutes = Math.floor(diff / 60000);
                    const hours = Math.floor(minutes / 60);

                    if (minutes < 1) return 'Vừa xong';
                    if (minutes < 60) return `${minutes} phút trước`;
                    if (hours < 24) return `${hours} giờ trước`;
                    return new Date(lastSync).toLocaleDateString('vi-VN');
                  })()}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-xl">
              <p className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                <Cloud className="w-4 h-4 mt-0.5" />
                <span>
                  Đồng bộ cloud lưu trữ an toàn dữ liệu của bạn (Bài thi, Flashcards, Chat) lên server.
                  Bạn có thể truy cập từ nhiều thiết bị khác nhau.
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="glass-card p-6 hover:shadow-lg transition-all">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="mr-2 text-yellow-500">⭐</span>
            Tính năng PWA
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-200 dark:hover:border-primary-800 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl text-blue-500">🚀</span>
                <h3 className="font-bold text-gray-900 dark:text-white">Tải nhanh</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ứng dụng tải và chạy cực nhanh nhờ cache thông minh
              </p>
            </div>

            <div className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-200 dark:hover:border-green-800 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl text-green-500">📶</span>
                <h3 className="font-bold text-gray-900 dark:text-white">Offline Mode</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tiếp tục học tập ngay cả khi mất kết nối Internet
              </p>
            </div>

            <div className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-purple-200 dark:hover:border-purple-800 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl text-purple-500">📱</span>
                <h3 className="font-bold text-gray-900 dark:text-white">Giống App</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Trải nghiệm mượt mà như ứng dụng native trên điện thoại
              </p>
            </div>

            <div className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-orange-200 dark:hover:border-orange-800 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl text-orange-500">🔄</span>
                <h3 className="font-bold text-gray-900 dark:text-white">Tự động đồng bộ</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Dữ liệu được đồng bộ tự động khi có kết nối
              </p>
            </div>
          </div>
        </div>

        {/* How to Install */}
        <div className="glass-panel border-0 p-6 text-white relative overflow-hidden rounded-2xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-600 opacity-90"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="mr-2">❓</span>
              Cách cài đặt
            </h2>
            <div className="space-y-3 text-white/90">
              <p><strong>Trên Chrome/Edge:</strong> Nhấn nút "Cài đặt" hoặc biểu tượng + trên thanh địa chỉ</p>
              <p><strong>Trên iOS Safari:</strong> Nhấn nút Chia sẻ → Thêm vào Màn hình chính</p>
              <p><strong>Trên Android:</strong> Nhấn menu (⋮) → Cài đặt ứng dụng hoặc Thêm vào màn hình chính</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWASettings;
