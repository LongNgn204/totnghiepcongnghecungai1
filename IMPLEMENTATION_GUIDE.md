# 🚀 HƯỚNG DẪN NÂNG CẤP & FIX BUG

---

## PHASE 1: SECURITY & BACKEND INTEGRATION (Tuần 1-2)

### Step 1.1: Upgrade Error Handling System

**File:** `utils/errorHandler.ts` (NEW)

```typescript
// ✅ Create centralized error handler
export enum ErrorCode {
  // Client errors
  INVALID_INPUT = 'INVALID_INPUT',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  
  // Auth errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  
  // Server errors
  SERVER_ERROR = 'SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  RATE_LIMITED = 'RATE_LIMITED',
  
  // AI errors
  AI_ERROR = 'AI_ERROR',
  INVALID_PROMPT = 'INVALID_PROMPT',
  MODEL_NOT_FOUND = 'MODEL_NOT_FOUND',
}

export interface AppError {
  code: ErrorCode;
  message: string;
  details?: any;
  statusCode?: number;
  timestamp: number;
}

export class AppErrorClass extends Error implements AppError {
  code: ErrorCode;
  message: string;
  details?: any;
  statusCode?: number;
  timestamp: number;

  constructor(code: ErrorCode, message: string, details?: any, statusCode?: number) {
    super(message);
    this.code = code;
    this.message = message;
    this.details = details;
    this.statusCode = statusCode;
    this.timestamp = Date.now();
    Object.setPrototypeOf(this, AppErrorClass.prototype);
  }
}

export const errorMessages: Record<ErrorCode, string> = {
  [ErrorCode.INVALID_INPUT]: 'Dữ liệu nhập không hợp lệ',
  [ErrorCode.NETWORK_ERROR]: 'Lỗi kết nối mạng. Vui lòng kiểm tra internet',
  [ErrorCode.TIMEOUT]: 'Yêu cầu hết thời gian. Vui lòng thử lại',
  [ErrorCode.UNAUTHORIZED]: 'Bạn chưa đăng nhập',
  [ErrorCode.FORBIDDEN]: 'Bạn không có quyền truy cập',
  [ErrorCode.TOKEN_EXPIRED]: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại',
  [ErrorCode.SERVER_ERROR]: 'Lỗi server. Vui lòng thử lại sau',
  [ErrorCode.SERVICE_UNAVAILABLE]: 'Dịch vụ tạm thời không khả dụng',
  [ErrorCode.RATE_LIMITED]: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng chờ',
  [ErrorCode.AI_ERROR]: 'Lỗi AI. Vui lòng thử lại',
  [ErrorCode.INVALID_PROMPT]: 'Prompt không hợp lệ',
  [ErrorCode.MODEL_NOT_FOUND]: 'Model AI không tìm thấy',
};

export function getErrorMessage(error: unknown): string {
  if (error instanceof AppErrorClass) {
    return error.message || errorMessages[error.code];
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Có lỗi xảy ra';
}

export function logError(error: AppError | Error) {
  console.error('[ERROR]', error);
  // TODO: Send to error tracking service (Sentry, etc.)
}
```

### Step 1.2: Implement Retry Logic

**File:** `utils/retry.ts` (NEW)

```typescript
export interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  shouldRetry?: (error: any) => boolean;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
};

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function retryAsync<T>(
  fn: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> {
  let lastError: Error | null = null;
  let delay = config.initialDelayMs;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      const shouldRetry = config.shouldRetry
        ? config.shouldRetry(error)
        : isRetryableError(error);

      if (attempt < config.maxRetries && shouldRetry) {
        console.warn(
          `Attempt ${attempt + 1} failed, retrying in ${delay}ms...`,
          error
        );
        await sleep(delay);
        delay = Math.min(
          delay * config.backoffMultiplier,
          config.maxDelayMs
        );
      } else {
        throw error;
      }
    }
  }

  throw lastError || new Error('Unknown error');
}

function isRetryableError(error: any): boolean {
  if (error instanceof TypeError) return true; // Network error
  if (error.status >= 500) return true; // Server error
  if (error.status === 429) return true; // Rate limit
  if (error.status === 408) return true; // Timeout
  return false;
}
```

### Step 1.3: Update API Client with Retry

