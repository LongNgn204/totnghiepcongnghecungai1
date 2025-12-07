# 🔧 CODE FIXES - SẴN SÀNG COPY-PASTE

---

## FIX #1: Add Error Boundaries to All Routes

**File:** `App.tsx`

**Replace this:**
```typescript
<Route path="/san-pham-1" element={<ProtectedRoute><Product1 /></ProtectedRoute>} />
<Route path="/san-pham-2" element={<ProtectedRoute><Product2 /></ProtectedRoute>} />
<Route path="/san-pham-4" element={<ProtectedRoute><Product4 /></ProtectedRoute>} />
<Route path="/san-pham-5" element={<ProtectedRoute><Product5 /></ProtectedRoute>} />
<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
<Route path="/flashcards" element={<ProtectedRoute><Flashcards /></ProtectedRoute>} />
<Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
<Route path="/history" element={<ProtectedRoute><ExamHistory /></ProtectedRoute>} />
<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
<Route path="/settings" element={<ProtectedRoute><PWASettings /></ProtectedRoute>} />
<Route path="/home/coding-lab" element={<ProtectedRoute><CodingLab /></ProtectedRoute>} />
```

**With this:**
```typescript
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

## FIX #2: Add ARIA Labels to Header

**File:** `components/Header.tsx`

**Add to buttons:**
```typescript
{/* Menu button */}
<button
  onClick={() => setIsMenuOpen(!isMenuOpen)}
  className="xl:hidden"
  aria-label="Toggle navigation menu"
  aria-expanded={isMenuOpen}
  aria-controls="mobile-nav"
>
  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
</button>

{/* Theme toggle */}
<button
  onClick={toggleTheme}
  className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
  aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
  title={theme === 'light' ? 'Dark mode' : 'Light mode'}
>
  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
</button>

{/* User menu button */}
<button
  onClick={() => setShowUserMenu(!showUserMenu)}
  className="flex items-center gap-2"
  aria-label="User menu"
  aria-expanded={showUserMenu}
  aria-controls="user-menu"
>
  <User size={20} />
  <ChevronDown size={16} />
</button>
```

---

## FIX #3: Improve Error Messages in API Client

**File:** `utils/apiClient.ts`

**Replace the error handling:**
```typescript
// ❌ OLD
if (!response.ok) {
  if (response.status === 401) {
    console.error('Unauthorized access. Token may be invalid or expired.');
    window.dispatchEvent(new Event('auth-error'));
  }
  const error = await response.json().catch(() => ({ error: 'Network error or invalid JSON response' }));
  throw new Error(error.error || `API Error: ${response.status}`);
}
```

**With this:**
```typescript
// ✅ NEW
if (!response.ok) {
  const errorData = await response.json().catch(() => ({ error: 'Network error' }));
  
  if (response.status === 401) {
    window.dispatchEvent(new Event('auth-error'));
    throw new Error('Bạn chưa đăng nhập. Vui lòng đăng nhập lại.');
  }
  
  if (response.status === 403) {
    throw new Error('Bạn không có quyền truy cập tài nguyên này.');
  }
  
  if (response.status === 404) {
    throw new Error('Tài nguyên không tìm thấy.');
  }
  
  if (response.status === 429) {
    throw new Error('Bạn đã gửi quá nhiều yêu cầu. Vui lòng chờ một lúc.');
  }
  
  if (response.status >= 500) {
    throw new Error('Lỗi server. Vui lòng thử lại sau.');
  }
  
  throw new Error(errorData?.error || `Lỗi ${response.status}`);
}
```

---

## FIX #4: Add Loading States to Submit Buttons

**File:** `components/Product2.tsx` (or any component with submit)

**Replace:**
```typescript
// ❌ OLD
const handleGenerate = async () => {
  setLoading(true);
  setError('');
  // ... logic
  setLoading(false);
};

