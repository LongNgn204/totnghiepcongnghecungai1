import React, { useState } from 'react';
import { saveSharedResource, generateShareUrl, copyToClipboard } from '../utils/shareUtils';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceType: 'exam' | 'flashcard-deck' | 'chat';
  resourceTitle: string;
  resourceContent: any;
  category?: string;
  grade?: string;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  resourceType,
  resourceTitle,
  resourceContent,
  category,
  grade,
}) => {
  const [isPublic, setIsPublic] = useState(true);
  const [shareUrl, setShareUrl] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleShare = () => {
    const resourceId = saveSharedResource({
      type: resourceType,
      title: resourceTitle,
      content: resourceContent,
      createdBy: 'current_user',
      isPublic,
      category,
      grade,
    });

    const url = generateShareUrl(resourceId);
    setShareUrl(url);
    setShowSuccess(true);
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getResourceIcon = () => {
    switch (resourceType) {
      case 'exam':
        return '📝';
      case 'flashcard-deck':
        return '🗂️';
      case 'chat':
        return '💬';
    }
  };

  const getResourceTypeText = () => {
    switch (resourceType) {
      case 'exam':
        return 'Bài kiểm tra';
      case 'flashcard-deck':
        return 'Bộ thẻ học';
      case 'chat':
        return 'Cuộc trò chuyện';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{getResourceIcon()}</span>
              <div>
                <h2 className="text-2xl font-bold text-white">Chia sẻ</h2>
                <p className="text-purple-100 text-sm">{getResourceTypeText()}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!showSuccess ? (
            <>
              {/* Resource Info */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-2">Tài nguyên</p>
                <p className="font-semibold text-gray-900">{resourceTitle}</p>
                {category && (
                  <p className="text-sm text-gray-600 mt-1">
                    <i className="fas fa-tag mr-1"></i>
                    {category}
                  </p>
                )}
                {grade && (
                  <p className="text-sm text-gray-600 mt-1">
                    <i className="fas fa-graduation-cap mr-1"></i>
                    Lớp {grade}
                  </p>
                )}
              </div>

              {/* Privacy Settings */}
              <div className="space-y-3">
                <p className="font-semibold text-gray-900">Quyền riêng tư</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-purple-500 transition-colors">
                    <input
                      type="radio"
                      name="privacy"
                      checked={isPublic}
                      onChange={() => setIsPublic(true)}
                      className="w-4 h-4 text-purple-500"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        <i className="fas fa-globe mr-2 text-blue-500"></i>
                        Công khai
                      </p>
                      <p className="text-sm text-gray-600">Mọi người có thể xem và sử dụng</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-purple-500 transition-colors">
                    <input
                      type="radio"
                      name="privacy"
                      checked={!isPublic}
                      onChange={() => setIsPublic(false)}
                      className="w-4 h-4 text-purple-500"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        <i className="fas fa-lock mr-2 text-orange-500"></i>
                        Riêng tư
                      </p>
                      <p className="text-sm text-gray-600">Chỉ người có link mới xem được</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <i className="fas fa-share-alt mr-2"></i>
                Tạo link chia sẻ
              </button>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-check text-3xl text-green-500"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Tạo link thành công!
                </h3>
                <p className="text-gray-600 text-sm">
                  Chia sẻ link này với bạn bè để họ có thể truy cập
                </p>
              </div>

              {/* Share URL */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-2">Link chia sẻ</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                  />
                  <button
                    onClick={handleCopy}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      copied
                        ? 'bg-green-500 text-white'
                        : 'bg-purple-500 text-white hover:bg-purple-600'
                    }`}
                  >
                    <i className={`fas ${copied ? 'fa-check' : 'fa-copy'} mr-1`}></i>
                    {copied ? 'Đã copy!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Share Options */}
              <div className="grid grid-cols-3 gap-3">
                <button className="flex flex-col items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
                  <i className="fab fa-facebook text-2xl text-blue-600"></i>
                  <span className="text-xs font-medium text-gray-700">Facebook</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors">
                  <i className="fab fa-whatsapp text-2xl text-green-600"></i>
                  <span className="text-xs font-medium text-gray-700">WhatsApp</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-3 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors">
                  <i className="fas fa-envelope text-2xl text-purple-600"></i>
                  <span className="text-xs font-medium text-gray-700">Email</span>
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Đóng
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
