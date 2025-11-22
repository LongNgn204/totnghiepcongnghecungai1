import React, { useState, useMemo } from 'react';
import { QuestionMC, QuestionTF, QuestionLevel } from '../types';
import QuestionCard from './QuestionCard';
import { generateContent } from '../utils/geminiAPI';
import { api } from '../utils/apiClient';

// Dữ liệu mẫu dựa trên sách giáo khoa Cánh Diều
const defaultMcQuestionsData: QuestionMC[] = [
    // Công nghệ 10 & 11
    { id: 1, question: "Theo tiêu chuẩn Việt Nam (TCVN), có mấy loại khổ giấy chính dùng trong bản vẽ kĩ thuật?", options: ["3", "4", "5", "6"], answer: "5", requirement: "Trình bày được các nội dung cơ bản của tiêu chuẩn về trình bày bản vẽ kĩ thuật (khổ giấy, tỉ lệ, nét vẽ, chữ viết). (Công nghệ 10)", level: QuestionLevel.KNOW },
    { id: 2, question: "Động cơ đốt trong biến đổi năng lượng nào thành cơ năng?", options: ["Điện năng", "Hóa năng (nhiên liệu)", "Thế năng", "Quang năng"], answer: "Hóa năng (nhiên liệu)", requirement: "Trình bày được khái niệm và phân loại động cơ đốt trong. (Công nghệ 11)", level: QuestionLevel.UNDERSTAND },
    // Công nghệ điện (Lớp 12)
    { id: 3, question: "Trong mạch điện ba pha mắc hình sao có dây trung hòa, dòng điện trong dây trung hòa (I₀) có đặc điểm gì khi tải đối xứng?", options: ["I₀ = Iₚ", "I₀ = Iₐ + Iₑ + Iₐ", "I₀ = 0", "I₀ = √3 * Iₚ"], answer: "I₀ = 0", requirement: "Trình bày được cách nối nguồn điện và tải hình sao, hình tam giác. (Công nghệ 12)", level: QuestionLevel.UNDERSTAND },
    { id: 4, question: "Máy biến áp ba pha có công dụng gì trong hệ thống truyền tải điện năng?", options: ["Biến đổi tần số dòng điện", "Biến đổi điện áp của hệ thống dòng điện xoay chiều", "Biến đổi dòng xoay chiều thành một chiều", "Ổn định công suất"], answer: "Biến đổi điện áp của hệ thống dòng điện xoay chiều", requirement: "Nêu được công dụng, cấu tạo, nguyên lí làm việc của máy biến áp ba pha. (Công nghệ 12)", level: QuestionLevel.KNOW },
    { id: 5, question: "Tốc độ quay của từ trường trong động cơ không đồng bộ ba pha được tính bằng công thức nào?", options: ["n₁ = 60f/p", "n₁ = 60p/f", "n₁ = f/60p", "n₁ = 60pf"], answer: "n₁ = 60f/p", requirement: "Giải thích được nguyên lí làm việc của động cơ không đồng bộ ba pha. (Công nghệ 12)", level: QuestionLevel.UNDERSTAND },
    { id: 6, question: "Một hộ gia đình sử dụng một động cơ điện xoay chiều 220V. Để bảo vệ động cơ, cần chọn aptomat có các thông số định mức như thế nào?", options: ["Uđm > 220V, Iđm > I làm việc", "Uđm < 220V", "Iđm < I làm việc", "Chỉ cần Uđm = 220V"], answer: "Uđm > 220V, Iđm > I làm việc", requirement: "Lựa chọn được phương án đấu dây và các thiết bị phù hợp cho mạng điện trong nhà. (Công nghệ 12)", level: QuestionLevel.APPLY },
    // Công nghệ điện tử (Lớp 12)
    { id: 7, question: "Linh kiện điện tử nào được dùng để biến đổi điện áp xoay chiều thành điện áp một chiều?", options: ["Tụ điện", "Tranzito", "Điôt", "Điện trở"], answer: "Điôt", requirement: "Trình bày được cấu tạo, nguyên lí làm việc và công dụng của một số linh kiện điện tử cơ bản. (Công nghệ 12)", level: QuestionLevel.KNOW },
    { id: 8, question: "Trong mạch khuếch đại dùng tranzito, tín hiệu được đưa vào cực nào và lấy ra ở cực nào để có độ lợi dòng điện lớn nhất (mắc E chung)?", options: ["Vào B, ra C", "Vào E, ra C", "Vào B, ra E", "Vào C, ra B"], answer: "Vào B, ra C", requirement: "Phân tích được nguyên lí làm việc của mạch khuếch đại dùng tranzito. (Công nghệ 12)", level: QuestionLevel.UNDERSTAND },
    { id: 9, question: "IC khuếch đại thuật toán (Op-Amp) có đặc điểm nào sau đây?", options: ["Hệ số khuếch đại rất nhỏ, tổng trở vào rất lớn", "Hệ số khuếch đại rất lớn, tổng trở vào rất lớn", "Hệ số khuếch đại rất lớn, tổng trở vào rất nhỏ", "Hệ số khuếch đại và tổng trở vào đều nhỏ"], answer: "Hệ số khuếch đại rất lớn, tổng trở vào rất lớn", requirement: "Nêu được khái niệm, cấu tạo, kí hiệu và các thông số cơ bản của IC và Op-Amp. (Công nghệ 12)", level: QuestionLevel.KNOW },
    { id: 10, question: "Để tạo ra một mạch dao động đa hài tự kích dùng hai tranzito, cần phải có loại liên kết nào giữa hai tầng khuếch đại?", options: ["Liên kết một chiều", "Liên kết xoay chiều", "Hồi tiếp dương", "Hồi tiếp âm"], answer: "Hồi tiếp dương", requirement: "Trình bày được sơ đồ và nguyên lí làm việc của mạch tạo xung đa hài tự kích dùng tranzito. (Công nghệ 12)", level: QuestionLevel.APPLY },
];

