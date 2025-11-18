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
    // Reset flip for next card
    setTimeout(() => setIsFlipped(false), 300);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'hard': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getMasteryColor = (level: number) => {
    if (level >= 4) return 'text-green-600';
    if (level >= 2) return 'text-yellow-600';
    return 'text-gray-400';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Card Stats */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getDifficultyColor(card.difficulty)}`}>
            {card.difficulty === 'easy' ? 'Dễ' : card.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <i 
                key={i}
                className={`fas fa-star text-sm ${i <= card.masteryLevel ? getMasteryColor(card.masteryLevel) : 'text-gray-300'}`}
              ></i>
            ))}
          </div>
        </div>
        <div className="text-xs text-gray-600">
          <i className="fas fa-redo mr-1"></i>
          {card.reviewCount} lần ôn
        </div>
      </div>

      {/* Flashcard */}
      <div 
        className="relative w-full h-96 cursor-pointer perspective-1000"
        onClick={handleFlip}
      >
        <div 
          className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
        >
          {/* Front side - Question */}
          <div className="absolute w-full h-full backface-hidden">
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center border-4 border-white">
              <div className="text-white text-center space-y-4 w-full">
                <i className="fas fa-question-circle text-5xl opacity-75"></i>
                <h3 className="text-2xl font-bold leading-relaxed">
                  {card.question}
                </h3>
                {card.imageUrl && (
                  <img 
                    src={card.imageUrl} 
                    alt="Question" 
                    className="max-w-full max-h-40 mx-auto rounded-lg shadow-lg border-4 border-white"
                  />
                )}
                {card.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {card.tags.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="absolute bottom-6 left-0 right-0 text-center">
                <p className="text-white text-sm font-medium flex items-center justify-center gap-2">
                  <i className="fas fa-hand-pointer animate-bounce"></i>
                  Click để xem đáp án
                </p>
              </div>
            </div>
          </div>

          {/* Back side - Answer */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180">
            <div className="w-full h-full bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center border-4 border-white">
              <div className="text-white text-center space-y-4 w-full">
                <i className="fas fa-check-circle text-5xl opacity-75"></i>
                <h3 className="text-2xl font-bold leading-relaxed">
                  {card.answer}
                </h3>
              </div>
              <div className="absolute bottom-6 left-0 right-0 text-center">
                <p className="text-white text-sm font-medium">
                  Click để quay lại câu hỏi
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Answer Buttons */}
      {showButtons && isFlipped && (
        <div className="flex gap-4 mt-6 justify-center animate-fade-in">
          <button
            onClick={() => handleAnswer(false)}
            className="flex-1 max-w-xs bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <i className="fas fa-times-circle"></i>
            Chưa nhớ
          </button>
          <button
            onClick={() => handleAnswer(true)}
            className="flex-1 max-w-xs bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <i className="fas fa-check-circle"></i>
            Đã nhớ
          </button>
        </div>
      )}

      {/* Progress Info */}
      {card.reviewCount > 0 && (
        <div className="mt-4 text-center text-sm text-gray-600">
          <span className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
            <span className="text-green-600 font-bold">{card.correctCount} đúng</span>
            <span>•</span>
            <span className="text-red-600 font-bold">{card.incorrectCount} sai</span>
            <span>•</span>
            <span className="font-bold">
              {card.reviewCount > 0 ? Math.round((card.correctCount / card.reviewCount) * 100) : 0}% chính xác
            </span>
          </span>
        </div>
      )}
    </div>
  );
};

export default FlashcardView;
