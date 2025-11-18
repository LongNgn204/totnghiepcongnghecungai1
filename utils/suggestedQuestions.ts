import { generateContent } from './geminiAPI';
import type { ChatMessage } from './chatStorage';

/**
 * Generate suggested follow-up questions based on conversation context
 */
export const generateSuggestedQuestions = async (
  messages: ChatMessage[],
  grade: string = '12'
): Promise<string[]> => {
  try {
    if (messages.length === 0) {
      // Default questions for new chat
      return getDefaultQuestions(grade);
    }

    // Get last 4 messages for context
    const recentMessages = messages.slice(-4);
    const context = recentMessages
      .map(m => `${m.role === 'user' ? 'Học sinh' : 'AI'}: ${m.content}`)
      .join('\n\n');

    const prompt = `Dựa trên cuộc trò chuyện sau, hãy đề xuất 3 câu hỏi tiếp theo mà học sinh lớp ${grade} có thể quan tâm:

${context}

YÊU CẦU:
- Mỗi câu hỏi phải liên quan trực tiếp đến nội dung vừa thảo luận
- Câu hỏi nên đi sâu hơn hoặc mở rộng kiến thức
- Ngắn gọn, rõ ràng (tối đa 15 từ mỗi câu)
- Phù hợp với trình độ học sinh lớp ${grade}

Trả về CHÍNH XÁC 3 câu hỏi, mỗi câu trên 1 dòng, KHÔNG đánh số, KHÔNG giải thích thêm.`;

    const response = await generateContent(prompt);
    
    if (!response.success || !response.text) {
      return getDefaultQuestions(grade);
    }
    
    const questions = response.text
      .split('\n')
      .map(q => q.trim())
      .filter(q => q.length > 0 && !q.match(/^\d+[\.\)]/)) // Remove numbered items
      .slice(0, 3);

    return questions.length > 0 ? questions : getDefaultQuestions(grade);
  } catch (error) {
    console.error('Error generating suggested questions:', error);
    return getDefaultQuestions(grade);
  }
};

/**
 * Get default suggested questions based on grade
 */
const getDefaultQuestions = (grade: string): string[] => {
  const questionsByGrade: { [key: string]: string[] } = {
    '6': [
      'Máy tính hoạt động như thế nào?',
      'Internet được tạo ra bằng cách nào?',
      'Làm sao để bảo vệ thông tin cá nhân?'
    ],
    '7': [
      'Thuật toán là gì? Cho ví dụ',
      'Phần mềm và phần cứng khác nhau thế nào?',
      'Lập trình Scratch có thể làm gì?'
    ],
    '8': [
      'Cơ sở dữ liệu được sử dụng như thế nào?',
      'Mạng máy tính có những loại nào?',
      'HTML và CSS khác nhau chỗ nào?'
    ],
    '9': [
      'Trí tuệ nhân tạo hoạt động ra sao?',
      'Blockchain có ứng dụng gì thực tế?',
      'IoT ảnh hưởng đến cuộc sống thế nào?'
    ],
    '10': [
      'Giải thích cách hoạt động của hệ thống điện năng lượng mặt trời',
      'Máy biến áp có vai trò gì trong lưới điện?',
      'Động cơ điện 3 pha hoạt động như thế nào?'
    ],
    '11': [
      'Phân tích nguyên lý hoạt động của PLC trong tự động hóa',
      'Robot công nghiệp được lập trình bằng cách nào?',
      'Cảm biến trong công nghiệp 4.0 có vai trò gì?'
    ],
    '12': [
      'So sánh các công nghệ trồng trọt thông minh',
      'Hệ thống tưới tự động hoạt động ra sao?',
      'AI được ứng dụng trong nông nghiệp như thế nào?'
    ]
  };

  return questionsByGrade[grade] || questionsByGrade['12'];
};

/**
 * Generate smart suggestions based on user's grade and subject
 */
export const getSmartSuggestions = (grade: string, subject?: string): string[] => {
  if (subject === 'Công nghiệp') {
    return [
      'Giải thích nguyên lý hoạt động của máy biến áp',
      'Tính toán công suất trong mạch điện ba pha',
      'Hệ thống PLC điều khiển dây chuyền sản xuất'
    ];
  }

  if (subject === 'Nông nghiệp') {
    return [
      'Công nghệ IoT trong nông nghiệp thông minh',
      'Hệ thống tưới tự động dựa trên độ ẩm đất',
      'Phân tích chất lượng đất bằng cảm biến'
    ];
  }

  // Default suggestions
  return getDefaultQuestions(grade);
};

/**
 * Detect if the last message needs follow-up
 */
export const needsFollowUp = (lastMessage: ChatMessage): boolean => {
  if (!lastMessage || lastMessage.role === 'user') return false;

  const content = lastMessage.content.toLowerCase();
  
  // Keywords that suggest user might want to know more
  const followUpKeywords = [
    'ví dụ',
    'tóm lại',
    'một cách khác',
    'ngoài ra',
    'lưu ý',
    'quan trọng',
    'nếu bạn muốn',
    'có thể tìm hiểu thêm'
  ];

  return followUpKeywords.some(keyword => content.includes(keyword));
};
