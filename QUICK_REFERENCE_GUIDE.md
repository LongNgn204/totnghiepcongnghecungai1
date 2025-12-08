# 🚀 QUICK REFERENCE GUIDE

**For:** STEM Vietnam AI Platform  
**Version:** 2.0  
**Last Updated:** 2025-12-07

---

## 📋 TABLE OF CONTENTS

1. [Authentication](#authentication)
2. [State Management](#state-management)
3. [Data Validation](#data-validation)
4. [Caching](#caching)
5. [Error Handling](#error-handling)
6. [Components](#components)

---

## 🔐 AUTHENTICATION

### Using Auth Context
```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout, error, clearError } = useAuth();
  
  return (
    <div>
      {error && <div className="error">{error}</div>}
      {isAuthenticated ? (
        <>
          <p>Welcome, {user?.displayName}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => login('email@example.com', 'password')}>
          Login
        </button>
      )}
    </div>
  );
}
```

### Using Auth Store
```typescript
import { useAuthStore } from '@/store/authStore';

const { user, token, isAuthenticated, login, logout } = useAuthStore();
```

### Token Management
```typescript
import { tokenManager, initializeTokenManager } from '@/utils/tokenManager';

// Initialize on app start
const isValid = await initializeTokenManager();

// Get current token
const token = tokenManager.getAccessToken();

// Check if authenticated
const isAuth = tokenManager.isAuthenticated();

// Logout
tokenManager.cleanup();
```

---

## 📦 STATE MANAGEMENT

### Auth Store
```typescript
import { useAuthStore } from '@/store/authStore';

const {
  user,           // User | null
  token,          // string | null
  isAuthenticated, // boolean
  isLoading,      // boolean
  error,          // string | null
  login,          // (user, token) => void
  logout,         // () => void
  updateUser,     // (user) => void
  clearError,     // () => void
} = useAuthStore();
```

### Chat Store
```typescript
import { useChatStore } from '@/store/chatStore';

const {
  sessions,           // ChatSession[]
  currentSessionId,   // string | null
  addMessage,         // (message) => void
  createSession,      // (session) => void
  deleteSession,      // (id) => void
  getCurrentSession,  // () => ChatSession | null
  getSessionMessages, // (sessionId) => ChatMessage[]
} = useChatStore();
```

### Exam Store
```typescript
import { useExamStore } from '@/store/examStore';

const {
  history,            // ExamHistoryItem[]
  page,               // number
  pageSize,           // number
  filterType,         // 'all' | 'industrial' | 'agriculture' | 'custom'
  addToHistory,       // (item) => void
  setPage,            // (page) => void
  setPageSize,        // (size) => void
  getFilteredHistory, // () => ExamHistoryItem[]
  getPaginatedHistory,// () => ExamHistoryItem[]
  getTotalPages,      // () => number
  getStats,           // () => ExamStats
} = useExamStore();
```

### Flashcard Store
```typescript
import { useFlashcardStore } from '@/store/flashcardStore';

const {
  decks,              // FlashcardDeck[]
  currentDeckId,      // string | null
  progress,           // StudyProgress[]
  addDeck,            // (deck) => void
  addCard,            // (deckId, card) => void
  recordProgress,     // (progress) => void
  getCurrentDeck,     // () => FlashcardDeck | null
  getProgressStats,   // (deckId) => ProgressStats
} = useFlashcardStore();
```

---

## ✅ DATA VALIDATION

### Auth Validation
```typescript
import {
  validateLoginRequest,
  validateRegisterRequest,
  safeValidateLoginRequest,
  safeValidateRegisterRequest,
} from '@/schemas/auth.schema';

// Strict validation (throws on error)
try {
  const loginData = validateLoginRequest(formData);
  // Use validated data
} catch (error) {
  console.error('Validation error:', error);
}

// Safe validation (returns null on error)
const loginData = safeValidateLoginRequest(formData);
if (loginData) {
  // Use validated data
}
```

### Exam Validation
```typescript
import {
  validateCreateExamRequest,
  validateSubmitExamRequest,
  safeValidateExamResult,
} from '@/schemas/exam.schema';

const examData = validateCreateExamRequest(data);
const result = safeValidateExamResult(data);
```

### Flashcard Validation
```typescript
import {
  validateCreateFlashcardDeckRequest,
  validateRecordStudyProgressRequest,
  safeValidateFlashcardCard,
} from '@/schemas/flashcard.schema';

const deckData = validateCreateFlashcardDeckRequest(data);
const progressData = validateRecordStudyProgressRequest(data);
```

### Chat Validation
```typescript
import {
  validateSendChatMessageRequest,
  validateCreateChatSessionRequest,
  safeValidateChatMessage,
} from '@/schemas/chat.schema';

const messageData = validateSendChatMessageRequest(data);
const sessionData = validateCreateChatSessionRequest(data);
```

### AI Validation
```typescript
import {
  validateAIGenerateRequest,
  validateAIChatRequest,
  safeValidateAIGenerateResponse,
} from '@/schemas/ai.schema';

const generateData = validateAIGenerateRequest(data);
const chatData = validateAIChatRequest(data);
```

---

## 💾 CACHING

### Initialize Caches
```typescript
import { initializeCacheConfigs } from '@/utils/cacheManager';

// Call on app start
initializeCacheConfigs();
```

### Using Cache Helpers
```typescript
import { cacheHelpers } from '@/utils/cacheManager';

// AI cache
cacheHelpers.ai.set('prompt-key', response);
const cached = cacheHelpers.ai.get('prompt-key');
if (cacheHelpers.ai.has('prompt-key')) {
  // Use cached value
}
cacheHelpers.ai.delete('prompt-key');
cacheHelpers.ai.clear();

// Exam cache
cacheHelpers.exam.set('exam-id', examData);
const exam = cacheHelpers.exam.get('exam-id');

// Flashcard cache
cacheHelpers.flashcard.set('deck-id', deckData);
const deck = cacheHelpers.flashcard.get('deck-id');

// Chat cache
cacheHelpers.chat.set('session-id', sessionData);
const session = cacheHelpers.chat.get('session-id');

// User cache
cacheHelpers.user.set('user-id', userData);
const user = cacheHelpers.user.get('user-id');
```

### Using Cache Manager Directly
```typescript
import { cacheManager } from '@/utils/cacheManager';

// Set with custom TTL
cacheManager.set('namespace', 'key', value, 5 * 60 * 1000); // 5 minutes

// Get
const value = cacheManager.get('namespace', 'key');

// Check
if (cacheManager.has('namespace', 'key')) {
  // Use cached value
}

// Delete
cacheManager.delete('namespace', 'key');

// Clear namespace
cacheManager.clear('namespace');

// Clear all
cacheManager.clearAll();

// Get stats
const stats = cacheManager.getStats();
// { totalItems, hitRate, missRate, totalHits, totalMisses, averageAccessTime }

// Get namespace stats
const nsStats = cacheManager.getNamespaceStats('namespace');
// { totalItems, totalSize, oldestEntry, newestEntry }
```

---

## ⚠️ ERROR HANDLING

### Using Error Handler
```typescript
import {
  AppErrorClass,
  ErrorCode,
  getErrorMessage,
  getErrorRecoverySuggestions,
  isRetryableError,
  isAuthError,
} from '@/utils/errorHandler';

try {
  // Some operation
} catch (error) {
  const message = getErrorMessage(error);
  const suggestions = getErrorRecoverySuggestions(error);
  
  if (isRetryableError(error)) {
    // Retry the operation
  }
  
  if (isAuthError(error)) {
    // Redirect to login
  }
}
```

### Using Error Logger
```typescript
import { errorLogger, logError } from '@/utils/errorLogger';

try {
  // Some operation
} catch (error) {
  // Log error
  const errorLog = logError(error, 'ComponentName');
  console.log('Error ID:', errorLog.id);
  
  // Get stats
  const stats = errorLogger.getStats();
  console.log('Total errors:', stats.total);
  console.log('Hit rate:', stats.hitRate);
  
  // Get logs by code
  const authErrors = errorLogger.getLogsByCode(ErrorCode.UNAUTHORIZED);
  
  // Get logs by severity
  const criticalErrors = errorLogger.getLogsBySeverity('critical');
  
  // Export logs
  const json = errorLogger.exportAsJSON();
  const csv = errorLogger.exportAsCSV();
  
  // Download logs
  errorLogger.downloadLogs('json');
  errorLogger.downloadLogs('csv');
}
```

### Error Codes
```typescript
import { ErrorCode } from '@/utils/errorHandler';

// Client errors
ErrorCode.INVALID_INPUT
ErrorCode.VALIDATION_ERROR
ErrorCode.NOT_FOUND

// Network errors
ErrorCode.NETWORK_ERROR
ErrorCode.TIMEOUT
ErrorCode.CONNECTION_REFUSED

// Auth errors
ErrorCode.UNAUTHORIZED
ErrorCode.FORBIDDEN
ErrorCode.TOKEN_EXPIRED
ErrorCode.INVALID_TOKEN

// Server errors
ErrorCode.SERVER_ERROR
ErrorCode.SERVICE_UNAVAILABLE
ErrorCode.INTERNAL_ERROR

// Rate limiting
ErrorCode.RATE_LIMITED
ErrorCode.TOO_MANY_REQUESTS

// AI errors
ErrorCode.AI_ERROR
ErrorCode.INVALID_PROMPT
ErrorCode.MODEL_NOT_FOUND
ErrorCode.AI_TIMEOUT

// Data errors
ErrorCode.PARSE_ERROR
ErrorCode.INVALID_DATA
ErrorCode.DATA_CORRUPTION

// Unknown
ErrorCode.UNKNOWN_ERROR
```

---

## 🎨 COMPONENTS

### Pagination Component
```typescript
import { Pagination } from '@/components/Pagination';

<Pagination
  currentPage={page}
  totalPages={totalPages}
  pageSize={pageSize}
  totalItems={totalItems}
  onPageChange={setPage}
  onPageSizeChange={setPageSize}
  pageSizeOptions={[5, 10, 20, 50]}
  maxVisiblePages={5}
  disabled={isLoading}
/>
```

---

## 🔗 API CLIENT

### Using API Client
```typescript
import { api } from '@/utils/apiClient';

// Auth
await api.auth.login({ email, password });
await api.auth.register({ email, username, password, displayName });
await api.auth.logout();
await api.auth.me();
await api.auth.updateProfile({ displayName, avatar, bio });

// Exams
await api.exams.getAll({ page: 1, limit: 10 });
await api.exams.getById(examId);
await api.exams.create(examData);
await api.exams.delete(examId);

// Flashcards
await api.flashcards.decks.getAll();
await api.flashcards.decks.getById(deckId);
await api.flashcards.decks.create(deckData);
await api.flashcards.decks.delete(deckId);

// Chat
await api.chat.getAll();
await api.chat.getById(sessionId);
await api.chat.create(sessionData);
await api.chat.update(sessionId, updates);
await api.chat.delete(sessionId);

// Progress
await api.progress.recordSession(sessionData);
await api.progress.getStats();
await api.progress.getChart(period);
```

---

## 🎯 COMMON PATTERNS

### Fetching Data with Error Handling
```typescript
import { useEffect, useState } from 'react';
import { api } from '@/utils/apiClient';
import { getErrorMessage } from '@/utils/errorHandler';
import { logError } from '@/utils/errorLogger';

function MyComponent() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await api.exams.getAll();
        setData(result);
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        logError(err, 'MyComponent');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  
  return <div>{/* Render data */}</div>;
}
```

### Using Store with Validation
```typescript
import { useExamStore } from '@/store/examStore';
import { validateCreateExamRequest } from '@/schemas/exam.schema';

function CreateExam() {
  const { addToHistory } = useExamStore();

  const handleSubmit = async (formData: any) => {
    try {
      // Validate
      const validData = validateCreateExamRequest(formData);
      
      // Submit
      const result = await api.exams.create(validData);
      
      // Update store
      addToHistory({
        id: result.id,
        examTitle: result.title,
        examType: result.type,
        score: 0,
        totalQuestions: result.questions.length,
        percentage: 0,
        timeSpent: 0,
        createdAt: new Date().toISOString(),
        isSubmitted: false,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>;
}
```

### Using Cache
```typescript
import { cacheHelpers } from '@/utils/cacheManager';
import { api } from '@/utils/apiClient';

async function getExamData(examId: string) {
  // Check cache first
  const cached = cacheHelpers.exam.get(examId);
  if (cached) {
    return cached;
  }

  // Fetch from API
  const data = await api.exams.getById(examId);

  // Cache for 1 hour
  cacheHelpers.exam.set(examId, data, 60 * 60 * 1000);

  return data;
}
```

---

## 📚 RESOURCES

- [Zod Documentation](https://zod.dev/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

---

## ✨ TIPS & TRICKS

### 1. Always validate API responses
```typescript
const validatedData = safeValidateExamResult(apiResponse);
if (!validatedData) {
  // Handle validation error
}
```

### 2. Use cache for frequently accessed data
```typescript
// Cache user data for 1 hour
cacheHelpers.user.set(userId, userData, 60 * 60 * 1000);
```

### 3. Log errors for debugging
```typescript
try {
  // Some operation
} catch (error) {
  logError(error, 'ComponentName');
}
```

### 4. Use store getters for computed values
```typescript
const stats = useExamStore().getStats();
const pages = useExamStore().getTotalPages();
```

### 5. Handle auth errors gracefully
```typescript
if (isAuthError(error)) {
  // Redirect to login or show login modal
}
```

---

**Last Updated:** 2025-12-07  
**Version:** 2.0