**File:** `utils/apiClient.ts` (MODIFY)

```typescript
import { retryAsync, DEFAULT_RETRY_CONFIG } from './retry';
import { AppErrorClass, ErrorCode } from './errorHandler';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

export async function fetchAPI(
  endpoint: string,
  options: RequestInit = {},
  retryConfig = DEFAULT_RETRY_CONFIG
) {
  return retryAsync(async () => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.dispatchEvent(new Event('auth-error'));
        throw new AppErrorClass(
          ErrorCode.UNAUTHORIZED,
          'Bạn chưa đăng nhập',
          null,
          401
        );
      }

      if (response.status === 403) {
        throw new AppErrorClass(
          ErrorCode.FORBIDDEN,
          'Bạn không có quyền truy cập',
          null,
          403
        );
      }

      if (response.status === 429) {
        throw new AppErrorClass(
          ErrorCode.RATE_LIMITED,
          'Bạn đã gửi quá nhiều yêu cầu',
          null,
          429
        );
      }

      const error = await response.json().catch(() => ({
        error: 'Network error or invalid JSON response',
      }));

      throw new AppErrorClass(
        response.status >= 500 ? ErrorCode.SERVER_ERROR : ErrorCode.INVALID_INPUT,
        error.error || `API Error: ${response.status}`,
        error,
        response.status
      );
    }

    return response.json();
  }, retryConfig);
}

export const api = {
  auth: {
    register: (data: any) =>
      fetchAPI('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    login: (data: any) =>
      fetchAPI('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    logout: () => fetchAPI('/api/auth/logout', { method: 'POST' }),
    me: () => fetchAPI('/api/auth/me'),
    refresh: (refreshToken: string) =>
      fetchAPI('/api/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      }),
    updateProfile: (data: any) =>
      fetchAPI('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },
  ai: {
    generate: (prompt: string, modelId: string) =>
      fetchAPI('/api/ai/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt, modelId }),
      }),
    chat: (message: string, sessionId: string, files?: File[]) =>
      fetchAPI('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message, sessionId, files }),
      }),
  },
  exams: {
    getAll: (params?: any) => {
      const queryString = params
        ? '?' + new URLSearchParams(params).toString()
        : '';
      return fetchAPI(`/api/exams${queryString}`);
    },
    getById: (id: string) => fetchAPI(`/api/exams/${id}`),
    create: (data: any) =>
      fetchAPI('/api/exams', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchAPI(`/api/exams/${id}`, { method: 'DELETE' }),
  },
  // ... rest of the API
};

export default api;
```

### Step 1.4: Update Gemini API with Backend Proxy

**File:** `utils/geminiAPI.ts` (MODIFY)

```typescript
import { AppErrorClass, ErrorCode } from './errorHandler';
import { retryAsync } from './retry';

export interface GeminiResponse {
  text: string;
  success: boolean;
  error?: string;
}

export const AVAILABLE_MODELS = [
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    description: 'Mô hình mạnh mẽ nhất (Next Gen)',
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    description: 'Phản hồi nhanh, độ trễ thấp (Turbo)',
  },
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

/**
 * ✅ Gọi AI qua server proxy để tránh lộ API key
 */
export async function generateContent(
  prompt: string,
  modelId: string = 'gemini-2.5-pro'
): Promise<GeminiResponse> {
  try {
    // Validate input
    if (!prompt || typeof prompt !== 'string') {
      throw new AppErrorClass(
        ErrorCode.INVALID_PROMPT,
        'Prompt không hợp lệ'
      );
    }

    if (!AVAILABLE_MODELS.find(m => m.id === modelId)) {
      throw new AppErrorClass(
        ErrorCode.MODEL_NOT_FOUND,
        'Model AI không tìm thấy'
      );
    }

    const token = localStorage.getItem('auth_token');

    // Check if API URL is configured
    if (!API_URL || API_URL === 'http://localhost:8787') {
      console.warn('AI API endpoint not properly configured.');
      return {
        text: 'Xin lỗi, dịch vụ AI hiện không khả dụng.',
        success: false,
        error: 'API endpoint not configured',
      };
    }

    // ✅ Call backend proxy with retry
    const response = await retryAsync(async () => {
      const res = await fetch(`${API_URL}/api/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          prompt,
          modelId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const statusMessage =
          res.status === 404
            ? 'Endpoint AI không tìm thấy.'
            : res.status === 500
            ? 'Lỗi server. Vui lòng thử lại sau.'
            : `Lỗi ${res.status}`;
        throw new AppErrorClass(
          ErrorCode.AI_ERROR,
          errorData?.error || statusMessage,
          errorData,
          res.status
        );
      }

      return res;
    });

    const data = await response.json();
    const text =
      data.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      '';

    return { text, success: true };
  } catch (error) {
    console.error('AI Proxy Error:', error);
    const message =
      error instanceof AppErrorClass
        ? error.message
        : error instanceof Error
        ? error.message
        : 'Có lỗi xảy ra khi gọi API';
    return { text: '', success: false, error: message };
  }
}

