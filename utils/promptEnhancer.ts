export type EnhancementSuggestion = {
  label: string;
  example?: string;
};

export type EnhancementResult = {
  improvedPrompt: string;
  suggestions: EnhancementSuggestion[];
  changes: string[]; // human-readable changelog
};

/**
 * Lightweight prompt enhancement heuristic (client-side):
 * - Adds Context section if missing (Lớp/SGK/Mục tiêu)
 * - Encourages structure (bảng/danh sách/các bước)
 * - Adds validation hint (sai lầm thường gặp / cách kiểm tra)
 */
export function enhancePrompt(raw: string): EnhancementResult {
  const original = (raw || '').trim();
  const suggestions: EnhancementSuggestion[] = [];
  const changes: string[] = [];
  let improved = original;

  // Add Context if missing
  if (!/(sgk|sách|lớp|mục tiêu)/i.test(original)) {
    improved = `Ngữ cảnh:\n- Lớp: 12\n- Sách: Kết nối tri thức hoặc Cánh Diều\n- Mục tiêu: Hiểu và vận dụng để làm bài tập\n\nYêu cầu:\n${improved}`;
    changes.push('Bổ sung khối Ngữ cảnh (lớp, sách, mục tiêu).');
  }

  // Encourage structure
  if (!/(bảng|danh sách|các bước|so sánh)/i.test(original)) {
    improved += `\n\nĐịnh dạng trả lời mong muốn:\n- Trình bày theo các mục rõ ràng\n- Nếu có thể, thêm bảng tóm tắt hoặc các bước giải`;
    changes.push('Gợi ý định dạng (các mục/bảng/các bước).');
  }

  // Add validation hint
  if (!/(lỗi|sai lầm|kiểm tra)/i.test(original)) {
    improved += `\n\nLưu ý: Nêu 1-2 sai lầm thường gặp và cách kiểm tra kết quả.`;
    changes.push('Thêm yêu cầu nêu sai lầm thường gặp và cách kiểm tra.');
  }

  suggestions.push(
    { label: 'Chỉ rõ SGK (KNTT/Cánh Diều)' },
    { label: 'Yêu cầu ví dụ số/công thức' },
    { label: 'Đề nghị trình bày theo các bước/bảng' },
  );

  return { improvedPrompt: improved, suggestions, changes };
}
