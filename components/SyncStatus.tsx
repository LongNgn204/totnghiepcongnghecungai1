import React, { useState, useEffect } from 'react';
import syncManager from '../utils/syncManager';

const SyncStatus: React.FC = () => {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [enabled, setEnabled] = useState(true);
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Load initial state
    setEnabled(syncManager.isEnabled());
    const lastSyncTime = syncManager.getLastSyncTime();
    if (lastSyncTime) {
      setLastSync(new Date(lastSyncTime));
    }

    // Listen to sync events
    const handleSyncCompleted = (e: any) => {
      setLastSync(new Date(e.detail.lastSyncTime));
      setSyncing(false);
    };

    const handleSyncError = () => {
      setSyncing(false);
    };

    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('sync-completed', handleSyncCompleted);
    window.addEventListener('sync-error', handleSyncError);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check if syncing
    const checkSyncing = setInterval(() => {
      setSyncing(syncManager.isSyncing());
    }, 500);

    return () => {
      window.removeEventListener('sync-completed', handleSyncCompleted);
      window.removeEventListener('sync-error', handleSyncError);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(checkSyncing);
    };
  }, []);

  const handleSync = async () => {
    if (!online || !enabled) return;
    setSyncing(true);
    await syncManager.syncAll();
  };

  const handleToggle = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    syncManager.saveConfig({ enabled: newEnabled });
  };

  const formatTime = (date: Date | null): string => {
    if (!date) return 'Chưa đồng bộ';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    return date.toLocaleString('vi-VN');
  };

  if (!enabled) {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-100 rounded-lg shadow-lg p-3 max-w-xs z-50">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-gray-600">
            <i className="fas fa-cloud-slash"></i>
            <span className="text-sm">Sync tắt</span>
          </div>
          <button
            onClick={handleToggle}
            className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
          >
            Bật
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl p-3 max-w-xs border-2 border-gray-200 z-50">
      <div className="flex items-center justify-between gap-3">
        {/* Status */}
        <div className="flex-1">
          {syncing ? (
            <div className="flex items-center gap-2 text-blue-600">
              <i className="fas fa-sync-alt animate-spin"></i>
              <span className="text-sm font-semibold">Đang đồng bộ...</span>
            </div>
          ) : !online ? (
            <div className="flex items-center gap-2 text-orange-600">
              <i className="fas fa-wifi-slash"></i>
              <span className="text-sm font-semibold">Offline</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-600">
              <i className="fas fa-check-circle"></i>
              <div>
                <p className="text-sm font-semibold">Đã đồng bộ</p>
                <p className="text-xs text-gray-500">{formatTime(lastSync)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSync}
            disabled={syncing || !online}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Đồng bộ ngay"
          >
            <i className="fas fa-sync-alt"></i>
          </button>
          <button
            onClick={handleToggle}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Tắt đồng bộ"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SyncStatus;
