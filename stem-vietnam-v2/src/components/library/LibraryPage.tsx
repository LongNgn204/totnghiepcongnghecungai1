// Chú thích: Library Page - Quản lý tài liệu nguồn cho RAG
// Hiển thị SGK mặc định + Chuyên đề + Đề thi mẫu theo Tabs
import { useState, useEffect } from 'react';
import {
    Library,
    Upload,
    FileText,
    Trash2,
    BookOpen,
    Plus,
    CheckCircle2,
    AlertCircle,
    Download,
    Book,
    FileSpreadsheet,
    Link as LinkIcon
} from 'lucide-react';
import type { Document } from '../../types';
import { DEFAULT_LIBRARY, BOOK_PUBLISHERS, checkDocumentExists } from '../../data/library/defaultBooks';

// Chú thích: Categories tabs - theo loại tài liệu thực tế
const TABS = [
    { id: 'policy', label: 'Văn bản pháp quy', icon: FileSpreadsheet, prefix: 'policy-' },
    { id: 'sgk', label: 'Sách giáo khoa', icon: Book, prefix: 'sgk-' },
    { id: 'chuyen_de', label: 'Chuyên đề học tập', icon: BookOpen, prefix: 'cd-' },
    { id: 'user', label: 'Tài liệu của bạn', icon: Upload, prefix: 'user-' },
] as const;

