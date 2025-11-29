export type TemplateCategory = 'Lý thuyết' | 'Bài tập' | 'Tài liệu' | 'So sánh' | 'Ôn thi';

export interface PromptTemplate {
  id: string;
  category: TemplateCategory;
  title: string;
  description?: string;
  build: () => string;
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'explain-concept',
    category: 'Lý thuyết',
    title: 'Giải thích khái niệm',
    description: 'Yêu cầu AI giải thích khái niệm một cách rõ ràng, có ví dụ.',
    build: () => `Giải thích khái niệm "máy biến áp ba pha" dành cho học sinh lớp 12 theo SGK Kết nối tri thức. 
- Trình bày ngắn gọn, dễ hiểu. 
- Có ví dụ minh hoạ thực tế. 
- Nêu 2 lỗi hiểu sai phổ biến và cách tránh.`,
  },
  {
    id: 'solve-exercise',
    category: 'Bài tập',
    title: 'Giải bài tập có hướng dẫn',
    description: 'Yêu cầu phân tích đề và giải từng bước.',
    build: () => `Hãy giải bài tập mạch điện ba pha với các yêu cầu:
- Đề: Công suất tác dụng P = 10kW, hệ số công suất cosφ = 0.8. 
- Yêu cầu: Trình bày từng bước rõ ràng, ghi công thức, thay số, kết luận. 
- Nếu thiếu dữ liệu, hãy nêu giả thiết hợp lý và giải theo giả thiết đó.`,
  },
  {
    id: 'analyze-document',
    category: 'Tài liệu',
    title: 'Phân tích tài liệu đính kèm',
    description: 'Dùng khi tải lên PDF/ảnh để AI trích ý chính.',
    build: () => `Tôi sẽ tải lên 1 tài liệu (PDF/ảnh). Hãy:
1) Tóm tắt 5 ý chính.
2) Liệt kê công thức quan trọng (nếu có).
3) Gợi ý 3 câu hỏi trắc nghiệm kiểm tra kiến thức.
Nếu thiếu ngữ cảnh, hãy hỏi lại tôi trước khi kết luận.`,
  },
  {
    id: 'compare-contrast',
    category: 'So sánh',
    title: 'So sánh & đối chiếu',
    description: 'Tạo bảng so sánh rõ ràng.',
    build: () => `So sánh điốt và transistor theo các tiêu chí: nguyên lý, ứng dụng, ưu/nhược điểm, ký hiệu. Trả lời dạng bảng, ngắn gọn, dễ nhớ.`,
  },
  {
    id: 'exam-prep',
    category: 'Ôn thi',
    title: 'Ôn thi nhanh theo mục tiêu',
    description: 'Yêu cầu checklist ôn tập có ví dụ & mẹo.',
    build: () => `Hãy tạo checklist ôn thi nhanh chủ đề "mạch điện ba pha" cho lớp 12 (SGK Cánh Diều):
- 5 ý trọng tâm
- 3 ví dụ bài tập có lời giải tóm tắt
- 5 mẹo/note dễ sai`,
  },
];

