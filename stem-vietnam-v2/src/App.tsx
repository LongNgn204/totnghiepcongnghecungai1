// Chú thích: Root App component với React Router
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import MainLayout from './components/layout/MainLayout';
import { useAppStore } from './stores/appStore';

// Chú thích: Lazy load pages cho better performance
import { lazy, Suspense } from 'react';

const ChatPage = lazy(() => import('./components/chat/ChatPage'));
const QuestionFormPage = lazy(() => import('./components/forms/QuestionFormPage'));
const ExamFormPage = lazy(() => import('./components/forms/ExamFormPage'));
const SemesterExamFormPage = lazy(() => import('./components/forms/SemesterExamFormPage'));
const LibraryPage = lazy(() => import('./components/library/LibraryPage'));

// Chú thích: Loading fallback component
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
    </div>
  );
}

function App() {
  const { isDarkMode, notification, clearNotification } = useAppStore();

  // Chú thích: Apply dark mode class on mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <BrowserRouter>
      {/* Notification Toast */}
      {notification && (
        <div className={`
          fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg animate-slide-up
          ${notification.type === 'success' ? 'bg-green-500 text-white' : ''}
          ${notification.type === 'error' ? 'bg-red-500 text-white' : ''}
          ${notification.type === 'info' ? 'bg-primary-500 text-white' : ''}
        `}>
          <div className="flex items-center gap-2">
            <span>{notification.message}</span>
            <button onClick={clearNotification} className="ml-2 hover:opacity-75">×</button>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Redirect root to chat */}
          <Route index element={<Navigate to="/chat" replace />} />

          {/* Main pages */}
          <Route path="chat" element={
            <Suspense fallback={<PageLoader />}>
              <ChatPage />
            </Suspense>
          } />

          <Route path="questions" element={
            <Suspense fallback={<PageLoader />}>
              <QuestionFormPage />
            </Suspense>
          } />

          <Route path="exam/thpt" element={
            <Suspense fallback={<PageLoader />}>
              <ExamFormPage />
            </Suspense>
          } />

          <Route path="exam/semester" element={
            <Suspense fallback={<PageLoader />}>
              <SemesterExamFormPage />
            </Suspense>
          } />

          <Route path="library" element={
            <Suspense fallback={<PageLoader />}>
              <LibraryPage />
            </Suspense>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
