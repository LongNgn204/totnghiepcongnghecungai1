# 📖 PHASE 1 USAGE GUIDE

**Phase 1 Status:** ✅ COMPLETE  
**Files Created:** 3 new + 2 upgraded  
**Ready to Use:** YES

---

## 🚀 QUICK START

### 1. Error Handling

```typescript
import { 
  AppErrorClass, 
  ErrorCode, 
  getErrorMessage,
  getErrorRecoverySuggestions 
} from './utils/errorHandler';

try {
  // Your code
  const result = await someAsyncOperation();
} catch (error) {
  // Get user-friendly message
  const message = getErrorMessage(error);
  console.error(message);
  
  // Get recovery suggestions
  if (error instanceof AppErrorClass) {
    const suggestions = getErrorRecoverySuggestions(error);
    suggestions.forEach(s => console.log('Suggestion:', s));
  }
}
```

### 2. Retry Logic

```typescript
import { retryAsync, retryNetworkRequest, retryAIRequest } from './utils/retry';

// Simple retry
const data = await retryAsync(async () => {
  return await fetch('/api/data');
});

// Network request retry
const response = await retryNetworkRequest(async () => {
  return await fetch('/api/endpoint');
});

// AI request retry
const aiResponse = await retryAIRequest(async () => {
  return await generateContent(prompt);
});
```

### 3. Token Management

```typescript
import { 
  tokenManager, 
  initializeTokenManager,
  getStoredTokens,
  logout 
} from './utils/tokenManager';

// Initialize on app start
useEffect(() => {
  initializeTokenManager();
}, []);

// Check if authenticated
if (tokenManager.isAuthenticated()) {
  const token = tokenManager.getAccessToken();
  // Use token
}

// Logout
const handleLogout = () => {
  logout();
  navigate('/login');
};
```

### 4. API Client

```typescript
import { fetchAPI } from './utils/apiClient';

// Automatic retry + error handling
const data = await fetchAPI('/api/exams', {
  method: 'POST',
  body: JSON.stringify(examData)
});
```

### 5. Gemini API

```typescript
import { generateContent } from './utils/geminiAPI';

// Automatic validation + retry + error handling
const response = await generateContent(prompt, 'gemini-2.5-pro');

if (response.success) {
  console.log(response.text);
} else {
  console.error(response.error);
}
```

---

## 📚 DETAILED USAGE

### Error Handler

#### Creating Custom Errors

```typescript
import { AppErrorClass, ErrorCode } from './utils/errorHandler';

// Create validation error
throw new AppErrorClass(
  ErrorCode.VALIDATION_ERROR,
  'Email không hợp lệ',
  { email: 'invalid@' },
  undefined,
  'validateEmail'
);

// Create auth error
throw new AppErrorClass(
  ErrorCode.UNAUTHORIZED,
  'Bạn chưa đăng nhập',
  null,
  401,
  'protectedRoute'
);

// Create AI error
throw new AppErrorClass(
  ErrorCode.AI_ERROR,
  'AI không thể xử lý yêu cầu',
  { originalError: error },
  undefined,
  'generateContent',
  'high'
);
```

#### Error Logging

```typescript
import { logError, AppErrorClass } from './utils/errorHandler';

try {
  // ...
} catch (error) {
  logError(error, 'MyComponent');
  // Logs to console in development
  // Sends to error tracking service in production
}
```

#### Error Classification

```typescript
import { 
  isRetryableError, 
  isAuthError 
} from './utils/errorHandler';

if (isRetryableError(error)) {
  // Retry the operation
  await retryAsync(operation);
}

if (isAuthError(error)) {
  // Redirect to login
  navigate('/login');
}
```

---

### Retry Logic

#### Basic Retry

```typescript
import { retryAsync, DEFAULT_RETRY_CONFIG } from './utils/retry';

const result = await retryAsync(
  async () => {
    return await fetch('/api/data');
  },
  DEFAULT_RETRY_CONFIG // 3 retries, 1-10s delay
);
```

#### Custom Retry Config

```typescript
import { retryAsync } from './utils/retry';

const result = await retryAsync(
  async () => {
    return await fetch('/api/data');
  },
  {
    maxRetries: 5,
    initialDelayMs: 500,
    maxDelayMs: 30000,
    backoffMultiplier: 2,
    onRetry: (error, attempt, delay) => {
      console.log(`Retry ${attempt} in ${delay}ms`);
    }
  }
);
```

