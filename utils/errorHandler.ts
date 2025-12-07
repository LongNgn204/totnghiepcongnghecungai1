/**
 * ✅ PHASE 1 - STEP 1.1: Centralized Error Handler System
 * 
 * Tạo hệ thống xử lý lỗi tập trung để:
 * - Phân loại lỗi (client, server, network, auth)
 * - Cung cấp thông báo lỗi cụ thể
 * - Dễ dàng track & log lỗi
 * - Consistent error handling across app
 */

export enum ErrorCode {
  // Client errors (4xx)
  INVALID_INPUT = 'INVALID_INPUT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  CONNECTION_REFUSED = 'CONNECTION_REFUSED',
  
  // Auth errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  
  // Server errors (5xx)
  SERVER_ERROR = 'SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  
  // Rate limiting
  RATE_LIMITED = 'RATE_LIMITED',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  
  // AI specific errors
  AI_ERROR = 'AI_ERROR',
  INVALID_PROMPT = 'INVALID_PROMPT',
  MODEL_NOT_FOUND = 'MODEL_NOT_FOUND',
  AI_TIMEOUT = 'AI_TIMEOUT',
  
  // Data errors
  PARSE_ERROR = 'PARSE_ERROR',
  INVALID_DATA = 'INVALID_DATA',
  DATA_CORRUPTION = 'DATA_CORRUPTION',
  
