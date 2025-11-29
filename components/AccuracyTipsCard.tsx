import React, { useState } from 'react';
import { ChevronDown, Zap } from 'lucide-react';

export interface AccuracyTip {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  examples?: string[];
}

interface AccuracyTipsCardProps {
  tips: AccuracyTip[];
  onTryNow: (tipId: string) => void;
}

const AccuracyTipsCard: React.FC<AccuracyTipsCardProps> = ({ tips, onTryNow }) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpanded(next);
  };

  return (
    <div className="space-y-3">
      {tips.map((tip) => (
        <div key={tip.id} className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800/30">
          <button
            type="button"
            onClick={() => toggle(tip.id)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="text-purple-600">{tip.icon}</div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{tip.title}</h4>
            </div>
            <ChevronDown className={`w-5 h-5 text-purple-600 transition-transform ${expanded.has(tip.id) ? 'rotate-180' : ''}`} />
          </button>

          {expanded.has(tip.id) && (
            <div className="mt-3 pl-8 space-y-3">
              <p className="text-sm text-gray-700 dark:text-gray-300">{tip.description}</p>
              {tip.examples && tip.examples.length > 0 && (
                <div className="space-y-2">
                  {tip.examples.map((ex, i) => (
                    <div key={i} className="p-2 bg-white dark:bg-gray-800 rounded border border-purple-100 dark:border-purple-800/40 text-xs text-gray-700 dark:text-gray-300">
                      {ex}
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => onTryNow(tip.id)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold"
              >
                <Zap className="w-4 h-4" /> Thử ngay
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AccuracyTipsCard;