// ... rest of the functions
```

---

## PHASE 2: DATA VALIDATION & STATE MANAGEMENT (Tuần 2-3)

### Step 2.1: Install Zod for Validation

```bash
npm install zod
```

### Step 2.2: Create Validation Schemas

**File:** `utils/validation.ts` (NEW)

```typescript
import { z } from 'zod';

// ✅ Question schemas
export const StatementSchema = z.object({
  id: z.string(),
  text: z.string(),
  isCorrect: z.boolean(),
  explanation: z.string().optional(),
});

export const MCQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  answer: z.string(),
  requirement: z.string().optional(),
  level: z.enum(['Nhận biết', 'Thông hiểu', 'Vận dụng']).optional(),
  explanation: z.string().optional(),
});

export const TFQuestionSchema = z.object({
  question: z.string(),
  statements: z.array(StatementSchema).length(4),
  requirement: z.string().optional(),
  level: z.enum(['Nhận biết', 'Thông hiểu', 'Vận dụng']).optional(),
  explanation: z.string().optional(),
});

export const ExamDataSchema = z.object({
  mcQuestions: z.array(MCQuestionSchema),
  tfQuestions: z.array(TFQuestionSchema),
});

export const FlashcardSchema = z.object({
  front: z.string(),
  back: z.string(),
  category: z.string().optional(),
  difficulty: z.enum(['Dễ', 'Trung bình', 'Khó']).optional(),
});

export const FlashcardDeckSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  category: z.string(),
  grade: z.string(),
  cards: z.array(FlashcardSchema),
});

// ✅ Export types
export type Statement = z.infer<typeof StatementSchema>;
export type MCQuestion = z.infer<typeof MCQuestionSchema>;
export type TFQuestion = z.infer<typeof TFQuestionSchema>;
export type ExamData = z.infer<typeof ExamDataSchema>;
export type Flashcard = z.infer<typeof FlashcardSchema>;
export type FlashcardDeck = z.infer<typeof FlashcardDeckSchema>;
```

### Step 2.3: Create Global State Store

**File:** `store/appStore.ts` (NEW)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChatSession {
  id: string;
  title: string;
  messages: any[];
  createdAt: number;
}

interface ExamRecord {
  id: string;
  title: string;
  score: number;
  totalQuestions: number;
  duration: number;
  createdAt: number;
}

interface AppState {
  // Chat
  chatSessions: ChatSession[];
  currentChatId: string | null;
  addChatSession: (session: ChatSession) => void;
  updateChatSession: (id: string, session: Partial<ChatSession>) => void;
  deleteChatSession: (id: string) => void;
  setCurrentChat: (id: string | null) => void;

  // Exams
  examRecords: ExamRecord[];
  addExamRecord: (record: ExamRecord) => void;
  deleteExamRecord: (id: string) => void;

  // Sync
  lastSyncTime: number;
  isSyncing: boolean;
  setLastSyncTime: (time: number) => void;
  setIsSyncing: (syncing: boolean) => void;

  // Sync from backend
  syncFromBackend: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Chat
      chatSessions: [],
      currentChatId: null,
      addChatSession: (session) =>
        set((state) => ({
          chatSessions: [...state.chatSessions, session],
        })),
      updateChatSession: (id, session) =>
        set((state) => ({
          chatSessions: state.chatSessions.map((s) =>
            s.id === id ? { ...s, ...session } : s
          ),
        })),
      deleteChatSession: (id) =>
        set((state) => ({
          chatSessions: state.chatSessions.filter((s) => s.id !== id),
        })),
      setCurrentChat: (id) => set({ currentChatId: id }),

      // Exams
      examRecords: [],
      addExamRecord: (record) =>
        set((state) => ({
          examRecords: [...state.examRecords, record],
        })),
      deleteExamRecord: (id) =>
        set((state) => ({
          examRecords: state.examRecords.filter((r) => r.id !== id),
        })),

      // Sync
      lastSyncTime: 0,
      isSyncing: false,
      setLastSyncTime: (time) => set({ lastSyncTime: time }),
      setIsSyncing: (syncing) => set({ isSyncing: syncing }),

      // Sync from backend
      syncFromBackend: async () => {
        set({ isSyncing: true });
        try {
          // TODO: Implement backend sync
          set({ lastSyncTime: Date.now() });
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: 'app-store',
    }
  )
);
```

