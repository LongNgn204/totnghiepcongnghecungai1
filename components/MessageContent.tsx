import React from 'react';
import DOMPurify from 'dompurify';
import katex from 'katex';
import CodeBlock from './CodeBlock';
import 'katex/dist/katex.min.css';

interface MessageContentProps {
  content: string;
}

const isSafeHttpUrl = (url: string): boolean => {
  try {
    const u = new URL(url, window.location.origin);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

const isSafeImageSrc = (src: string): boolean => {
  try {
    const u = new URL(src, window.location.origin);
    if (u.protocol === 'http:' || u.protocol === 'https:') return true;
    if (u.protocol === 'data:') {
      return /^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml);base64,/i.test(src);
    }
    return false;
  } catch {
    return false;
  }
};

const escapeHtml = (str: string): string =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const MessageContent: React.FC<MessageContentProps> = ({ content }) => {
  const renderContent = () => {
    const parts: React.ReactNode[] = [];
    let key = 0;

    // Extract and render code blocks first
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

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

// KaTeX options and common macros
const katexOptions = {
  throwOnError: false,
  trust: true,
  macros: {
    "\\RR": "\\mathbb{R}",
    "\\NN": "\\mathbb{N}",
    "\\ZZ": "\\mathbb{Z}",
    "\\QQ": "\\mathbb{Q}",
    "\\CC": "\\mathbb{C}",
    "\\vec": "\\boldsymbol{#1}",
    "\\bm": "\\boldsymbol{#1}",
    "\\abs": "\\left|#1\\right|",
    "\\norm": "\\left\\lVert#1\\right\\rVert",
    "\\set": "\\left\\{#1\\right\\}",
    "\\inner": "\\left\\langle #1,#2 \\right\\rangle",
    "\\argmax": "\\operatorname*{arg\\,max}",
    "\\argmin": "\\operatorname*{arg\\,min}",
    "\\dv": "\\frac{d \\! #1}{d \\! #2}",
    "\\pdv": "\\frac{\\partial \\! #1}{\\partial \\! #2}",
    "\\qty": "\\left( #1 \\right)",
  } as Record<string, string>,
};

// Format markdown (without code blocks, handled separately)
const formatMarkdown = (text: string): string => {
  let html = text;

  // Escape HTML
  html = escapeHtml(html);

  // Math display blocks: $...$ and \[...\]
  html = html.replace(/\$\$([\s\S]+?)\$\$/g, (_m, eq) => {
    try { return `<div class="math-block my-4">${katex.renderToString(String(eq).trim(), { ...katexOptions, displayMode: true })}</div>`; }
    catch { return `<div class="math-error bg-red-100 dark:bg-red-900 p-2 rounded">${escapeHtml(eq)}</div>`; }
  });
  html = html.replace(/\\\[([\s\S]+?)\\\]/g, (_m, eq) => {
    try { return `<div class="math-block my-4">${katex.renderToString(String(eq).trim(), { ...katexOptions, displayMode: true })}</div>`; }
    catch { return `<div class="math-error bg-red-100 dark:bg-red-900 p-2 rounded">${escapeHtml(eq)}</div>`; }
  });

  // Math environments (display)
  const envs = '(equation\*?|align\*?|aligned|gather\*?|multline\*?|cases|matrix|pmatrix|bmatrix|Bmatrix|vmatrix|Vmatrix)';
  const envBlock = new RegExp('\\\\begin\\{' + envs + '\\}([\\s\\S]*?)\\\\end\\{' + envs + '\\}', 'g');
  html = html.replace(envBlock, (_m, _env, body) => {
    try { return `<div class="math-block my-4">${katex.renderToString(String(body).trim(), { ...katexOptions, displayMode: true })}</div>`; }
    catch { return `<div class="math-error bg-red-100 dark:bg-red-900 p-2 rounded">${escapeHtml(body)}</div>`; }
  });

  // Math inline: $...$ and \(...\)
  html = html.replace(/\$([^\$\n]+?)\$/g, (_m, eq) => {
    try { return `<span class="math-inline">${katex.renderToString(String(eq).trim(), { ...katexOptions, displayMode: false })}</span>`; }
    catch { return `<span class="math-error text-red-600">${escapeHtml(eq)}</span>`; }
  });
  html = html.replace(/\\\(([^\\)\n]+?)\\\)/g, (_m, eq) => {
    try { return `<span class="math-inline">${katex.renderToString(String(eq).trim(), { ...katexOptions, displayMode: false })}</span>`; }
    catch { return `<span class="math-error text-red-600">${escapeHtml(eq)}</span>`; }
  });

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2 text-gray-800">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3 text-gray-800">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4 text-gray-800">$1</h1>');

  // Bold / Italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-blue-600">$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>');

  // Inline code (only single backticks, triple handled separately)
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-200 px-2 py-1 rounded text-sm font-mono text-pink-600">$1</code>');

  // Images (sanitize URL)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt, src) => {
    const safe = isSafeImageSrc(src) ? src : '';
    const escapedAlt = escapeHtml(alt);
    if (!safe) return `<span class="text-red-500 text-sm">[Blocked image: ${escapedAlt}]</span>`;
    return `<a href="${safe}" target="_blank" rel="noopener noreferrer"><img src="${safe}" alt="${escapedAlt}" loading="lazy" decoding="async" referrerpolicy="no-referrer" class="max-w-full rounded-xl shadow-sm my-4 border border-gray-100 cursor-zoom-in" /></a>`;
  });

  // Links (sanitize URL)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, href) => {
    const safe = isSafeHttpUrl(href) ? href : '#';
    const escapedLabel = escapeHtml(label);
    return `<a href="${safe}" class="text-blue-500 hover:underline font-medium" target="_blank" rel="noopener noreferrer">${escapedLabel} 🔗</a>`;
  });

  // Lists
  html = html.replace(/^\s*[-•]\s+(.*)$/gim, '<li class="ml-6 my-1 flex items-start gap-2"><span class="text-blue-500 font-bold">•</span><span>$1</span></li>');
  html = html.replace(/^\s*(\d+)\.\s+(.*)$/gim, '<li class="ml-6 my-1 flex items-start gap-2"><span class="text-blue-600 font-bold">$1.</span><span>$2</span></li>');

  // Blockquotes
  html = html.replace(/^>\s+(.*)$/gim, '<blockquote class="border-l-4 border-blue-500 pl-4 my-2 italic text-gray-700 bg-blue-50 py-2 rounded-r">$1</blockquote>');

  // Horizontal rules
  html = html.replace(/^━+$/gm, '<hr class="my-4 border-t-2 border-gray-300"/>');
  html = html.replace(/^─+$/gm, '<hr class="my-2 border-t border-gray-200"/>');

  // Line breaks
  html = html.replace(/\n\n/g, '<br/><br/>' );
  html = html.replace(/\n/g, '<br/>' );

  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true, svg: false, mathMl: true },
    ADD_ATTR: ['target', 'rel', 'referrerpolicy', 'loading', 'decoding', 'class'],
  });
};

export default MessageContent;
