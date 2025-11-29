import React from 'react';
import { QuestionMC, QuestionTF, QuestionLevel } from '../types';

interface QuestionCardProps {
  question: QuestionMC | QuestionTF;
  type: 'mc' | 'tf';
  onAnswerChange: (questionId: number, answer: any) => void;
  userAnswer?: any;
  isSubmitted: boolean;
  index?: number; // Added index prop
  showResult?: boolean; // Added showResult prop
}

const getLevelColor = (level?: QuestionLevel) => {
  switch (level) {
    case QuestionLevel.KNOW:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case QuestionLevel.UNDERSTAND:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case QuestionLevel.APPLY:
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200';
  }
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question, type, onAnswerChange, userAnswer, isSubmitted, index, showResult }) => {
  // Normalize question text
  const questionText = question.question || question.text || '';
  const questionId = question.id;

  const getOptionClass = (option: string, correctAns: string) => {
    if (!isSubmitted && !showResult) {
      return userAnswer === option
        ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500 border-transparent'
        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600';
    }

    const isCorrect = correctAns === option;
    const isSelected = userAnswer === option;

    if (isCorrect) return 'bg-green-100 dark:bg-green-900 ring-2 ring-green-500 border-transparent text-green-800 dark:text-green-200';
    if (isSelected && !isCorrect) return 'bg-red-100 dark:bg-red-900 ring-2 ring-red-500 border-transparent text-red-800 dark:text-red-300';
    return 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 opacity-60';
  };

  const getTFButtonClass = (isTrue: boolean, statementId: string, isCorrect: boolean) => {
    // userAnswer for TF is typically an object { [statementId]: boolean }
    const currentAnswer = userAnswer?.[statementId];
    const isSelected = currentAnswer === isTrue;

    if (!isSubmitted && !showResult) {
      return isSelected
        ? 'bg-blue-600 text-white ring-2 ring-blue-500'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200';
    }

    if (isCorrect === isTrue) return 'bg-green-500 text-white';
    if (isSelected && isCorrect !== isTrue) return 'bg-red-500 text-white';
    return 'bg-gray-100 text-gray-400 opacity-50';
  };

  const handleTFChange = (statementId: string, value: boolean) => {
    if (isSubmitted || showResult) return;
    const currentAnswers = userAnswer || {};
    // If the key is composite like "qid-sid", we might need to handle it, but usually we pass just the object for this question
    // However, Product4 passes a global userAnswers object.
    // Let's assume onAnswerChange handles the merging or keying.
    // Actually, Product4 expects (ans, stmtIdx) => handleAnswerSelect(q.id, ans, stmtIdx)
    // But QuestionCard props say onAnswerChange: (questionId, answer)
    // We need to adapt.

    // If the parent expects a full object update:
    onAnswerChange(questionId, { ...currentAnswers, [statementId]: value });

    // Note: Product4's handleAnswerSelect signature is different from Product2's.
    // Product4: (questionId, answer, statementIndex)
    // Product2: (questionId, answer) where answer is the full object for TF
    // We should standardize on Product2's approach for QuestionCard: passing the full answer object for the question.
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md flex flex-col h-full transition-all duration-300 border border-gray-100 hover:shadow-lg focus-within:ring-2 focus-within:ring-blue-500">
      <div className="flex justify-between items-start mb-3">
        <p className="font-bold text-lg text-blue-600 dark:text-blue-400" id={`q-label-${questionId}`}>
          {index !== undefined ? `Câu ${index + 1}` : `Câu ${questionId}`}
        </p>
        {question.level && (
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(question.level)}`}>
            {question.level}
          </span>
        )}
      </div>
      <p className="text-gray-800 dark:text-gray-200 mb-4 flex-grow font-medium text-base">{questionText}</p>

      {type === 'mc' && (
        <fieldset className="space-y-2 mb-4" role="radiogroup" aria-labelledby={`q-label-${questionId}`}>
          <legend className="sr-only">Các lựa chọn cho câu {questionId}</legend>
          {(question as QuestionMC).options.map((option, idx) => {
            const optionId = `q-${questionId}-option-${idx}`;
            const correctAns = (question as QuestionMC).answer || (question as QuestionMC).correctAnswer || '';
            return (
              <div key={idx} className={`relative rounded-lg transition-all duration-200 ${getOptionClass(option, correctAns)}`}>
                <input
                  type="radio"
                  id={optionId}
                  name={`question-${questionId}`}
                  value={option}
                  checked={userAnswer === option}
                  disabled={isSubmitted || showResult}
                  onChange={() => onAnswerChange(questionId, option)}
                  className="sr-only peer"
                />
                <label
                  htmlFor={optionId}
                  className="block w-full text-left p-3 min-h-[44px] rounded-lg text-sm cursor-pointer peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-blue-500"
                >
                  <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span> {option}
                  {(isSubmitted || showResult) && correctAns === option && <span className="ml-2 float-right text-green-600" aria-label="Đáp án đúng">✅</span>}
                  {(isSubmitted || showResult) && userAnswer === option && correctAns !== option && <span className="ml-2 float-right text-red-600" aria-label="Lựa chọn sai">❌</span>}
                </label>
              </div>
            );
          })}
          {(isSubmitted || showResult) && (question as QuestionMC).explanation && (
            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-200">
              <strong>Giải thích:</strong> {(question as QuestionMC).explanation}
            </div>
          )}
        </fieldset>
      )}

      {type === 'tf' && (
        <div className="space-y-4 mb-4">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 italic">
            Chọn Đúng (Đ) hoặc Sai (S) cho mỗi phát biểu:
          </p>
          {(question as QuestionTF).statements.map((stmt, idx) => {
            // Handle both object-like statements (from old code if any) or array-like
            const statementText = stmt.text;
            const statementId = stmt.id || idx.toString();
            const isCorrect = stmt.isCorrect;
            const explanation = stmt.explanation;

            const fieldsetId = `q-${questionId}-statement-${statementId}`;

            return (
              <fieldset key={statementId} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-600" aria-labelledby={fieldsetId}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <legend id={fieldsetId} className="flex-1">
                    <span className="font-bold text-blue-600 dark:text-blue-400 w-6">{String.fromCharCode(97 + idx)})</span>
                    <span className="text-sm text-gray-800 dark:text-gray-200 ml-2">{statementText}</span>
                  </legend>
                  <div className="flex gap-2 shrink-0" role="radiogroup">
                    <button
                      onClick={() => handleTFChange(statementId, true)}
                      disabled={isSubmitted || showResult}
                      role="radio"
                      aria-checked={userAnswer?.[statementId] === true}
                      className={`w-10 h-10 rounded-full font-bold text-sm transition-all flex items-center justify-center shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 ${getTFButtonClass(true, statementId, isCorrect)}`}
                      aria-label={`Phát biểu ${statementId}, Đúng`}
                    >
                      Đ
                    </button>
                    <button
                      onClick={() => handleTFChange(statementId, false)}
                      disabled={isSubmitted || showResult}
                      role="radio"
                      aria-checked={userAnswer?.[statementId] === false}
                      className={`w-10 h-10 rounded-full font-bold text-sm transition-all flex items-center justify-center shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 ${getTFButtonClass(false, statementId, isCorrect)}`}
                      aria-label={`Phát biểu ${statementId}, Sai`}
                    >
                      S
                    </button>
                  </div>
                </div>
                {(isSubmitted || showResult) && explanation && (
                  <div className="mt-2 ml-9 text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-2 rounded border border-gray-100 dark:border-gray-700">
                    <strong>Giải thích:</strong> {explanation}
                  </div>
                )}
              </fieldset>
            );
          })}
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400"><em>YCCĐ: {question.requirement || 'Vận dụng kiến thức'}</em></p>
      </div>
    </div>
  );
};

export default QuestionCard;
