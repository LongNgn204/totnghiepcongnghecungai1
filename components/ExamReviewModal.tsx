import React from 'react';
import { ExamHistory } from '../utils/examStorage';
import { QuestionMC, QuestionTF, QuestionLevel } from '../types';
import { exportExamToPDF } from '../utils/exportPDF';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface ExamReviewModalProps {
  exam: ExamHistory;
  onClose: () => void;
}

const getLevelColor = (level: QuestionLevel) => {
  switch (level) {
    case QuestionLevel.KNOW:
      return 'bg-green-100 text-green-800';
    case QuestionLevel.UNDERSTAND:
      return 'bg-yellow-100 text-yellow-800';
    case QuestionLevel.APPLY:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ExamReviewModal: React.FC<ExamReviewModalProps> = ({ exam, onClose }) => {
  const mcQuestions = exam.questions.filter((q: any) => q.options) as QuestionMC[];
  const tfQuestions = exam.questions.filter((q: any) => !q.options) as QuestionTF[];

  const getAnswerStatus = (questionId: number, correctAnswer: any) => {
    const userAnswer = exam.userAnswers[questionId];
    const isCorrect = userAnswer === correctAnswer;
    
    return {
      isCorrect,
      userAnswer,
      correctAnswer
    };
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <i className="fas fa-file-alt"></i>
                Xem lại đề thi
              </h2>
              <p className="text-blue-100 text-sm">{exam.examTitle}</p>
              <div className="mt-3 flex items-center gap-4 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  <i className="fas fa-calendar mr-1"></i>
                  {new Date(exam.createdAt).toLocaleString('vi-VN')}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  <i className="fas fa-clock mr-1"></i>
                  {exam.timeSpent} phút
                </span>
                <span className={`px-3 py-1 rounded-full font-bold ${
                  exam.percentage >= 80 ? 'bg-green-500' : 
                  exam.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}>
                  <i className="fas fa-star mr-1"></i>
                  {exam.score}/{exam.totalQuestions} ({exam.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => exportExamToPDF(exam)}
                className="text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-all hover:scale-105 flex items-center gap-2"
              >
                <i className="fas fa-download"></i>
                <span className="hidden sm:inline">Xuất PDF</span>
              </button>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 p-3 rounded-full transition-all hover:scale-110"
              >
                <i className="fas fa-times text-2xl"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Stats Summary */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-200 transform transition-all hover:scale-105 hover:shadow-lg">
              <div className="text-3xl font-bold text-blue-600 animate-fade-in">{exam.totalQuestions}</div>
              <div className="text-sm text-gray-600 mt-1">Tổng câu</div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl text-center border border-green-200 transform transition-all hover:scale-105 hover:shadow-lg">
              <div className="text-3xl font-bold text-green-600 animate-fade-in">{exam.score}</div>
              <div className="text-sm text-gray-600 mt-1">Trả lời đúng</div>
            </div>
            <div className="bg-red-50 p-4 rounded-xl text-center border border-red-200 transform transition-all hover:scale-105 hover:shadow-lg">
              <div className="text-3xl font-bold text-red-600 animate-fade-in">{exam.totalQuestions - exam.score}</div>
              <div className="text-sm text-gray-600 mt-1">Trả lời sai</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl text-center border border-purple-200 transform transition-all hover:scale-105 hover:shadow-lg">
              <div className="text-3xl font-bold text-purple-600 animate-fade-in">{exam.percentage.toFixed(1)}%</div>
              <div className="text-sm text-gray-600 mt-1">Điểm số</div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-2 gap-6">
            {/* Pie Chart - Correct vs Wrong */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <i className="fas fa-chart-pie text-blue-600 mr-2"></i>
                Phân bố đúng/sai
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Đúng', value: exam.score, color: '#22c55e' },
                      { name: 'Sai', value: exam.totalQuestions - exam.score, color: '#ef4444' }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#22c55e" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart - Level Breakdown */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <i className="fas fa-chart-bar text-purple-600 mr-2"></i>
                Phân tích theo mức độ
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={(() => {
                  const levelStats: any = {
                    [QuestionLevel.KNOW]: { correct: 0, wrong: 0 },
                    [QuestionLevel.UNDERSTAND]: { correct: 0, wrong: 0 },
                    [QuestionLevel.APPLY]: { correct: 0, wrong: 0 }
                  };
                  
                  exam.questions.forEach((q: any, idx: number) => {
                    const isCorrect = exam.userAnswers[idx + 1] === (q.correctAnswer || q.answers);
                    const level = q.level || QuestionLevel.KNOW;
                    if (isCorrect) {
                      levelStats[level].correct++;
                    } else {
                      levelStats[level].wrong++;
                    }
                  });

                  return [
                    { name: 'Biết', Đúng: levelStats[QuestionLevel.KNOW].correct, Sai: levelStats[QuestionLevel.KNOW].wrong },
                    { name: 'Hiểu', Đúng: levelStats[QuestionLevel.UNDERSTAND].correct, Sai: levelStats[QuestionLevel.UNDERSTAND].wrong },
                    { name: 'Vận dụng', Đúng: levelStats[QuestionLevel.APPLY].correct, Sai: levelStats[QuestionLevel.APPLY].wrong }
                  ];
                })()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Đúng" fill="#22c55e" />
                  <Bar dataKey="Sai" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance Insights */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
              Nhận xét & Gợi ý
            </h3>
            <div className="space-y-3">
              {exam.percentage >= 80 ? (
                <div className="flex items-start gap-3">
                  <i className="fas fa-trophy text-yellow-500 text-2xl"></i>
                  <div>
                    <p className="font-semibold text-green-700">Xuất sắc! 🎉</p>
                    <p className="text-gray-600">Bạn đã nắm vững kiến thức. Hãy tiếp tục duy trì và thử các đề khó hơn!</p>
                  </div>
                </div>
              ) : exam.percentage >= 50 ? (
                <div className="flex items-start gap-3">
                  <i className="fas fa-thumbs-up text-blue-500 text-2xl"></i>
                  <div>
                    <p className="font-semibold text-yellow-700">Khá tốt! 👍</p>
                    <p className="text-gray-600">Bạn đã hiểu cơ bản. Hãy ôn lại các câu sai và luyện tập thêm để đạt điểm cao hơn.</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <i className="fas fa-book-reader text-red-500 text-2xl"></i>
                  <div>
                    <p className="font-semibold text-red-700">Cần cố gắng thêm! 💪</p>
                    <p className="text-gray-600">Hãy xem lại giải thích từng câu, ôn kỹ lý thuyết và làm thêm nhiều bài tập.</p>
                  </div>
                </div>
              )}
              
              {(() => {
                const weakLevel = exam.questions.reduce((acc: any, q: any, idx: number) => {
                  const isCorrect = exam.userAnswers[idx + 1] === (q.correctAnswer || q.answers);
                  if (!isCorrect) {
                    acc[q.level || QuestionLevel.KNOW] = (acc[q.level || QuestionLevel.KNOW] || 0) + 1;
                  }
                  return acc;
                }, {});
                
                const maxWeak = Object.entries(weakLevel).sort((a: any, b: any) => b[1] - a[1])[0] as [string, number] | undefined;
                if (maxWeak && maxWeak[1] > 2) {
                  const levelName = maxWeak[0] === QuestionLevel.KNOW ? 'Biết' : 
                                   maxWeak[0] === QuestionLevel.UNDERSTAND ? 'Hiểu' : 'Vận dụng';
                  return (
                    <div className="flex items-start gap-3 mt-3 pt-3 border-t border-indigo-200">
                      <i className="fas fa-exclamation-circle text-orange-500 text-2xl"></i>
                      <div>
                        <p className="font-semibold text-orange-700">Điểm yếu cần cải thiện:</p>
                        <p className="text-gray-600">Bạn làm sai nhiều câu ở mức độ <strong>{levelName}</strong>. Hãy tập trung ôn lại phần này.</p>
                      </div>
                    </div>
                  );
                }
              })()}
            </div>
          </div>

          {/* PHẦN I: Trắc nghiệm 4 lựa chọn */}
          <div>
            <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
              <i className="fas fa-list-ol"></i>
              PHẦN I: Trắc nghiệm 4 lựa chọn (Câu 1-24)
            </h3>
            <div className="space-y-4">
              {mcQuestions.map((q) => {
                const status = getAnswerStatus(q.id, q.answer);
                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-xl border-l-4 ${
                      status.isCorrect
                        ? 'bg-green-50 border-green-500'
                        : 'bg-red-50 border-red-500'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-gray-700">Câu {q.id}</span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(q.level)}`}>
                          {q.level}
                        </span>
                        {status.isCorrect ? (
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <i className="fas fa-check-circle"></i> ĐÚNG
                          </span>
                        ) : (
                          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <i className="fas fa-times-circle"></i> SAI
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-800 mb-4 font-medium">{q.question}</p>
                    
                    <div className="space-y-2">
                      {q.options.map((option, idx) => {
                        const isUserAnswer = status.userAnswer === option;
                        const isCorrectAnswer = status.correctAnswer === option;
                        
                        return (
                          <div
                            key={idx}
                            className={`p-3 rounded-lg border-2 ${
                              isCorrectAnswer
                                ? 'bg-green-100 border-green-500'
                                : isUserAnswer
                                ? 'bg-red-100 border-red-500'
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{option}</span>
                              <div className="flex items-center gap-2">
                                {isUserAnswer && !isCorrectAnswer && (
                                  <span className="text-red-600 text-xs font-bold">Bạn chọn</span>
                                )}
                                {isCorrectAnswer && (
                                  <i className="fas fa-check-circle text-green-600"></i>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-600">
                        <i className="fas fa-info-circle mr-1"></i>
                        <em>YCCĐ: {q.requirement}</em>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PHẦN II: Đúng/Sai */}
          {tfQuestions.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-green-600 mb-4 flex items-center gap-2">
                <i className="fas fa-check-double"></i>
                PHẦN II: Trắc nghiệm Đúng/Sai (Câu 25-28)
              </h3>
              <div className="space-y-4">
                {tfQuestions.map((q) => {
                  const status = getAnswerStatus(q.id, q.answer);
                  
                  return (
                    <div
                      key={q.id}
                      className={`p-5 rounded-xl border-l-4 ${
                        status.isCorrect
                          ? 'bg-green-50 border-green-500'
                          : 'bg-red-50 border-red-500'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-gray-700">Câu {q.id}</span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(q.level)}`}>
                            {q.level}
                          </span>
                          {status.isCorrect ? (
                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                              <i className="fas fa-check-circle"></i> ĐÚNG
                            </span>
                          ) : (
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                              <i className="fas fa-times-circle"></i> SAI
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-800 mb-4 font-medium">{q.question}</p>
                      
                      {/* Hiển thị 4 phát biểu nếu có */}
                      {q.statements && (
                        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-4">
                          <p className="text-sm font-semibold text-blue-800 mb-3">
                            <i className="fas fa-list-check mr-2"></i>
                            Các phát biểu:
                          </p>
                          <div className="space-y-3">
                            {Object.entries(q.statements).map(([key, statement]) => {
                              const isCorrect = q.answers?.[key as 'a' | 'b' | 'c' | 'd'];
                              const explanation = q.explanations?.[key as 'a' | 'b' | 'c' | 'd'];
                              
                              return (
                                <div key={key} className="bg-white p-3 rounded-md border-2 border-gray-200">
                                  <div className="flex items-start gap-2">
                                    <span className="font-bold text-blue-600 mt-0.5">{key})</span>
                                    <div className="flex-1">
                                      <p className="text-sm text-gray-800">{statement}</p>
                                      {explanation && (
                                        <div className={`mt-2 p-2 rounded text-xs font-medium ${
                                          isCorrect 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                          <i className={`fas ${isCorrect ? 'fa-check-circle' : 'fa-times-circle'} mr-1`}></i>
                                          {explanation}
                                        </div>
                                      )}
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                      isCorrect 
                                        ? 'bg-green-500 text-white' 
                                        : 'bg-red-500 text-white'
                                    }`}>
                                      {isCorrect ? 'ĐÚNG' : 'SAI'}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      {/* Đáp án của bạn (format cũ) */}
                      {!q.statements && (
                        <div className="flex items-center gap-4">
                          <div className="flex-1 bg-white p-3 rounded-lg border-2 border-gray-200">
                            <span className="text-sm font-medium text-gray-700">Bạn chọn: </span>
                            <span className={`font-bold ${status.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                              {status.userAnswer ? 'ĐÚNG' : 'SAI'}
                            </span>
                          </div>
                          <div className="flex-1 bg-green-100 p-3 rounded-lg border-2 border-green-500">
                            <span className="text-sm font-medium text-gray-700">Đáp án: </span>
                            <span className="font-bold text-green-600">
                              {status.correctAnswer ? 'ĐÚNG' : 'SAI'}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-600">
                          <i className="fas fa-info-circle mr-1"></i>
                          <em>YCCĐ: {q.requirement}</em>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-2xl border-t-2 border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <i className="fas fa-lightbulb mr-2 text-yellow-500"></i>
              Xem lại các câu sai để cải thiện kiến thức
            </div>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all font-bold"
            >
              <i className="fas fa-check mr-2"></i>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamReviewModal;
