import React from 'react';
import katex from 'katex';
import CodeBlock from './CodeBlock';
import 'katex/dist/katex.min.css';

interface MessageContentProps {
  content: string;
}

const MessageContent: React.FC<MessageContentProps> = ({ content }) => {
  const renderContent = () => {
    const parts: React.ReactNode[] = [];
    let text = content;
    let key = 0;

    // Extract and render code blocks first
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        const textBefore = content.substring(lastIndex, match.index);
        parts.push(
          <span
            key={`text-${key++}`}
            dangerouslySetInnerHTML={{ __html: formatMarkdown(textBefore) }}
          />
        );
      }

      // Add code block
      const language = match[1] || 'text';
      const code = match[2].trim();
      parts.push(
        <CodeBlock key={`code-${key++}`} code={code} language={language} />
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      const remainingText = content.substring(lastIndex);
      parts.push(
        <span
          key={`text-${key++}`}
          dangerouslySetInnerHTML={{ __html: formatMarkdown(remainingText) }}
        />
      );
    }

    return parts.length > 0 ? parts : (
      <span dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }} />
    );
  };

  return <div className="message-content">{renderContent()}</div>;
};

// Format markdown (without code blocks, handled separately)
const formatMarkdown = (text: string): string => {
  let html = text;

  // Escape HTML
  html = html.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Math equations - Block ($$...$$)
  html = html.replace(/\$\$([\s\S]+?)\$\$/g, (match, equation) => {
    try {
      return `<div class="math-block my-4">${katex.renderToString(equation.trim(), {
        displayMode: true,
        throwOnError: false,
        trust: true
      })}</div>`;
    } catch (e) {
      return `<div class="math-error bg-red-100 dark:bg-red-900 p-2 rounded">Error rendering: ${equation}</div>`;
    }
  });

  // Math equations - Inline ($...$)
  html = html.replace(/\$([^\$\n]+?)\$/g, (match, equation) => {
    try {
      return `<span class="math-inline">${katex.renderToString(equation.trim(), {
        displayMode: false,
        throwOnError: false,
        trust: true
      })}</span>`;
    } catch (e) {
      return `<span class="math-error text-red-600">${equation}</span>`;
    }
  });

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2 text-gray-800">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3 text-gray-800">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4 text-gray-800">$1</h1>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-blue-600">$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>');

  // Inline code (only single backticks, triple handled separately)
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-200 px-2 py-1 rounded text-sm font-mono text-pink-600">$1</code>');

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg shadow-lg my-4 border-2 border-gray-200 hover:scale-105 transition-transform cursor-pointer" onclick="window.open(\'$2\', \'_blank\')" />');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-500 hover:underline font-medium" target="_blank" rel="noopener noreferrer">$1 <i class="fas fa-external-link-alt text-xs"></i></a>');

  // Lists - Unordered
  html = html.replace(/^\s*[-•]\s+(.*)$/gim, '<li class="ml-6 my-1 flex items-start gap-2"><span class="text-blue-500 font-bold">•</span><span>$1</span></li>');

  // Lists - Ordered
  html = html.replace(/^\s*(\d+)\.\s+(.*)$/gim, '<li class="ml-6 my-1 flex items-start gap-2"><span class="text-blue-600 font-bold">$1.</span><span>$2</span></li>');

  // Blockquotes
  html = html.replace(/^>\s+(.*)$/gim, '<blockquote class="border-l-4 border-blue-500 pl-4 my-2 italic text-gray-700 bg-blue-50 py-2 rounded-r">$1</blockquote>');

  // Horizontal rules
  html = html.replace(/^━+$/gm, '<hr class="my-4 border-t-2 border-gray-300"/>');
  html = html.replace(/^─+$/gm, '<hr class="my-2 border-t border-gray-200"/>');

  // Line breaks
  html = html.replace(/\n\n/g, '<br/><br/>');
  html = html.replace(/\n/g, '<br/>');

  return html;
};

export default MessageContent;
