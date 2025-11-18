import React, { useState, useEffect } from 'react';
import { generateContent } from '../utils/geminiAPI';
import { saveExamToHistory, getExamHistory, ExamHistory, deleteExamFromHistory } from '../utils/examStorage';
import QuestionCard from './QuestionCard';
import LoadingSpinner from './LoadingSpinner';
import { ExamSkeleton } from './Skeleton';
import CountdownTimer from './CountdownTimer';
import ExamReviewModal from './ExamReviewModal';

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

🔢 VÍ DỤ CÂU HỎI CHUẨN:

**Câu trắc nghiệm trồng trọt:**
"Trong công thức phân bón NPK 16-16-8, ý nghĩa của ba số 16-16-8 lần lượt là"
A. % nitơ, photpho, kali ✓
B. g/kg nitơ, photpho, kali
C. % protein, photpho, khoáng
D. mg/l nitơ, photpho, kali

**Câu trắc nghiệm chăn nuôi:**
"Trong chăn nuôi gia cầm, nhiệt độ tối ưu trong chuồng nuôi gà thịt giai đoạn 1-7 ngày tuổi là"
A. 18-22°C
B. 24-26°C
C. 32-35°C ✓
D. 38-40°C

**Câu Đúng/Sai trồng trọt (QUAN TRỌNG - FORMAT BẮT BUỘC):**
"Câu 25. Cho các phát biểu về kỹ thuật trồng lúa trong điều kiện Việt Nam. Các phát biểu sau đúng hay sai?
a) Giống lúa lai F1 có ưu thế lai nên năng suất cao hơn giống thuần từ 15-20%
b) Để tăng năng suất, nên gieo sạ với mật độ dày đặc 250-300 hạt/m²
c) Thời kỳ làm đòng (trổ bông và chín sữa) là giai đoạn cần tưới nước nhiều nhất
d) Phân đạm nên bón toàn bộ một lần vào lúc bón lót để cây hấp thụ tốt

ĐÁP ÁN:
a) ĐÚNG (Lúa F1 lai có ưu thế lai vượt trội về năng suất, theo SGK Kết nối tri thức)
b) SAI (Mật độ quá dày làm cây chống đổ, sâu bệnh, năng suất thấp. Nên gieo 100-120 hạt/m²)
c) ĐÚNG (Giai đoạn đòng nước tiêu hao nước nhiều nhất, thiếu nước làm giảm năng suất nghiêm trọng)
d) SAI (Phân đạm phải chia làm 2-3 lần: lót, trước khi đẻ nhánh, và trước khi trổ)"

**Câu Đúng/Sai chăn nuôi (QUAN TRỌNG - FORMAT BẮT BUỘC):**
"Câu 27. Về kỹ thuật chăn nuôi lợn thịt theo tiêu chuẩn VietGAP. Các phát biểu sau đúng hay sai?
a) Hàm lượng protein thô trong khẩu phần cần đạt 14-18% tùy giai đoạn sinh trưởng
b) Chuồng nuôi nên kín bốn phía để giữ ấm và tránh gió lùa cho lợn
c) Lợn phải được tiêm phòng vacxin dịch tả lợn, tai xanh định kỳ theo lịch
d) Lợn nái mang thai nên cho ăn thả ga để tăng số con/lứa

