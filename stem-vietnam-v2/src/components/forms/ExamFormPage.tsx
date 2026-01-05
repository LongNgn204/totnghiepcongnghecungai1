// Chú thích: Form tạo đề thi THPT Quốc gia (28 câu)
// Thêm: Mức độ khó (dễ/trung bình/khó) + bắt buộc RAG
import { useState } from 'react';
import { ClipboardList, Sparkles, Download, Printer, BookOpen } from 'lucide-react';
import { generateExamWithRAG } from '../../lib/rag/generator';
import { EXAM_GENERATOR_PROMPT } from '../../lib/prompts';
import { BOOK_PUBLISHERS } from '../../data/library/defaultBooks';

// Chú thích: Các mức độ khó cho đề thi
const DIFFICULTY_LEVELS = {
    easy: { label: '🟢 Dễ', description: 'Nhiều câu Nhớ/Hiểu, ít Vận dụng cao' },
    medium: { label: '🟡 Trung bình', description: 'Cân đối theo chuẩn Bộ GD&ĐT' },
    hard: { label: '🔴 Khó', description: 'Nhiều câu Vận dụng, VD cao' },
} as const;

type DifficultyLevel = keyof typeof DIFFICULTY_LEVELS;

export default function ExamFormPage() {
    const [formData, setFormData] = useState({
        subject: 'cong_nghiep' as 'cong_nghiep' | 'nong_nghiep',
        difficulty: 'medium' as DifficultyLevel,
        bookPublisher: 'all' as 'all' | string,
        customPrompt: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<string>('');

    const handleGenerate = async () => {
        setIsLoading(true);
        setResult('');

        try {
            // Chú thích: Build prompt với mức độ khó
            let difficultyPrompt = '';
            if (formData.difficulty === 'easy') {
                difficultyPrompt = 'Tạo đề dễ hơn: 10 câu Nhớ, 10 câu Hiểu, 6 câu VD, 2 câu VDC.';
            } else if (formData.difficulty === 'hard') {
                difficultyPrompt = 'Tạo đề khó hơn: 6 câu Nhớ, 6 câu Hiểu, 10 câu VD, 6 câu VDC.';
            }

            const fullCustomPrompt = [
                difficultyPrompt,
                formData.bookPublisher !== 'all' ? `Ưu tiên nội dung từ bộ sách ${formData.bookPublisher}` : '',
                formData.customPrompt,
            ].filter(Boolean).join('\n');

            const response = await generateExamWithRAG({
                subject: formData.subject,
                systemPrompt: EXAM_GENERATOR_PROMPT,
                customPrompt: fullCustomPrompt || undefined,
            });

            setResult(response.text);
        } catch (error) {
            console.error('[exam-form] error:', error);
            setResult('Đã có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <ClipboardList className="text-primary-500" />
                    Tạo Đề Thi THPT Quốc Gia
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Tạo đề 28 câu chuẩn format Bộ GD&ĐT (24 trắc nghiệm + 4 Đúng/Sai)
                </p>
            </div>

            {/* RAG notice */}
            <div className="glass-card p-3 mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                    <BookOpen size={16} />
                    <span><strong>RAG Enabled:</strong> AI sẽ tạo đề dựa trên nội dung SGK trong Thư viện</span>
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Form */}
                <div className="glass-panel p-6 space-y-5">
                    {/* Chọn môn */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Phân môn
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setFormData(prev => ({ ...prev, subject: 'cong_nghiep' }))}
                                className={`p-3 rounded-xl text-center transition-all border-2 ${formData.subject === 'cong_nghiep'
                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                        : 'border-slate-200 dark:border-slate-700'
                                    }`}
                            >
                                <p className="font-semibold text-sm">🏭 Công nghiệp</p>
                            </button>
                            <button
                                onClick={() => setFormData(prev => ({ ...prev, subject: 'nong_nghiep' }))}
                                className={`p-3 rounded-xl text-center transition-all border-2 ${formData.subject === 'nong_nghiep'
                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                        : 'border-slate-200 dark:border-slate-700'
                                    }`}
                            >
                                <p className="font-semibold text-sm">🌾 Nông nghiệp</p>
                            </button>
                        </div>
                    </div>

                    {/* Mức độ khó - MỚI */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Mức độ khó
                        </label>
                        <div className="space-y-2">
                            {(Object.keys(DIFFICULTY_LEVELS) as DifficultyLevel[]).map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setFormData(prev => ({ ...prev, difficulty: level }))}
                                    className={`w-full p-3 rounded-xl text-left transition-all border-2 ${formData.difficulty === level
                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                        }`}
                                >
                                    <p className="font-semibold text-sm text-slate-900 dark:text-white">
                                        {DIFFICULTY_LEVELS[level].label}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {DIFFICULTY_LEVELS[level].description}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bộ sách - MỚI */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Ưu tiên bộ sách
                            <span className="text-slate-400 font-normal ml-2">(Tuỳ chọn)</span>
                        </label>
                        <select
                            value={formData.bookPublisher}
                            onChange={(e) => setFormData(prev => ({ ...prev, bookPublisher: e.target.value }))}
                            className="input-field"
                        >
                            <option value="all">Tất cả bộ sách</option>
                            {Object.values(BOOK_PUBLISHERS).map(pub => (
                                <option key={pub} value={pub}>{pub}</option>
                            ))}
                        </select>
                    </div>

                    {/* Cấu trúc đề */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Cấu trúc đề:</p>
                        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                            <li>• 24 câu trắc nghiệm (A, B, C, D)</li>
                            <li>• 4 câu Đúng/Sai (mỗi câu 4 ý)</li>
                            <li>• Có đáp án đầy đủ</li>
                        </ul>
                    </div>

                    {/* Custom Prompt */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Tuỳ chỉnh thêm
                            <span className="text-slate-400 font-normal ml-2">(Có thể bỏ qua)</span>
                        </label>
                        <textarea
                            value={formData.customPrompt}
                            onChange={(e) => setFormData(prev => ({ ...prev, customPrompt: e.target.value }))}
                            placeholder="VD: Tập trung vào chương mạng máy tính..."
                            rows={2}
                            className="input-field resize-none"
                        />
                    </div>

                    {/* Generate button */}
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                Đang tạo đề...
                            </>
                        ) : (
                            <>
                                <Sparkles size={20} />
                                Tạo Đề Thi
                            </>
                        )}
                    </button>
                </div>

                {/* Result */}
                <div className="lg:col-span-2 glass-panel p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                            Đề Thi
                        </h3>
                        {result && (
                            <div className="flex gap-2">
                                <button className="btn-secondary py-2 px-4 flex items-center gap-2 text-sm">
                                    <Download size={16} />
                                    Tải PDF
                                </button>
                                <button className="btn-secondary py-2 px-4 flex items-center gap-2 text-sm">
                                    <Printer size={16} />
                                    In
                                </button>
                            </div>
                        )}
                    </div>

                    {result ? (
                        <div className="prose prose-slate dark:prose-invert max-w-none">
                            <pre className="whitespace-pre-wrap text-sm bg-slate-50 dark:bg-slate-900 p-4 rounded-xl overflow-auto max-h-[600px]">
                                {result}
                            </pre>
                        </div>
                    ) : (
                        <div className="h-96 flex flex-col items-center justify-center text-slate-400">
                            <ClipboardList size={48} className="mb-4 opacity-50" />
                            <p>Đề thi sẽ hiển thị ở đây</p>
                            <p className="text-sm mt-2">Chọn phân môn, mức độ và nhấn "Tạo Đề Thi"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