#### Retry with Custom Condition

```typescript
import { retryAsyncWithCondition } from './utils/retry';

const result = await retryAsyncWithCondition(
  async () => {
    return await fetch('/api/data');
  },
  (error, attempt) => {
    // Only retry on network errors, max 3 times
    return error instanceof TypeError && attempt < 3;
  }
);
```

#### Circuit Breaker

```typescript
import { CircuitBreaker } from './utils/retry';

const breaker = new CircuitBreaker(
  async () => {
    return await fetch('/api/unreliable-endpoint');
  },
  5, // Fail after 5 failures
  60000 // Reset after 60 seconds
);

try {
  const result = await breaker.execute();
} catch (error) {
  if (error.message === 'Circuit breaker is open') {
    console.log('Service is down, try again later');
  }
}
```

---

### Token Management

#### Initialize on App Start

```typescript
import { initializeTokenManager } from './utils/tokenManager';

// In App.tsx or main useEffect
useEffect(() => {
  const init = async () => {
    const isValid = await initializeTokenManager();
    if (!isValid) {
      navigate('/login');
    }
  };
  init();
}, []);
```

#### Check Authentication

```typescript
import { tokenManager } from './utils/tokenManager';

// Check if user is authenticated
if (tokenManager.isAuthenticated()) {
  // User is logged in
  const token = tokenManager.getAccessToken();
  // Use token
} else {
  // User is not logged in
  navigate('/login');
}
```

#### Manual Token Refresh

```typescript
import { tokenManager } from './utils/tokenManager';

// Manually refresh token
const newTokenData = await tokenManager.refresh();

if (newTokenData) {
  console.log('Token refreshed');
} else {
  console.log('Refresh failed, user logged out');
}
```

#### Ensure Valid Token Before API Call

```typescript
import { tokenManager } from './utils/tokenManager';

async function makeAuthenticatedRequest() {
  // Ensure token is valid (refresh if needed)
  const isValid = await tokenManager.ensureValidToken();
  
  if (!isValid) {
    navigate('/login');
    return;
  }
  
  // Make API call
  const response = await fetch('/api/protected', {
    headers: {
      'Authorization': `Bearer ${tokenManager.getAccessToken()}`
    }
  });
}
```

#### Logout

```typescript
import { logout } from './utils/tokenManager';

const handleLogout = () => {
  logout(); // Clears tokens and dispatches logout event
  navigate('/login');
};
```

---

### API Client

#### Basic Usage

```typescript
import { fetchAPI } from './utils/apiClient';

// GET request
const data = await fetchAPI('/api/exams');

// POST request
const result = await fetchAPI('/api/exams', {
  method: 'POST',
  body: JSON.stringify({ title: 'Exam 1' })
});

// PUT request
const updated = await fetchAPI('/api/exams/123', {
  method: 'PUT',
  body: JSON.stringify({ title: 'Updated Exam' })
});

// DELETE request
await fetchAPI('/api/exams/123', {
  method: 'DELETE'
});
```

#### With Custom Retry Config

```typescript
import { fetchAPI } from './utils/apiClient';
import { AGGRESSIVE_RETRY_CONFIG } from './utils/retry';

const data = await fetchAPI(
  '/api/critical-endpoint',
  { method: 'GET' },
  AGGRESSIVE_RETRY_CONFIG // More aggressive retry
);
```

#### Error Handling

```typescript
import { fetchAPI } from './utils/apiClient';
import { getErrorMessage } from './utils/errorHandler';

try {
  const data = await fetchAPI('/api/exams');
} catch (error) {
  const message = getErrorMessage(error);
  toast.error(message);
}
```

---

### Gemini API

#### Basic Usage

```typescript
import { generateContent } from './utils/geminiAPI';

const response = await generateContent(
  'Giải thích máy biến áp',
  'gemini-2.5-pro'
);

if (response.success) {
  console.log('Response:', response.text);
} else {
  console.error('Error:', response.error);
}
```

#### With Error Handling