const defaultTfQuestionsData: QuestionTF[] = [
    {
        id: 11,
        question: "Mỗi phát biểu sau đây là đúng hay sai về hệ thống điện quốc gia?",
        answer: true, // Placeholder
        requirement: "Giải thích được vai trò của hệ thống điện quốc gia. (Công nghệ 12)",
        level: QuestionLevel.UNDERSTAND,
        statements: {
            a: "Hệ thống điện quốc gia gồm nguồn điện, lưới điện và các hộ tiêu thụ điện.",
            b: "Lưới điện phân phối có điện áp từ 110kV trở lên.",
            c: "Trung tâm điều độ hệ thống điện quốc gia có vai trò chỉ huy, điều khiển quá trình sản xuất, truyền tải và phân phối điện năng.",
            d: "Việc kết nối lưới điện quốc gia giúp nâng cao độ tin cậy cung cấp điện."
        },
        answers: { a: true, b: false, c: true, d: true },
        explanations: {
            a: "Đúng. Theo định nghĩa SGK.",
            b: "Sai. Lưới điện phân phối thường có điện áp từ 35kV trở xuống. 110kV trở lên là lưới truyền tải.",
            c: "Đúng. Đây là chức năng chính của trung tâm điều độ.",
            d: "Đúng. Kết nối lưới giúp hỗ trợ công suất giữa các vùng miền."
        }
    },
    {
        id: 12,
        question: "Mỗi phát biểu sau đây là đúng hay sai về linh kiện bán dẫn?",
        answer: false, // Placeholder
        requirement: "Trình bày được cấu tạo, nguyên lí làm việc của linh kiện bán dẫn. (Công nghệ 12)",
        level: QuestionLevel.KNOW,
        statements: {
            a: "Điôt bán dẫn có tính chất dẫn điện theo hai chiều như nhau.",
            b: "Tranzito lưỡng cực (BJT) có 3 cực là E, B, C.",
            c: "Tirixto có thể dùng để chỉnh lưu dòng điện có điều khiển.",
            d: "Triac chỉ dẫn điện theo một chiều từ A1 sang A2."
        },
        answers: { a: false, b: true, c: true, d: false },
        explanations: {
            a: "Sai. Điôt chỉ dẫn điện theo một chiều (phân cực thuận).",
            b: "Đúng. Cấu tạo BJT gồm 3 cực Emitter, Base, Collector.",
            c: "Đúng. Tirixto là linh kiện chỉnh lưu có điều khiển.",
            d: "Sai. Triac dẫn điện theo cả hai chiều."
        }
    }
];


type UserAnswers = { [key: number]: any }; // Changed to any to support object for TF questions

