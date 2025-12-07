import React, { useState, useMemo } from 'react';
import ProductTemplate from './layout/ProductTemplate';
import { FileText, Zap } from 'lucide-react';
import { QuestionMC, QuestionTF, QuestionLevel } from '../types';
import QuestionCard from './QuestionCard';
import { generateContent } from '../utils/geminiAPI';
import { ExamDataSchema } from '../utils/validation';
import { getErrorMessage } from '../utils/errorHandler';
import { api } from '../utils/apiClient';

// Data and logic remain the same
const defaultMcQuestionsData: QuestionMC[] = [
    { id: 1, question: "Theo TCVN, có mấy loại khổ giấy chính trong bản vẽ kĩ thuật?", options: ["3", "4", "5", "6"], answer: "5", requirement: "Nội dung cơ bản của tiêu chuẩn trình bày bản vẽ kĩ thuật.", level: QuestionLevel.KNOW },
    { id: 2, question: "Động cơ đốt trong biến đổi năng lượng nào thành cơ năng?", options: ["Điện năng", "Hóa năng", "Thế năng", "Quang năng"], answer: "Hóa năng", requirement: "Khái niệm và phân loại động cơ đốt trong.", level: QuestionLevel.UNDERSTAND },
];
const defaultTfQuestionsData: QuestionTF[] = [
    {
        id: 3,
        question: "Các phát biểu sau về hệ thống điện quốc gia là đúng hay sai?",
        requirement: "Vai trò của hệ thống điện quốc gia.",
        level: QuestionLevel.UNDERSTAND,
        statements: [
            { id: 'a', text: "Gồm nguồn điện, lưới điện, hộ tiêu thụ.", isCorrect: true, explanation: "Đúng." },
            { id: 'b', text: "Lưới phân phối có điện áp từ 110kV trở lên.", isCorrect: false, explanation: "Sai, dưới 35kV." },
            { id: 'c', text: "Trung tâm điều độ chỉ huy toàn bộ hệ thống.", isCorrect: true, explanation: "Đúng." },
            { id: 'd', text: "Kết nối lưới giúp tăng độ tin cậy.", isCorrect: true, explanation: "Đúng." }
        ]
    },
];