return (
  <button onClick={handleGenerate}>
    Tạo đề
  </button>
);
```

**With:**
```typescript
// ✅ NEW
const handleGenerate = async () => {
  if (!topic.trim()) {
    setError('Vui lòng nhập chủ đề cần tạo câu hỏi');
    return;
  }
  
  setLoading(true);
  setError('');
  setHasGenerated(false);
  
  try {
    const response = await generateContent(prompt);
    if (!response.success) {
      throw new Error(response.error || 'Lỗi không xác định');
    }
    // ... logic
    setHasGenerated(true);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Lỗi xử lý dữ liệu.';
    setError(errorMessage);
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};

return (
  <>
    {error && (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
        {error}
      </div>
    )}
    
    <button
      onClick={handleGenerate}
      disabled={loading || !topic.trim()}
      className={`px-6 py-2 rounded font-medium transition-all ${
        loading
          ? 'bg-gray-400 cursor-not-allowed opacity-75'
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      }`}
    >
      {loading ? (
        <>
          <Loader2 className="inline mr-2 animate-spin" size={18} />
          Đang tạo đề...
        </>
      ) : (
        <>
          <Sparkles className="inline mr-2" size={18} />
          Tạo đề
        </>
      )}
    </button>
  </>
);
```

---

## FIX #5: Add Input Validation for Forms

**File:** `components/Product2.tsx`

**Add validation function:**
```typescript
// ✅ NEW: Add at top of component
const validateInputs = (): boolean => {
  if (!topic.trim()) {
    setError('Vui lòng nhập chủ đề');
    return false;
  }
  
  const numMCValue = parseInt(numMC);
  const numTFValue = parseInt(numTF);
  
  if (isNaN(numMCValue) || numMCValue < 1 || numMCValue > 50) {
    setError('Số câu trắc nghiệm phải từ 1 đến 50');
    return false;
  }
  
  if (isNaN(numTFValue) || numTFValue < 1 || numTFValue > 20) {
    setError('Số câu đúng/sai phải từ 1 đến 20');
    return false;
  }
  
  if (!['6', '9', '10', '11', '12'].includes(grade)) {
    setError('Lớp không hợp lệ');
    return false;
  }
  
  if (!['Dễ', 'Trung bình', 'Khó'].includes(difficulty)) {
    setError('Độ khó không hợp lệ');
    return false;
  }
  
  return true;
};

// ✅ Use in handleGenerate
const handleGenerate = async () => {
  if (!validateInputs()) {
    return;
  }
  
  setLoading(true);
  setError('');
  // ... rest of logic
};
```

---

## FIX #6: Add Toast Notifications for User Feedback

**File:** Any component with async operations

**Add imports:**
```typescript
import toast from 'react-hot-toast';
```

**Add notifications:**
```typescript
const handleDelete = async (id: string) => {
  if (!confirm('Bạn có chắc muốn xóa?')) return;
  
  const toastId = toast.loading('Đang xóa...');
  
  try {
    await api.exams.delete(id);
    toast.success('Xóa thành công!', { id: toastId });
    // Refresh list
    loadHistory();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lỗi xóa';
    toast.error(message, { id: toastId });
  }
};

const handleSubmit = async () => {
  const toastId = toast.loading('Đang nộp bài...');
  
  try {
    const result = await api.exams.create(examData);
    toast.success('Nộp bài thành công!', { id: toastId });
    setTimeout(() => navigate('/history'), 1500);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lỗi nộp bài';
    toast.error(message, { id: toastId });
  }
};
```

---

## FIX #7: Add Keyboard Navigation Support

**File:** `components/Header.tsx` (or any menu)

**Add keyboard handling:**
```typescript
// ✅ NEW: Add keyboard event handler
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Close menu on Escape
    if (e.key === 'Escape') {
      setIsMenuOpen(false);
      setShowUserMenu(false);
    }
    
    // Toggle menu on Alt+M
    if (e.altKey && e.key === 'm') {
      e.preventDefault();
      setIsMenuOpen(!isMenuOpen);
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [isMenuOpen]);
```

---

## FIX #8: Add Fallback UI for Loading States

**File:** Any component with data loading

**Add skeleton/fallback:**
```typescript
// ✅ NEW: Add loading state
if (loading && examHistory.length === 0) {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="p-4 bg-gray-200 rounded-lg animate-pulse h-20" />
      ))}
    </div>
  );
}

// ✅ NEW: Add empty state
if (examHistory.length === 0 && !loading) {
  return (
    <div className="text-center py-12">
      <FileQuestion className="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đề thi</h3>
      <p className="text-gray-500 mb-6">Hãy tạo đề thi đầu tiên của bạn</p>
      <button
        onClick={() => navigate('/san-pham-2')}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Tạo đề thi
      </button>
    </div>
  );
}
```

---

## FIX #9: Add Error Recovery Options

**File:** `components/ErrorBoundary.tsx` (improve existing)

**Add recovery button:**
```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  componentName?: string;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorCount: number;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorCount: 0 };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Error in ${this.props.componentName}:`, error, errorInfo);
    this.setState(prev => ({ errorCount: prev.errorCount + 1 }));
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Có lỗi xảy ra
            </h2>
            <p className="text-gray-600 mb-4">
              {this.props.componentName && `Lỗi trong ${this.props.componentName}: `}
              {this.state.error?.message || 'Không xác định'}
            </p>
            
            {this.state.errorCount > 2 && (
              <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded mb-4">
                Lỗi lặp lại nhiều lần. Vui lòng làm mới trang.
              </p>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Làm mới
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium"
              >
                Trang chủ
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

---

## FIX #10: Add Network Status Indicator

**File:** `components/NetworkStatus.tsx` (NEW)

```typescript
import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3 shadow-lg z-40">
      <WifiOff className="w-5 h-5 text-yellow-600" />
      <div>
        <p className="font-medium text-yellow-900">Mất kết nối mạng</p>
        <p className="text-sm text-yellow-700">Dữ liệu sẽ được đồng bộ khi có kết nối</p>
      </div>
    </div>
  );
};

export default NetworkStatus;
```

**Add to App.tsx:**
```typescript
import NetworkStatus from './components/NetworkStatus';

export default function App() {
  return (
    <div>
      <Header />
      <main>{/* ... */}</main>
      <NetworkStatus />
    </div>
  );
}
```

---

## IMPLEMENTATION ORDER

1. **FIX #1** - Add Error Boundaries (30 mins)
2. **FIX #2** - Add ARIA Labels (1 hour)
3. **FIX #3** - Improve Error Messages (1 hour)
4. **FIX #4** - Add Loading States (1-2 hours)
5. **FIX #5** - Add Input Validation (1 hour)
6. **FIX #6** - Add Toast Notifications (30 mins)
7. **FIX #7** - Add Keyboard Navigation (30 mins)
8. **FIX #8** - Add Fallback UI (1 hour)
9. **FIX #9** - Improve Error Boundary (1 hour)
10. **FIX #10** - Add Network Status (30 mins)

**Total Time:** ~8-9 hours

---

**Last Updated:** 2025-12-07 03:25:00 UTC

