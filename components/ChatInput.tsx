import React, { ChangeEvent, ClipboardEvent, RefObject } from 'react';

interface ChatInputProps {
  inputMessage: string;
  onInputChange: (val: string) => void;
  onSendMessage: () => void;
  loading: boolean;
  attachedFiles: File[];
  onRemoveFile: (index: number) => void;
  onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: RefObject<HTMLInputElement>;
  onPaste: (e: ClipboardEvent) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputMessage,
  onInputChange,
  onSendMessage,
  loading,
  attachedFiles,
  onRemoveFile,
  onFileSelect,
  fileInputRef,
  onPaste
}) => {
  return (
    <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
      {attachedFiles.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-3">
          {attachedFiles.map((file, idx) => (
            <div key={idx} className="relative bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg flex items-center gap-2">
              <span className="text-sm truncate max-w-[150px]">{file.name}</span>
              <button onClick={() => onRemoveFile(idx)} className="text-red-500 hover:text-red-700">✕</button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <input type="file" ref={fileInputRef} onChange={onFileSelect} multiple className="hidden" />
        <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all border border-gray-300" title="Đính kèm">
          📎
        </button>

        <textarea
          value={inputMessage}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSendMessage(); } }}
          onPaste={onPaste}
          placeholder="Nhập câu hỏi... (Shift+Enter xuống dòng)"
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows={1}
          disabled={loading}
        />

        <button
          onClick={onSendMessage}
          disabled={loading || (!inputMessage.trim() && attachedFiles.length === 0)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 font-bold"
        >
          ➤
        </button>
      </div>
      <p className="text-xs text-center text-gray-400 mt-2">AI có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.</p>
    </div>
  );
};

export default ChatInput;
