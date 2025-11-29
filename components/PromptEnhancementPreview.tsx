import React, { useMemo } from 'react';
import { enhancePrompt } from '../utils/promptEnhancer';
import { Sparkles, X, ListChecks } from 'lucide-react';

interface PromptEnhancementPreviewProps {
  open: boolean;
  onClose: () => void;
  original: string;
  onApply: (enhanced: string) => void;
}

const PromptEnhancementPreview: React.FC<PromptEnhancementPreviewProps> = ({ open, onClose, original, onApply }) => {
  const result = useMemo(() => enhancePrompt(original || ''), [original]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
            <Sparkles className="w-5 h-5 text-primary-600" /> Nâng cao prompt
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">Gốc</div>
            <pre className="text-xs whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 max-h-64 overflow-auto">{original || '(trống)'}</pre>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">Đề xuất</div>
            <pre className="text-xs whitespace-pre-wrap bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded border border-emerald-200 dark:border-emerald-800/40 text-gray-800 dark:text-gray-100 max-h-64 overflow-auto">{result.improvedPrompt}</pre>
          </div>
        </div>
        <div className="px-5 pb-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 inline-flex items-center gap-2"><ListChecks className="w-4 h-4" /> Thay đổi</div>
          <ul className="text-xs text-gray-700 dark:text-gray-300 list-disc ml-6 space-y-1">
            {result.changes.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
        <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-2 bg-gray-50/50 dark:bg-gray-800/50">
          <button onClick={onClose} className="px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">Đóng</button>
          <button onClick={() => { onApply(result.improvedPrompt); onClose(); }} className="px-3 py-2 rounded-lg text-sm bg-primary-600 text-white hover:bg-primary-700">Áp dụng prompt</button>
        </div>
      </div>
    </div>
  );
};

export default PromptEnhancementPreview;

