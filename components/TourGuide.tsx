import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for the element to highlight
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
}

interface TourGuideProps {
  steps: TourStep[];
  onComplete?: () => void;
  autoStart?: boolean;
}

const TourGuide: React.FC<TourGuideProps> = ({ steps, onComplete, autoStart = false }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(autoStart);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!isVisible || !steps[currentStep]?.target) {
      setHighlightRect(null);
      return;
    }

    const updateHighlight = () => {
      const element = document.querySelector(steps[currentStep].target!);
      if (element) {
        setHighlightRect(element.getBoundingClientRect());
      }
    };

    updateHighlight();
    window.addEventListener('resize', updateHighlight);
    window.addEventListener('scroll', updateHighlight);

    return () => {
      window.removeEventListener('resize', updateHighlight);
      window.removeEventListener('scroll', updateHighlight);
    };
  }, [currentStep, isVisible, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      steps[currentStep + 1]?.action?.();
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    onComplete?.();
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isVisible) {
    return null;
  }

  const step = steps[currentStep];
  const position = step.position || 'bottom';

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/40 pointer-events-none" />

      {/* Highlight Box */}
      {highlightRect && (
        <div
          className="fixed z-40 border-2 border-blue-500 rounded-lg pointer-events-none shadow-lg shadow-blue-500/50 transition-all duration-300"
          style={{
            top: `${highlightRect.top - 4}px`,
            left: `${highlightRect.left - 4}px`,
            width: `${highlightRect.width + 8}px`,
            height: `${highlightRect.height + 8}px`,
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 max-w-sm border border-gray-200 dark:border-gray-700 animate-fade-in-up"
        style={{
          top: highlightRect
            ? position === 'top'
              ? `${highlightRect.top - 280}px`
              : `${highlightRect.bottom + 20}px`
            : '50%',
          left: highlightRect
            ? `${Math.max(20, Math.min(window.innerWidth - 380, highlightRect.left - 100))}px`
            : '50%',
          transform: !highlightRect ? 'translate(-50%, -50%)' : 'none',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {step.description}
            </p>
          </div>
          <button
            onClick={handleSkip}
            className="ml-4 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Đóng tour"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {currentStep + 1} / {steps.length}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
            Quay lại
          </button>

          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleComplete}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              <CheckCircle size={16} />
              Hoàn tất
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Tiếp theo
              <ChevronRight size={16} />
            </button>
          )}

          <button
            onClick={handleSkip}
            className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Bỏ qua
          </button>
        </div>
      </div>
    </>
  );
};

export default TourGuide;

