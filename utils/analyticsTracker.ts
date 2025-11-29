export type DaySummary = {
  date: string; // YYYY-MM-DD
  questions: number;
  answers: number;
};

export type AnalyticsSummary = {
  totalQuestions: number;
  totalAnswers: number;
  last7Days: DaySummary[];
};

const KEY = 'analytics.summary.v1';

type Stored = {
  totalQuestions: number;
  totalAnswers: number;
  days: Record<string, { q: number; a: number }>;
};

function todayKey(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function load(): Stored {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { totalQuestions: 0, totalAnswers: 0, days: {} };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { totalQuestions: 0, totalAnswers: 0, days: {} };
    return {
      totalQuestions: Number(parsed.totalQuestions) || 0,
      totalAnswers: Number(parsed.totalAnswers) || 0,
      days: parsed.days || {}
    };
  } catch {
    return { totalQuestions: 0, totalAnswers: 0, days: {} };
  }
}

function save(data: Stored) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
}

export function recordQuestion() {
  const data = load();
  data.totalQuestions += 1;
  const k = todayKey();
  data.days[k] = data.days[k] || { q: 0, a: 0 };
  data.days[k].q += 1;
  save(data);
  try { window.dispatchEvent(new Event('analytics-updated')); } catch {}
}

export function recordAnswer() {
  const data = load();
  data.totalAnswers += 1;
  const k = todayKey();
  data.days[k] = data.days[k] || { q: 0, a: 0 };
  data.days[k].a += 1;
  save(data);
  try { window.dispatchEvent(new Event('analytics-updated')); } catch {}
}

export function getSummary(): AnalyticsSummary {
  const data = load();
  const days: DaySummary[] = [];
  const base = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(base.getDate() - i);
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const entry = data.days[k] || { q: 0, a: 0 };
    days.push({ date: k, questions: entry.q, answers: entry.a });
  }
  return { totalQuestions: data.totalQuestions, totalAnswers: data.totalAnswers, last7Days: days };
}
