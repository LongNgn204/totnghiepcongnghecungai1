import React, { useEffect, useMemo, useState } from 'react';
import { Lesson } from '../data/codingLessons';
import { QuestionMC, QuestionTF } from '../types';
import codingQuizzes from '../data/codingQuizzes';
import { generateContent } from '../utils/geminiAPI';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface QuizPanelProps {
  lesson?: Lesson;
  onPassed?: () => void;
}

type MCAnswers = Record<number, string>; // question id -> selected option
type TFAnswers = Record<string, boolean>; // statement id -> selected value

const passThreshold = 0.8; // 80%

const QuizPanel: React.FC<QuizPanelProps> = ({ lesson, onPassed }) => {
  const external = lesson ? codingQuizzes[lesson.id] : undefined;
  const mc = ((lesson?.mcQuestions && lesson.mcQuestions.length > 0) ? lesson.mcQuestions : external?.mc) as QuestionMC[] || [];
  const tf = ((lesson?.tfQuestions && lesson.tfQuestions.length > 0) ? lesson.tfQuestions : external?.tf) as QuestionTF[] || [];

  const storageKey = useMemo(() => (lesson ? `quiz_answers_${lesson.id}` : ''), [lesson?.id]);

  const [mcAnswers, setMcAnswers] = useState<MCAnswers>({});
  const [tfAnswers, setTfAnswers] = useState<TFAnswers>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Load saved answers
  useEffect(() => {
    if (!lesson || !storageKey) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        setMcAnswers(parsed.mc || {});
        setTfAnswers(parsed.tf || {});
        setSubmitted(!!parsed.submitted);
        setScore(parsed.score || 0);
      } else {
        setMcAnswers({});
        setTfAnswers({});
        setSubmitted(false);
        setScore(0);
      }
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  // Save answers
  useEffect(() => {
    if (!lesson || !storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ mc: mcAnswers, tf: tfAnswers, submitted, score }));
    } catch {}
  }, [lesson?.id, storageKey, mcAnswers, tfAnswers, submitted, score]);

  const totalQuestions = mc.length + tf.reduce((sum, q) => sum + q.statements.length, 0);

  const grade = () => {
    let correct = 0;
    // MC grading
    for (const q of mc) {
      const sel = mcAnswers[q.id];
      if (sel && sel === (q.answer || q.correctAnswer)) correct += 1;
    }
    // TF grading (each statement counts as 1)
    for (const q of tf) {
      for (const st of q.statements) {
        const sel = tfAnswers[`${q.id}:${st.id}`];
        if (typeof sel === 'boolean' && sel === st.isCorrect) correct += 1;
      }
    }
    const s = totalQuestions > 0 ? correct / totalQuestions : 0;
    setScore(s);
    setSubmitted(true);
    if (s >= passThreshold) onPassed?.();
  };

  const reset = () => {
    setMcAnswers({});
    setTfAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  if (!lesson) {
    return <div className="p-4 text-sm text-gray-500">Chọn một bài học để làm bài trắc nghiệm.</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Bài trắc nghiệm: {lesson.title}</h3>
          <div className="text-sm text-gray-600">
            Tổng số câu: <span className="font-semibold">{totalQuestions}</span>
          </div>
        </div>
        {submitted && (
          <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${score >= passThreshold ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
            {score >= passThreshold ? <CheckCircle size={16} /> : <XCircle size={16} />}
            Điểm: {(score * 100).toFixed(0)}%
          </div>
        )}
      </div>

      <div className="p-4 space-y-6">
        {/* Multiple Choice */}
        {mc.length > 0 && (
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Câu hỏi trắc nghiệm (MC)</h4>
            <div className="space-y-4">
              {mc.map((q, idx) => {
                const selected = mcAnswers[q.id];
                const correct = q.answer || q.correctAnswer;
                return (
                  <div key={q.id} className="p-3 rounded-lg border bg-white">
                    <div className="font-medium text-gray-900">{idx + 1}. {q.question || q.text}</div>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {q.options.map(opt => {
                        const isSelected = selected === opt;
                        const isCorrect = submitted && correct === opt;
                        const isWrong = submitted && isSelected && correct !== opt;
                        return (
                          <label key={opt} className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} ${isCorrect ? '!border-green-600 !bg-green-50' : ''} ${isWrong ? '!border-red-600 !bg-red-50' : ''}`}>
                            <input
                              type="radio"
                              name={`mc_${q.id}`}
                              className="accent-blue-600"
                              checked={isSelected || false}
                              onChange={() => setMcAnswers(prev => ({ ...prev, [q.id]: opt }))}
                              disabled={submitted}
                            />
                            <span className="text-sm text-gray-900">{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                    {submitted && q.explanation && (
                      <div className="mt-2 text-xs text-gray-600">Giải thích: {q.explanation}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* True/False */}
        {tf.length > 0 && (
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Đúng/Sai (TF)</h4>
            <div className="space-y-4">
              {tf.map((q, idx) => (
                <div key={q.id} className="p-3 rounded-lg border bg-white">
                  <div className="font-medium text-gray-900">{mc.length + idx + 1}. {q.question || q.text}</div>
                  <div className="mt-2 space-y-2">
                    {q.statements.map(st => {
                      const key = `${q.id}:${st.id}`;
                      const selected = tfAnswers[key];
                      const isCorrect = submitted && typeof selected === 'boolean' && selected === st.isCorrect;
                      const isWrong = submitted && typeof selected === 'boolean' && selected !== st.isCorrect;
                      return (
                        <div key={st.id} className={`p-2 rounded border ${isCorrect ? 'border-green-600 bg-green-50' : isWrong ? 'border-red-600 bg-red-50' : 'border-gray-200 bg-white'}`}>
                          <div className="text-sm text-gray-900 mb-1">{st.text}</div>
                          <div className="flex items-center gap-4 text-sm">
                            <label className="inline-flex items-center gap-1">
                              <input type="radio" name={`tf_${key}`} className="accent-blue-600" checked={selected === true} onChange={() => setTfAnswers(prev => ({ ...prev, [key]: true }))} disabled={submitted} />
                              Đúng
                            </label>
                            <label className="inline-flex items-center gap-1">
                              <input type="radio" name={`tf_${key}`} className="accent-blue-600" checked={selected === false} onChange={() => setTfAnswers(prev => ({ ...prev, [key]: false }))} disabled={submitted} />
                              Sai
                            </label>
                          </div>
                          {submitted && st.explanation && (
                            <div className="mt-1 text-xs text-gray-600">Giải thích: {st.explanation}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button onClick={grade} disabled={submitted || totalQuestions === 0} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-medium">Nộp bài & Chấm điểm</button>
          <button onClick={reset} className="px-3 py-2 rounded-lg bg-gray-100 text-gray-900 text-sm font-medium border flex items-center gap-2"><RefreshCw size={16}/>Làm lại</button>
        </div>
        {totalQuestions === 0 && (
          <p className="text-sm text-gray-500">Bài học này chưa có câu hỏi. Hãy tiếp tục học phần code trước nhé!</p>
        )}
      </div>
    </div>
  );
};

export default QuizPanel;

