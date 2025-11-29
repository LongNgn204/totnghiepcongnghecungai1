import React, { useEffect, useMemo, useState } from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle2, Target, BookOpen, FileText, ClipboardList } from 'lucide-react';

interface ContextWizardProps {
  open: boolean;
  onClose: () => void;
}

const SUBJECTS = ['Máy điện', 'Điện tử cơ bản', 'Vật liệu điện', 'Kỹ thuật số', 'Mạch điện ba pha'] as const;
const LEVELS = ['Cơ bản', 'Trung bình', 'Nâng cao'] as const;
const TEXTBOOKS = ['Kết nối tri thức', 'Cánh Diều'] as const;

const steps = [
  { id: 1, title: 'Chủ đề' },
  { id: 2, title: 'Mức độ' },
  { id: 3, title: 'Sách' },
  { id: 4, title: 'Mục tiêu' },
  { id: 5, title: 'Tệp đính kèm' },
  { id: 6, title: 'Xem lại' },
] as const;

const ContextWizard: React.FC<ContextWizardProps> = ({ open, onClose }) => {
  const [step, setStep] = useState(1);
  const [subject, setSubject] = useState<typeof SUBJECTS[number]>('Mạch điện ba pha');
  const [level, setLevel] = useState<typeof LEVELS[number]>('Trung bình');
  const [textbook, setTextbook] = useState<typeof TEXTBOOKS[number]>('Kết nối tri thức');
  const [goal, setGoal] = useState('Hiểu nguyên lý và giải được bài tập cơ bản');
  const [requireFiles, setRequireFiles] = useState(false);

  // Load persisted values when opening
  useEffect(() => {
    if (!open) return;
    try {
      const raw = localStorage.getItem('ctx_wizard_state');
      if (raw) {
        const state = JSON.parse(raw) as {
          subject?: typeof SUBJECTS[number];
          level?: typeof LEVELS[number];
          textbook?: typeof TEXTBOOKS[number];
          goal?: string;
          requireFiles?: boolean;
        };
        if (state.subject) setSubject(state.subject);
        if (state.level) setLevel(state.level);
        if (state.textbook) setTextbook(state.textbook);
        if (typeof state.requireFiles === 'boolean') setRequireFiles(state.requireFiles);
        if (typeof state.goal === 'string') setGoal(state.goal);
      }
      setStep(1);
    } catch {}
  }, [open]);

  // Persist values on change
  useEffect(() => {
    try {
      localStorage.setItem(
        'ctx_wizard_state',
        JSON.stringify({ subject, level, textbook, goal, requireFiles })
      );
    } catch {}
  }, [subject, level, textbook, goal, requireFiles]);

  const canNext = useMemo(() => {
    if (step === 4) return goal.trim().length > 0;
    return true;
  }, [step, goal]);

  const buildPrompt = () => {
    return (
      `Ngữ cảnh học tập:
- Chủ đề: ${subject}
- Cấp độ: ${level}
- Sách giáo khoa: ${textbook}
- Mục tiêu: ${goal}

Yêu cầu trả lời:
- Ngắn gọn, mạch lạc, dùng ngôn ngữ phổ thông cho học sinh THPT
- Có công thức (nếu có), ví dụ minh họa
- Nêu 2 sai lầm thường gặp và cách tránh
- Gợi ý thêm 2 câu hỏi tự luyện phù hợp`
    );
  };

  const handleConfirm = () => {
    const prompt = buildPrompt();
    window.dispatchEvent(new CustomEvent('auto-fill-question', { detail: { question: prompt } }));
    if (requireFiles) {
      window.dispatchEvent(new Event('open-file-picker'));
    }
    onClose();
    // reset state for next open
    setStep(1);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50/60 dark:bg-gray-800/60">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Trình dựng ngữ cảnh</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-200/60 dark:hover:bg-gray-700/60 text-gray-600 dark:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
            {steps.map(s => (
              <div key={s.id} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border ${s.id === step ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800/30' : 'border-gray-200 dark:border-gray-700'}`}>
                <span>{s.id}</span>
                <span className="hidden sm:inline">{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2"><Target className="w-4 h-4" /> Chọn chủ đề</p>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map((s) => (
                  <button key={s} onClick={() => setSubject(s)} className={`px-3 py-1.5 rounded-full border text-sm ${subject === s ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>{s}</button>
                ))}
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Chọn mức độ</p>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map((lv) => (
                  <button key={lv} onClick={() => setLevel(lv)} className={`px-3 py-1.5 rounded-full border text-sm ${level === lv ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>{lv}</button>
                ))}
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Chọn sách giáo khoa</p>
              <div className="flex flex-wrap gap-2">
                {TEXTBOOKS.map((tb) => (
                  <button key={tb} onClick={() => setTextbook(tb)} className={`px-3 py-1.5 rounded-full border text-sm ${textbook === tb ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>{tb}</button>
                ))}
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2"><Target className="w-4 h-4" /> Nhập mục tiêu học tập</p>
              <textarea value={goal} onChange={(e) => setGoal(e.target.value)} rows={3} className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm p-2 text-gray-800 dark:text-gray-100" placeholder="Ví dụ: Nắm vững nguyên lý và giải được 2 dạng bài tập cơ bản" />
            </div>
          )}
          {step === 5 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2"><FileText className="w-4 h-4" /> Tệp đính kèm</p>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input type="checkbox" className="rounded" checked={requireFiles} onChange={(e) => setRequireFiles(e.target.checked)} />
                Tôi sẽ đính kèm tệp (PDF/ảnh) để AI phân tích cùng ngữ cảnh này
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">Khi xác nhận, hệ thống sẽ mở hộp thoại chọn tệp.</p>
            </div>
          )}
          {step === 6 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Xem lại ngữ cảnh</p>
              <div className="text-sm bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-3 text-gray-800 dark:text-gray-100">
                <p><strong>Chủ đề:</strong> {subject}</p>
                <p><strong>Mức độ:</strong> {level}</p>
                <p><strong>Sách:</strong> {textbook}</p>
                <p><strong>Mục tiêu:</strong> {goal}</p>
                <p><strong>Đính kèm tệp:</strong> {requireFiles ? 'Có' : 'Không'}</p>
              </div>
              <details className="text-xs">
                <summary className="cursor-pointer text-gray-500 dark:text-gray-400">Xem prompt sẽ áp dụng</summary>
                <pre className="mt-2 whitespace-pre-wrap bg-gray-50 dark:bg-gray-900/50 p-3 rounded border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">{buildPrompt()}</pre>
              </details>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/60 flex items-center justify-between">
          <div className="text-xs text-gray-500 dark:text-gray-400">Bước {step}/6</div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Hủy</button>
            <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1} className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 inline-flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" /> Trước
            </button>
            {step < 6 ? (
              <button onClick={() => canNext && setStep(Math.min(6, step + 1))} disabled={!canNext} className="px-3 py-1.5 rounded-lg text-sm bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 inline-flex items-center gap-1">
                Tiếp <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleConfirm} className="px-3 py-1.5 rounded-lg text-sm bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center gap-1">
                Áp dụng
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextWizard;

