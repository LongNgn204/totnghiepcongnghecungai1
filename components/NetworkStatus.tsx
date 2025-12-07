import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div role="status" aria-live="polite" className="fixed bottom-4 right-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 flex items-center gap-3 shadow-lg z-50 max-w-xs sm:max-w-sm">
      <WifiOff className="w-5 h-5 text-yellow-700" />
      <div className="text-xs sm:text-sm">
        <p className="font-semibold text-yellow-800">Mất kết nối mạng</p>
        <p className="text-yellow-700">Dữ liệu sẽ được đồng bộ khi có kết nối.</p>
      </div>
    </div>
  );
};

export default NetworkStatus;