const Product2: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [grade, setGrade] = useState('12');
    const [difficulty, setDifficulty] = useState('Khó');
    const [numMC, setNumMC] = useState('10');
    const [numTF, setNumTF] = useState('4');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mcQuestionsData, setMcQuestionsData] = useState<QuestionMC[]>(defaultMcQuestionsData);
    const [tfQuestionsData, setTfQuestionsData] = useState<QuestionTF[]>(defaultTfQuestionsData);
    const [hasGenerated, setHasGenerated] = useState(false);
    const [userAnswers, setUserAnswers] = useState<{ [key: number]: any }>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const allQuestions = useMemo(() => [...mcQuestionsData, ...tfQuestionsData], [mcQuestionsData, tfQuestionsData]);

    const handleGenerate = async () => {
        // Input validation
        const numMCVal = parseInt(numMC, 10);
        const numTFVal = parseInt(numTF, 10);
        if (!topic.trim()) {
            setError('Vui lòng nhập chủ đề cần tạo câu hỏi');
            return;
        }
        if (!['10', '11', '12'].includes(grade)) {
            setError('Lớp không hợp lệ (chỉ 10, 11, 12)');
            return;
        }
        if (!['Dễ', 'Khó', 'Rất khó'].includes(difficulty)) {
            setError('Độ khó không hợp lệ (Dễ/Khó/Rất khó)');
            return;
        }
        if (isNaN(numMCVal) || numMCVal < 1 || numMCVal > 50) {
            setError('Số câu trắc nghiệm phải từ 1 đến 50');
            return;
        }
        if (isNaN(numTFVal) || numTFVal < 1 || numTFVal > 20) {
            setError('Số câu Đúng/Sai phải từ 1 đến 20');
            return;
        }

        setLoading(true);
        setError('');
        setHasGenerated(false);
        setUserAnswers({});
        setIsSubmitted(false);

        const prompt = `Tạo bộ câu hỏi môn Công nghệ THPT, chủ đề: "${topic}", lớp ${grade}, độ khó: ${difficulty}. Gồm ${numMCVal} câu trắc nghiệm 4 lựa chọn và ${numTFVal} câu Đúng/Sai (mỗi câu 4 ý). Trả về JSON theo format: { "mcQuestions": [{"question", "options", "answer", "requirement", "level"}], "tfQuestions": [{"question", "statements": [{"id": "a", "text": "...", "isCorrect": boolean, "explanation": "..."}], "requirement", "level"}] }`;

        try {
            const response = await generateContent(prompt);
            if (!response.success) throw new Error(response.error || 'Lỗi không xác định');

            // Extract JSON safely (supports code blocks)
            const extractJSON = (text: string): string | null => {
                const codeBlock = text.match(/```json\n([\s\S]*?)```/i) || text.match(/```\n([\s\S]*?)```/i);
                if (codeBlock && codeBlock[1]) return codeBlock[1];
                const objMatch = text.match(/\{[\s\S]*\}/);
                return objMatch ? objMatch[0] : null;
            };

            const jsonText = extractJSON(response.text);
            if (!jsonText) throw new Error('AI không trả về đúng định dạng JSON.');

            let rawData: any;
            try {
                rawData = JSON.parse(jsonText);
            } catch (e) {
                throw new Error('Lỗi parse JSON từ phản hồi AI.');
            }

            const parsed = ExamDataSchema.safeParse(rawData);
            if (!parsed.success) {
                throw new Error('Dữ liệu AI không hợp lệ. Vui lòng thử lại với chủ đề/định dạng khác.');
            }

            const data = parsed.data;
            const mcQuestions: QuestionMC[] = (data.mcQuestions || []).map((q: any, idx: number) => ({
                ...q,
                id: idx + 1,
                type: 'multiple_choice'
            }));
            const tfQuestions: QuestionTF[] = (data.tfQuestions || []).map((q: any, idx: number) => ({
                ...q,
                id: mcQuestions.length + idx + 1,
                type: 'true_false'
            }));

            setMcQuestionsData(mcQuestions);
            setTfQuestionsData(tfQuestions);
            setHasGenerated(true);
        } catch (err) {
            setError(getErrorMessage(err));
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
        // Saving logic...
    };

    const score = useMemo(() => {
        if (!isSubmitted) return 0;
        let totalScore = 0;
        allQuestions.forEach(q => {
            if ('options' in q) { // MC
                if (userAnswers[q.id] === q.answer) totalScore += 1;
            } else { // TF
                const userAns = userAnswers[q.id] as { [key: string]: boolean } | undefined;
                if (userAns && q.statements) {
                    q.statements.forEach(stmt => {
                        if (userAns[stmt.id] === stmt.isCorrect) totalScore += 0.25;
                    });
                }
            }
        });
        return totalScore;
    }, [isSubmitted, userAnswers, allQuestions]);

    const maxScore = mcQuestionsData.length + tfQuestionsData.length;

    const sidebar = (
        <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-primary-600">⚙️</span>
                Cấu hình
            </h3>
            <div className="space-y-4">
                <div>
                    <label htmlFor="product2-topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Chủ đề</label>
                    <input id="product2-topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="VD: Mạch điện ba pha" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm dark:text-white" disabled={loading} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lớp</label>
                    <select value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm dark:text-white" disabled={loading}>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Độ khó</label>
                    <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm dark:text-white" disabled={loading}>
                        <option>Dễ</option>
                        <option>Khó</option>
                        <option>Rất khó</option>
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Câu MC</label>
                        <input type="number" value={numMC} onChange={(e) => setNumMC(e.target.value)} min="1" max="20" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg text-sm dark:text-white" disabled={loading} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Câu Đ/S</label>
                        <input type="number" value={numTF} onChange={(e) => setNumTF(e.target.value)} min="1" max="10" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg text-sm dark:text-white" disabled={loading} />
                    </div>
                </div>
                <button onClick={handleGenerate} disabled={loading} className="w-full btn-primary py-3 px-4 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 shadow-md">
                    {loading ? <><Zap size={16} className="animate-spin" /> Đang tạo...</> : <><Zap size={16} /> Tạo câu hỏi</>}
                </button>
            </div>
        </div>
    );

    return (
        <ProductTemplate
            icon={<FileText size={200} />}
            title="Sản phẩm học tập số 2: Ngân hàng câu hỏi"
            subtitle="Tạo bộ câu hỏi trắc nghiệm và đúng/sai tự động từ SGK với AI Gemini 2.5 Pro"
            heroGradientFrom="from-green-600"
            heroGradientTo="to-teal-700"
            sidebar={sidebar}
        >
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 mb-4"><span>⚠️</span>{error}</div>}

            {isSubmitted && (
                <div className="glass-card p-6 rounded-xl shadow-lg text-center sticky top-24 z-40 border border-primary-100 animate-fade-in-down mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Kết quả: <span className="text-primary-600">{score.toFixed(2)} / {maxScore}</span> điểm</h3>
                </div>
            )}

            {allQuestions.length > 0 && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {mcQuestionsData.map(q => <QuestionCard key={q.id} question={q} type="mc" onAnswerChange={handleAnswerChange} userAnswer={userAnswers[q.id]} isSubmitted={isSubmitted} />)}
                    </div>
                    {tfQuestionsData.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {tfQuestionsData.map(q => <QuestionCard key={q.id} question={q} type="tf" onAnswerChange={handleAnswerChange} userAnswer={userAnswers[q.id]} isSubmitted={isSubmitted} />)}
                        </div>
                    )}
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-center">
                        {!isSubmitted ? (
                            <button onClick={handleSubmit} className="btn-primary py-3 px-10 rounded-xl shadow-lg">Kiểm tra đáp án</button>
                        ) : (
                            <button onClick={() => setUserAnswers({})} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold py-3 px-10 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all">Làm lại</button>
                        )}
                    </div>
                </div>
            )}
        </ProductTemplate>
    );
};

export default Product2;
