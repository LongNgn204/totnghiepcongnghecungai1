import React, { useState, useEffect } from 'react';
import { generateContent } from '../utils/geminiAPI';
import QuestionCard from './QuestionCard';
import { QuestionMC, QuestionTF, QuestionLevel } from '../types';
import { saveExamToHistory, getExamHistory, ExamHistory, deleteExamFromHistory } from '../utils/examStorage';
import LoadingSpinner from './LoadingSpinner';
import { ExamSkeleton } from './Skeleton';
import CountdownTimer from './CountdownTimer';
import ExamReviewModal from './ExamReviewModal';
import {
  FileText,
  History,
  Plus,
  Settings,
  Info,
  AlertTriangle,
  Play,
  CheckCircle,
  Printer,
  RefreshCw,
  Download,
  Trash2,
  Eye,
  Clock,
  Calendar,
  BarChart2
} from 'lucide-react';

const Product3: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [grade, setGrade] = useState('12');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Câu hỏi được tạo
  const [questions, setQuestions] = useState<(QuestionMC | QuestionTF)[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [examTitle, setExamTitle] = useState('');

  // Trả lời
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string | boolean }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  // History & Review
  const [examHistory, setExamHistory] = useState<ExamHistory[]>([]);
  const [selectedExam, setSelectedExam] = useState<ExamHistory | null>(null);

  // Load history when switching to history tab
  useEffect(() => {
    if (activeTab === 'history') {
      const history = getExamHistory().filter(e => e.examType === 'industrial');
      setExamHistory(history);
    }
  }, [activeTab]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to submit
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && hasGenerated && !isSubmitted) {
        e.preventDefault();
        handleSubmit();
      }
      // Escape to reset
      if (e.key === 'Escape' && isSubmitted) {
        e.preventDefault();
        handleReset();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [hasGenerated, isSubmitted]);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setHasGenerated(false);
    setUserAnswers({});
    setIsSubmitted(false);
    setStartTime(Date.now());

    const prompt = `🎓 Bạn là chuyên gia biên soạn đề thi tốt nghiệp THPT môn Công nghệ theo Chương trình GDPT 2018.

📚 **SGK THAM KHẢO:**
   • Sách Kết nối tri thức với cuộc sống (KNTT)
   • Sách Cánh Diều (CD)
   ➡️ Sử dụng nội dung từ CẢ 2 BỘ SÁCH để tạo đề thi chuẩn!

📚 NHIỆM VỤ: Tạo đề thi mô phỏng CHÍNH THỨC với độ khó và nội dung giống đề thi THPT thật.

⚠️ QUAN TRỌNG: Đề thi phải ĐÚNG FORMAT và CÂN ĐỐI với đề thi chính thức của Bộ GD&ĐT!

📋 CẤU TRÚC BẮT BUỘC (28 câu - 50 phút):

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 PHẦN I: TRẮC NGHIỆM 4 LỰA CHỌN (24 câu)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Câu 1-8: Công nghệ 10-11 (8 câu)
   • Lớp 10: Bản vẽ kỹ thuật (hình chiếu, kích thước, dung sai)
   • Lớp 10: Vật liệu công nghiệp (kim loại, phi kim loại, vật liệu composite)
   • Lớp 11: Máy công cụ (máy tiện, máy phay, máy bào, máy khoan)
   • Lớp 11: Động cơ đốt trong (cấu tạo, nguyên lý 4 kỳ, nhiên liệu)
   
🔹 Câu 9-14: Công nghệ ĐIỆN lớp 12 (6 câu)
   • Dòng điện xoay chiều 3 pha (đấu Y, Δ, công suất P = √3UIcosφ)
   • Máy biến áp 3 pha (tỷ số biến đổi, hiệu suất, cấu tạo)
   • Động cơ không đồng bộ 3 pha (nguyên lý, công suất, tốc độ)
   • Hệ thống điện quốc gia (truyền tải, phân phối, an toàn)
   • An toàn điện (nối đất, chống giật, biện pháp phòng ngừa)
   
🔹 Câu 15-20: Công nghệ ĐIỆN TỬ lớp 12 (6 câu)
   • Linh kiện bán dẫn (điốt, transistor, đặc tính VA)
   • Mạch chỉnh lưu (1 pha, 3 pha, lọc tụ, lọc cuộn)
   • Mạch khuếch đại (transistor, hệ số khuếch đại Ku = Ura/Uvào)
   • Op-Amp (khuếch đại đảo, không đảo, cộng, trừ)
   • IC số (IC 74xx, IC 4xxx, ứng dụng)
   • Mạch dao động (LC, RC, tần số f = 1/(2π√LC))

🔹 Câu 21-24: Công nghệ lớp 10-11 (4 câu tiếp)
   • Bản vẽ kỹ thuật, Vật liệu, Máy công cụ, Động cơ

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 PHẦN II: TRẮC NGHIỆM ĐÚNG/SAI (4 câu - Câu 25-28)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️⚠️⚠️ QUAN TRỌNG - ĐỌC KỸ FORMAT MỚI:

🔹 Câu 25-26: Công nghệ ĐIỆN (2 câu)
   ✅ MỖI CÂU CÓ 4 PHÁT BIỂU a), b), c), d) RIÊNG BIỆT
   ✅ HỌC SINH XÁC ĐỊNH TỪNG PHÁT BIỂU LÀ ĐÚNG HAY SAI
   
   📝 FORMAT BẮT BUỘC:
      1. Câu hỏi chính: Cho tình huống/dữ kiện cụ thể
      2. Yêu cầu: "Các phát biểu sau đúng hay sai?"
      3. Liệt kê 4 phát biểu:
         a) Phát biểu 1 (câu hoàn chỉnh, có nội dung cụ thể)
         b) Phát biểu 2 (câu hoàn chỉnh, có nội dung cụ thể)
         c) Phát biểu 3 (câu hoàn chỉnh, có nội dung cụ thể)
         d) Phát biểu 4 (câu hoàn chỉnh, có nội dung cụ thể)
      4. Đáp án: 
         - a: true/false (ĐÚNG hoặc SAI)
         - b: true/false
         - c: true/false
         - d: true/false
      5. Giải thích cho MỖI phát biểu (tại sao đúng/sai)
   
🔹 Câu 27-28: Công nghệ ĐIỆN TỬ (2 câu)
   ✅ FORMAT TƯƠNG TỰ: 4 phát biểu a), b), c), d)
   ✅ Mỗi phát biểu phải độc lập, rõ ràng
   ✅ Đáp án + Giải thích cho từng phát biểu

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 PHÂN BỔ MỨC ĐỘ (THEO CHUẨN BỘ GD&ĐT):
• Nhận biết: 12 câu (43%) - Câu 1,2,3,4,9,10,15,16,21,22,25,26
• Thông hiểu: 12 câu (43%) - Câu 5,6,7,8,11,12,17,18,23,24,27,28
• Vận dụng: 4 câu (14%) - Câu 13,14,19,20

🎯 YÊU CẦU KỸ THUẬT:
1. ✅ Nội dung: BÁM SÁT SGK Cánh Diều, giống đề thi thật 95%
2. ✅ Độ khó: Phù hợp học sinh THPT trung bình - khá
3. ✅ Phương án nhiễu: Hợp lý, có tính phân hóa, dễ nhầm lẫn
4. ✅ Số liệu: Thực tế, có đơn vị chuẩn (V, A, W, Hz, Ω...)
5. ✅ Công thức: Ghi đúng ký hiệu toán học (√, π, cosφ, Δ, ≈...)
6. ✅ Ngôn ngữ: Khoa học, súc tích, rõ ràng, không mơ hồ
7. ✅ YCCĐ: Ghi cụ thể theo SGK Cánh Diều

📝 OUTPUT FORMAT (JSON):
\`\`\`json
{
  "examTitle": "ĐỀ THI THỬ TỐT NGHIỆP THPT NĂM 2025\\nMÔN: CÔNG NGHỆ\\nThời gian: 50 phút (Không kể thời gian giao đề)",
  "questions": [
    {
      "id": 1,
      "type": "mc",
      "question": "Trong hình chiếu vuông góc, hình chiếu bằng của một đường thẳng xảy ra khi đường thẳng đó",
      "options": [
        "A. Song song với mặt phẳng hình chiếu",
        "B. Vuông góc với mặt phẳng hình chiếu",
        "C. Tạo với mặt phẳng góc 45°",
        "D. Nằm trong mặt phẳng hình chiếu"
      ],
      "answer": "A. Song song với mặt phẳng hình chiếu",
      "requirement": "Nhận biết các quy tắc cơ bản về hình chiếu vuông góc",
      "level": "Nhận biết",
      "grade": "10",
      "topic": "Bản vẽ kỹ thuật"
    },
    {
      "id": 25,
      "type": "tf",
      "question": "Cho mạch điện xoay chiều RLC mắc nối tiếp, điện áp hiệu dụng U = 200V. Các phát biểu sau đúng hay sai?\\na) Khi xảy ra cộng hưởng, tổng trở Z = R\\nb) Công suất tiêu thụ cực đại khi XL = XC\\nc) Hệ số công suất cosφ = 1 tại tần số cộng hưởng\\nd) Điện áp hiệu dụng trên R luôn nhỏ hơn U",
      "statements": {
        "a": "Khi xảy ra cộng hưởng, tổng trở Z = R",
        "b": "Công suất tiêu thụ cực đại khi XL = XC",
        "c": "Hệ số công suất cosφ = 1 tại tần số cộng hưởng",
        "d": "Điện áp hiệu dụng trên R luôn nhỏ hơn U"
      },
      "answers": {
        "a": true,
        "b": true,
        "c": true,
        "d": false
      },
      "explanations": {
        "a": "ĐÚNG - Tại cộng hưởng XL = XC nên Z = √(R² + 0²) = R",
        "b": "ĐÚNG - Pmax = U²/R đạt được khi Z = R (cộng hưởng)",
        "c": "ĐÚNG - Tại cộng hưởng φ = 0° nên cosφ = 1",
        "d": "SAI - Tại cộng hưởng UR = U (vì I = U/R và UR = I·R = U)"
      },
      "requirement": "Vận dụng kiến thức về cộng hưởng điện trong mạch RLC",
      "level": "Thông hiểu",
      "grade": "12",
      "topic": "Mạch điện xoay chiều"
    }
  ]
}
\`\`\`

⚠️ LƯU Ý: Chỉ trả về JSON thuần, KHÔNG thêm text giải thích!`;

    try {
      const response = await generateContent(prompt);

      if (!response.success) {
        setError(response.error || 'Có lỗi xảy ra');
        setLoading(false);
        return;
      }

      // Parse JSON
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        setError('Hệ thống chưa trả về đúng định dạng. Vui lòng thử lại.');
        setLoading(false);
        return;
      }

      const data = JSON.parse(jsonMatch[0]);
      setExamTitle(data.examTitle || 'ĐỀ THI MÔ PHỎNG');

      // Convert questions
      const parsedQuestions = data.questions.map((q: any) => {
        if (q.type === 'mc') {
          return {
            id: q.id,
            question: q.question,
            options: q.options,
            answer: q.answer,
            requirement: q.requirement,
            level: q.level as QuestionLevel,
            grade: q.grade,
            topic: q.topic
          } as QuestionMC & { grade: string; topic: string };
        } else {
          return {
            id: q.id,
            question: q.question,
            answer: q.answer,
            requirement: q.requirement,
            level: q.level as QuestionLevel,
            grade: q.grade,
            topic: q.topic,
            // Format mới với 4 phát biểu a, b, c, d
            statements: q.statements,
            answers: q.answers,
            explanations: q.explanations
          } as QuestionTF & { grade: string; topic: string };
        }
      });

      setQuestions(parsedQuestions);
      setHasGenerated(true);
    } catch (err) {
      setError('Có lỗi xảy ra khi xử lý dữ liệu. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, answer: string | boolean) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    const currentEndTime = Date.now();
    setIsSubmitted(true);
    setEndTime(currentEndTime);

    // Calculate score
    const currentScore = questions.reduce((acc, q) => {
      if (userAnswers[q.id] === q.answer) return acc + 1;
      return acc;
    }, 0);

    const percentage = (currentScore / questions.length) * 100;
    const timeSpent = startTime ? Math.round((currentEndTime - startTime) / 1000 / 60) : 0;

    // Save to history
    saveExamToHistory({
      id: `exam_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      examTitle: examTitle,
      examType: 'industrial',
      questions: questions,
      userAnswers: userAnswers,
      score: currentScore,
      totalQuestions: questions.length,
      timeSpent: timeSpent,
      percentage: percentage,
      createdAt: new Date().toISOString(),
      isSubmitted: true
    });

    window.scrollTo(0, 0);
  };

  const handleReset = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setStartTime(Date.now());
    setEndTime(null);
  };

  const handleResetAll = () => {
    setQuestions([]);
    setHasGenerated(false);
    setUserAnswers({});
    setIsSubmitted(false);
    setError('');
    setStartTime(null);
    setEndTime(null);
  };

  const score = questions.reduce((acc, q) => {
    if (userAnswers[q.id] === q.answer) return acc + 1;
    return acc;
  }, 0);

  const timeSpent = startTime && endTime ? Math.round((endTime - startTime) / 1000 / 60) : 0;

  const handleDeleteExam = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đề thi này không?')) {
      deleteExamFromHistory(id);
      setExamHistory(prev => prev.filter(e => e.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800 flex items-center justify-center gap-3">
          <FileText className="text-blue-600" size={32} />
          Sản phẩm học tập số 3: Tạo đề thi mô phỏng
        </h2>
        <p className="text-center text-gray-600">
          Đề thi chuẩn tốt nghiệp THPT Quốc Gia - 28 câu (24 TN + 4 Đ/S), 50 phút
        </p>
        <p className="text-center text-blue-600 text-sm mt-2 flex items-center justify-center gap-2">
          <Info size={16} />
          Công cụ hỗ trợ học tập - Nội dung mang tính tham khảo
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white rounded-lg shadow-sm p-2 border border-gray-200">
        <button
          onClick={() => setActiveTab('create')}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${activeTab === 'create'
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-600 hover:bg-gray-50'
            }`}
        >
          <Plus size={20} />
          Tạo đề mới
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${activeTab === 'history'
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-600 hover:bg-gray-50'
            }`}
        >
          <History size={20} />
          Lịch sử thi ({examHistory.length})
        </button>
      </div>

      {/* Create Tab */}
      {activeTab === 'create' && (
        <>
          {/* Form tạo đề */}
          {!hasGenerated && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-200 flex items-center gap-3 text-gray-800">
                <Settings className="text-blue-500" size={24} /> Cấu hình đề thi
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn lớp ôn tập
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  >
                    <option value="10">Lớp 10 (Trọng tâm: Bản vẽ, Vật liệu)</option>
                    <option value="11">Lớp 11 (Trọng tâm: Động cơ, Máy công cụ)</option>
                    <option value="12">Lớp 12 (Trọng tâm: Điện, Điện tử)</option>
                  </select>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-800">
                    <Info size={18} />
                    Cấu trúc đề thi chuẩn THPT:
                  </h4>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li className="flex items-center gap-2"><CheckCircle size={14} /> <strong>Phần I:</strong> 24 câu trắc nghiệm 4 lựa chọn</li>
                    <li className="ml-6">• Câu 1-8: Công nghệ 10-11 (Phần 1)</li>
                    <li className="ml-6">• Câu 9-14: Công nghệ điện lớp 12</li>
                    <li className="ml-6">• Câu 15-20: Công nghệ điện tử lớp 12</li>
                    <li className="ml-6">• Câu 21-24: Công nghệ 10-11 (Phần 2)</li>
                    <li className="flex items-center gap-2"><CheckCircle size={14} /> <strong>Phần II:</strong> 4 câu Đúng/Sai (Câu 25-28)</li>
                    <li className="ml-6">• Câu 25-26: Công nghệ điện</li>
                    <li className="ml-6">• Câu 27-28: Công nghệ điện tử</li>
                    <li className="mt-2 text-xs text-blue-600 flex items-center gap-1">
                      <Info size={12} /> Dựa trên SGK Kết nối tri thức & Cánh Diều
                    </li>
                  </ul>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative flex items-center gap-2">
                    <AlertTriangle size={20} />
                    {error}
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin"><RefreshCw size={20} /></span>
                      Đang thiết lập đề thi... (30-60 giây)
                    </>
                  ) : (
                    <>
                      <Play size={20} />
                      Tạo đề thi mô phỏng
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="space-y-6">
              <LoadingSpinner
                size="lg"
                text="Hệ thống đang tạo đề thi..."
                showProgress={true}
                progress={50}
              />
              <ExamSkeleton />
            </div>
          )}

          {/* Countdown Timer */}
          {hasGenerated && questions.length > 0 && !isSubmitted && (
            <CountdownTimer
              initialMinutes={50}
              onTimeUp={() => {
                if (!isSubmitted) {
                  handleSubmit();
                  alert('⏰ Hết giờ! Bài thi đã được tự động nộp.');
                }
              }}
              onWarning={(minutes) => {
                alert(`⚠️ Chỉ còn ${minutes} phút! Hãy chuẩn bị nộp bài.`);
              }}
              autoStart={true}
            />
          )}

          {/* Hiển thị kết quả */}
          {isSubmitted && (
            <div className="bg-white p-6 rounded-xl shadow-lg sticky top-20 z-40 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="text-3xl font-bold text-blue-600">
                    {score}/{questions.length}
                  </div>
                  <div className="text-sm text-gray-600">Số câu đúng</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="text-3xl font-bold text-green-600">
                    {((score / questions.length) * 10).toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">Điểm (thang 10)</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="text-3xl font-bold text-purple-600">
                    {timeSpent} phút
                  </div>
                  <div className="text-sm text-gray-600">Thời gian làm bài</div>
                </div>
              </div>
            </div>
          )}

          {/* Đề thi */}
          {hasGenerated && questions.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-center mb-6 border-b pb-4 border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {examTitle}
                </h3>
                <p className="text-gray-600 flex items-center justify-center gap-4">
                  <span className="flex items-center gap-2"><Clock size={18} />Thời gian làm bài: 50 phút</span>
                  <span className="mx-3">|</span>
                  <span className="flex items-center gap-2"><FileText size={18} />28 câu hỏi (24 TN + 4 Đ/S)</span>
                </p>
              </div>

              <div className="mb-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="text-yellow-600 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm font-semibold text-yellow-800 mb-1">
                      Công cụ hỗ trợ học tập môn Công nghệ THPT
                    </p>
                    <ul className="text-xs text-yellow-700 space-y-1">
                      <li>• Đề thi được tạo dựa trên SGK <strong>Kết nối tri thức</strong> và <strong>Cánh Diều</strong></li>
                      <li>• Nội dung mang tính tham khảo, hỗ trợ ôn tập và làm quen format đề thi</li>
                      <li>• Đây là phiên bản demo, có thể chưa chính xác 100%</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Phần I */}
              <div className="mb-8">
                <h4 className="text-xl font-bold mb-4 text-blue-600">
                  PHẦN I: Trắc nghiệm 4 lựa chọn (Câu 1-24)
                </h4>
                <div className="space-y-6">
                  {questions.filter((q): q is QuestionMC => 'options' in q).map((q, idx) => (
                    <div key={q.id} className="border-l-4 border-blue-500 pl-4">
                      <QuestionCard
                        question={q}
                        type="mc"
                        onAnswerChange={handleAnswerChange}
                        userAnswer={userAnswers[q.id]}
                        isSubmitted={isSubmitted}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Phần II */}
              <div className="mb-8">
                <h4 className="text-xl font-bold mb-4 text-green-600">
                  PHẦN II: Trắc nghiệm Đúng/Sai (Câu 25-28)
                </h4>
                <div className="space-y-6">
                  {questions.filter((q): q is QuestionTF => !('options' in q)).map((q) => (
                    <div key={q.id} className="border-l-4 border-green-500 pl-4">
                      <QuestionCard
                        question={q}
                        type="tf"
                        onAnswerChange={handleAnswerChange}
                        userAnswer={userAnswers[q.id]}
                        isSubmitted={isSubmitted}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap justify-center gap-4">
                {!isSubmitted ? (
                  <>
                    <button
                      onClick={handleSubmit}
                      className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-all shadow-md flex items-center gap-2"
                      aria-label="Nộp bài thi (Ctrl+Enter)"
                      title="Nhấn Ctrl+Enter để nộp nhanh"
                    >
                      <CheckCircle size={20} />Nộp bài
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 transition-all flex items-center gap-2"
                      aria-label="In đề thi"
                    >
                      <Printer size={20} />In đề thi
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleReset}
                      className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                    >
                      <RefreshCw size={20} />Làm lại
                    </button>
                    <button
                      onClick={() => {
                        const resultText = `
KẾT QUẢ THI THỬ THPT QUỐC GIA - MÔN CÔNG NGHỆ
${examTitle}

Số câu đúng: ${score}/${questions.length}
Điểm: ${((score / questions.length) * 10).toFixed(1)}/10
Thời gian làm bài: ${timeSpent} phút

CHI TIẾT:
${questions.map((q, idx) => {
                          const userAns = userAnswers[q.id];
                          const isCorrect = userAns === q.answer;
                          return `Câu ${q.id}: ${isCorrect ? '✓ ĐÚNG' : '✗ SAI'} - Đáp án: ${q.answer}`;
                        }).join('\n')}
`;
                        const blob = new Blob([resultText], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `KetQua_ThiThu_${Date.now()}.txt`;
                        a.click();
                      }}
                      className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2"
                    >
                      <Download size={20} />Tải kết quả
                    </button>
                  </>
                )}
                <button
                  onClick={handleResetAll}
                  className="bg-gray-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-700 transition-all flex items-center gap-2"
                >
                  <Plus size={20} />Tạo đề mới
                </button>
              </div>
            </div>
          )}

          {/* Hướng dẫn */}
          {!hasGenerated && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <Info size={24} className="text-blue-500" />
                Lợi ích của đề thi mô phỏng
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-green-500 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-gray-800">Làm quen format đề thi</p>
                    <p className="text-sm text-gray-600">Cấu trúc giống 95% đề thi thật của Bộ GD&ĐT</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="text-blue-500 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-gray-800">Rèn kỹ năng quản lý thời gian</p>
                    <p className="text-sm text-gray-600">50 phút cho 24 câu, trung bình 2 phút/câu</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <BarChart2 className="text-purple-500 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-gray-800">Ôn tập kiến thức toàn diện</p>
                    <p className="text-sm text-gray-600">Bao gồm cả 3 lớp 10, 11, 12 theo SGK KNTT & Cánh Diều</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Trophy className="text-red-500 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-gray-800">Đánh giá năng lực thực tế</p>
                    <p className="text-sm text-gray-600">Xem kết quả ngay, biết điểm mạnh/yếu để cải thiện</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {/* Overall Statistics */}
          {examHistory.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                <BarChart2 className="text-blue-600" size={24} />
                Thống kê tổng quan
              </h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
                  <div className="text-3xl font-bold text-blue-600">{examHistory.length}</div>
                  <div className="text-sm text-gray-600 mt-1">Đề đã làm</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
                  <div className="text-3xl font-bold text-green-600">
                    {(examHistory.reduce((sum, e) => sum + e.percentage, 0) / examHistory.length).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Điểm TB</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-100">
                  <div className="text-3xl font-bold text-purple-600">
                    {Math.max(...examHistory.map(e => e.percentage)).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Cao nhất</div>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-100">
                  <div className="text-3xl font-bold text-orange-600">
                    {examHistory.reduce((sum, e) => sum + e.timeSpent, 0)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Tổng phút</div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
              <History className="text-blue-600" size={24} />
              Lịch sử làm bài
            </h3>

            {examHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <History className="text-gray-300" size={64} />
                </div>
                <p className="text-gray-600 text-lg">Chưa có lịch sử thi</p>
                <p className="text-gray-500 text-sm mt-2">Tạo và làm đề thi để xem lịch sử tại đây</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all flex items-center mx-auto gap-2"
                >
                  <Plus size={20} />
                  Tạo đề thi ngay
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {examHistory.map((exam, idx) => (
                  <div
                    key={exam.id}
                    className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all hover:border-blue-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-800 mb-2">{exam.examTitle}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar size={16} className="text-blue-500" />
                            {new Date(exam.createdAt).toLocaleString('vi-VN')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={16} className="text-purple-500" />
                            {exam.timeSpent} phút
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">Độ chính xác</span>
                            <span className={`font-bold ${exam.percentage >= 80 ? 'text-green-600' :
                              exam.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                              {exam.score}/{exam.totalQuestions} ({exam.percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-1000 ${exam.percentage >= 80 ? 'bg-green-500' :
                                exam.percentage >= 50 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                              style={{ width: `${exam.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => setSelectedExam(exam)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          onClick={() => handleDeleteExam(exam.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selectedExam && (
        <ExamReviewModal
          exam={selectedExam}
          onClose={() => setSelectedExam(null)}
        />
      )}
    </div>
  );
};

export default Product3;
