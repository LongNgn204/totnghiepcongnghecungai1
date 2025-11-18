import React, { useState, useEffect } from 'react';
import syncManager from '../utils/syncManager';

const SyncSettings: React.FC = () => {
  const [config, setConfig] = useState(syncManager.getConfig());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setConfig(syncManager.getConfig());
  }, []);

  const handleToggleAutoSync = () => {
    const newConfig = { ...config, autoSync: !config.autoSync };
    setConfig(newConfig);
    setSaving(true);
    syncManager.saveConfig(newConfig);
    setTimeout(() => setSaving(false), 500);
  };

  const handleToggleEnabled = () => {
    const newConfig = { ...config, enabled: !config.enabled };
    setConfig(newConfig);
    setSaving(true);
    syncManager.saveConfig(newConfig);
    setTimeout(() => setSaving(false), 500);
  };

  const handleIntervalChange = (minutes: number) => {
    const newConfig = { ...config, syncInterval: minutes * 60 * 1000 };
    setConfig(newConfig);
    setSaving(true);
    syncManager.saveConfig(newConfig);
    setTimeout(() => setSaving(false), 500);
  };

  const handleSyncNow = async () => {
    setSaving(true);
    await syncManager.syncAll();
    setSaving(false);
  };

  const lastSyncTime = syncManager.getLastSyncTime();
  const lastSyncDate = lastSyncTime ? new Date(lastSyncTime) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          <i className="fas fa-sync-alt mr-2 text-blue-500"></i>
          Cài đặt đồng bộ
        </h2>
        <p className="text-gray-600">
          Đồng bộ dữ liệu giữa thiết bị và cloud
        </p>
      </div>

      {/* Status */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Lần đồng bộ cuối</p>
            <p className="text-2xl font-bold text-gray-900">
              {lastSyncDate ? lastSyncDate.toLocaleString('vi-VN') : 'Chưa đồng bộ'}
            </p>
          </div>
          <button
            onClick={handleSyncNow}
            disabled={saving || !config.enabled}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Đang đồng bộ...
              </>
            ) : (
              <>
                <i className="fas fa-sync-alt mr-2"></i>
                Đồng bộ ngay
              </>
            )}
          </button>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* Enable/Disable Sync */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-200">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Bật đồng bộ
            </h3>
            <p className="text-sm text-gray-600">
              Tự động lưu dữ liệu lên cloud và đồng bộ giữa thiết bị
            </p>
          </div>
          <button
            onClick={handleToggleEnabled}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              config.enabled ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                config.enabled ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {config.enabled && (
          <>
            {/* Auto Sync */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-200">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Tự động đồng bộ
                </h3>
                <p className="text-sm text-gray-600">
                  Đồng bộ định kỳ khi có kết nối Internet
                </p>
              </div>
              <button
                onClick={handleToggleAutoSync}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  config.autoSync ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    config.autoSync ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Sync Interval */}
            {config.autoSync && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Tần suất đồng bộ
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { minutes: 5, label: '5 phút' },
                    { minutes: 15, label: '15 phút' },
                    { minutes: 30, label: '30 phút' },
                    { minutes: 60, label: '1 giờ' },
                  ].map(({ minutes, label }) => (
                    <button
                      key={minutes}
                      onClick={() => handleIntervalChange(minutes)}
                      className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                        config.syncInterval === minutes * 60 * 1000
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <i className="fas fa-info-circle text-blue-600"></i>
          Thông tin
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <i className="fas fa-check text-green-600 mt-1"></i>
            <span>Dữ liệu được mã hóa và lưu trữ an toàn trên Cloudflare</span>
          </li>
          <li className="flex items-start gap-2">
            <i className="fas fa-check text-green-600 mt-1"></i>
            <span>Đồng bộ: Đề thi, Flashcards, Lịch sử chat, Tiến độ học tập</span>
          </li>
          <li className="flex items-start gap-2">
            <i className="fas fa-check text-green-600 mt-1"></i>
            <span>Hoạt động offline, tự động đồng bộ khi có mạng</span>
          </li>
          <li className="flex items-start gap-2">
            <i className="fas fa-check text-green-600 mt-1"></i>
            <span>Truy cập dữ liệu từ bất kỳ thiết bị nào</span>
          </li>
        </ul>
      </div>

      {saving && (
        <div className="fixed bottom-4 left-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          <i className="fas fa-check-circle mr-2"></i>
          Đã lưu cài đặt
        </div>
      )}
    </div>
  );
};

export default SyncSettings;