  // Unknown
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AppError {
  code: ErrorCode;
  message: string;
  details?: any;
  statusCode?: number;
  timestamp: number;
  context?: string; // Component or function name
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export class AppErrorClass extends Error implements AppError {
  code: ErrorCode;
  message: string;
  details?: any;
  statusCode?: number;
  timestamp: number;
  context?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';

  constructor(
    code: ErrorCode,
    message: string,
    details?: any,
    statusCode?: number,
    context?: string,
    severity?: 'low' | 'medium' | 'high' | 'critical'
  ) {
    super(message);
    this.code = code;
    this.message = message;
    this.details = details;
    this.statusCode = statusCode;
    this.timestamp = Date.now();
    this.context = context;
    this.severity = severity || 'medium';
    Object.setPrototypeOf(this, AppErrorClass.prototype);
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      context: this.context,
      severity: this.severity,
    };
  }
}

/**
 * ✅ User-friendly error messages in Vietnamese
 */
export const errorMessages: Record<ErrorCode, string> = {
  // Client errors
  [ErrorCode.INVALID_INPUT]: 'Dữ liệu nhập không hợp lệ. Vui lòng kiểm tra lại.',
  [ErrorCode.VALIDATION_ERROR]: 'Dữ liệu không đúng định dạng. Vui lòng kiểm tra lại.',
  [ErrorCode.NOT_FOUND]: 'Không tìm thấy dữ liệu bạn yêu cầu.',
  
  // Network errors
  [ErrorCode.NETWORK_ERROR]: 'Lỗi kết nối mạng. Vui lòng kiểm tra internet của bạn.',
  [ErrorCode.TIMEOUT]: 'Yêu cầu hết thời gian chờ. Vui lòng thử lại.',
  [ErrorCode.CONNECTION_REFUSED]: 'Không thể kết nối tới server. Vui lòng thử lại sau.',
  
  // Auth errors
  [ErrorCode.UNAUTHORIZED]: 'Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.',
  [ErrorCode.FORBIDDEN]: 'Bạn không có quyền truy cập tài nguyên này.',
  [ErrorCode.TOKEN_EXPIRED]: 'Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại.',
  [ErrorCode.INVALID_TOKEN]: 'Token không hợp lệ. Vui lòng đăng nhập lại.',
  
  // Server errors
  [ErrorCode.SERVER_ERROR]: 'Lỗi server. Vui lòng thử lại sau.',
  [ErrorCode.SERVICE_UNAVAILABLE]: 'Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.',
  [ErrorCode.INTERNAL_ERROR]: 'Có lỗi xảy ra. Vui lòng thử lại.',
  
  // Rate limiting
  [ErrorCode.RATE_LIMITED]: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng chờ một lúc.',
  [ErrorCode.TOO_MANY_REQUESTS]: 'Quá nhiều yêu cầu. Vui lòng chờ và thử lại.',
  
  // AI errors
  [ErrorCode.AI_ERROR]: 'Lỗi AI. Vui lòng thử lại.',
  [ErrorCode.INVALID_PROMPT]: 'Prompt không hợp lệ. Vui lòng kiểm tra lại.',
  [ErrorCode.MODEL_NOT_FOUND]: 'Model AI không tìm thấy.',
  [ErrorCode.AI_TIMEOUT]: 'AI xử lý quá lâu. Vui lòng thử lại với prompt ngắn hơn.',
  
  // Data errors
  [ErrorCode.PARSE_ERROR]: 'Lỗi xử lý dữ liệu. Vui lòng thử lại.',
  [ErrorCode.INVALID_DATA]: 'Dữ liệu không hợp lệ.',
  [ErrorCode.DATA_CORRUPTION]: 'Dữ liệu bị hỏng. Vui lòng liên hệ hỗ trợ.',
  
  // Unknown
  [ErrorCode.UNKNOWN_ERROR]: 'Có lỗi không xác định xảy ra. Vui lòng thử lại.',
};

/**
 * ✅ Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AppErrorClass) {
    return error.message || errorMessages[error.code];
  }
  if (error instanceof Error) {
    return error.message;
  }
  return errorMessages[ErrorCode.UNKNOWN_ERROR];
}

/**
 * ✅ Get error code from HTTP status
 */
export function getErrorCodeFromStatus(status: number): ErrorCode {
  if (status === 400) return ErrorCode.INVALID_INPUT;
  if (status === 401) return ErrorCode.UNAUTHORIZED;
  if (status === 403) return ErrorCode.FORBIDDEN;
  if (status === 404) return ErrorCode.NOT_FOUND;
  if (status === 408) return ErrorCode.TIMEOUT;
  if (status === 429) return ErrorCode.RATE_LIMITED;
  if (status >= 500) return ErrorCode.SERVER_ERROR;
  if (status === 503) return ErrorCode.SERVICE_UNAVAILABLE;
  return ErrorCode.UNKNOWN_ERROR;
}

/**
 * ✅ Log error to console and external service
 */
export function logError(error: AppError | Error, context?: string) {
  const errorObj = error instanceof AppErrorClass ? error : new AppErrorClass(
    ErrorCode.UNKNOWN_ERROR,
    error instanceof Error ? error.message : String(error),
    undefined,
    undefined,
    context
  );

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[ERROR]', {
      code: errorObj.code,
      message: errorObj.message,
      context: errorObj.context,
      details: errorObj.details,
      timestamp: new Date(errorObj.timestamp).toISOString(),
    });
  }

  // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
  // Example:
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(errorObj);
  // }
}

/**
 * ✅ Create error from response
 */
export function createErrorFromResponse(
  response: Response,
  errorData?: any,
  context?: string
): AppErrorClass {
  const code = getErrorCodeFromStatus(response.status);
  const message = errorData?.message || errorData?.error || errorMessages[code];
  
  return new AppErrorClass(
    code,
    message,
    errorData,
    response.status,
    context,
    response.status >= 500 ? 'high' : 'medium'
  );
}

/**
 * ✅ Create network error
 */
export function createNetworkError(
  originalError: Error,
  context?: string
): AppErrorClass {
  return new AppErrorClass(
    ErrorCode.NETWORK_ERROR,
    errorMessages[ErrorCode.NETWORK_ERROR],
    { originalError: originalError.message },
    undefined,
    context,
    'high'
  );
}

/**
 * ✅ Create validation error
 */
export function createValidationError(
  message: string,
  details?: any,
  context?: string
): AppErrorClass {
  return new AppErrorClass(
    ErrorCode.VALIDATION_ERROR,
    message || errorMessages[ErrorCode.VALIDATION_ERROR],
    details,
    undefined,
    context,
    'low'
  );
}

/**
 * ✅ Create auth error
 */