---

## PHASE 3: PERFORMANCE & UX (Tuần 3-4)

### Step 3.1: Add Pagination to Exam History

**File:** `components/ExamHistory.tsx` (MODIFY)

```typescript
const ITEMS_PER_PAGE = 10;

const ExamHistory: React.FC = () => {
  const [examHistory, setExamHistory] = useState<ExamHistory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadHistory = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await api.exams.getAll({
        page,
        limit: ITEMS_PER_PAGE,
      });

      setExamHistory(response.data);
      setTotalPages(Math.ceil(response.total / ITEMS_PER_PAGE));
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to load exam history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory(1);
  }, []);

  return (
    <div>
      {/* Exam list */}
      <div className="space-y-4">
        {examHistory.map((exam) => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => loadHistory(currentPage - 1)}
            disabled={currentPage === 1 || loading}
          >
            Trang trước
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => loadHistory(page)}
                disabled={loading}
                className={page === currentPage ? 'bg-blue-600 text-white' : ''}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => loadHistory(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
          >
            Trang sau
          </button>
        </div>
      )}

      {loading && <LoadingSpinner />}
    </div>
  );
};
```

---

## PHASE 4: TESTING & DOCUMENTATION (Tuần 4-5)

### Step 4.1: Add Unit Tests

**File:** `components/__tests__/Product2.test.tsx` (NEW)

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Product2 from '../Product2';
import * as geminiAPI from '../../utils/geminiAPI';

vi.mock('../../utils/geminiAPI');

describe('Product2 - Exam Generator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the component', () => {
    render(<Product2 />);
    expect(screen.getByText(/Tạo đề thi/i)).toBeInTheDocument();
  });

  it('should show error when topic is empty', async () => {
    render(<Product2 />);
    const generateButton = screen.getByText(/Tạo đề/i);
    fireEvent.click(generateButton);
    await waitFor(() => {
      expect(
        screen.getByText(/Vui lòng nhập chủ đề/i)
      ).toBeInTheDocument();
    });
  });

  it('should generate questions successfully', async () => {
    const mockResponse = {
      success: true,
      text: JSON.stringify({
        mcQuestions: [
          {
            question: 'Test question?',
            options: ['A', 'B', 'C', 'D'],
            answer: 'A',
          },
        ],
        tfQuestions: [],
      }),
    };

    vi.mocked(geminiAPI.generateContent).mockResolvedValue(mockResponse);

    render(<Product2 />);
    // ... test logic
  });
});
```

---

## QUICK IMPLEMENTATION CHECKLIST

### Week 1
- [ ] Implement error handling system
- [ ] Add retry logic
- [ ] Update API client
- [ ] Update Gemini API
- [ ] Add error boundaries to all routes

### Week 2
- [ ] Install and setup Zod
- [ ] Create validation schemas
- [ ] Update Product2 with validation
- [ ] Update Product3 with validation
- [ ] Implement token refresh

### Week 3
- [ ] Create global state store
- [ ] Add pagination to exam history
- [ ] Optimize component rendering
- [ ] Add loading states everywhere
- [ ] Improve error messages

### Week 4
- [ ] Add ARIA labels
- [ ] Improve responsive design
- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Create API documentation

### Week 5
- [ ] Add E2E tests
- [ ] Performance optimization
- [ ] Security audit
- [ ] Final testing
- [ ] Deployment

---

**Next Step:** Start with Phase 1, Step 1.1

