# 🐛 DANH SÁCH BUG CHI TIẾT VÀ CÁCH FIX

---

## BUG #1: API Key Exposure Risk

**Severity:** [object Object]
**Component:** `utils/geminiAPI.ts`  
**Status:** ❌ NOT FIXED

### Problem
```typescript
// ❌ HIỆN TẠI
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

export async function generateContent(prompt: string, modelId: string = 'gemini-2.5-pro') {
  const response = await fetch(`${API_URL}/api/ai/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      modelId, // ⚠️ Model ID exposed
      generationConfig: { /* ... */ },
      safetySettings: [ /* ... */ ],
    }),
  });
}
```

### Issues
1. API key có thể bị lộ nếu backend không cấu hình đúng
2. Không có rate limiting từ frontend
3. Không thể track usage per user
4. CORS issues có thể xảy ra

### Solution
```typescript
// ✅ FIX: Tất cả AI calls qua backend
export async function generateContent(prompt: string, modelId: string = 'gemini-2.5-pro'): Promise<GeminiResponse> {
  try {
    const token = localStorage.getItem('auth_token');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';
    
    // Check if API URL is configured
    if (!API_URL || API_URL === 'http://localhost:8787') {
      console.warn('AI API endpoint not properly configured.');
      return { 
        text: 'Xin lỗi, dịch vụ AI hiện không khả dụng.', 
        success: false, 
        error: 'API endpoint not configured' 
      };
    }

    // ✅ Gửi request tới backend proxy
    const response = await fetch(`${API_URL}/api/ai/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        prompt, // ✅ Chỉ gửi prompt
        modelId, // ✅ Backend sẽ validate
        // Backend sẽ handle API key securely
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const statusMessage = response.status === 404 
        ? 'Endpoint AI không tìm thấy.'
        : response.status === 500
        ? 'Lỗi server. Vui lòng thử lại sau.'
        : `Lỗi ${response.status}`;
      throw new Error(errorData?.error || statusMessage);
    }

    const data = await response.json();
    const text = data.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return { text, success: true };
  } catch (error) {
    console.error('AI Proxy Error:', error);
    return { 
      text: '', 
      success: false, 
      error: error instanceof Error ? error.message : 'Có lỗi xảy ra khi gọi API' 
    };
  }
}
```

### Backend Implementation (Node.js/Express)
```typescript
// backend/routes/ai.ts
import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { authenticate } from '../middleware/auth';
import { rateLimit } from '../middleware/rateLimit';

const router = Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// ✅ Rate limit per user
const aiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  keyGenerator: (req) => req.user?.id || req.ip,
});

router.post('/api/ai/generate', authenticate, aiRateLimit, async (req: Request, res: Response) => {
  try {
    const { prompt, modelId = 'gemini-2.5-pro' } = req.body;
    const userId = req.user?.id;

    // ✅ Validate input
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Invalid prompt' });
    }

    // ✅ Validate model
    const validModels = ['gemini-2.5-pro', 'gemini-2.5-flash'];
    if (!validModels.includes(modelId)) {
      return res.status(400).json({ error: 'Invalid model' });
    }

    // ✅ Track usage
    await trackUsage(userId, 'ai_generate', { modelId, promptLength: prompt.length });

    // ✅ Call Gemini API securely
    const model = genAI.getGenerativeModel({ model: modelId });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({
      success: true,
      data: {
        candidates: [{
          content: {
            parts: [{ text }]
          }
        }]
      }
    });
  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate content',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
```

---

## BUG #2: Missing Token Refresh Logic

**Severity:** [object Object]:** `contexts/AuthContext.tsx`  
**Status:** ❌ NOT FIXED

### Problem
```typescript
// ❌ HIỆN TẠI
const initAuth = async () => {
  const storedToken = localStorage.getItem('auth_token');
  if (storedToken) {
    setToken(storedToken);
    // ❌ Không check token expiry
    // ❌ Không có refresh mechanism
  }
};
```

### Issues
1. Token có thể hết hạn nhưng app vẫn dùng
2. Không có automatic refresh
3. User bị logout đột ngột
4. Không có refresh token

### Solution
```typescript
// ✅ FIX: Implement token refresh
interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshTimeoutRef = useRef<NodeJS.Timeout>();

  // ✅ Check if token is expired
  const isTokenExpired = (expiresAt: number): boolean => {
    return Date.now() >= expiresAt - 60000; // 1 minute buffer
  };

  // ✅ Refresh token
  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) return false;

      const response = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        logout();
        return false;
      }

      const result = await response.json();
      const { accessToken, refreshToken: newRefreshToken, expiresAt } = result.data;

      setToken(accessToken);
      localStorage.setItem('auth_token', accessToken);
      localStorage.setItem('refresh_token', newRefreshToken);
      localStorage.setItem('token_expires_at', String(expiresAt));

      // ✅ Schedule next refresh
      scheduleTokenRefresh(expiresAt);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  };

  // ✅ Schedule token refresh before expiry
  const scheduleTokenRefresh = (expiresAt: number) => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    const timeUntilExpiry = expiresAt - Date.now() - 60000; // Refresh 1 min before expiry
    if (timeUntilExpiry > 0) {
      refreshTimeoutRef.current = setTimeout(() => {
        refreshToken();
      }, timeUntilExpiry);
    }
  };

  const logout = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    const currentToken = localStorage.getItem('auth_token');
    if (currentToken) {
      fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      }).catch(err => console.error('Logout error:', err));
    }

    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expires_at');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_id');
    pauseSync();
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      const expiresAt = localStorage.getItem('token_expires_at');

      if (storedToken && expiresAt) {
        // ✅ Check if token is expired
        if (isTokenExpired(Number(expiresAt))) {
          const refreshed = await refreshToken();
          if (!refreshed) {
            setLoading(false);
            return;
          }
        } else {
          setToken(storedToken);
          scheduleTokenRefresh(Number(expiresAt));
        }

        try {
          const response = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const result = await response.json();
            const userData = result.data || result;
            setUser(userData);
            localStorage.setItem('user_data', JSON.stringify(userData));
            resumeSync();
          } else if (response.status === 401) {
            const refreshed = await refreshToken();
            if (!refreshed) {
              logout();
            }
          } else {
            logout();
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          logout();
        }
      } else {
        pauseSync();
      }
      setLoading(false);
    };

    initAuth();

    const handleAuthError = () => logout();
    window.addEventListener('auth-error', handleAuthError);

    return () => {
      window.removeEventListener('auth-error', handleAuthError);
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [logout]);

  // ... rest of the code
};
```

---

## BUG #3: No Input Validation for AI Responses

**Severity:** 🟡 MEDIUM  
**Component:** `components/Product2.tsx`, `components/Product3.tsx`  
**Status:** ❌ NOT FIXED

### Problem
```typescript
// ❌ HIỆN TẠI
const jsonMatch = response.text.match(/\{[\s\S]*\}/);
if (!jsonMatch) throw new Error('AI không trả về đúng định dạng JSON.');
const data = JSON.parse(jsonMatch[0]); // ❌ Có thể fail

const mcQuestions: QuestionMC[] = (data.mcQuestions || []).map((q: any, idx: number) => ({
  ...q, 
  id: idx + 1 
})); // ❌ Không validate required fields
```

### Issues
1. JSON parsing có thể fail
2. Không validate question structure
3. Không check required fields
4. Không có fallback data

### Solution
```typescript
// ✅ FIX: Implement data validation with Zod
import { z } from 'zod';

// ✅ Define schemas
const StatementSchema = z.object({
  id: z.string(),
  text: z.string(),
  isCorrect: z.boolean(),
  explanation: z.string().optional(),
});

const MCQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  answer: z.string(),
  requirement: z.string().optional(),
  level: z.enum(['Nhận biết', 'Thông hiểu', 'Vận dụng']).optional(),
  explanation: z.string().optional(),
});

const TFQuestionSchema = z.object({
  question: z.string(),
  statements: z.array(StatementSchema).length(4),
  requirement: z.string().optional(),
  level: z.enum(['Nhận biết', 'Thông hiểu', 'Vận dụng']).optional(),
  explanation: z.string().optional(),
});

const ExamDataSchema = z.object({
  mcQuestions: z.array(MCQuestionSchema),
  tfQuestions: z.array(TFQuestionSchema),
});

// ✅ Validate and parse response
const handleGenerate = async () => {
  setLoading(true);
  setError('');

  try {
    const response = await generateContent(prompt);
    if (!response.success) throw new Error(response.error || 'Lỗi không xác định');

    // ✅ Extract JSON
    const jsonMatch = response.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI không trả về đúng định dạng JSON.');
    }

    let data;
    try {
      data = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      throw new Error('Lỗi parse JSON từ AI response');
    }

    // ✅ Validate with Zod
    const validatedData = ExamDataSchema.parse(data);

    // ✅ Transform to internal format
    const mcQuestions: QuestionMC[] = validatedData.mcQuestions.map((q, idx) => ({
      id: idx + 1,
      type: 'multiple_choice',
      question: q.question,
      options: q.options,
      answer: q.answer,
      requirement: q.requirement,
      level: q.level,
      explanation: q.explanation,
    }));

    const tfQuestions: QuestionTF[] = validatedData.tfQuestions.map((q, idx) => ({
      id: mcQuestions.length + idx + 1,
      type: 'true_false',
      question: q.question,
      statements: q.statements,
      requirement: q.requirement,
      level: q.level,
      explanation: q.explanation,
    }));

    setMcQuestionsData(mcQuestions);
    setTfQuestionsData(tfQuestions);
    setHasGenerated(true);
  } catch (err) {
    const errorMessage = err instanceof z.ZodError
      ? `Dữ liệu không hợp lệ: ${err.errors[0].message}`
      : err instanceof Error
      ? err.message
      : 'Lỗi xử lý dữ liệu.';
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};
```

---

## BUG #4: Missing Error Boundaries

**Severity:** 🟡 MEDIUM  
**Component:** Multiple components  
**Status:** ⚠️ PARTIALLY FIXED

### Problem
```typescript
// ❌ HIỆN TẠI: Chỉ có ErrorBoundary cho Product3
<Route path="/san-pham-3" element={
  <ProtectedRoute>
    <ErrorBoundary componentName="Product3">
      <Product3 />
    </ErrorBoundary>
  </ProtectedRoute>
} />

// ❌ Không có cho Product1, Product2, v.v.
<Route path="/san-pham-1" element={<ProtectedRoute><Product1 /></ProtectedRoute>} />
```

### Solution
```typescript
// ✅ FIX: Wrap tất cả routes với ErrorBoundary
<Route path="/san-pham-1" element={
  <ProtectedRoute>
    <ErrorBoundary componentName="Product1">
      <Product1 />
    </ErrorBoundary>
  </ProtectedRoute>
} />

<Route path="/san-pham-2" element={
  <ProtectedRoute>
    <ErrorBoundary componentName="Product2">
      <Product2 />
    </ErrorBoundary>
  </ProtectedRoute>
} />

<Route path="/san-pham-4" element={
  <ProtectedRoute>
    <ErrorBoundary componentName="Product4">
      <Product4 />
    </ErrorBoundary>
  </ProtectedRoute>
} />

<Route path="/san-pham-5" element={
  <ProtectedRoute>
    <ErrorBoundary componentName="Product5">
      <Product5 />
    </ErrorBoundary>
  </ProtectedRoute>
} />

<Route path="/dashboard" element={
  <ProtectedRoute>
    <ErrorBoundary componentName="Dashboard">
      <Dashboard />
    </ErrorBoundary>
  </ProtectedRoute>
} />

<Route path="/flashcards" element={
  <ProtectedRoute>
    <ErrorBoundary componentName="Flashcards">
      <Flashcards />
    </ErrorBoundary>
  </ProtectedRoute>
} />

<Route path="/leaderboard" element={
  <ProtectedRoute>
    <ErrorBoundary componentName="Leaderboard">
      <Leaderboard />
    </ErrorBoundary>
  </ProtectedRoute>
} />

<Route path="/history" element={
  <ProtectedRoute>
    <ErrorBoundary componentName="ExamHistory">
      <ExamHistory />
    </ErrorBoundary>
  </ProtectedRoute>
} />

<Route path="/profile" element={
  <ProtectedRoute>
    <ErrorBoundary componentName="Profile">
      <Profile />
    </ErrorBoundary>
  </ProtectedRoute>
} />

<Route path="/settings" element={
  <ProtectedRoute>
    <ErrorBoundary componentName="PWASettings">
      <PWASettings />
    </ErrorBoundary>
  </ProtectedRoute>
} />

<Route path="/home/coding-lab" element={
  <ProtectedRoute>
    <ErrorBoundary componentName="CodingLab">
      <CodingLab />
    </ErrorBoundary>
  </ProtectedRoute>
} />
```

---

## BUG #5: No Pagination for Long Lists

**Severity:** 🟡 MEDIUM  
**Component:** `components/ExamHistory.tsx`, `components/Leaderboard.tsx`  
**Status:** ❌ NOT FIXED

### Problem
```typescript
// ❌ HIỆN TẠI: Load tất cả exams vào memory
const [examHistory, setExamHistory] = useState<ExamHistory[]>([]);

const loadHistory = () => {
  const history = getExamHistory(); // ❌ Tất cả exams
  setExamHistory(history);
};

// ❌ Render tất cả items
return (
  <div>
    {examHistory.map(exam => (
      <ExamCard key={exam.id} exam={exam} />
    ))}
  </div>
);
```

### Issues
1. Memory usage cao với dữ liệu lớn
2. Render performance kém
3. Không có infinite scroll
4. Không có load more button

### Solution
```typescript
// ✅ FIX: Implement pagination
const ITEMS_PER_PAGE = 10;

const ExamHistory: React.FC = () => {
  const [examHistory, setExamHistory] = useState<ExamHistory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadHistory = async (page: number = 1) => {
    setLoading(true);
    try {
      // ✅ Fetch with pagination
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

  const paginatedExams = useMemo(() => {
    return examHistory;
  }, [examHistory]);

  return (
    <div>
      {/* Exam list */}
      <div className="space-y-4">
        {paginatedExams.map(exam => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => loadHistory(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Trang trước
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => loadHistory(page)}
              disabled={loading}
              className={`px-4 py-2 rounded ${
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => loadHistory(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
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

## BUG #6: No Retry Logic for Failed Requests

**Severity[object Object]  
**Component:** `utils/apiClient.ts`, `utils/geminiAPI.ts`  
**Status:** ❌ NOT FIXED

### Problem
```typescript
// ❌ HIỆN TẠI: Không retry khi fail
export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(error.error || `API Error: ${response.status}`);
  }

  return response.json();
}
```

### Issues
1. Network errors không được retry
2. Timeout errors không được handle
3. User experience kém khi network unstable
4. Không có exponential backoff

### Solution
```typescript
// ✅ FIX: Implement retry logic
interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
};

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isRetryableError(error: any): boolean {
  // Retry on network errors, timeouts, and 5xx errors
  if (error instanceof TypeError) return true; // Network error
  if (error.status >= 500) return true; // Server error
  if (error.status === 429) return true; // Rate limit
  if (error.status === 408) return true; // Request timeout
  return false;
}

export async function fetchAPI(
  endpoint: string,
  options: RequestInit = {},
  retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
) {
  let lastError: Error | null = null;
  let delay = retryConfig.initialDelayMs;

  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Network error' }));
        const errorObj = new Error(error.error || `API Error: ${response.status}`);
        (errorObj as any).status = response.status;
        throw errorObj;
      }

      return response.json();
    } catch (error) {
      lastError = error as Error;

      // ✅ Check if error is retryable
      if (attempt < retryConfig.maxRetries && isRetryableError(error)) {
        console.warn(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`, error);
        await sleep(delay);
        delay = Math.min(delay * retryConfig.backoffMultiplier, retryConfig.maxDelayMs);
      } else {
        throw error;
      }
    }
  }

  throw lastError || new Error('Unknown error');
}