export function createAuthError(
  code: ErrorCode = ErrorCode.UNAUTHORIZED,
  context?: string
): AppErrorClass {
  return new AppErrorClass(
    code,
    errorMessages[code],
    undefined,
    401,
    context,
    'high'
  );
}

/**
 * ✅ Create AI error
 */
export function createAIError(
  message: string,
  details?: any,
  context?: string
): AppErrorClass {
  return new AppErrorClass(
    ErrorCode.AI_ERROR,
    message || errorMessages[ErrorCode.AI_ERROR],
    details,
    undefined,
    context,
    'medium'
  );
}

/**
 * ✅ Error recovery suggestions
 */
export function getErrorRecoverySuggestions(error: AppErrorClass): string[] {
  const suggestions: string[] = [];

  switch (error.code) {
    case ErrorCode.NETWORK_ERROR:
    case ErrorCode.CONNECTION_REFUSED:
      suggestions.push('Kiểm tra kết nối internet của bạn');
      suggestions.push('Thử làm mới trang');
      suggestions.push('Thử lại sau vài phút');
      break;

    case ErrorCode.TIMEOUT:
      suggestions.push('Thử lại với dữ liệu nhỏ hơn');
      suggestions.push('Kiểm tra tốc độ internet');
      suggestions.push('Thử lại sau');
      break;

    case ErrorCode.UNAUTHORIZED:
    case ErrorCode.TOKEN_EXPIRED:
      suggestions.push('Đăng nhập lại');
      suggestions.push('Xóa cache và cookies');
      break;

    case ErrorCode.FORBIDDEN:
      suggestions.push('Liên hệ quản trị viên để được cấp quyền');
      break;

    case ErrorCode.RATE_LIMITED:
      suggestions.push('Chờ vài phút rồi thử lại');
      suggestions.push('Giảm số lượng yêu cầu');
      break;

    case ErrorCode.SERVER_ERROR:
    case ErrorCode.SERVICE_UNAVAILABLE:
      suggestions.push('Thử lại sau vài phút');
      suggestions.push('Liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục');
      break;

    case ErrorCode.INVALID_INPUT:
    case ErrorCode.VALIDATION_ERROR:
      suggestions.push('Kiểm tra lại dữ liệu nhập');
      suggestions.push('Xem hướng dẫn để biết định dạng đúng');
      break;

    case ErrorCode.AI_ERROR:
      suggestions.push('Thử lại với prompt khác');
      suggestions.push('Giảm độ phức tạp của yêu cầu');
      break;

    default:
      suggestions.push('Thử lại');
      suggestions.push('Làm mới trang');
      suggestions.push('Liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục');
  }

  return suggestions;
}

/**
 * ✅ Check if error is retryable
 */
export function isRetryableError(error: any): boolean {
  if (error instanceof AppErrorClass) {
    return [
      ErrorCode.NETWORK_ERROR,
      ErrorCode.TIMEOUT,
      ErrorCode.CONNECTION_REFUSED,
      ErrorCode.SERVER_ERROR,
      ErrorCode.SERVICE_UNAVAILABLE,
      ErrorCode.RATE_LIMITED,
      ErrorCode.AI_TIMEOUT,
    ].includes(error.code);
  }

  if (error instanceof TypeError) {
    return true; // Network error
  }

  return false;
}

/**
 * ✅ Check if error is auth-related
 */
export function isAuthError(error: any): boolean {
  if (error instanceof AppErrorClass) {
    return [
      ErrorCode.UNAUTHORIZED,
      ErrorCode.FORBIDDEN,
      ErrorCode.TOKEN_EXPIRED,
      ErrorCode.INVALID_TOKEN,
    ].includes(error.code);
  }

  return false;
}

export default {
  ErrorCode,
  AppErrorClass,
  errorMessages,
  getErrorMessage,
  getErrorCodeFromStatus,
  logError,
  createErrorFromResponse,
  createNetworkError,
  createValidationError,
  createAuthError,
  createAIError,
  getErrorRecoverySuggestions,
  isRetryableError,
  isAuthError,
};

