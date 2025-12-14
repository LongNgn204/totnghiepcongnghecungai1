/**
 * Text-to-Speech Component
 * Sử dụng Web Speech API để đọc text thành giọng nói
 */
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Pause, Play } from 'lucide-react';

interface TextToSpeechProps {
  text: string;
  language?: string;
  autoPlay?: boolean;
  className?: string;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({
  text,
  language = 'vi-VN',
  autoPlay = false,
  className = '',
}) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Kiểm tra hỗ trợ Web Speech API
  useEffect(() => {
    if ('speechSynthesis' in window) {
      setIsSupported(true);
      loadVoices();
      
      // Lắng nghe khi voices được load
      const handleVoicesChanged = () => {
        loadVoices();
      };
      speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      
      return () => {
        speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      };
    }
  }, []);

  // Load danh sách voices
  const loadVoices = () => {
    const availableVoices = speechSynthesis.getVoices();
    setVoices(availableVoices);
    
    // Tự động chọn voice tiếng Việt nếu có
    const vietnameseVoice = availableVoices.find(
      (voice) => voice.lang.includes('vi') || voice.lang.includes('VN')
    );
    if (vietnameseVoice) {
      setSelectedVoice(vietnameseVoice);
    } else if (availableVoices.length > 0) {
      // Fallback to first available voice
      setSelectedVoice(availableVoices[0]);
    }
  };

  // Auto-play khi text thay đổi
  useEffect(() => {
    if (autoPlay && text && isSupported && !isPlaying) {
      handlePlay();
    }
  }, [text, autoPlay]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      if (utteranceRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlay = () => {
    if (!isSupported || !text.trim()) return;

    // Dừng bất kỳ phát âm nào đang chạy
    speechSynthesis.cancel();

    // Tạo utterance mới
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 1.0; // Tốc độ đọc (0.1 - 10)
    utterance.pitch = 1.0; // Cao độ (0 - 2)
    utterance.volume = 1.0; // Âm lượng (0 - 1)

    // Chọn voice nếu có
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Event handlers
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };

    utterance.onerror = (error) => {
      console.error('TTS Error:', error);
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (isPlaying && !isPaused) {
      speechSynthesis.pause();
      setIsPaused(true);
    } else if (isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    utteranceRef.current = null;
  };

  if (!isSupported) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        Trình duyệt không hỗ trợ Text-to-Speech
      </div>
    );
  }

  if (!text.trim()) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Voice selector (ẩn mặc định, có thể mở rộng) */}
      {voices.length > 0 && (
        <select
          value={selectedVoice?.name || ''}
          onChange={(e) => {
            const voice = voices.find((v) => v.name === e.target.value);
            if (voice) setSelectedVoice(voice);
          }}
          className="hidden text-xs border rounded px-2 py-1 bg-white dark:bg-gray-800"
          title="Chọn giọng đọc"
        >
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      )}

      {/* Control buttons */}
      {!isPlaying ? (
        <button
          onClick={handlePlay}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Phát âm"
          aria-label="Phát âm"
        >
          <Volume2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </button>
      ) : (
        <>
          <button
            onClick={handlePause}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={isPaused ? 'Tiếp tục' : 'Tạm dừng'}
            aria-label={isPaused ? 'Tiếp tục' : 'Tạm dừng'}
          >
            {isPaused ? (
              <Play className="w-4 h-4 text-green-600 dark:text-green-400" />
            ) : (
              <Pause className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            )}
          </button>
          <button
            onClick={handleStop}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Dừng"
            aria-label="Dừng"
          >
            <VolumeX className="w-4 h-4 text-red-600 dark:text-red-400" />
          </button>
        </>
      )}
    </div>
  );
};

export default TextToSpeech;

