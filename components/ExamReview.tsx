import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getExamById, ExamHistory } from '../utils/examStorage';
import QuestionCard from './QuestionCard';

const ExamReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<ExamHistory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const examData = getExamById(id);
      if (examData) {
        setExam(examData);
      } else {
        // Exam not found, redirect to history
        navigate('/lich-su');
      }
    }
    setLoading(false);
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="bg-white dark:bg-gray-800 p-12 rounded-lg shadow text-center">
        <i className="fas fa-exclamation-circle text-6xl text-red-500 mb-4"></i>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Không tìm thấy đề thi
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Đề thi này có thể đã bị xóa hoặc không tồn tại
        </p>
        <Link
          to="/lich-su"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all inline-block"
        >
          <i className="fas fa-arrow-left mr-2"></i>Quay lại lịch sử
        </Link>
      </div>
    );
  }

  const mcQuestions = exam.questions.filter(q => 'options' in q);
  const tfQuestions = exam.questions.filter(q => !('options' in q));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className={`bg-gradient-to-r ${
        exam.examType === 'industrial'
          ? 'from-purple-600 to-pink-600'
          : 'from-green-600 to-teal-600'
      } p-6 rounded-lg shadow-lg text-white`}>
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/lich-su"
            className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all"
          >
            <i className="fas fa-arrow-left mr-2"></i>Quay lại
          </Link>
          <span className={`px-4 py-2 rounded-full font-medium ${
            exam.examType === 'industrial'
              ? 'bg-purple-900 bg-opacity-50'
              : 'bg-green-900 bg-opacity-50'
          }`}>
            <i className={`fas ${exam.examType === 'industrial' ? 'fa-industry' : 'fa-tractor'} mr-2`}></i>
            {exam.examType === 'industrial' ? 'Công nghiệp' : 'Nông nghiệp'}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">
          <i className="fas fa-eye mr-2"></i>
          Xem Lại Đề Thi
        </h2>
        <p className="text-center text-white text-opacity-90">
          {new Date(exam.createdAt).toLocaleString('vi-VN')}
        </p>
      </div>

      {/* Score Summary */}
      {exam.isSubmitted && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
            <i className="fas fa-chart-bar mr-2"></i>Kết quả
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {exam.score}/{exam.totalQuestions}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Số câu đúng</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900 rounded-lg">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {((exam.score / exam.totalQuestions) * 10).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Điểm (thang 10)</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {exam.percentage.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Tỷ lệ đúng</div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900 rounded-lg">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {exam.timeSpent} phút
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Thời gian</div>
            </div>
          </div>
        </div>
      )}

      {/* Exam Title */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="text-center border-b-2 pb-4 mb-6">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {exam.examTitle}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            <i className="fas fa-book mr-2"></i>28 câu hỏi (24 TN + 4 Đ/S)
            <span className="mx-3">|</span>
            <i className="fas fa-clock mr-2"></i>Thời gian: 50 phút
          </p>
        </div>

        {/* Phần I: Multiple Choice */}
        <div className="mb-8">
          <h4 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">
            PHẦN I: Trắc nghiệm 4 lựa chọn (Câu 1-24)
          </h4>
          <div className="space-y-6">
            {mcQuestions.map((q) => (
              <div key={q.id} className="border-l-4 border-blue-500 pl-4">
                <QuestionCard
                  question={q}
                  type="mc"
                  onAnswerChange={() => {}}
                  userAnswer={exam.userAnswers[q.id]}
                  isSubmitted={true}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Phần II: True/False */}
        <div className="mb-8">
          <h4 className="text-xl font-bold mb-4 text-green-600 dark:text-green-400">
            PHẦN II: Trắc nghiệm Đúng/Sai (Câu 25-28)
          </h4>
          <div className="space-y-6">
            {tfQuestions.map((q) => (
              <div key={q.id} className="border-l-4 border-green-500 pl-4">
                <QuestionCard
                  question={q}
                  type="tf"
                  onAnswerChange={() => {}}
                  userAnswer={exam.userAnswers[q.id]}
                  isSubmitted={true}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
          >
            <i className="fas fa-print mr-2"></i>In đề thi
          </button>
          <button
            onClick={() => {
              const resultText = `
XEM LẠI ĐỀ THI - ${exam.examType === 'industrial' ? 'CÔNG NGHIỆP' : 'NÔNG NGHIỆP'}
${exam.examTitle}
Ngày làm: ${new Date(exam.createdAt).toLocaleString('vi-VN')}

${exam.isSubmitted ? `KẾT QUẢ:
Số câu đúng: ${exam.score}/${exam.totalQuestions}
Điểm: ${((exam.score / exam.totalQuestions) * 10).toFixed(1)}/10
Tỷ lệ đúng: ${exam.percentage.toFixed(1)}%
Thời gian: ${exam.timeSpent} phút
` : 'Chưa nộp bài'}

CHI TIẾT CÂU HỎI:
${exam.questions.map((q, idx) => {
  const userAns = exam.userAnswers[q.id];
  const isCorrect = userAns === q.answer;
  return `\nCâu ${q.id}: ${exam.isSubmitted ? (isCorrect ? '✓ ĐÚNG' : '✗ SAI') : '(Chưa trả lời)'}
Câu hỏi: ${q.question}
${exam.isSubmitted ? `Đáp án đúng: ${q.answer}` : ''}
${userAns ? `Bạn chọn: ${userAns}` : '(Chưa chọn đáp án)'}`;
}).join('\n')}
`;
              const blob = new Blob([resultText], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `XemLai_DeThi_${exam.id}.txt`;
              a.click();
            }}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
          >
            <i className="fas fa-download mr-2"></i>Tải kết quả
          </button>
          <Link
            to="/lich-su"
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
          >
            <i className="fas fa-arrow-left mr-2"></i>Về lịch sử
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExamReview;
