import React, { useEffect, useState } from 'react';

interface MermaidDiagramProps {
  chart: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const renderDiagram = async () => {
      try {
        const { default: mermaid } = await import('mermaid');
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: 'sans-serif',
        });
        const id = `mermaid-diagram-${Math.random().toString(36).slice(2, 11)}`;
        const { svg: svgCode } = await mermaid.render(id, chart);
        if (isMounted) {
          setSvg(svgCode);
          setError(null);
        }
      } catch (e) {
        if (isMounted) {
          console.error(e);
          setError('Không thể hiển thị sơ đồ. Vui lòng kiểm tra cú pháp.');
        }
      }
    };

    renderDiagram();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-4 rounded-md">
        {error}
      </div>
    );
  }

  return <div className="dark:invert dark:hue-rotate-180" dangerouslySetInnerHTML={{ __html: svg }} />;
};

export default MermaidDiagram;