export default function LibraryPage() {
    const documents = DEFAULT_LIBRARY;
    const [userDocuments, setUserDocuments] = useState<Document[]>([]);
    const [documentStatus, setDocumentStatus] = useState<Record<string, boolean>>({});
    const [activeTab, setActiveTab] = useState<string>('sgk');
    const [showUpload, setShowUpload] = useState(false);
    const [filterGrade, setFilterGrade] = useState<'all' | '10' | '11' | '12'>('all');
    const [filterPublisher, setFilterPublisher] = useState<'all' | string>('all');

    const [uploadForm, setUploadForm] = useState({
        title: '',
        grade: '12' as '10' | '11' | '12',
        topic: '',
        source: '',
        inputType: 'file' as 'file' | 'url',
        fileUrl: '',
    });

    // Chú thích: Kiểm tra file PDF có tồn tại không khi mount
    useEffect(() => {
        const checkAllDocuments = async () => {
            const statuses: Record<string, boolean> = {};
            for (const doc of DEFAULT_LIBRARY) {
                statuses[doc.id] = await checkDocumentExists(doc.fileUrl);
            }
            setDocumentStatus(statuses);
        };
        checkAllDocuments();
    }, []);

    // Chú thích: Filter documents logic
    const getTabDocuments = () => {
        let docs: Document[] = [];

        switch (activeTab) {
            case 'policy':
                docs = documents.filter(d => d.id.startsWith('policy-'));
                break;
            case 'sgk':
                docs = documents.filter(d => d.id.startsWith('sgk-'));
                break;
            case 'chuyen_de':
                docs = documents.filter(d => d.id.startsWith('cd-'));
                break;
            case 'user':
                docs = userDocuments;
                break;
            default:
                docs = documents;
        }

        return docs.filter(doc => {
            if (filterGrade !== 'all' && doc.grade !== filterGrade) return false;
            if (filterPublisher !== 'all' && doc.source !== filterPublisher) return false;
            return true;
        });
    };

    const filteredDocuments = getTabDocuments();


    const handleUpload = () => {
        const newDoc: Document = {
            id: `user-doc-${Date.now()}`,
            title: uploadForm.title,
            grade: uploadForm.grade,
            topic: uploadForm.topic,
            source: uploadForm.source,
            fileUrl: uploadForm.inputType === 'url' ? uploadForm.fileUrl : '', // Handle real file upload later
            createdAt: Date.now(),
        };
        setUserDocuments(prev => [newDoc, ...prev]);
        setShowUpload(false);
        setActiveTab('user'); // Switch to user tab
        setUploadForm({
            title: '',
            grade: '12',
            topic: '',
            source: '',
            inputType: 'file',
            fileUrl: ''
        });
    };

    const handleDelete = (id: string) => {
        if (id.startsWith('user-doc-')) {
            if (confirm('Bạn có chắc muốn xoá tài liệu này?')) {
                setUserDocuments(prev => prev.filter(d => d.id !== id));
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <Library className="text-primary-500" />
                        Thư Viện Tài Liệu
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Kho tài liệu chính thống cho RAG: SGK, Chuyên đề, Đề thi mẫu
                    </p>
                </div>
                <button
                    onClick={() => setShowUpload(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    Thêm Tài Liệu
                </button>
            </div>

            {/* Tabs */}
            <div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-2xl mb-6 shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${isActive
                                ? 'bg-primary-500 text-white shadow-md'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                                }`}
                        >
                            <Icon size={18} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Stats & Filters Row */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                {/* Helper Banner */}
                <div className="flex-1 glass-card p-4 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 flex items-center gap-3">
                    <BookOpen className="text-primary-600" />
                    <div>
                        <p className="font-semibold text-primary-900 dark:text-primary-100 text-sm">
                            RAG Context
                        </p>
                        <p className="text-xs text-primary-700 dark:text-primary-300">
                            {activeTab === 'sgk' && 'Nguồn kiến thức nền tảng chính xác nhất.'}
                            {activeTab === 'chuyen_de' && 'Kiến thức chuyên sâu và mở rộng.'}
                            {activeTab === 'de_thi' && 'Cấu trúc đề thi chuẩn Bộ GD&ĐT.'}
                            {activeTab === 'user' && 'Tài liệu bổ sung cá nhân của bạn.'}
                        </p>
                    </div>
                </div>

                {/* Filter Controls */}
                <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex gap-1">
                        {(['all', '10', '11', '12'] as const).map(grade => (
                            <button
                                key={grade}
                                onClick={() => setFilterGrade(grade)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${filterGrade === grade
                                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                            >
                                {grade === 'all' ? 'Tất cả' : grade}
                            </button>
                        ))}
                    </div>

                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />

                    <select
                        value={filterPublisher}
                        onChange={(e) => setFilterPublisher(e.target.value)}
                        className="text-sm bg-transparent border-none focus:ring-0 text-slate-700 dark:text-slate-300"
                    >
                        <option value="all">Tất cả nguồn</option>
                        {Object.values(BOOK_PUBLISHERS).map(pub => (
                            <option key={pub} value={pub}>{pub}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Documents grid */}
            {filteredDocuments.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDocuments.map((doc) => {
                        const isDefault = !doc.id.startsWith('user-doc-');
                        const hasFile = documentStatus[doc.id];

                        return (
                            <div
                                key={doc.id}
                                className={`glass-card p-4 hover:shadow-lg transition-shadow relative group ${!hasFile && isDefault ? 'border-amber-300 dark:border-amber-700' : ''
                                    }`}
                            >
                                {/* Status badge */}
                                <div className="absolute top-3 right-3">
                                    {isDefault ? (
                                        hasFile ? (
                                            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                                                <CheckCircle2 size={12} />
                                                Sẵn sàng
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-full">
                                                <AlertCircle size={12} />
                                                Thiếu file
                                            </span>
                                        )
                                    ) : (
                                        <button
                                            onClick={() => handleDelete(doc.id)}
                                            className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-start gap-3 mb-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isDefault
                                        ? 'bg-primary-100 dark:bg-primary-900/30'
                                        : 'bg-slate-100 dark:bg-slate-700'
                                        }`}>
                                        {doc.id.startsWith('sgk-') && <Book className="text-primary-600" size={20} />}
                                        {doc.id.startsWith('cd-') && <BookOpen className="text-indigo-600" size={20} />}
                                        {doc.id.startsWith('de-') && <FileSpreadsheet className="text-emerald-600" size={20} />}
                                        {doc.id.startsWith('user-') && <FileText className="text-slate-500" size={20} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-2" title={doc.title}>
                                            {doc.title}
                                        </h3>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1.5 text-xs mb-3">
                                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                        Lớp {doc.grade}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 truncate max-w-[150px]">
                                        {doc.source}
                                    </span>
                                </div>

                                {/* Actions */}
                                {hasFile && (
                                    <a
                                        href={doc.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-xs text-primary-600 hover:text-primary-700 font-medium"
                                    >
                                        <Download size={14} />
                                        Xem PDF
                                    </a>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-slate-500 dark:text-slate-400">Không tìm thấy tài liệu phù hợp.</p>
                </div>
            )}

            {/* Upload/Add Modal */}
            {showUpload && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="glass-panel w-full max-w-md p-6 animate-slide-up">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            {uploadForm.inputType === 'file' ? <Upload size={24} /> : <LinkIcon size={24} />}
                            {uploadForm.inputType === 'file' ? 'Tải Tệp Lên' : 'Thêm từ Google Drive'}
                        </h2>

                        <div className="space-y-4">
                            {/* Input Type Switcher */}
                            <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                                <button
                                    onClick={() => setUploadForm(prev => ({ ...prev, inputType: 'file' }))}
                                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-md transition-all ${uploadForm.inputType === 'file'
                                        ? 'bg-white dark:bg-slate-600 shadow text-primary-600 dark:text-white'
                                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                                        }`}
                                >
                                    <Upload size={14} />
                                    Tải tệp
                                </button>
                                <button
                                    onClick={() => setUploadForm(prev => ({ ...prev, inputType: 'url' }))}
                                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-md transition-all ${uploadForm.inputType === 'url'
                                        ? 'bg-white dark:bg-slate-600 shadow text-primary-600 dark:text-white'
                                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                                        }`}
                                >
                                    <LinkIcon size={14} />
                                    Google Drive
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Tên tài liệu *
                                </label>
                                <input
                                    type="text"
                                    value={uploadForm.title}
                                    onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="VD: Đề thi thử THPT 2024"
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Lớp
                                </label>
                                <div className="flex gap-2">
                                    {(['10', '11', '12'] as const).map((grade) => (
                                        <button
                                            key={grade}
                                            type="button"
                                            onClick={() => setUploadForm(prev => ({ ...prev, grade }))}
                                            className={`flex-1 py-2 rounded-lg transition-all ${uploadForm.grade === grade
                                                ? 'bg-primary-600 text-white'
                                                : 'bg-slate-100 dark:bg-slate-700'
                                                }`}
                                        >
                                            {grade}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Nguồn
                                </label>
                                <input
                                    type="text"
                                    value={uploadForm.source}
                                    onChange={(e) => setUploadForm(prev => ({ ...prev, source: e.target.value }))}
                                    placeholder="VD: Sưu tầm..."
                                    className="input-field"
                                />
                            </div>

                            {/* Dynamic Input Area */}
                            {uploadForm.inputType === 'file' ? (
                                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center hover:border-primary-500 transition-colors cursor-pointer">
                                    <Upload className="mx-auto text-slate-400 mb-2" size={32} />
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                        Kéo thả file PDF vào đây
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        hoặc click để chọn file
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Link Google Drive / Dropbox *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <LinkIcon size={16} className="text-slate-400" />
                                        </div>
                                        <input
                                            type="url"
                                            value={uploadForm.fileUrl}
                                            onChange={(e) => setUploadForm(prev => ({ ...prev, fileUrl: e.target.value }))}
                                            placeholder="https://drive.google.com/..."
                                            className="input-field pl-10"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">
                                        * Đảm bảo link đã được chia sẻ công khai (Anyone with the link)
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowUpload(false)}
                                className="btn-secondary flex-1"
                            >
                                Huỷ
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={!uploadForm.title.trim() || (uploadForm.inputType === 'url' && !uploadForm.fileUrl.trim())}
                                className="btn-primary flex-1"
                            >
                                {uploadForm.inputType === 'file' ? 'Tải lên' : 'Thêm Link'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