```typescript
import { generateContent } from './utils/geminiAPI';
import { getErrorMessage } from './utils/errorHandler';

try {
  const response = await generateContent(prompt, modelId);
  
  if (!response.success) {
    throw new Error(response.error);
  }
  
  // Use response.text
} catch (error) {
  const message = getErrorMessage(error);
  toast.error(message);
}
```

#### Model Selection

```typescript
import { generateContent, AVAILABLE_MODELS } from './utils/geminiAPI';

// List available models
AVAILABLE_MODELS.forEach(model => {
  console.log(`${model.name}: ${model.description}`);
});

// Use specific model
const response = await generateContent(
  prompt,
  'gemini-2.5-flash' // Faster, less powerful
);
```

---

## 🔧 INTEGRATION EXAMPLES

### In ChatInterface.tsx

```typescript
import { generateContent } from '../utils/geminiAPI';
import { getErrorMessage } from '../utils/errorHandler';
import toast from 'react-hot-toast';

const handleSendMessage = async (message: string) => {
  setLoading(true);
  const toastId = toast.loading('Đang xử lý...');
  
  try {
    const response = await generateContent(message, selectedModel);
    
    if (!response.success) {
      throw new Error(response.error);
    }
    
    // Add to chat
    addMessage({
      role: 'assistant',
      content: response.text
    });
    
    toast.success('Trả lời thành công', { id: toastId });
  } catch (error) {
    const message = getErrorMessage(error);
    toast.error(message, { id: toastId });
  } finally {
    setLoading(false);
  }
};
```

### In Product2.tsx (Exam Generator)

```typescript
import { generateContent } from '../utils/geminiAPI';
import { getErrorMessage, AppErrorClass } from '../utils/errorHandler';
import toast from 'react-hot-toast';

const handleGenerate = async () => {
  if (!topic.trim()) {
    toast.error('Vui lòng nhập chủ đề');
    return;
  }
  
  setLoading(true);
  const toastId = toast.loading('Đang tạo đề thi...');
  
  try {
    const response = await generateContent(prompt, 'gemini-2.5-pro');
    
    if (!response.success) {
      throw new Error(response.error);
    }
    
    // Parse and validate
    const data = JSON.parse(response.text);
    
    // Use data
    setQuestions(data);
    toast.success('Tạo đề thi thành công', { id: toastId });
  } catch (error) {
    const message = getErrorMessage(error);
    toast.error(message, { id: toastId });
  } finally {
    setLoading(false);
  }
};
```

### In AuthContext.tsx

```typescript
import { tokenManager, initializeTokenManager } from '../utils/tokenManager';
import { getErrorMessage } from '../utils/errorHandler';

useEffect(() => {
  const init = async () => {
    try {
      const isValid = await initializeTokenManager();
      if (isValid) {
        // Load user data
        const user = await fetchAPI('/api/auth/me');
        setUser(user);
      }
    } catch (error) {
      console.error('Init failed:', getErrorMessage(error));
      logout();
    }
  };
  
  init();
}, []);

const logout = () => {
  tokenManager.cleanup();
  setUser(null);
  setToken(null);
};
```

---

## ✅ CHECKLIST

Before using Phase 1 utilities:

- [ ] Import error handler in components
- [ ] Import retry logic for API calls
- [ ] Initialize token manager on app start
- [ ] Use upgraded API client
- [ ] Use upgraded Gemini API
- [ ] Add error handling to all async operations
- [ ] Add loading states
- [ ] Add toast notifications
- [ ] Test error scenarios
- [ ] Test retry logic
- [ ] Test token refresh

---

## 📞 TROUBLESHOOTING

### Token keeps expiring

```typescript
// Check token expiry time
import { getTokenExpirationTime } from './utils/tokenManager';

const token = localStorage.getItem('auth_token');
const expiresAt = getTokenExpirationTime(token);
console.log('Expires at:', new Date(expiresAt));
```

### Retry not working

```typescript
// Check if error is retryable
import { isRetryableError } from './utils/errorHandler';

try {
  // ...
} catch (error) {
  if (isRetryableError(error)) {
    console.log('This error will be retried');
  } else {
    console.log('This error will not be retried');
  }
}
```

### Error message not showing

```typescript
// Check error code
import { getErrorMessage } from './utils/errorHandler';

const message = getErrorMessage(error);
console.log('Message:', message);
```

---

**Phase 1 is ready to use! Start integrating these utilities into your components.**

