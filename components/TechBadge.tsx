import React, { useState } from 'react';

const TechBadge: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="fixed bottom-24 right-8 z-40"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {isExpanded ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-4 animate-scale-in">
          <h4 className="font-bold text-sm mb-2 text-gray-800 dark:text-white flex items-center">
            <i className="fas fa-robot text-blue-600 mr-2"></i>
            Powered by
          </h4>
          <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <i className="fas fa-brain text-purple-600"></i>
              <span>Llama 3.1 8B (Cloudflare AI)</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fab fa-react text-cyan-600"></i>
              <span>React 19 + TypeScript</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fas fa-wind text-teal-600"></i>
              <span>Tailwind CSS</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer">
          <i className="fas fa-robot mr-2"></i>
          <span className="text-sm font-semibold">AI Powered</span>
        </div>
      )}
    </div>
  );
};

export default TechBadge;
