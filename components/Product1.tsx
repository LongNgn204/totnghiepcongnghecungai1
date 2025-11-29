import React, { useState, useEffect, Suspense } from 'react';
import ChatInterface from './ChatInterface';
import ProductTemplate from './layout/ProductTemplate';
import AccuracyTipsCard, { AccuracyTip } from './AccuracyTipsCard';
// Code-splitting lazy imports for secondary sections
const PromptTemplates = React.lazy(() => import('./PromptTemplates'));
const ContextWizard = React.lazy(() => import('./ContextWizard'));
const Product1Analytics = React.lazy(() => import('./Product1Analytics'));
import { MessageSquare, FileText, Clock, Search, Download, CornerDownLeft, Lightbulb, HelpCircle, FileQuestion, Zap, Scale, RefreshCw, Brain, Target, Sparkles, TrendingUp, Copy, Check } from 'lucide-react';
import syncManager from '../utils/syncManager';

const Product1: React.FC = () => {
  const [lastSync, setLastSync] = useState<string>('');
  const [selectedQuestion, setSelectedQuestion] = useState<string>('');
  const [copiedQuestion, setCopiedQuestion] = useState<string>('');
  const [showWizard, setShowWizard] = useState<boolean>(false);

  const updateLastSync = () => {
    const timestamp = syncManager.getLastSyncTime();
    if (timestamp > 0) {
      const date = new Date(timestamp);
      setLastSync(date.toLocaleString('vi-VN'));
    } else {
      setLastSync('Chưa đồng bộ');
    }
  };

  useEffect(() => {
    updateLastSync();
    window.addEventListener('sync-completed', updateLastSync);
    return () => {
      window.removeEventListener('sync-completed', updateLastSync);
    };
  }, []);

  const handleSuggestedQuestionClick = (question: string) => {
    setSelectedQuestion(question);
    window.dispatchEvent(new CustomEvent('auto-fill-question', { detail: { question } }));
  };

  const copyQuestion = async (question: string) => {
    try {
      await navigator.clipboard.writeText(question);
      setCopiedQuestion(question);
      setTimeout(() => setCopiedQuestion(''), 1500);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  const accuracyTips: AccuracyTip[] = [
    {
      id: 'context',
      title: 'Đặt câu hỏi cụ thể với ngữ cảnh rõ ràng',
      description: 'Nêu rõ chủ đề, lớp, sách (KNTT/Cánh Diều), mục tiêu học để AI trả lời đúng trọng tâm.',
      icon: <Target className="w-5 h-5" />,
      examples: [
        'Sai: "Giải thích máy biến áp"',
        'Đúng: "Giải thích nguyên lý máy biến áp ba pha (SGK KNTT 12), kèm ví dụ tính công suất"'
      ]
    },
    {
      id: 'files',
      title: 'Đính kèm tài liệu để phân tích',
      description: 'Tải lên PDF/ảnh đề thi, bài giảng hoặc sơ đồ mạch để AI trích xuất và phân tích.',
      icon: <FileText className="w-5 h-5" />,
      examples: ['Upload đề thi PDF', 'Upload ảnh sơ đồ mạch điện', 'Upload bài giảng PowerPoint']
    },
    {
      id: 'refine',
      title: 'Tinh chỉnh theo phản hồi',
      description: 'Yêu cầu AI sửa đổi cách trình bày, bổ sung bước giải, hoặc đổi định dạng để rõ ràng hơn.',
      icon: <TrendingUp className="w-5 h-5" />,
      examples: ['Trình bày lại thành các bước rõ ràng', 'Đổi sang bảng so sánh', 'Thêm công thức và giả thiết']
    }
  ];

  const handleTryNow = (tipId: string) => {
    switch (tipId) {
      case 'context': {
        const template = 'Ngữ cảnh: Lớp 12, SGK KNTT, chủ đề: Máy điện. Mục tiêu: Hiểu nguyên lý máy biến áp 3 pha và ví dụ tính công suất.\nYêu cầu trả lời: ngắn gọn, có công thức, ví dụ số, và lưu ý sai lầm phổ biến.';
        window.dispatchEvent(new CustomEvent('auto-fill-question', { detail: { question: template } }));
        break;
      }
      case 'files': {
        window.dispatchEvent(new Event('open-file-picker'));
        break;
      }
      case 'refine': {
        const refine = 'Hãy chỉnh sửa câu trả lời theo định dạng: 1) Tóm tắt 3 ý chính; 2) Bảng công thức; 3) Ví dụ minh họa; 4) Sai lầm thường gặp.';
        window.dispatchEvent(new CustomEvent('auto-fill-question', { detail: { question: refine } }));
        break;
      }
    }
  };

  const sidebar = (
    <>
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-sm font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-yellow-500" />
          Mẹo sử dụng
        </h3>
        <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-2"><MessageSquare className="w-4 h-4 text-primary-600 mt-0.5" /> Nhấn “Chat mới” để bắt đầu hội thoại mới.</li>
          <li className="flex items-start gap-2"><FileText className="w-4 h-4 text-primary-600 mt-0.5" /> Dùng 📎 để đính kèm PDF, DOCX, ảnh.</li>
          <li className="flex items-start gap-2"><Clock className="w-4 h-4 text-primary-600 mt-0.5" /> Lịch sử được lưu tự động (offline-first).</li>
          <li className="flex items-start gap-2"><Search className="w-4 h-4 text-primary-600 mt-0.5" /> Tìm kiếm nhanh theo tiêu đề/nội dung.</li>
          <li className="flex items-start gap-2"><Download className="w-4 h-4 text-primary-600 mt-0.5" /> Xuất nội dung chat dạng .txt.</li>
          <li className="flex items-start gap-2"><CornerDownLeft className="w-4 h-4 text-primary-600 mt-0.5" /> Enter gửi, Shift+Enter xuống dòng.</li>
        </ul>
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <RefreshCw className="w-3 h-3" />
          <span>Đồng bộ cuối: {lastSync}</span>
        </div>
      </div>
      <div className="glass-card p-6 rounded-2xl mt-4">
        <h3 className="text-sm font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-500" />
          Nâng cao độ xử lý AI
        </h3>
        <AccuracyTipsCard tips={accuracyTips} onTryNow={handleTryNow} />
      </div>

      <div className="glass-card p-6 rounded-2xl mt-4">
        <h3 className="text-sm font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-primary-600" />
          Câu hỏi gợi ý
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li
            onClick={() => handleSuggestedQuestionClick('Giải thích nguyên lý máy biến áp ba pha?')}
            className={`p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border transition-colors cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900/40 ${selectedQuestion === 'Giải thích nguyên lý máy biến áp ba pha?' ? 'border-primary-500 ring-1 ring-primary-300 dark:ring-primary-800' : 'border-primary-100 dark:border-primary-800/30'}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span>Giải thích nguyên lý máy biến áp ba pha?</span>
              <button
                onClick={(e) => { e.stopPropagation(); copyQuestion('Giải thích nguyên lý máy biến áp ba pha?'); }}
                className="p-1 text-primary-600 hover:text-primary-700 rounded-md hover:bg-primary-100/60 dark:hover:bg-primary-900/40"
                title="Sao chép"
              >
                {copiedQuestion === 'Giải thích nguyên lý máy biến áp ba pha?' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </li>
          <li
            onClick={() => handleSuggestedQuestionClick('Giải bài tập mạch điện ba pha P=10kW, cosφ=0.8')}
            className={`p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border transition-colors cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900/40 ${selectedQuestion === 'Giải bài tập mạch điện ba pha P=10kW, cosφ=0.8' ? 'border-primary-500 ring-1 ring-primary-300 dark:ring-primary-800' : 'border-primary-100 dark:border-primary-800/30'}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span>Giải bài tập mạch điện ba pha P=10kW, cosφ=0.8</span>
              <button
                onClick={(e) => { e.stopPropagation(); copyQuestion('Giải bài tập mạch điện ba pha P=10kW, cosφ=0.8'); }}
                className="p-1 text-primary-600 hover:text-primary-700 rounded-md hover:bg-primary-100/60 dark:hover:bg-primary-900/40"
                title="Sao chép"
              >
                {copiedQuestion === 'Giải bài tập mạch điện ba pha P=10kW, cosφ=0.8' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </li>
          <li
            onClick={() => handleSuggestedQuestionClick('Phân tích đề thi trong file PDF')}
            className={`p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border transition-colors cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900/40 ${selectedQuestion === 'Phân tích đề thi trong file PDF' ? 'border-primary-500 ring-1 ring-primary-300 dark:ring-primary-800' : 'border-primary-100 dark:border-primary-800/30'}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span>Phân tích đề thi trong file PDF</span>
              <button
                onClick={(e) => { e.stopPropagation(); copyQuestion('Phân tích đề thi trong file PDF'); }}
                className="p-1 text-primary-600 hover:text-primary-700 rounded-md hover:bg-primary-100/60 dark:hover:bg-primary-900/40"
                title="Sao chép"
              >
                {copiedQuestion === 'Phân tích đề thi trong file PDF' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </li>
          <li
            onClick={() => handleSuggestedQuestionClick('So sánh diode và transistor')}
            className={`p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border transition-colors cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900/40 ${selectedQuestion === 'So sánh diode và transistor' ? 'border-primary-500 ring-1 ring-primary-300 dark:ring-primary-800' : 'border-primary-100 dark:border-primary-800/30'}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span>So sánh diode và transistor</span>
              <button
                onClick={(e) => { e.stopPropagation(); copyQuestion('So sánh diode và transistor'); }}
                className="p-1 text-primary-600 hover:text-primary-700 rounded-md hover:bg-primary-100/60 dark:hover:bg-primary-900/40"
                title="Sao chép"
              >
                {copiedQuestion === 'So sánh diode và transistor' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </li>
        </ul>
      </div>
    </>
  );

  return (
    <ProductTemplate
      icon={<MessageSquare size={200} />}
      title="Sản phẩm học tập số 1: Trò chuyện với AI"
      subtitle="Hỏi đáp về Công nghệ (SGK KNTT & Cánh Diều), đính kèm file để phân tích, lịch sử chat offline-first"
      heroGradientFrom="from-primary-600"
      heroGradientTo="to-secondary-600"
      sidebar={sidebar}
    >
      <div className="animate-fade-in">
        <ChatInterface />
      </div>

      <div className="glass-card p-8 rounded-2xl">
        <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-primary-600" />
          Ví dụ câu hỏi hay
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800/30 hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1">
            <div className="flex items-center gap-2 mb-2">
              <FileQuestion className="w-5 h-5 text-primary-600" />
              <p className="text-sm font-bold text-primary-800 dark:text-primary-300">Lý thuyết</p>
            </div>
            <p className="text-gray-700 dark:text-gray-300 group-hover:text-primary-700 dark:group-hover:text-primary-200 transition-colors">Giải thích nguyên lý hoạt động của máy biến áp ba pha</p>
          </div>
          <div className="p-5 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800/30 hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-primary-600" />
              <p className="text-sm font-bold text-primary-800 dark:text-primary-300">Bài tập</p>
            </div>
            <p className="text-gray-700 dark:text-gray-300 group-hover:text-primary-700 dark:group-hover:text-primary-200 transition-colors">Giải bài tập về mạch điện ba pha, P=10kW, cosφ=0.8</p>
          </div>
          <div className="p-5 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800/30 hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-primary-600" />
              <p className="text-sm font-bold text-primary-800 dark:text-primary-300">Phân tích file</p>
            </div>
            <p className="text-gray-700 dark:text-gray-300 group-hover:text-primary-700 dark:group-hover:text-primary-200 transition-colors">Phân tích đề thi trong file PDF và đưa ra hướng giải</p>
          </div>
          <div className="p-5 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800/30 hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Scale className="w-5 h-5 text-primary-600" />
              <p className="text-sm font-bold text-primary-800 dark:text-primary-300">So sánh</p>
            </div>
            <p className="text-gray-700 dark:text-gray-300 group-hover:text-primary-700 dark:group-hover:text-primary-200 transition-colors">So sánh điốt và transistor</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-8 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary-600" />
            Mẫu câu hỏi nhanh
          </h3>
          <button
            onClick={() => setShowWizard(true)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold"
          >
            <Target className="w-4 h-4" /> Trình dựng ngữ cảnh
          </button>
        </div>
        <Suspense fallback={<div className="text-sm text-gray-500">Đang tải mẫu...</div>}>
          <PromptTemplates />
        </Suspense>
      </div>

      <Suspense fallback={<div className="text-sm text-gray-500">Đang tải thống kê...</div>}>
        <Product1Analytics />
      </Suspense>

      <div className="glass-card p-8 rounded-2xl mt-6">
        <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
          <Target className="w-6 h-6 text-emerald-600" />
          Tăng cường độ chính xác của AI
        </h3>
        <div className="space-y-4">
          <div className="p-5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-200 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">1</span>
              Cung cấp ngữ cảnh đầy đủ
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">Nêu rõ chủ đề, cấp độ học, sách giáo khoa (KNTT/Cánh Diều) để AI hiểu chính xác nhu cầu của bạn.</p>
          </div>
          <div className="p-5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-200 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">2</span>
              Đính kèm tài liệu tham khảo
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">Upload PDF, ảnh, hoặc tài liệu liên quan để AI phân tích dựa trên dữ liệu thực tế, tăng độ chính xác.</p>
          </div>
          <div className="p-5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-200 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">3</span>
              Yêu cầu định dạng cụ thể
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">Chỉ định rõ ràng định dạng trả lời (bảng, danh sách, công thức, sơ đồ) để AI cấu trúc thông tin tốt hơn.</p>
          </div>
          <div className="p-5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-200 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">4</span>
              Tinh chỉnh và phản hồi
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">Nếu kết quả chưa tốt, hãy yêu cầu AI điều chỉnh, giải thích thêm hoặc thay đổi cách tiếp cận.</p>
          </div>
        </div>
      </div>
      <Suspense fallback={<div className="text-sm text-gray-500">Đang tải trình dựng ngữ cảnh...</div>}>
        <ContextWizard open={showWizard} onClose={() => setShowWizard(false)} />
      </Suspense>
    </ProductTemplate>
  );
};

export default Product1;
