import React, { useState, useEffect } from 'react';
import { generateContent } from '../utils/geminiAPI';
import { saveExamToHistory, getExamHistory, ExamHistory, deleteExamFromHistory } from '../utils/examStorage';
import QuestionCard from './QuestionCard';
import LoadingSpinner from './LoadingSpinner';
import { ExamSkeleton } from './Skeleton';
import CountdownTimer from './CountdownTimer';
import ExamReviewModal from './ExamReviewModal';
import {
  Sprout,
  FileText,
  History,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle,
  Printer,
  Download,
  Trash2,
  Eye,
  Trophy,
  BarChart2,
  Info,
  Check,
  Play,
  RefreshCw,
  Loader2,
  BookOpen
} from 'lucide-react';

interface Question {
  id: number;
  type: 'mc' | 'tf';
  question: string;
  options?: string[];
  answer: string | { a: boolean; b: boolean; c: boolean; d: boolean };
  requirement?: string;
  level?: string;
  grade?: string;
  topic?: string;
}

const Product4: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [examTitle, setExamTitle] = useState('');
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: any }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [examHistory, setExamHistory] = useState<ExamHistory[]>([]);
  const [selectedExam, setSelectedExam] = useState<ExamHistory | null>(null);

  useEffect(() => {
    if (activeTab === 'history') {
      const history = getExamHistory().filter(e => e.examType === 'agriculture');
      setExamHistory(history);
    }
  }, [activeTab]);

  const generateExam = async () => {
    const prompt = `🎓 Bạn là chuyên gia biên soạn đề thi tốt nghiệp THPT môn Công nghệ - Chuyên đề NÔNG NGHIỆP theo Chương trình GDPT 2018.

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
   • Lớp 10: Vật liệu (gỗ, tre nứa, nhựa, cao su, vật liệu composite)
   • Lớp 11: Máy nông nghiệp (máy cày, máy bừa, máy gặt đập liên hợp)
   • Lớp 11: Máy động lực (động cơ đốt trong cho máy kéo, bơm nước)
   
🔹 Câu 9-14: TRỒNG TRỌT lớp 12 (6 câu)
   • Giống cây trồng (lúa, ngô, cây công nghiệp)
   • Kỹ thuật canh tác (làm đất, gieo sạ, chăm sóc)
   • Phân bón (NPK, phân hữu cơ, vi lượng)
   • Tưới tiêu (hệ thống tưới, tiêu nước)
   • Bảo vệ thực vật (sâu bệnh, thuốc BVTV)
   • Công nghệ sau thu hoạch (bảo quản, sơ chế)
   
🔹 Câu 15-20: CHĂN NUÔI lớp 12 (6 câu)
   • Giống vật nuôi (lợn, gà, bò, cá)
   • Thức ăn chăn nuôi (protein, năng lượng, khoáng, vitamin)
   • Chuồng trại (thiết kế, vệ sinh, môi trường)
   • Chăm sóc nuôi dưỡng (cho ăn, chế độ dinh dưỡng)
   • Phòng bệnh (vắc-xin, thuốc thú y, an toàn sinh học)
   • Công nghệ sau giết mổ (bảo quản thịt, chế biến)

🔹 Câu 21-24: Công nghệ lớp 10-11 (4 câu tiếp)
   • Bản vẽ kỹ thuật, Vật liệu, Máy nông nghiệp, Máy động lực

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 PHẦN II: TRẮC NGHIỆM ĐÚNG/SAI (4 câu - Câu 25-28)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️⚠️⚠️ QUAN TRỌNG - ĐỌC KỸ FORMAT MỚI:

🔹 Câu 25-26: TRỒNG TRỌT (2 câu)
   ✅ MỖI CÂU CÓ 4 PHÁT BIỂU a), b), c), d) RIÊNG BIỆT
   ✅ HỌC SINH XÁC ĐỊNH TỪNG PHÁT BIỂU LÀ ĐÚNG HAY SAI
   
   📝 FORMAT BẮT BUỘC:
      1. Câu hỏi chính: Cho tình huống về cây trồng (lúa, ngô, rau...)
      2. Yêu cầu: "Các phát biểu sau đúng hay sai?"
      3. Liệt kê 4 phát biểu:
         a) Phát biểu về giống/kỹ thuật (câu hoàn chỉnh)
         b) Phát biểu về phân bón/dinh dưỡng
         c) Phát biểu về tưới tiêu/chăm sóc
         d) Phát biểu về sâu bệnh/thu hoạch
      4. Đáp án: 
         - a: true/false (ĐÚNG hoặc SAI)
         - b: true/false
         - c: true/false
         - d: true/false
      5. Giải thích cho MỖI phát biểu (tại sao đúng/sai)
   
🔹 Câu 27-28: CHĂN NUÔI (2 câu)
   ✅ FORMAT TƯƠNG TỰ: 4 phát biểu a), b), c), d)
   ✅ Nội dung: dinh dưỡng, chuồng trại, vacxin, quản lý đàn
   ✅ Đáp án + Giải thích cho từng phát biểu

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 PHÂN BỔ MỨC ĐỘ (THEO CHUẨN BỘ GD&ĐT):
• Nhận biết: 12 câu (43%) - Câu 1,2,3,4,9,10,15,16,21,22,25,26
• Thông hiểu: 12 câu (43%) - Câu 5,6,7,8,11,12,17,18,23,24,27,28
• Vận dụng: 4 câu (14%) - Câu 13,14,19,20

🎯 YÊU CẦU KỸ THUẬT:
1. ✅ Nội dung: BÁM SÁT SGK **Kết nối tri thức & Cánh Diều** Nông nghiệp, giống đề thi thật 95%
2. ✅ Độ khó: Phù hợp học sinh THPT trung bình - khá
3. ✅ Phương án nhiễu: Hợp lý, có tính phân hóa, dễ nhầm lẫn
4. ✅ Số liệu: Thực tế (VD: N-P-K 16-16-8, suất ăn 2.5kg/ngày, độ ẩm 14%...)
5. ✅ Thuật ngữ: Đúng chuyên ngành (giống F1, lai tạo, tăng trọng, FCR...)
6. ✅ Ngôn ngữ: Khoa học, súc tích, rõ ràng, không mơ hồ
7. ✅ YCCĐ: Ghi cụ thể theo SGK Cánh Diều

📝 OUTPUT FORMAT (JSON):
\`\`\`json
{
  "examTitle": "ĐỀ THI THỬ TỐT NGHIỆP THPT NĂM 2025\\nMÔN: CÔNG NGHỆ (CHUYÊN ĐỀ NÔNG NGHIỆP)\\nThời gian: 50 phút (Không kể thời gian giao đề)",
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
      "question": "Cho các phát biểu về kỹ thuật canh tác lúa nước theo quy trình VietGAP. Các phát biểu sau đúng hay sai?\\na) Giống lúa F1 lai có năng suất cao hơn giống thuần 15-20%\\nb) Mật độ gieo sạ nên đạt 250-300 hạt/m² để tăng năng suất\\nc) Giai đoạn đòng nước (trổ-chín sữa) cần tưới nhiều nhất\\nd) Phân đạm nên bón toàn bộ một lần vào lúc bón lót",
      "statements": {
        "a": "Giống lúa F1 lai có năng suất cao hơn giống thuần 15-20%",
        "b": "Mật độ gieo sạ nên đạt 250-300 hạt/m² để tăng năng suất",
        "c": "Giai đoạn đòng nước (trổ-chín sữa) cần tưới nhiều nhất",
        "d": "Phân đạm nên bón toàn bộ một lần vào lúc bón lót"
      },
      "answers": {
        "a": true,
        "b": false,
        "c": true,
        "d": false
      },
      "explanations": {
        "a": "ĐÚNG - Lúa F1 lai có ưu thế lai vượt trội về năng suất theo SGK",
        "b": "SAI - Mật độ quá dày làm cây chống đổ, sâu bệnh. Nên 100-120 hạt/m²",
        "c": "ĐÚNG - Đòng nước là giai đoạn tiêu hao nước lớn nhất của lúa",
        "d": "SAI - Phân đạm chia 2-3 lần: lót, trước đẻ nhánh, trước trổ"
      },
      "requirement": "Vận dụng kiến thức về kỹ thuật trồng lúa",
      "level": "Thông hiểu",
      "grade": "12",
      "topic": "Trồng trọt"
    }
  ]
}
\`\`\`

⚠️ LƯU Ý: Chỉ trả về JSON thuần, KHÔNG thêm text giải thích!`;

    try {
      setLoading(true);
      setError('');
      setQuestions([]);
      setUserAnswers({});
      setExamTitle('');

      const response = await generateContent(prompt);

      if (!response.success) {
        setError(response.error || 'Có lỗi xảy ra');
        setLoading(false);
        return;
      }

      // Parse JSON
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        setError('AI chưa trả về đúng định dạng. Vui lòng thử lại.');
        setLoading(false);
        return;
      }

      const data = JSON.parse(jsonMatch[0]);
      setExamTitle(data.examTitle || 'ĐỀ THI MÔ PHỎNG NÔNG NGHIỆP');

      // Convert questions
      const parsedQuestions = data.questions.map((q: any) => {
        if (q.type === 'mc') {
          return {
            id: q.id,
            question: q.question,
            options: q.options,
            answer: q.answer,
            requirement: q.requirement,
            level: q.level,
            grade: q.grade,
            topic: q.topic,
            type: 'mc'
          };
        } else {
          return {
            id: q.id,
            question: q.question,
            answer: q.answer,
            requirement: q.requirement,
            level: q.level,
            grade: q.grade,
            topic: q.topic,
            type: 'tf',
            // Format mới với 4 phát biểu a, b, c, d
            statements: q.statements,
            answers: q.answers,
            explanations: q.explanations
          };
        }
      });

      setQuestions(parsedQuestions);
      setStartTime(Date.now());
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Có lỗi xảy ra khi tạo đề thi. Vui lòng thử lại.');
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, answer: any) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);

    // Tính điểm
    let correctCount = 0;
    questions.forEach(q => {
      const userAnswer = userAnswers[q.id];
      if (q.type === 'mc') {
        if (userAnswer === q.answer) correctCount++;
      } else if (q.type === 'tf') {
        const correctAnswer = q.answer as { a: boolean; b: boolean; c: boolean; d: boolean };
        if (
          userAnswer?.a === correctAnswer.a &&
          userAnswer?.b === correctAnswer.b &&
          userAnswer?.c === correctAnswer.c &&
          userAnswer?.d === correctAnswer.d
        ) {
          correctCount++;
        }
      }
    });

    const score = correctCount;
    const percentage = (score / questions.length) * 100;
    const timeSpent = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

    // Lưu vào localStorage
    const examId = `exam_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    saveExamToHistory({
      id: examId,
      examTitle: examTitle,
      examType: 'agriculture',
      questions: questions,
      userAnswers: userAnswers,
      score: score,
      totalQuestions: questions.length,
      timeSpent: timeSpent,
      percentage: percentage,
      createdAt: new Date().toISOString(),
      isSubmitted: true
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    let content = examTitle + '\n\n';

    questions.forEach(q => {
      content += `Câu ${q.id}: ${q.question}\n`;
      if (q.type === 'mc' && q.options) {
        q.options.forEach(opt => content += `${opt}\n`);
      }
      content += `Đáp án: ${typeof q.answer === 'object' ? JSON.stringify(q.answer) : q.answer}\n`;
      content += `YCCĐ: ${q.requirement}\n`;
      content += `Mức độ: ${q.level}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'de-thi-nong-nghiep.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteExam = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đề thi này không?')) {
      deleteExamFromHistory(id);
      setExamHistory(prev => prev.filter(e => e.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-2xl shadow-lg text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
          <Sprout size={200} />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-center mb-3 flex items-center justify-center gap-3">
            <Sprout className="w-8 h-8" />
            Sản Phẩm 4: Tạo Đề Thi THPT - Chuyên Đề Nông Nghiệp
          </h2>
          <p className="text-center text-blue-100 max-w-2xl mx-auto text-lg">
            Tạo đề thi mô phỏng chính thức với 24 câu (20 MC + 4 Đúng/Sai)
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white rounded-xl shadow-sm p-2 border border-gray-200">
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
          {/* Instructions */}
          <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Cấu trúc đề thi
            </h3>
            <div className="space-y-4 text-gray-700">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  PHẦN I: 20 câu trắc nghiệm 4 lựa chọn
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm ml-6 text-blue-900">
                  <li><strong>Câu 1-8:</strong> Công nghệ 10-11 (Bản vẽ, Vật liệu, Máy nông nghiệp)</li>
                  <li><strong>Câu 9-14:</strong> Trồng trọt lớp 12 (Giống, Kỹ thuật, Phân bón, Tưới tiêu, BVTV)</li>
                  <li><strong>Câu 15-20:</strong> Chăn nuôi lớp 12 (Giống vật nuôi, Thức ăn, Chuồng trại, Phòng bệnh)</li>
                </ul>
              </div>

              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <h4 className="font-bold text-indigo-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  PHẦN II: 4 câu Đúng/Sai
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm ml-6 text-indigo-900">
                  <li><strong>Câu 21-22:</strong> Trồng trọt (mỗi câu 4 ý a,b,c,d)</li>
                  <li><strong>Câu 23-24:</strong> Chăn nuôi (mỗi câu 4 ý a,b,c,d)</li>
                </ul>
              </div>

              <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-xl border border-yellow-100 text-yellow-800">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">Thời gian: 50 phút</span>
                </div>
                <div className="h-4 w-px bg-yellow-200"></div>
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-5 h-5" />
                  <span className="font-semibold">Phân bố: 42% Nhận biết • 42% Thông hiểu • 16% Vận dụng</span>
                </div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center py-4">
            <button
              onClick={generateExam}
              disabled={loading}
              className="px-10 py-5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl text-lg flex items-center justify-center mx-auto gap-3 transform hover:-translate-y-1"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-6 h-6" />
                  Đang tạo đề thi...
                </>
              ) : (
                <>
                  <Sprout className="w-6 h-6" />
                  Tạo Đề Thi Nông Nghiệp
                </>
              )}
            </button>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="space-y-6">
              <LoadingSpinner
                size="lg"
                text="AI Gemini đang tạo đề thi Nông nghiệp..."
                showProgress={true}
                progress={50}
              />
              <ExamSkeleton />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-3 text-red-700">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              {error}
            </div>
          )}

          {/* Countdown Timer */}
          {!loading && questions.length > 0 && !isSubmitted && (
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

          {/* Exam Display */}
          {!loading && questions.length > 0 && (
            <>
              {/* Exam Content */}
              <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-200 exam-content">
                <div className="text-center mb-10 border-b border-gray-100 pb-8">
                  <h2 className="text-2xl font-bold mb-3 text-gray-900 whitespace-pre-line leading-relaxed">
                    {examTitle}
                  </h2>
                  <p className="text-gray-500 font-medium">
                    (Đề thi có 24 câu, gồm 4 trang)
                  </p>
                </div>

                {/* Part I: Multiple Choice */}
                <div className="mb-12">
                  <h3 className="text-xl font-bold mb-6 text-blue-800 bg-blue-50 p-4 rounded-lg inline-block">
                    PHẦN I: TRẮC NGHIỆM 4 LỰA CHỌN (20 câu)
                  </h3>
                  <div className="space-y-8">
                    {questions.filter(q => q.type === 'mc').map(q => (
                      <div key={q.id} className="pl-4 border-l-4 border-blue-500">
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

                {/* Part II: True/False */}
                <div>
                  <h3 className="text-xl font-bold mb-6 text-indigo-800 bg-indigo-50 p-4 rounded-lg inline-block">
                    PHẦN II: TRẮC NGHIỆM ĐÚNG/SAI (4 câu)
                  </h3>
                  <div className="space-y-8">
                    {questions.filter(q => q.type === 'tf').map(q => (
                      <div key={q.id} className="pl-4 border-l-4 border-indigo-500">
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
              </div>

              {/* Submit Button and Results */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                {!isSubmitted ? (
                  <div className="flex flex-wrap justify-center gap-4">
                    <button
                      onClick={handleSubmit}
                      className="bg-blue-600 text-white font-bold py-4 px-10 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Nộp bài
                    </button>
                    <button
                      onClick={handlePrint}
                      className="bg-white text-gray-700 font-bold py-4 px-8 rounded-xl border border-gray-300 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                    >
                      <Printer className="w-5 h-5" />
                      In đề thi
                    </button>
                    <button
                      onClick={handleDownload}
                      className="bg-white text-gray-700 font-bold py-4 px-8 rounded-xl border border-gray-300 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Tải kết quả
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-inner mb-8 border border-blue-100">
                      <h3 className="text-2xl font-bold text-center mb-6 text-blue-900 flex items-center justify-center gap-3">
                        <Trophy className="w-8 h-8 text-yellow-500" />
                        Kết Quả Bài Thi
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                          <p className="text-gray-500 mb-1">Số câu đúng</p>
                          <p className="text-3xl font-bold text-blue-600">
                            {Object.keys(userAnswers).filter(key => {
                              const q = questions.find(q => q.id === parseInt(key));
                              if (!q) return false;
                              if (q.type === 'mc') {
                                return userAnswers[parseInt(key)] === q.answer;
                              } else {
                                const correctAnswer = q.answer as { a: boolean; b: boolean; c: boolean; d: boolean };
                                const userAnswer = userAnswers[parseInt(key)];
                                return userAnswer?.a === correctAnswer.a &&
                                  userAnswer?.b === correctAnswer.b &&
                                  userAnswer?.c === correctAnswer.c &&
                                  userAnswer?.d === correctAnswer.d;
                              }
                            }).length}/{questions.length}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                          <p className="text-gray-500 mb-1">Điểm số</p>
                          <p className="text-3xl font-bold text-indigo-600">
                            {((Object.keys(userAnswers).filter(key => {
                              const q = questions.find(q => q.id === parseInt(key));
                              if (!q) return false;
                              if (q.type === 'mc') {
                                return userAnswers[parseInt(key)] === q.answer;
                              } else {
                                const correctAnswer = q.answer as { a: boolean; b: boolean; c: boolean; d: boolean };
                                const userAnswer = userAnswers[parseInt(key)];
                                return userAnswer?.a === correctAnswer.a &&
                                  userAnswer?.b === correctAnswer.b &&
                                  userAnswer?.c === correctAnswer.c &&
                                  userAnswer?.d === correctAnswer.d;
                              }
                            }).length / questions.length) * 10).toFixed(1)}/10
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                          <p className="text-gray-500 mb-1">Thời gian</p>
                          <p className="text-3xl font-bold text-purple-600">
                            {startTime ? Math.floor((Date.now() - startTime) / 60000) : 0} phút
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => {
                          setIsSubmitted(false);
                          setUserAnswers({});
                          setStartTime(Date.now());
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-white text-blue-600 font-bold py-4 px-10 rounded-xl border-2 border-blue-600 hover:bg-blue-50 transition-all flex items-center gap-2"
                      >
                        <RefreshCw className="w-5 h-5" />
                        Làm lại
                      </button>
                      <button
                        onClick={() => {
                          setQuestions([]);
                          setUserAnswers({});
                          setIsSubmitted(false);
                          setStartTime(null);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-blue-600 text-white font-bold py-4 px-10 rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg"
                      >
                        <Plus className="w-5 h-5" />
                        Tạo đề mới
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Benefits */}
              <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm mt-8">
                <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  Lợi ích của việc làm đề thi mô phỏng
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <strong className="text-gray-900">Làm quen format</strong>
                      <p className="text-sm text-gray-600">Đúng cấu trúc 24 câu của đề thi THPT Quốc Gia</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <strong className="text-gray-900">Bám sát SGK</strong>
                      <p className="text-sm text-gray-600">Nội dung theo chương trình GDPT 2018 - SGK Cánh Diều Nông nghiệp</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <strong className="text-gray-900">Phân bố chuẩn</strong>
                      <p className="text-sm text-gray-600">Trồng trọt (8 câu) + Chăn nuôi (8 câu) + Cơ sở (8 câu)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <strong className="text-gray-900">Tiết kiệm thời gian</strong>
                      <p className="text-sm text-gray-600">Tạo đề chỉ trong ~30 giây với AI Gemini 2.5 Pro</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {/* Overall Statistics */}
          {examHistory.length > 0 && (
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-8 text-white animate-fade-in">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <BarChart2 className="w-6 h-6" />
                Thống kê tổng quan
              </h3>
              <div className="grid grid-cols-4 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                  <div className="text-3xl font-bold">{examHistory.length}</div>
                  <div className="text-sm text-blue-100 mt-1">Đề đã làm</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                  <div className="text-3xl font-bold">
                    {(examHistory.reduce((sum, e) => sum + e.percentage, 0) / examHistory.length).toFixed(1)}%
                  </div>
                  <div className="text-sm text-blue-100 mt-1">Điểm TB</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                  <div className="text-3xl font-bold">
                    {Math.max(...examHistory.map(e => e.percentage)).toFixed(1)}%
                  </div>
                  <div className="text-sm text-blue-100 mt-1">Cao nhất</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                  <div className="text-3xl font-bold">
                    {examHistory.reduce((sum, e) => sum + e.timeSpent, 0)}
                  </div>
                  <div className="text-sm text-blue-100 mt-1">Tổng phút</div>
                </div>
              </div>
            </div>
          )}

          {examHistory.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <History className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có đề thi nào</h3>
              <p className="text-gray-500 mb-8">Hãy tạo đề thi đầu tiên của bạn để bắt đầu luyện tập!</p>
              <button
                onClick={() => setActiveTab('create')}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center mx-auto gap-2 font-bold shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Tạo đề mới
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {examHistory.map((exam, idx) => (
                <div
                  key={exam.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all animate-fade-in group"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {exam.examTitle}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(exam.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="flex items-center gap-1">
                          <History className="w-4 h-4" />
                          {exam.timeSpent} phút
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Độ chính xác</span>
                          <span className={`font-bold ${exam.percentage >= 80 ? 'text-green-600' :
                            exam.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                            {exam.score}/{exam.totalQuestions} ({exam.percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
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

                    {/* Score Badge */}
                    <div className={`ml-6 px-4 py-2 rounded-lg font-bold text-white text-center min-w-[80px] ${exam.percentage >= 80 ? 'bg-green-500' :
                      exam.percentage >= 50 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}>
                      {exam.percentage.toFixed(0)}%
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => setSelectedExam(exam)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteExam(exam.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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

export default Product4;
