import React, { useEffect, useMemo, useState } from 'react';
import { PROMPT_TEMPLATES, PromptTemplate, TemplateCategory } from '../utils/promptTemplates';
import { Sparkles, FileText, BookOpen, ListChecks } from 'lucide-react';

interface PromptTemplatesProps {
  onUseTemplate?: (template: PromptTemplate) => void;
}

const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  'Lý thuyết': 'Lý thuyết',
  'Bài tập': 'Bài tập',
  'Tài liệu': 'Tài liệu',
  'So sánh': 'So sánh',
  'Ôn thi': 'Ôn thi'
};

const STORAGE_KEY = 'promptTemplates.activeCategory';

const PromptTemplates: React.FC<PromptTemplatesProps> = ({ onUseTemplate }) => {
  const [active, setActive] = useState<TemplateCategory>('Lý thuyết');

  // Load last active category from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (Object.keys(CATEGORY_LABELS) as TemplateCategory[]).includes(saved as TemplateCategory)) {
        setActive(saved as TemplateCategory);
      }
    } catch {}
  }, []);

  // Persist when changed
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, active); } catch {}
  }, [active]);

  const groups = useMemo(() => {
    const map = new Map<TemplateCategory, PromptTemplate[]>();
    PROMPT_TEMPLATES.forEach(t => {
      const arr = map.get(t.category) || [];
      arr.push(t);
      map.set(t.category, arr);
    });
    return map;
  }, []);

  const handleUse = (tpl: PromptTemplate) => {
    const prompt = tpl.build();
    // Dispatch to ChatInterface
    window.dispatchEvent(new CustomEvent('auto-fill-question', { detail: { question: prompt } }));
    if (tpl.id === 'analyze-document') {
      // If template expects files, open picker
      window.dispatchEvent(new Event('open-file-picker'));
    }
    onUseTemplate?.(tpl);
  };

  const activeList = groups.get(active) || [];

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(CATEGORY_LABELS) as TemplateCategory[]).map(cat => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              active === cat
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-3">
        {activeList.map(tpl => (
          <div key={tpl.id} className="p-4 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-sm transition-all">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-primary-600" />
                  <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{tpl.title}</p>
                </div>
                {tpl.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400">{tpl.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {tpl.id === 'analyze-document' && (
                  <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/30">
                    <FileText className="w-3 h-3" /> cần tệp
                  </span>
                )}
                <button
                  onClick={() => handleUse(tpl)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold"
                >
                  <BookOpen className="w-4 h-4" /> Dùng mẫu
                </button>
              </div>
            </div>
            <details className="mt-3 group">
              <summary className="list-none cursor-pointer text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 inline-flex items-center gap-2">
                <ListChecks className="w-3 h-3" /> Xem prompt mẫu
              </summary>
              <pre className="mt-2 text-xs whitespace-pre-wrap bg-gray-50 dark:bg-gray-900/50 p-3 rounded border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">{tpl.build()}</pre>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptTemplates;

