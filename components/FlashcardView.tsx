import React, { useState } from 'react';
import type { Flashcard } from '../utils/flashcardStorage';

interface FlashcardViewProps {
  card: Flashcard;
  onAnswer?: (correct: boolean) => void;
  showButtons?: boolean;
}

const FlashcardView: React.FC<FlashcardViewProps> = ({ card, onAnswer, showButtons = true }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = (correct: boolean) => {
    if (onAnswer) {
      onAnswer(correct);
    }
    setTimeout(() => setIsFlipped(false), 300);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700';
      case 'hard': return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700';
      default: return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const getMasteryColor = (level: number) => {
    if (level >= 4) return 'text-green-500';
    if (level >= 2) return 'text-yellow-500';
    return 'text-gray-400 dark:text-gray-500';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getDifficultyColor(card.difficulty)}`}>
            {card.difficulty === 'easy' ? 'Dễ' : card.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <i 
                key={i}
                className={`fas fa-star text-sm ${i <= card.masteryLevel ? getMasteryColor(card.masteryLevel) : 'text-gray-300 dark:text-gray-600'}`}
              ></i>
            ))}
          </div>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          <i className="fas fa-redo mr-1"></i>
          {card.reviewCount} lần ôn
        </div>
      </div>

      <div 
        className="relative w-full h-96 cursor-pointer perspective-1000"
        onClick={handleFlip}
      >
        <div 
          className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
        >
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden">
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center border-4 border-white dark:border-gray-700">
              {/* ... */}
            </div>
          </div>

          {/* Back */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180">
            <div className="w-full h-full bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center border-4 border-white dark:border-gray-700">
              {/* ... */}
            </div>
          </div>
        </div>
      </div>

      {showButtons && isFlipped && (
        <div className="flex gap-4 mt-6 justify-center animate-fade-in">
          {/* ... */}
        </div>
      )}

      {card.reviewCount > 0 && (
        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <span className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full">
            <span className="text-green-600 dark:text-green-400 font-bold">{card.correctCount} đúng</span>
            <span>•</span>
            <span className="text-red-600 dark:text-red-400 font-bold">{card.incorrectCount} sai</span>
            <span>•</span>
            <span className="font-bold dark:text-white">
              {card.reviewCount > 0 ? Math.round((card.correctCount / card.reviewCount) * 100) : 0}% chính xác
            </span>
          </span>
        </div>
      )}
    </div>
  );
};

export default FlashcardView;