const Product2: React.FC = () => {
    // State cho form nhập liệu
    const [topic, setTopic] = useState('');
    const [grade, setGrade] = useState('12');
    const [difficulty, setDifficulty] = useState('Khó');
    const [numMC, setNumMC] = useState('10');
    const [numTF, setNumTF] = useState('4');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    // State cho câu hỏi được tạo
    const [mcQuestionsData, setMcQuestionsData] = useState<QuestionMC[]>(defaultMcQuestionsData);
    const [tfQuestionsData, setTfQuestionsData] = useState<QuestionTF[]>(defaultTfQuestionsData);
    const [hasGenerated, setHasGenerated] = useState(false);

    // State cho trả lời
    const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const allQuestions = useMemo(() => [...mcQuestionsData, ...tfQuestionsData], [mcQuestionsData, tfQuestionsData]);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Vui lòng nhập chủ đề cần tạo câu hỏi');
            return;
        }

        setLoading(true);
        setError('');
        setHasGenerated(false);
        setUserAnswers({});
        setIsSubmitted(false);

        const prompt = `🎓 Bạn là chuyên gia sư phạm và biên soạn đề thi môn Công nghệ THPT hàng đầu Việt Nam.
Bạn am hiểu sâu sắc Chương trình GDPT 2018 và tâm lý học sinh Gen Z.

📚 NGUỒN TÀI LIỆU:
- SGK Công nghệ lớp ${grade} (Bộ **Kết nối tri thức** và **Cánh Diều**)
- Đề thi tốt nghiệp THPT Quốc gia các năm gần đây.

🎯 NHIỆM VỤ: Tạo bộ câu hỏi kiểm tra kiến thức chủ đề: "${topic}"

🔥 ĐỘ KHÓ YÊU CẦU: **${difficulty.toUpperCase()}**
${difficulty === 'Dễ' ? '- Tập trung vào mức độ NHẬN BIẾT và THÔNG HIỂU.\n- Câu hỏi ngắn gọn, trực diện, kiểm tra kiến thức cơ bản trong SGK.\n- Tránh các câu hỏi đánh đố hoặc quá phức tạp.' : ''}
${difficulty === 'Khó' ? '- Tập trung vào mức độ THÔNG HIỂU và VẬN DỤNG.\n- Yêu cầu học sinh phải suy luận, liên kết kiến thức.\n- Các phương án nhiễu phải có tính phân loại cao.' : ''}
${difficulty === 'Rất khó' ? '- Tập trung vào mức độ VẬN DỤNG và VẬN DỤNG CAO.\n- Đưa ra các tình huống thực tế hóc búa, bài toán kỹ thuật phức tạp.\n- Yêu cầu tư duy tổng hợp, phân tích sâu.' : ''}

✍️ PHONG CÁCH NGÔN NGỮ (QUAN TRỌNG):
- **Tự nhiên & Hiện đại:** Diễn đạt câu hỏi một cách trôi chảy, gợi mở, tránh văn phong khô khan, cứng nhắc của sách cũ.
- **Gần gũi:** Sử dụng từ ngữ dễ hiểu, có thể liên hệ với các ví dụ thực tế trong đời sống hàng ngày của học sinh.
- **Sư phạm:** Câu hỏi phải giúp học sinh "ngộ" ra kiến thức, không chỉ là kiểm tra trí nhớ.

📊 CẤU TRÚC ĐỀ THI:
1. **${numMC} câu trắc nghiệm 4 lựa chọn:**
   - Phân bổ kiến thức hợp lý theo chủ đề.
   - Đảm bảo có đủ 4 phương án A, B, C, D.

2. **${numTF} câu trắc nghiệm Đúng/Sai:**
   - Mỗi câu gồm 1 câu dẫn và 4 phát biểu (a, b, c, d).
   - Các phát biểu phải liên quan chặt chẽ đến câu dẫn và có tính logic.

⚙️ ĐỊNH DẠNG JSON (BẮT BUỘC - KHÔNG THÊM LỜI DẪN):
{
  "mcQuestions": [
    {
      "question": "Nội dung câu hỏi...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "answer": "B. ...",
      "requirement": "YCCĐ: ...",
      "level": "${difficulty === 'Dễ' ? 'Nhận biết' : difficulty === 'Khó' ? 'Thông hiểu' : 'Vận dụng'}"
    }
  ],
  "tfQuestions": [
    {
      "question": "Câu dẫn...",
      "statements": { "a": "...", "b": "...", "c": "...", "d": "..." },
      "answers": { "a": true, "b": false, "c": true, "d": false },
      "explanations": { "a": "...", "b": "...", "c": "...", "d": "..." },
      "requirement": "YCCĐ: ...",
      "level": "${difficulty === 'Dễ' ? 'Thông hiểu' : difficulty === 'Khó' ? 'Vận dụng' : 'Vận dụng cao'}"
    }
  ]
}`;

        try {
            const response = await generateContent(prompt);

            if (!response.success) {
                setError(response.error || 'Có lỗi xảy ra');
                setLoading(false);
                return;
            }

            // Parse JSON từ response
            const jsonMatch = response.text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                setError('AI chưa trả về đúng định dạng. Vui lòng thử lại.');
                setLoading(false);
                return;
            }

            const data = JSON.parse(jsonMatch[0]);

            // Chuyển đổi dữ liệu
            const mcQuestions: QuestionMC[] = data.mcQuestions.map((q: any, idx: number) => ({
                id: idx + 1,
                question: q.question,
                options: q.options,
                answer: q.answer,
                requirement: q.requirement,
                level: q.level as QuestionLevel
            }));

            const tfQuestions: QuestionTF[] = data.tfQuestions.map((q: any, idx: number) => ({
                id: mcQuestions.length + idx + 1,
                question: q.question,
                answer: true, // Placeholder
                requirement: q.requirement,
                level: q.level as QuestionLevel,
                statements: q.statements,
                answers: q.answers,
                explanations: q.explanations
            }));

            setMcQuestionsData(mcQuestions);
            setTfQuestionsData(tfQuestions);
            setHasGenerated(true);
        } catch (err) {
            setError('Có lỗi xảy ra khi xử lý dữ liệu từ AI. Vui lòng thử lại.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionId: number, answer: any) => {
        if (isSubmitted) return;
        setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleSubmit = async () => {
        setIsSubmitted(true);
        window.scrollTo(0, 0);

        // Calculate score for saving
        let currentScore = 0;
        mcQuestionsData.forEach(q => {
            if (userAnswers[q.id] === q.answer) {
                currentScore += 1;
            }
        });
        tfQuestionsData.forEach(q => {
            if (q.statements && q.answers) {
                const userAns = userAnswers[q.id] as { [key: string]: boolean } | undefined;
                if (userAns) {
                    Object.keys(q.statements).forEach(key => {
                        if (userAns[key] === q.answers?.[key as 'a' | 'b' | 'c' | 'd']) {
                            currentScore += 0.25;
                        }
                    });
                }
            }
        });

        const examData = {
            title: `Đề thi ${topic || 'Tổng hợp'} - Lớp ${grade}`,
            description: `Độ khó: ${difficulty}`,
            subject: 'Công nghệ',
            grade: grade,
            difficulty: difficulty,
            duration: 0,
            score: currentScore,
            total_questions: mcQuestionsData.length + tfQuestionsData.length,
            questions: JSON.stringify([...mcQuestionsData, ...tfQuestionsData]),
            answers: JSON.stringify(userAnswers)
        };

        try {
            setSaving(true);
            await api.exams.create(examData);
        } catch (error) {
            console.error('Failed to save exam result:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleResetAnswers = () => {
        setUserAnswers({});
        setIsSubmitted(false);
    };

    const handleResetAll = () => {
        setTopic('');
        setMcQuestionsData(defaultMcQuestionsData);
        setTfQuestionsData(defaultTfQuestionsData);
        setHasGenerated(false);
        setUserAnswers({});
        setIsSubmitted(false);
        setError('');
    };

    const handleDownload = () => {
        let content = `ĐỀ THI MÔN CÔNG NGHỆ - CHỦ ĐỀ: ${topic || 'TỔNG HỢP'}\n`;
        content += `Lớp: ${grade}\n`;
        content += `Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}\n\n`;

        content += `--- PHẦN 1: TRẮC NGHIỆM NHIỀU LỰA CHỌN ---\n\n`;
        mcQuestionsData.forEach((q, idx) => {
            content += `Câu ${idx + 1}: ${q.question}\n`;
            q.options.forEach(opt => content += `   ${opt}\n`);
            content += `   Đáp án đúng: ${q.answer}\n`;
            content += `   YCCĐ: ${q.requirement}\n\n`;
        });

        content += `--- PHẦN 2: TRẮC NGHIỆM ĐÚNG/SAI ---\n\n`;
        tfQuestionsData.forEach((q, idx) => {
            content += `Câu ${mcQuestionsData.length + idx + 1}: ${q.question}\n`;
            if (q.statements && q.answers) {
                Object.entries(q.statements).forEach(([key, stmt]) => {
                    const isTrue = q.answers?.[key as 'a' | 'b' | 'c' | 'd'];
                    content += `   ${key}) ${stmt} -> ${isTrue ? 'ĐÚNG' : 'SAI'}\n`;
                    if (q.explanations?.[key as 'a' | 'b' | 'c' | 'd']) {
                        content += `      Giải thích: ${q.explanations[key as 'a' | 'b' | 'c' | 'd']}\n`;
                    }
                });
            }
            content += `   YCCĐ: ${q.requirement}\n\n`;
        });

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `de-thi-cong-nghe-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const score = useMemo(() => {
        if (!isSubmitted) return 0;
        let totalScore = 0;

        // Score MC questions (1 point each)
        mcQuestionsData.forEach(q => {
            if (userAnswers[q.id] === q.answer) {
                totalScore += 1;
            }
        });

        // Score TF questions (1 point per question if all statements correct, or 0.25 each)
        // Let's use 0.25 per correct statement for granular scoring
        tfQuestionsData.forEach(q => {
            if (q.statements && q.answers) {
                const userAns = userAnswers[q.id] as { [key: string]: boolean } | undefined;
                if (userAns) {
                    Object.keys(q.statements).forEach(key => {
                        if (userAns[key] === q.answers?.[key as 'a' | 'b' | 'c' | 'd']) {
                            totalScore += 0.25;
                        }
                    });
                }
            }
        });

        return totalScore;
    }, [isSubmitted, userAnswers, mcQuestionsData, tfQuestionsData]);

    const maxScore = mcQuestionsData.length + tfQuestionsData.length * 1; // Assuming 1 point per TF question (0.25 * 4)

    return (
        <div className="space-y-12 animate-fade-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-2xl shadow-lg text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                    <span className="text-9xl">📚</span>
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-center mb-3 flex items-center justify-center gap-3">
                        <span>📚</span>
                        Sản phẩm học tập số 2: Ngân hàng câu hỏi
                    </h2>
                    <p className="text-center text-blue-100 max-w-2xl mx-auto text-lg">
                        Tạo bộ câu hỏi trắc nghiệm và đúng/sai tự động từ SGK với AI Gemini 2.5 Pro
                    </p>
                </div>
            </div>

            {/* Form nhập liệu */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold mb-6 border-b border-gray-100 pb-4 flex items-center gap-2 text-gray-900">
                    <span className="text-blue-600">⚙️</span>
                    Cấu hình tạo câu hỏi
                </h3>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Chọn lớp
                            </label>
                            <select
                                value={grade}
                                onChange={(e) => setGrade(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
                                disabled={loading}
                            >
                                <option value="10">Lớp 10</option>
                                <option value="11">Lớp 11</option>
                                <option value="12">Lớp 12</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Độ khó
                            </label>
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
                                disabled={loading}
                            >
                                <option value="Dễ">Dễ (Cơ bản)</option>
                                <option value="Khó">Khó (Vận dụng)</option>
                                <option value="Rất khó">Rất khó (Vận dụng cao)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Số câu 4 lựa chọn
                            </label>
                            <input
                                type="number"
                                value={numMC}
                                onChange={(e) => setNumMC(e.target.value)}
                                min="1"
                                max="20"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Số câu Đúng/Sai
                            </label>
                            <input
                                type="number"
                                value={numTF}
                                onChange={(e) => setNumTF(e.target.value)}
                                min="1"
                                max="20"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Chủ đề cần tạo câu hỏi (ví dụ: Công nghệ điện, Mạch điện ba pha, Động cơ đốt trong...)
                        </label>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Nhập chủ đề..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
                            <span>⚠️</span>
                            {error}
                        </div>
                    )}

                    <div className="flex gap-4 pt-2">
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            {loading ? (
                                <>
                                    <span className="mr-2 animate-spin">⏳</span>
                                    AI đang tạo câu hỏi {difficulty.toLowerCase()}...
                                </>
                            ) : (
                                <>
                                    <span className="mr-2">✨</span>
                                    Tạo câu hỏi {difficulty.toLowerCase()}
                                </>
                            )}
                        </button>
                        {hasGenerated && (
                            <button
                                onClick={handleResetAll}
                                className="bg-white text-gray-700 font-bold py-4 px-6 rounded-xl border border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center shadow-sm hover:shadow-md"
                            >
                                <span className="mr-2">🔄</span>
                                Làm mới
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {isSubmitted && (
                <div className="bg-white p-6 rounded-xl shadow-lg text-center sticky top-24 z-40 border border-blue-100 animate-fade-in-down">
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-3">
                        <span className="text-yellow-500 text-3xl">🏆</span>
                        Kết quả: <span className="text-blue-600 text-3xl">{score}</span> / <span className="text-gray-500">{maxScore}</span>
                    </h3>
                    <p className="text-gray-600 mt-2">Bạn đã hoàn thành bài kiểm tra. Hãy xem lại kết quả chi tiết bên dưới.</p>
                </div>
            )}

            {/* Hiển thị câu hỏi khi đã tạo */}
            {hasGenerated && mcQuestionsData.length > 0 && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                        <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                            <span className="text-blue-600">📋</span>
                            Hệ thống câu hỏi trắc nghiệm
                        </h3>
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                        >
                            <span>📥</span>
                            Tải đề về
                        </button>
                    </div>

                    <h4 className="text-lg font-bold mt-6 mb-4 text-blue-800 bg-blue-50 p-3 rounded-lg inline-block">A. Trắc nghiệm nhiều lựa chọn</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {mcQuestionsData.map(q =>
                            <QuestionCard
                                key={q.id}
                                question={q}
                                type="mc"
                                onAnswerChange={handleAnswerChange}
                                userAnswer={userAnswers[q.id]}
                                isSubmitted={isSubmitted}
                            />)}
                    </div>

                    {tfQuestionsData.length > 0 && (
                        <>
                            <h4 className="text-lg font-bold mt-10 mb-4 text-blue-800 bg-blue-50 p-3 rounded-lg inline-block">B. Trắc nghiệm Đúng/Sai</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {tfQuestionsData.map(q =>
                                    <QuestionCard
                                        key={q.id}
                                        question={q}
                                        type="tf"
                                        onAnswerChange={handleAnswerChange}
                                        userAnswer={userAnswers[q.id]}
                                        isSubmitted={isSubmitted}
                                    />)}
                            </div>
                        </>
                    )}

                    <div className="mt-10 pt-8 border-t border-gray-100 flex justify-center space-x-4">
                        {!isSubmitted ? (
                            <button onClick={handleSubmit} className="bg-blue-600 text-white font-bold py-4 px-12 rounded-xl hover:bg-blue-700 transition-all flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                <span className="mr-2">✅</span> Kiểm tra đáp án
                            </button>
                        ) : (
                            <button onClick={handleResetAnswers} className="bg-white text-blue-600 font-bold py-4 px-12 rounded-xl border-2 border-blue-600 hover:bg-blue-50 transition-all flex items-center shadow-md">
                                <span className="mr-2">🔄</span> Làm lại
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Hướng dẫn sử dụng */}
            {!hasGenerated && (
                <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
                    <h3 className="text-xl font-bold mb-4 text-blue-900 flex items-center gap-2">
                        <span className="text-2xl">ℹ️</span>
                        Hướng dẫn sử dụng
                    </h3>
                    <ul className="space-y-3 text-blue-800">
                        <li className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm border border-blue-100">
                            <div className="bg-blue-100 p-1 rounded-full">
                                <span className="text-blue-600 text-xs">✓</span>
                            </div>
                            Chọn lớp học và số lượng câu hỏi mong muốn
                        </li>
                        <li className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm border border-blue-100">
                            <div className="bg-blue-100 p-1 rounded-full">
                                <span className="text-blue-600 text-xs">✓</span>
                            </div>
                            Nhập chủ đề cần tạo câu hỏi (ví dụ: "Công nghệ điện", "Mạch điện ba pha"...)
                        </li>
                        <li className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm border border-blue-100">
                            <div className="bg-blue-100 p-1 rounded-full">
                                <span className="text-blue-600 text-xs">✓</span>
                            </div>
                            Nhấn "Tạo câu hỏi với AI" và chờ AI xử lý
                        </li>
                        <li className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm border border-blue-100">
                            <div className="bg-blue-100 p-1 rounded-full">
                                <span className="text-blue-600 text-xs">✓</span>
                            </div>
                            Làm bài trắc nghiệm và kiểm tra đáp án
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Product2;
