import React, { useState, useEffect } from 'react';

/**
 * ✅ UpdateNotification Component
 * Hiển thị popup góc phải khi có bản cập nhật mới
 * Chú thích: Component UI premium với animation slide-in từ phải
 */

interface UpdateNotificationProps {
  onRefresh?: () => void;
  onDismiss?: () => void;
}

export const UpdateNotification: React.FC<UpdateNotificationProps> = ({
  onRefresh,
  onDismiss,
}) => {
  const [visible, setVisible] = useState(false);
  const [isHiding, setIsHiding] = useState(false);

  // Chú thích: Debounce key để tránh hiển thị notification liên tục sau khi user đã cập nhật
  const DEBOUNCE_KEY = 'pwa-update-dismissed';
  const DEBOUNCE_DURATION = 5 * 60 * 1000; // 5 phút - không hiển thị lại trong 5 phút

  useEffect(() => {
    // Kiểm tra đã bị dismiss gần đây chưa
    const checkDebounce = (): boolean => {
      const dismissedAt = sessionStorage.getItem(DEBOUNCE_KEY);
      if (dismissedAt) {
        const elapsed = Date.now() - parseInt(dismissedAt, 10);
        if (elapsed < DEBOUNCE_DURATION) {
          return true; // Còn trong thời gian debounce, không hiển thị
        }
      }
      return false;
    };

    // Lắng nghe message từ Service Worker khi có bản cập nhật mới
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
        // Chỉ hiển thị nếu chưa bị debounce
        if (!checkDebounce()) {
          setVisible(true);
        }
      }
    };

    // Lắng nghe custom event từ pwaUtils
    const handleUpdateAvailable = () => {
      if (!checkDebounce()) {
        setVisible(true);
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleServiceWorkerMessage);
    window.addEventListener('pwa-update-available', handleUpdateAvailable);

    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleServiceWorkerMessage);
      window.removeEventListener('pwa-update-available', handleUpdateAvailable);
    };
  }, []);

  const handleRefresh = () => {
    onRefresh?.();
    // Chú thích: Lưu debounce trước khi reload để tránh loop notification
    sessionStorage.setItem('pwa-update-dismissed', Date.now().toString());
    // Xóa tất cả cache và reload
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => caches.delete(name));
      });
    }
    window.location.reload();
  };

  const handleDismiss = () => {
    setIsHiding(true);
    // Chú thích: Lưu thời điểm dismiss vào sessionStorage để debounce
    sessionStorage.setItem('pwa-update-dismissed', Date.now().toString());
    setTimeout(() => {
      setVisible(false);
      setIsHiding(false);
      onDismiss?.();
    }, 300);
  };

  if (!visible) return null;

  return (
    <div
      className={`update-notification ${isHiding ? 'hiding' : ''}`}
      role="alert"
      aria-live="polite"
    >
      <div className="update-notification-content">
        <div className="update-notification-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 21h5v-5" />
          </svg>
        </div>
        <div className="update-notification-text">
          <h4>Có bản cập nhật mới!</h4>
          <p>Nhấn để tải phiên bản mới nhất.</p>
        </div>
        <div className="update-notification-actions">
          <button
            className="update-btn-refresh"
            onClick={handleRefresh}
            aria-label="Tải lại trang"
          >
            Cập nhật
          </button>
          <button
            className="update-btn-dismiss"
            onClick={handleDismiss}
            aria-label="Bỏ qua"
          >
            ✕
          </button>
        </div>
      </div>

      <style>{`
        .update-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 99999;
          animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .update-notification.hiding {
          animation: slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .update-notification-content {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          box-shadow: 
            0 10px 40px rgba(102, 126, 234, 0.4),
            0 4px 12px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(10px);
          max-width: 380px;
        }
        
        .update-notification-icon {
          flex-shrink: 0;
          color: white;
          animation: spin 2s linear infinite;
        }
        
        .update-notification-text {
          flex: 1;
          color: white;
        }
        
        .update-notification-text h4 {
          margin: 0 0 2px 0;
          font-size: 15px;
          font-weight: 600;
        }
        
        .update-notification-text p {
          margin: 0;
          font-size: 13px;
          opacity: 0.9;
        }
        
        .update-notification-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .update-btn-refresh {
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.95);
          color: #667eea;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .update-btn-refresh:hover {
          background: white;
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .update-btn-dismiss {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .update-btn-dismiss:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(120%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(120%);
            opacity: 0;
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .update-notification-content {
            background: linear-gradient(135deg, #4c51bf 0%, #553c9a 100%);
          }
        }
        
        /* Mobile responsive */
        @media (max-width: 480px) {
          .update-notification {
            top: 10px;
            right: 10px;
            left: 10px;
          }
          
          .update-notification-content {
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
};

export default UpdateNotification;
