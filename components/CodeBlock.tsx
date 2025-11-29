import React, { useEffect, useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'javascript' }) => {
  const [copied, setCopied] = useState(false);
  const [Highlighter, setHighlighter] = useState<any>(null);
  const [style, setStyle] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    // Lazy load syntax highlighter and theme to reduce initial JS
    Promise.all([
      import('react-syntax-highlighter').then(m => m.Prism),
      import('react-syntax-highlighter/dist/esm/styles/prism').then(m => m.vscDarkPlus)
    ]).then(([PrismComp, theme]) => {
      if (mounted) {
        setHighlighter(() => PrismComp);
        setStyle(theme);
      }
    }).catch(() => {
      // ignore - fallback to plain pre
    });
    return () => { mounted = false; };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // ignore
    }
  };

  const detectLanguage = (lang?: string): string => {
    if (!lang) return 'javascript';
    const langMap: { [key: string]: string } = {
      'js': 'javascript', 'ts': 'typescript', 'py': 'python', 'java': 'java', 'cpp': 'cpp', 'c': 'c', 'cs': 'csharp',
      'php': 'php', 'rb': 'ruby', 'go': 'go', 'rs': 'rust', 'kt': 'kotlin', 'swift': 'swift', 'sql': 'sql',
      'html': 'markup', 'xml': 'markup', 'css': 'css', 'scss': 'scss', 'json': 'json', 'yaml': 'yaml', 'yml': 'yaml',
      'md': 'markdown', 'bash': 'bash', 'sh': 'bash', 'shell': 'bash', 'powershell': 'powershell', 'ps1': 'powershell'
    };
    return langMap[lang.toLowerCase()] || lang;
  };

  const getLanguageLabel = (lang: string): string => {
    const labels: { [key: string]: string } = {
      'javascript': 'JavaScript', 'typescript': 'TypeScript', 'python': 'Python', 'java': 'Java', 'cpp': 'C++', 'c': 'C',
      'csharp': 'C#', 'php': 'PHP', 'ruby': 'Ruby', 'go': 'Go', 'rust': 'Rust', 'kotlin': 'Kotlin', 'swift': 'Swift',
      'sql': 'SQL', 'markup': 'HTML', 'css': 'CSS', 'scss': 'SCSS', 'json': 'JSON', 'yaml': 'YAML', 'markdown': 'Markdown',
      'bash': 'Bash', 'powershell': 'PowerShell'
    };
    return labels[lang] || lang.toUpperCase();
  };

  const detectedLang = detectLanguage(language);

  return (
    <div className="relative group my-4 rounded-xl overflow-hidden shadow-lg border-2 border-gray-700">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
        <span className="text-xs font-semibold text-gray-300 flex items-center gap-2">
          <i className="fas fa-code"></i>
          {getLanguageLabel(detectedLang)}
        </span>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            copied
              ? 'bg-green-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
          }`}
          aria-label="Copy code"
        >
          <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
          {copied ? 'Đã copy!' : 'Copy code'}
        </button>
      </div>

      {/* Code */}
      <div className="relative">
        {Highlighter && style ? (
          <Highlighter
            language={detectedLang}
            style={style}
            customStyle={{
              margin: 0,
              padding: '1.25rem',
              fontSize: '0.875rem',
              lineHeight: '1.5',
              backgroundColor: '#1e1e1e',
            }}
            showLineNumbers={code.split('\n').length > 5}
            wrapLines
            wrapLongLines
          >
            {code}
          </Highlighter>
        ) : (
          <pre className="m-0 p-5 text-xs leading-6 bg-[#1e1e1e] text-gray-100 overflow-auto">
            {code}
          </pre>
        )}
      </div>
    </div>
  );
};

export default CodeBlock;
