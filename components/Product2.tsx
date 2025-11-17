import React, { useState, useMemo } from 'react';
import { QuestionMC, QuestionTF, QuestionLevel, MemberAssignment } from '../types';
import QuestionCard from './QuestionCard';
import MemberTable from './MemberTable';
import { generateContent } from '../utils/geminiAPI';

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
    // Công nghệ điện (Lớp 12)
    { id: 11, question: "Mục đích chính của việc truyền tải điện năng đi xa bằng điện áp cao là để giảm tổn thất công suất trên đường dây.", answer: true, requirement: "Giải thích được vai trò của hệ thống điện quốc gia. (Công nghệ 12)", level: QuestionLevel.UNDERSTAND },
    { id: 12, question: "Trong mạng điện sản xuất quy mô nhỏ, aptomat chỉ có chức năng bảo vệ quá tải, không có chức năng bảo vệ ngắn mạch.", answer: false, requirement: "Trình bày được chức năng các phần tử của mạng điện sản xuất quy mô nhỏ. (Công nghệ 12)", level: QuestionLevel.KNOW },
    // Công nghệ điện tử (Lớp 12)
    { id: 13, question: "Tirixto chỉ cho dòng điện đi qua khi được phân cực thuận và có xung kích ở cực điều khiển G.", answer: true, requirement: "Nêu được công dụng và nguyên lí làm việc của Tirixto. (Công nghệ 12)", level: QuestionLevel.KNOW },
    { id: 14, question: "Trong mạch nguồn một chiều, tụ điện mắc song song với tải có tác dụng làm tăng độ gợn sóng của điện áp.", answer: false, requirement: "Phân tích được sơ đồ và nguyên lí làm việc của mạch nguồn một chiều. (Công nghệ 12)", level: QuestionLevel.UNDERSTAND },
];


type UserAnswers = { [key: number]: string | boolean };

