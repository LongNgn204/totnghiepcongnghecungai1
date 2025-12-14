// Enhanced error messages for better user experience

export interface ErrorContext {
  type: 'api' | 'network' | 'validation' | 'parsing' | 'unknown';
  originalMessage?: string;
  statusCode?: number;
}

export function getfriendlyErrorMessage(error: any, context?: Partial<ErrorContext>): string {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const lowerError = errorMessage.toLowerCase();

  // API Key errors
  if (lowerError.includes('api key') || lowerError.includes('api_key') || lowerError.includes('apikey')) {
    return '🔑 API key chưa được cấu hình. Vui lòng liên hệ quản trị viên để cấp quyền truy cập.';
  }

  // Network errors
  if (lowerError.includes('network') || lowerError.includes('failed to fetch') || lowerError.includes('networkerror')) {
    return '📡 Mất kết nối mạng. Vui lòng kiểm tra internet và thử lại.';
  }

  // Timeout errors
  if (lowerError.includes('timeout') || lowerError.includes('time out')) {
    return '⏱️ Yêu cầu quá lâu không phản hồi. Vui lòng thử lại sau vài giây.';
  }

  // Rate limit / Quota errors
  if (lowerError.includes('rate limit') || lowerError.includes('quota') || lowerError.includes('429')) {
    return '⚠️ Đã vượt quá giới hạn sử dụng. Vui lòng chờ vài phút rồi thử lại.';
  }

  // Authentication / Permission errors
  if (lowerError.includes('401') || lowerError.includes('unauthorized') || lowerError.includes('authentication')) {
    return '🔐 Không có quyền truy cập. Vui lòng kiểm tra lại thông tin đăng nhập.';
  }

  if (lowerError.includes('403') || lowerError.includes('forbidden')) {
    return '⛔ Không có quyền thực hiện hành động này. Vui lòng liên hệ quản trị viên.';
  }

  // Not found errors
  if (lowerError.includes('404') || lowerError.includes('not found')) {
    return '❓ Không tìm thấy tài nguyên yêu cầu. Vui lòng kiểm tra lại.';
  }

  // Server errors
  if (lowerError.includes('500') || lowerError.includes('internal server') || lowerError.includes('server error')) {
    return '🔧 Máy chủ gặp sự cố. Vui lòng thử lại sau vài phút.';
  }

  if (lowerError.includes('502') || lowerError.includes('bad gateway')) {
    return '🌐 Máy chủ không phản hồi. Vui lòng thử lại sau.';
  }

  if (lowerError.includes('503') || lowerError.includes('service unavailable')) {
    return '🛠️ Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.';
  }

  // AI-specific errors
  if (lowerError.includes('api request failed')) {
    return '🤖 AI không phản hồi. Vui lòng thử lại hoặc kiểm tra kết nối mạng.';
  }

  if (lowerError.includes('ai chưa trả về') || lowerError.includes('định dạng')) {
    return '🔄 AI trả về dữ liệu không hợp lệ. Vui lòng thử tạo lại hoặc đơn giản hóa yêu cầu.';
  }

  // Parsing / Data errors
  if (lowerError.includes('json') || lowerError.includes('parse') || lowerError.includes('syntax')) {
    return '📄 Dữ liệu không đúng định dạng. Vui lòng thử lại.';
  }

  // File upload errors
  if (lowerError.includes('file') && (lowerError.includes('size') || lowerError.includes('large'))) {
    return '📦 File quá lớn. Vui lòng chọn file nhỏ hơn 10MB.';
  }

  if (lowerError.includes('file') && lowerError.includes('type')) {
    return '📎 Định dạng file không được hỗ trợ. Chỉ chấp nhận: PDF, DOC, DOCX, TXT, PNG, JPG.';
  }

  // Validation errors
  if (context?.type === 'validation') {
    return `✏️ Dữ liệu nhập không hợp lệ: ${errorMessage}`;
  }

  // Exam generation specific
  if (lowerError.includes('tạo đề thi')) {
    return '📝 Không thể tạo đề thi. Vui lòng thử lại sau vài giây hoặc làm mới trang.';
  }

  if (lowerError.includes('câu hỏi')) {
    return '❓ Không thể tạo câu hỏi. Vui lòng thử với chủ đề khác hoặc giảm số lượng câu hỏi.';
  }

  // Generic fallback based on context
  if (context?.type === 'api') {
    return '🔌 Không thể kết nối với AI. Vui lòng kiểm tra kết nối và thử lại.';
  }

  if (context?.type === 'network') {
    return '📡 Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.';
  }

  // Default friendly message
  return `⚠️ Đã xảy ra lỗi. Vui lòng thử lại sau vài giây. Nếu vấn đề vẫn tiếp tục, hãy liên hệ hỗ trợ.`;
}

// Get suggestions for error recovery
export function getErrorSuggestions(error: any): string[] {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const lowerError = errorMessage.toLowerCase();

  if (lowerError.includes('network') || lowerError.includes('fetch')) {
    return [
      'Kiểm tra kết nối internet của bạn',
      'Thử tắt VPN nếu đang sử dụng',
      'Làm mới trang và thử lại',
      'Thử trên trình duyệt khác'
    ];
  }

  if (lowerError.includes('api key') || lowerError.includes('not configured')) {
    return [
      'Kiểm tra cấu hình Cloudflare AI Workers',
      'Xác nhận AI binding đã được cấu hình trong wrangler.toml',
      'Liên hệ quản trị viên nếu vấn đề vẫn tiếp tục'
    ];
  }

  if (lowerError.includes('rate limit') || lowerError.includes('quota')) {
    return [
      'Chờ vài phút rồi thử lại',
      'Giảm số lượng yêu cầu',
      'Thử vào thời gian khác trong ngày'
    ];
  }

  if (lowerError.includes('định dạng') || lowerError.includes('json')) {
    return [
      'Thử tạo lại với yêu cầu đơn giản hơn',
      'Làm mới trang và thử lại',
      'Giảm số lượng câu hỏi yêu cầu'
    ];
  }

  // Default suggestions
  return [
    'Làm mới trang và thử lại',
    'Kiểm tra kết nối internet',
    'Thử lại sau vài giây',
    'Liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục'
  ];
}

// Format error for display with icon
export function formatErrorDisplay(error: any, context?: Partial<ErrorContext>): string {
  const message = getUserFriendlyErrorMessage(error, context);
  const suggestions = getErrorSuggestions(error);
  
  return `${message}\n\n💡 Gợi ý:\n${suggestions.map(s => `• ${s}`).join('\n')}`;
}

// Main export with correct name
export function getUserFriendlyErrorMessage(error: any, context?: Partial<ErrorContext>): string {
  return getfriendlyErrorMessage(error, context);
}
