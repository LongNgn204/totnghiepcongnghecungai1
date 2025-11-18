import React from 'react';

interface SuggestedQuestionsProps {
  questions: string[];
  onSelectQuestion: (question: string) => void;
  loading?: boolean;
}

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ 
  questions, 
  onSelectQuestion,
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="min-w-[200px] h-16 bg-gray-200 rounded-lg animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (questions.length === 0) return null;

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <i className="fas fa-lightbulb text-yellow-500"></i>
        Câu hỏi gợi ý tiếp theo:
      </h4>
      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-2">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onSelectQuestion(question)}
            className="flex-shrink-0 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-2 border-blue-200 hover:border-blue-400 rounded-xl text-left text-sm text-gray-800 transition-all hover:shadow-md hover:scale-105 max-w-xs group"
          >
            <div className="flex items-start gap-2">
              <i className="fas fa-question-circle text-blue-500 mt-0.5 group-hover:scale-110 transition-transform"></i>
              <span className="line-clamp-2">{question}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;