// ✅ Usage with custom retry config
export const api = {
  auth: {
    login: (data: any) => fetchAPI('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }, {
      maxRetries: 2,
      initialDelayMs: 500,
      maxDelayMs: 5000,
      backoffMultiplier: 2,
    }),
  },
  // ... rest of the API
};
```

---

## BUG #7: No Loading States for Async Operations

**Severity[object Object]  
**Component:** Multiple components  
**Status:** ⚠️ PARTIALLY FIXED

### Problem
```typescript
// ❌ HIỆN TẠI: Không có loading state cho tất cả operations
const handleSubmit = async () => {
  // ❌ Không disable button
  // ❌ Không show loading indicator
  const result = await api.exams.create(examData);
  // ❌ Không show success message
};

return (
  <button onClick={handleSubmit}>
    Nộp bài {/* ❌ Không show loading text */}
  </button>
);
```

### Solution
```typescript
// ✅ FIX: Add loading states
const handleSubmit = async () => {
  setLoading(true);
  setError('');
  setSuccess('');

  try {
    const result = await api.exams.create(examData);
    setSuccess('Nộp bài thành công!');
    toast.success('Nộp bài thành công!');
    
    // ✅ Redirect or refresh
    setTimeout(() => {
      navigate('/history');
    }, 1500);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra';
    setError(errorMessage);
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};

return (
  <button
    onClick={handleSubmit}
    disabled={loading} // ✅ Disable while loading
    className={`px-6 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {loading ? (
      <>
        <Loader2 className="inline mr-2 animate-spin" size={18} />
        Đang nộp...
      </>
    ) : (
      'Nộp bài'
    )}
  </button>
);
```

---

## BUG #8: Missing ARIA Labels for Accessibility

**Severity:** 🟡 MEDIUM  
**Component:** Multiple components  
**Status:** ❌ NOT FIXED

### Problem
```typescript
// ❌ HIỆN TẠI: Không có ARIA labels
<button onClick={toggleMenu}>
  <Menu size={24} />
</button>

<input type="text" placeholder="Tìm kiếm..." />

<div className="flex gap-4">
  {items.map(item => (
    <div key={item.id}>{item.name}</div>
  ))}
</div>
```

### Solution
```typescript
// ✅ FIX: Add ARIA labels
<button
  onClick={toggleMenu}
  aria-label="Toggle navigation menu"
  aria-expanded={isMenuOpen}
  aria-controls="main-nav"
>
  <Menu size={24} />
</button>

<input
  type="text"
  placeholder="Tìm kiếm..."
  aria-label="Search exams"
  aria-describedby="search-help"
/>
<span id="search-help" className="text-sm text-gray-500">
  Tìm kiếm theo tên đề thi hoặc chủ đề
</span>

<div className="flex gap-4" role="list">
  {items.map(item => (
    <div key={item.id} role="listitem">
      {item.name}
    </div>
  ))}
</div>

{/* For images */}
<img src={image} alt="Mô tả chi tiết về hình ảnh" />

{/* For icons */}
<button aria-label="Delete exam">
  <Trash2 size={20} />
</button>
```

---

## Summary of Bugs

| # | Bug | Severity | Status | Fix Time |
|---|-----|----------|--------|----------|
| 1 | API Key Exposure | 🔴 CRITICAL | ❌ | 2-3 hours |
| 2 | Token Refresh | [object Object] | 2-3 hours |
| 3 | Input Validation | 🟡 MEDIUM | ❌ | 1-2 hours |
| 4 | Error Boundaries | 🟡 MEDIUM | ⚠️ | 30 mins |
| 5 | Pagination | 🟡 MEDIUM | ❌ | 2-3 hours |
| 6 | Retry Logic | 🟡 MEDIUM | ❌ | 1-2 hours |
| 7 | Loading States | 🟡 MEDIUM | ⚠️ | 1-2 hours |
| 8 | ARIA Labels | 🟡 MEDIUM | ❌ | 2-3 hours |

**Total Fix Time:** ~14-20 hours

---

**Last Updated:** 2025-12-07 03:15:00 UTC