ĐÁP ÁN:
a) ĐÚNG (Lợn con cần 18%, lợn thịt 14-16% protein theo khuyến cáo)
b) SAI (Chuồng phải thoáng khí, có cửa sổ thông gió để tránh ẩm ướt, khí độc)
c) ĐÚNG (Vacxin là biện pháp phòng bệnh bắt buộc trong chăn nuôi an toàn)
d) SAI (Nái mang thai ăn vừa đủ 2-2.5kg/ngày, ăn nhiều dễ béo, khó đẻ)"

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 rounded-lg shadow-lg text-white">
        <h2 className="text-3xl font-bold text-center mb-2">
          <i className="fas fa-tractor mr-2"></i>
          Sản Phẩm 4: Tạo Đề Thi THPT - Chuyên Đề Nông Nghiệp
        </h2>
        <p className="text-center text-green-100">
          Tạo đề thi mô phỏng chính thức với 24 câu (20 MC + 4 Đúng/Sai)
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white rounded-lg shadow-md p-2">
        <button
          onClick={() => setActiveTab('create')}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'create'
              ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <i className="fas fa-plus-circle mr-2"></i>
          Tạo đề mới
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'history'
              ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <i className="fas fa-history mr-2"></i>
          Lịch sử thi ({examHistory.length})
        </button>
      </div>

      {/* Create Tab */}
      {activeTab === 'create' && (
        <>
          {/* Instructions */}
      <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-3 text-green-800 dark:text-green-200 flex items-center">
          <i className="fas fa-seedling mr-2"></i>
          Cấu trúc đề thi
        </h3>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-green-700 dark:text-green-300">📌 PHẦN I: 20 câu trắc nghiệm 4 lựa chọn</h4>
            <ul className="list-disc list-inside space-y-1 text-sm ml-4 mt-2">
              <li><strong>Câu 1-8:</strong> Công nghệ 10-11 (Bản vẽ, Vật liệu, Máy nông nghiệp)</li>
              <li><strong>Câu 9-14:</strong> Trồng trọt lớp 12 (Giống, Kỹ thuật, Phân bón, Tưới tiêu, BVTV)</li>
              <li><strong>Câu 15-20:</strong> Chăn nuôi lớp 12 (Giống vật nuôi, Thức ăn, Chuồng trại, Phòng bệnh)</li>
            </ul>
          </div>
          <div className="border-l-4 border-teal-500 pl-4">
            <h4 className="font-semibold text-teal-700 dark:text-teal-300">📌 PHẦN II: 4 câu Đúng/Sai</h4>
            <ul className="list-disc list-inside space-y-1 text-sm ml-4 mt-2">
              <li><strong>Câu 21-22:</strong> Trồng trọt (mỗi câu 4 ý a,b,c,d)</li>
              <li><strong>Câu 23-24:</strong> Chăn nuôi (mỗi câu 4 ý a,b,c,d)</li>
            </ul>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900 p-3 rounded border-l-4 border-yellow-500">
            <p className="text-sm"><strong>⏱️ Thời gian:</strong> 50 phút</p>
            <p className="text-sm"><strong>📊 Phân bố:</strong> 42% Nhận biết • 42% Thông hiểu • 16% Vận dụng</p>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="text-center">
        <button
          onClick={generateExam}
          disabled={loading}
          className="px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Đang tạo đề thi...
            </>
          ) : (
            <>
              <i className="fas fa-tractor mr-2"></i>
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
        <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700 dark:text-red-300">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </p>
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
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg exam-content">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white whitespace-pre-line">
                {examTitle}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                (Đề thi có 24 câu, gồm 4 trang)
              </p>
            </div>

            {/* Part I: Multiple Choice */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-green-700 dark:text-green-400">
                PHẦN I: TRẮC NGHIỆM 4 LỰA CHỌN (20 câu)
              </h3>
              <div className="space-y-6">
                {questions.filter(q => q.type === 'mc').map(q => (
                  <div key={q.id} className="border-l-4 border-green-500 pl-4">
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
              <h3 className="text-xl font-bold mb-4 text-teal-700 dark:text-teal-400">
                PHẦN II: TRẮC NGHIỆM ĐÚNG/SAI (4 câu)
              </h3>
              <div className="space-y-6">
                {questions.filter(q => q.type === 'tf').map(q => (
                  <div key={q.id} className="border-l-4 border-teal-500 pl-4">
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
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            {!isSubmitted ? (
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 shadow-lg"
                >
                  <i className="fas fa-check-circle mr-2"></i>Nộp bài
                </button>
                <button
                  onClick={handlePrint}
                  className="bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 transition-transform transform hover:scale-105"
                >
                  <i className="fas fa-print mr-2"></i>In đề thi
                </button>
                <button
                  onClick={handleDownload}
                  className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
                >
                  <i className="fas fa-download mr-2"></i>Tải kết quả
                </button>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900 dark:to-teal-900 p-8 rounded-lg shadow-lg mb-6">
                  <h3 className="text-2xl font-bold text-center mb-4 text-green-800 dark:text-green-200">
                    <i className="fas fa-trophy mr-2"></i>Kết Quả Bài Thi
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Số câu đúng</p>
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400">
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
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Điểm số</p>
                      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
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
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Thời gian</p>
                      <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
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
                    className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
                  >
                    <i className="fas fa-redo mr-2"></i>Làm lại
                  </button>
                  <button
                    onClick={() => {
                      setQuestions([]);
                      setUserAnswers({});
                      setIsSubmitted(false);
                      setStartTime(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105"
                  >
                    <i className="fas fa-plus mr-2"></i>Tạo đề mới
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-green-800 dark:text-green-300 flex items-center">
              <i className="fas fa-star mr-2"></i>
              Lợi ích của việc làm đề thi mô phỏng
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-600 mr-2 mt-1"></i>
                <span><strong>Làm quen format:</strong> Đúng cấu trúc 24 câu của đề thi THPT Quốc Gia</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-600 mr-2 mt-1"></i>
                <span><strong>Bám sát SGK:</strong> Nội dung theo chương trình GDPT 2018 - SGK Cánh Diều Nông nghiệp</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-600 mr-2 mt-1"></i>
                <span><strong>Phân bố chuẩn:</strong> Trồng trọt (8 câu) + Chăn nuôi (8 câu) + Cơ sở (8 câu)</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-600 mr-2 mt-1"></i>
                <span><strong>In và luyện tập:</strong> Dễ dàng in ra giấy để luyện tập như thi thật</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-600 mr-2 mt-1"></i>
                <span><strong>Tiết kiệm thời gian:</strong> Tạo đề chỉ trong ~30 giây với AI Gemini 2.0</span>
              </li>
            </ul>
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
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg shadow-lg p-6 animate-fade-in">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                <i className="fas fa-chart-line text-green-600"></i>
                Thống kê tổng quan
              </h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 text-center shadow-md transform transition-all hover:scale-105">
                  <div className="text-3xl font-bold text-green-600">{examHistory.length}</div>
                  <div className="text-sm text-gray-600 mt-1">Đề đã làm</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-md transform transition-all hover:scale-105">
                  <div className="text-3xl font-bold text-teal-600">
                    {(examHistory.reduce((sum, e) => sum + e.percentage, 0) / examHistory.length).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Điểm TB</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-md transform transition-all hover:scale-105">
                  <div className="text-3xl font-bold text-emerald-600">
                    {Math.max(...examHistory.map(e => e.percentage)).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Cao nhất</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-md transform transition-all hover:scale-105">
                  <div className="text-3xl font-bold text-orange-600">
                    {examHistory.reduce((sum, e) => sum + e.timeSpent, 0)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Tổng phút</div>
                </div>
              </div>
            </div>
          )}

          {examHistory.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <i className="fas fa-history text-gray-300 text-6xl mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có đề thi nào</h3>
              <p className="text-gray-500 mb-6">Hãy tạo đề thi đầu tiên của bạn!</p>
              <button
                onClick={() => setActiveTab('create')}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <i className="fas fa-plus-circle mr-2"></i>
                Tạo đề mới
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {examHistory.map((exam, idx) => (
                <div
                  key={exam.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all animate-fade-in"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        <i className="fas fa-tractor text-green-600 mr-2"></i>
                        {exam.examTitle}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        <span>
                          <i className="fas fa-calendar mr-1"></i>
                          {new Date(exam.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                        <span>
                          <i className="fas fa-clock mr-1"></i>
                          {exam.timeSpent} phút
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-600">Độ chính xác</span>
                          <span className={`font-bold ${
                            exam.percentage >= 80 ? 'text-green-600' :
                            exam.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {exam.score}/{exam.totalQuestions} ({exam.percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${
                              exam.percentage >= 80 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                              exam.percentage >= 50 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                              'bg-gradient-to-r from-red-500 to-red-600'
                            }`}
                            style={{ width: `${exam.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Score Badge */}
                    <div className={`ml-4 px-4 py-2 rounded-full font-bold text-white text-center min-w-[80px] ${
                      exam.percentage >= 80 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                      exam.percentage >= 50 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                      'bg-gradient-to-r from-red-500 to-red-600'
                    }`}>
                      <div className="text-2xl">{exam.percentage.toFixed(0)}%</div>
                      <div className="text-xs opacity-90">
                        {exam.percentage >= 80 ? 'Xuất sắc' :
                         exam.percentage >= 50 ? 'Khá' : 'Cần cố gắng'}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedExam(exam)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      <i className="fas fa-eye mr-2"></i>
                      Xem chi tiết
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Bạn có chắc muốn xóa đề thi này?')) {
                          deleteExamFromHistory(exam.id);
                          setExamHistory(getExamHistory().filter(e => e.examType === 'agriculture'));
                        }
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
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