const Product2: React.FC = () => {
    // State cho form nhập liệu
    const [topic, setTopic] = useState('');
    const [grade, setGrade] = useState('12');
    const [numMC, setNumMC] = useState('10');
    const [numTF, setNumTF] = useState('4');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
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

        const prompt = `🎓 Bạn là chuyên gia biên soạn đề thi môn Công nghệ THPT theo Chương trình GDPT 2018.

📚 NGUỒN: SGK Công nghệ lớp ${grade} - Bộ **Kết nối tri thức với cuộc sống** và **Cánh Diều** + Đề thi thật THPT Quốc Gia
   ➡️ Sử dụng nội dung từ CẢ 2 BỘ SÁCH để tạo câu hỏi toàn diện!

🎯 YÊU CẦU TẠO CÂU HỎI:

Chủ đề: "${topic}"

📊 CẤU TRÚC BỘ CÂU HỎI:
✅ ${numMC} câu trắc nghiệm 4 lựa chọn (phân bổ):
   - ${Math.ceil(parseInt(numMC) * 0.4)} câu: Kiến thức Công nghệ lớp 10-11
   - ${Math.ceil(parseInt(numMC) * 0.3)} câu: Công nghệ điện (lớp 12)
   - ${Math.floor(parseInt(numMC) * 0.3)} câu: Công nghệ điện tử (lớp 12)

✅ ${numTF} câu Đúng/Sai (phân bổ):
   - ${Math.ceil(parseInt(numTF) / 2)} câu: Công nghệ điện
   - ${Math.floor(parseInt(numTF) / 2)} câu: Công nghệ điện tử

📋 TIÊU CHUẨN MỖI CÂU:
1. Bám sát SGK **Kết nối tri thức & Cánh Diều** và đề thi thật
2. Ghi rõ YCCĐ (Yêu cầu cần đạt) theo GDPT 2018
3. Mức độ nhận thức: "Nhận biết" / "Thông hiểu" / "Vận dụng"
4. Phương án nhiễu hợp lý, có tính phân hóa
5. Đáp án chính xác tuyệt đối

⚙️ ĐỊNH DẠNG JSON:
{
  "mcQuestions": [
    {
      "question": "Câu hỏi đầy đủ...",
      "options": ["A. Phương án 1", "B. Phương án 2", "C. Phương án 3", "D. Phương án 4"],
      "answer": "B. Phương án 2",
      "requirement": "YCCĐ: Trình bày được... (Công nghệ X)",
      "level": "Nhận biết hoặc Thông hiểu hoặc Vận dụng"
    }
  ],
  "tfQuestions": [
    {
      "question": "Phát biểu đầy đủ...",
      "answer": true/false,
      "requirement": "YCCĐ: ...",
      "level": "Nhận biết hoặc Thông hiểu hoặc Vận dụng"
    }
  ]
}

💡 Đảm bảo câu hỏi có tính thực tế cao, giống đề thi thật!`;

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
                answer: q.answer,
                requirement: q.requirement,
                level: q.level as QuestionLevel
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

    const handleAnswerChange = (questionId: number, answer: string | boolean) => {
        if (isSubmitted) return;
        setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        window.scrollTo(0, 0);
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

    const score = useMemo(() => {
        if (!isSubmitted) return 0;
        return allQuestions.reduce((acc, q) => {
            if (userAnswers[q.id] === q.answer) {
                return acc + 1;
            }
            return acc;
        }, 0);
    }, [isSubmitted, userAnswers, allQuestions]);

    return (
        <div className="space-y-12 animate-fade-in">
            <h2 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400">Sản phẩm học tập số 2: Xây dựng ngân hàng câu hỏi trắc nghiệm</h2>
            
            {/* Form nhập liệu */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-300 dark:border-gray-600 flex items-center">
                    <i className="fas fa-keyboard text-indigo-500 mr-3"></i>Nhập thông tin để tạo câu hỏi
                </h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Chọn lớp
                            </label>
                            <select 
                                value={grade}
                                onChange={(e) => setGrade(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                disabled={loading}
                            >
                                <option value="10">Lớp 10</option>
                                <option value="11">Lớp 11</option>
                                <option value="12">Lớp 12</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Số câu 4 lựa chọn
                            </label>
                            <input
                                type="number"
                                value={numMC}
                                onChange={(e) => setNumMC(e.target.value)}
                                min="1"
                                max="20"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Số câu Đúng/Sai
                            </label>
                            <input
                                type="number"
                                value={numTF}
                                onChange={(e) => setNumTF(e.target.value)}
                                min="1"
                                max="20"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Chủ đề cần tạo câu hỏi (ví dụ: Công nghệ điện, Mạch điện ba pha, Động cơ đốt trong...)
                        </label>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Nhập chủ đề..."
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            disabled={loading}
                        />
                    </div>
                    
                    {error && (
                        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded relative">
                            <i className="fas fa-exclamation-circle mr-2"></i>
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-2"></i>
                                    AI đang tạo câu hỏi...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-magic mr-2"></i>
                                    Tạo câu hỏi với AI
                                </>
                            )}
                        </button>
                        {hasGenerated && (
                            <button
                                onClick={handleResetAll}
                                className="bg-gray-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700 transition-transform transform hover:scale-105"
                            >
                                <i className="fas fa-redo mr-2"></i>
                                Làm mới
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {isSubmitted && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center sticky top-20 z-40">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Kết quả: <span className="text-green-500">{score}</span> / <span className="text-blue-500">{allQuestions.length}</span>
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Bạn đã hoàn thành bài kiểm tra. Hãy xem lại kết quả chi tiết bên dưới.</p>
                </div>
            )}

            {/* Hiển thị câu hỏi khi đã tạo */}
            {hasGenerated && mcQuestionsData.length > 0 && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-300 dark:border-gray-600"><i className="fas fa-list-ol mr-3"></i>Hệ thống câu hỏi trắc nghiệm</h3>
                    
                    <h4 className="text-xl font-semibold mt-6 mb-4 text-gray-700 dark:text-gray-300">A. Trắc nghiệm nhiều lựa chọn</h4>
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
                            <h4 className="text-xl font-semibold mt-8 mb-4 text-gray-700 dark:text-gray-300">B. Trắc nghiệm Đúng/Sai</h4>
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
                    
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-center space-x-4">
                        {!isSubmitted ? (
                            <button onClick={handleSubmit} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                                <i className="fas fa-check-circle mr-2"></i>Kiểm tra đáp án
                            </button>
                        ) : (
                            <button onClick={handleResetAnswers} className="bg-gray-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
                                <i className="fas fa-redo mr-2"></i>Làm lại
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Hướng dẫn sử dụng */}
            {!hasGenerated && (
                <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-3 text-blue-800 dark:text-blue-200 flex items-center">
                        <i className="fas fa-info-circle mr-2"></i>Hướng dẫn sử dụng
                    </h3>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                        <li><i className="fas fa-check text-green-500 mr-2"></i>Chọn lớp học và số lượng câu hỏi mong muốn</li>
                        <li><i className="fas fa-check text-green-500 mr-2"></i>Nhập chủ đề cần tạo câu hỏi (ví dụ: "Công nghệ điện", "Mạch điện ba pha"...)</li>
                        <li><i className="fas fa-check text-green-500 mr-2"></i>Nhấn "Tạo câu hỏi với AI" và chờ AI xử lý</li>
                        <li><i className="fas fa-check text-green-500 mr-2"></i>Làm bài trắc nghiệm và kiểm tra đáp án</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Product2;