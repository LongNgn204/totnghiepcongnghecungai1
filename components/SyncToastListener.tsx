import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import syncManager from '../utils/syncManager';

const formatTime = (timestamp?: number) => {
  if (!timestamp) return '';
  try {
    return new Date(timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};

const SyncToastListener = () => {
  useEffect(() => {
    const handleSyncCompleted = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      const timeLabel = formatTime(detail?.lastSyncTime);
      toast.success(timeLabel ? `Đồng bộ xong · ${timeLabel}` : 'Đồng bộ thành công');
    };

    const handleSyncError = () => {
      toast.error('Đồng bộ thất bại. Vui lòng kiểm tra kết nối và thử lại.');
    };

    const handleOnline = () => {
      toast.success('Đã kết nối lại internet. Đang đồng bộ dữ liệu...', { duration: 4000 });
      syncManager.syncAll();
    };

    const handleOffline = () => {
      toast('Bạn đang offline. Hệ thống sẽ lưu cục bộ và đồng bộ khi có internet.', {
        icon: '⚠️',
        duration: 5000,
      });
    };

    window.addEventListener('sync-completed', handleSyncCompleted as EventListener);
    window.addEventListener('sync-error', handleSyncError);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('sync-completed', handleSyncCompleted as EventListener);
      window.removeEventListener('sync-error', handleSyncError);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return null;
};

export default SyncToastListener;

