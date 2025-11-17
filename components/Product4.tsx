import React, { useState } from 'react';
import { generateContent } from '../utils/geminiAPI';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [examTitle, setExamTitle] = useState('');
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: any }>({});

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

🔹 Câu 25-26: TRỒNG TRỌT (2 câu)
   Mỗi câu có 4 ý a), b), c), d) cần xác định Đúng/Sai
   
🔹 Câu 27-28: CHĂN NUÔI (2 câu)
   Mỗi câu có 4 ý a), b), c), d) cần xác định Đúng/Sai

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

**Câu Đúng/Sai trồng trọt:**
"Cho các phát biểu về kỹ thuật trồng lúa:
a) Lúa F1 lai có năng suất cao hơn giống thuần ✓ [ĐÚNG]
b) Nên gieo sạ dày để tăng năng suất ✗ [SAI - làm giảm năng suất]
c) Thời kỳ đòng nước cần tưới nhiều nhất ✓ [ĐÚNG]
d) Phân đạm nên bón 1 lần vào đầu vụ ✗ [SAI - bón nhiều lần]"

**Câu Đúng/Sai chăn nuôi:**
"Về chăn nuôi lợn:
a) Lợn cần protein 14-18% trong khẩu phần ✓ [ĐÚNG]
b) Chuồng nuôi nên kín để giữ ấm ✗ [SAI - cần thoáng khí]
c) Vacxin dịch tả lợn phải tiêm định kỳ ✓ [ĐÚNG]
d) Lợn nái mang thai cần cho ăn nhiều ✗ [SAI - ăn vừa đủ]"

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
            type: 'tf'
          };
        }
      });

      setQuestions(parsedQuestions);
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

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700 dark:text-red-300">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </p>
        </div>
      )}

      {/* Exam Display */}
      {questions.length > 0 && (
        <>
          {/* Action Buttons */}
          <div className="flex gap-4 justify-center no-print">
            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <i className="fas fa-print mr-2"></i>
              In Đề Thi
            </button>
            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-md"
            >
              <i className="fas fa-download mr-2"></i>
              Tải Kết Quả
            </button>
          </div>

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
                    <p className="font-semibold text-gray-800 dark:text-white mb-2">
                      <span className="text-green-600 dark:text-green-400">Câu {q.id}:</span> {q.question}
                    </p>
                    <div className="space-y-1 ml-4">
                      {q.options?.map((opt, idx) => (
                        <p key={idx} className="text-gray-700 dark:text-gray-300">{opt}</p>
                      ))}
                    </div>
                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
                      <i className="fas fa-info-circle mr-1"></i>
                      {q.requirement} • <span className="font-semibold">{q.level}</span> • Lớp {q.grade}
                    </div>
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
                    <p className="font-semibold text-gray-800 dark:text-white mb-2">
                      <span className="text-teal-600 dark:text-teal-400">Câu {q.id}:</span> {q.question}
                    </p>
                    {typeof q.answer === 'object' && (
                      <div className="ml-4 space-y-1 text-gray-700 dark:text-gray-300">
                        {Object.entries(q.answer).map(([key, value]) => (
                          <p key={key}>
                            {key}) {value ? '✓ Đúng' : '✗ Sai'}
                          </p>
                        ))}
                      </div>
                    )}
                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
                      <i className="fas fa-info-circle mr-1"></i>
                      {q.requirement} • <span className="font-semibold">{q.level}</span> • Lớp {q.grade}
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
    </div>
  );
};

export default Product4;
