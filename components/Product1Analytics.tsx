import React from 'react';
import { getSummary, AnalyticsSummary } from '../utils/analyticsTracker';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { LineChart, Line } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#2563eb', '#10b981'];

const Product1Analytics: React.FC = () => {
  const [summary, setSummary] = React.useState<AnalyticsSummary>(getSummary());

  React.useEffect(() => {
    const handler = () => setSummary(getSummary());
    window.addEventListener('analytics-updated', handler);
    return () => window.removeEventListener('analytics-updated', handler);
  }, []);

  const chartData = summary.last7Days.map(d => ({
    date: d.date.slice(5), // MM-DD
    Questions: d.questions,
    Answers: d.answers,
  }));

  const isEmpty = summary.totalQuestions + summary.totalAnswers === 0;

  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Thống kê học tập</h3>
        <div className="text-xs text-gray-500 dark:text-gray-400">7 ngày gần đây</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Câu hỏi" value={summary.totalQuestions} color="text-blue-600" />
        <StatCard label="Câu trả lời" value={summary.totalAnswers} color="text-emerald-600" />
        <StatCard label="TB/ngày (Q)" value={avg(summary.last7Days.map(d => d.questions))} />
        <StatCard label="TB/ngày (A)" value={avg(summary.last7Days.map(d => d.answers))} />
      </div>

      {isEmpty ? (
        <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-6 text-center text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800">
          Chưa có dữ liệu. Hãy bắt đầu trò chuyện với AI để xem thống kê tại đây.
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Questions" fill={COLORS[0]} radius={[6, 6, 0, 0]} />
              <Bar dataKey="Answers" fill={COLORS[1]} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: number; color?: string }> = ({ label, value, color }) => (
  <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</div>
    <div className={`text-2xl font-bold ${color || 'text-gray-900 dark:text-white'}`}>{value}</div>
  </div>
);

function avg(nums: number[]): number {
  if (!nums.length) return 0;
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}

export default Product1Analytics;

