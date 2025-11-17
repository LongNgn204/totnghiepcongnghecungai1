import React, { useState } from 'react';
import { generateContent } from '../utils/geminiAPI';
import QuestionCard from './QuestionCard';
import { QuestionMC, QuestionTF, QuestionLevel } from '../types';
import { saveExamToHistory } from '../utils/examStorage';

const Product3: React.FC = () => {
  const [grade, setGrade] = useState('12');
  const [examType, setExamType] = useState('full'); // full: 24 câu, custom: tùy chỉnh
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

🔹 Câu 25-26: Công nghệ ĐIỆN (2 câu)
   Mỗi câu có 4 ý a), b), c), d) cần xác định Đúng/Sai
   
🔹 Câu 27-28: Công nghệ ĐIỆN TỬ (2 câu)
   Mỗi câu có 4 ý a), b), c), d) cần xác định Đúng/Sai

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

🔢 VÍ DỤ CÂU HỎI CHUẨN:

**Câu trắc nghiệm:**
"Một máy biến áp lý tưởng có tỷ số vòng dây n₁/n₂ = 10. Khi đặt vào cuộn sơ cấp điện áp 220V thì điện áp ở cuộn thứ cấp là"
A. 22V ✓
B. 2200V
C. 110V
D. 440V

**Câu Đúng/Sai:**
"Cho mạch điện xoay chiều ba pha đối xứng, điện áp pha Up = 220V.
a) Khi đấu Y, điện áp dây Ud = 220V [SAI - Ud = 380V]
b) Khi đấu Δ, dòng dây Id = √3 Ipha [ĐÚNG]
c) Công suất P = 3UpIpcosφ [ĐÚNG]
d) Tần số của mỗi pha là 100Hz [SAI - f = 50Hz]"

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
        setError('AI chưa trả về đúng định dạng. Vui lòng thử lại.');
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
            topic: q.topic
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

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg shadow-lg text-white">
        <h2 className="text-3xl font-bold text-center mb-2">
          <i className="fas fa-file-alt mr-2"></i>
          Sản phẩm học tập số 3: Tạo đề thi mô phỏng
        </h2>
        <p className="text-center text-blue-100">
          Đề thi chuẩn tốt nghiệp THPT Quốc Gia - 28 câu (24 TN + 4 Đ/S), 50 phút
        </p>
        <p className="text-center text-blue-50 text-sm mt-2">
          <i className="fas fa-info-circle mr-1"></i>
          Công cụ hỗ trợ học tập - Nội dung mang tính tham khảo
        </p>
      </div>

      {/* Form tạo đề */}
      {!hasGenerated && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-300 dark:border-gray-600 flex items-center">
            <i className="fas fa-cog text-blue-500 mr-3"></i>Cấu hình đề thi
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Chọn lớp ôn tập
              </label>
              <select 
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={loading}
              >
                <option value="10">Lớp 10 (Trọng tâm: Bản vẽ, Vật liệu)</option>
                <option value="11">Lớp 11 (Trọng tâm: Động cơ, Máy công cụ)</option>
                <option value="12">Lớp 12 (Trọng tâm: Điện, Điện tử)</option>
              </select>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-md">
              <h4 className="font-semibold mb-2 flex items-center">
                <i className="fas fa-info-circle mr-2"></i>
                Cấu trúc đề thi chuẩn THPT:
              </h4>
              <ul className="space-y-1 text-sm">
                <li>✅ <strong>Phần I:</strong> 24 câu trắc nghiệm 4 lựa chọn</li>
                <li className="ml-6">• Câu 1-8: Công nghệ 10-11 (Phần 1)</li>
                <li className="ml-6">• Câu 9-14: Công nghệ điện lớp 12</li>
                <li className="ml-6">• Câu 15-20: Công nghệ điện tử lớp 12</li>
                <li className="ml-6">• Câu 21-24: Công nghệ 10-11 (Phần 2)</li>
                <li>✅ <strong>Phần II:</strong> 4 câu Đúng/Sai (Câu 25-28)</li>
                <li className="ml-6">• Câu 25-26: Công nghệ điện</li>
                <li className="ml-6">• Câu 27-28: Công nghệ điện tử</li>
                <li className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                  <i className="fas fa-book mr-1"></i>Dựa trên SGK Kết nối tri thức & Cánh Diều
                </li>
              </ul>
            </div>

            {error && (
              <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded relative">
                <i className="fas fa-exclamation-circle mr-2"></i>
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  AI đang tạo đề thi... (30-60 giây)
                </>
              ) : (
                <>
                  <i className="fas fa-magic mr-2"></i>
                  Tạo đề thi mô phỏng với AI
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Hiển thị kết quả */}
      {isSubmitted && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg sticky top-20 z-40">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {score}/{questions.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Số câu đúng</div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {((score / questions.length) * 10).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Điểm (thang 10)</div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {timeSpent} phút
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Thời gian làm bài</div>
            </div>
          </div>
        </div>
      )}

      {/* Đề thi */}
      {hasGenerated && questions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="text-center mb-6 border-b-2 pb-4">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {examTitle}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              <i className="fas fa-clock mr-2"></i>Thời gian làm bài: 50 phút
              <span className="mx-3">|</span>
              <i className="fas fa-book mr-2"></i>28 câu hỏi (24 TN + 4 Đ/S)
            </p>
          </div>

          <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 rounded-lg border-l-4 border-yellow-500">
            <div className="flex items-start space-x-3">
              <i className="fas fa-info-circle text-yellow-600 dark:text-yellow-400 text-xl mt-0.5"></i>
              <div>
                <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                  Công cụ hỗ trợ học tập môn Công nghệ THPT
                </p>
                <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• Đề thi do AI tạo dựa trên SGK <strong>Kết nối tri thức</strong> và <strong>Cánh Diều</strong></li>
                  <li>• Nội dung mang tính tham khảo, hỗ trợ ôn tập và làm quen format đề thi</li>
                  <li>• Đây là phiên bản demo, có thể chưa chính xác 100%</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Phần I */}
          <div className="mb-8">
            <h4 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">
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
            <h4 className="text-xl font-bold mb-4 text-green-600 dark:text-green-400">
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

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap justify-center gap-4">
            {!isSubmitted ? (
              <>
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 shadow-lg"
                >
                  <i className="fas fa-check-circle mr-2"></i>Nộp bài
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 transition-transform transform hover:scale-105"
                >
                  <i className="fas fa-print mr-2"></i>In đề thi
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleReset}
                  className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
                >
                  <i className="fas fa-redo mr-2"></i>Làm lại
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
                  className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105"
                >
                  <i className="fas fa-download mr-2"></i>Tải kết quả
                </button>
              </>
            )}
            <button
              onClick={handleResetAll}
              className="bg-gray-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-700 transition-transform transform hover:scale-105"
            >
              <i className="fas fa-plus-circle mr-2"></i>Tạo đề mới
            </button>
          </div>
        </div>
      )}

      {/* Hướng dẫn */}
      {!hasGenerated && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
            <i className="fas fa-graduation-cap mr-2"></i>
            Lợi ích của đề thi mô phỏng
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <i className="fas fa-check-circle text-green-500 text-xl mt-1"></i>
              <div>
                <p className="font-semibold">Làm quen format đề thi</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Cấu trúc giống 95% đề thi thật của Bộ GD&ĐT</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <i className="fas fa-clock text-blue-500 text-xl mt-1"></i>
              <div>
                <p className="font-semibold">Rèn kỹ năng quản lý thời gian</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">50 phút cho 24 câu, trung bình 2 phút/câu</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <i className="fas fa-brain text-purple-500 text-xl mt-1"></i>
              <div>
                <p className="font-semibold">Ôn tập kiến thức toàn diện</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Bao gồm cả 3 lớp 10, 11, 12 theo SGK KNTT & Cánh Diều</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <i className="fas fa-chart-line text-red-500 text-xl mt-1"></i>
              <div>
                <p className="font-semibold">Đánh giá năng lực thực tế</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Xem kết quả ngay, biết điểm mạnh/yếu để cải thiện</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product3;
