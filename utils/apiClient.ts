/**
 * ✅ PHASE 1 - STEP 1.3: Upgraded API Client with Error Handling & Retry
 * 
 * Features:
 * - Centralized error handling
 * - Automatic retry with exponential backoff
 * - Specific error messages
 * - Auth error handling
 * - Request/response logging
 */

import { retryAsync, DEFAULT_RETRY_CONFIG, RetryConfig } from './retry';
import {
  AppErrorClass,
  ErrorCode,
  createErrorFromResponse,
  createNetworkError,
  logError,
  isAuthError,
  getErrorMessage,
} from './errorHandler';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || (import.meta.env.MODE === 'development' ? 'http://localhost:8787' : '');

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

/**
 * ✅ Fetch with error handling and retry
 */
export async function fetchAPI(
  endpoint: string,
  options: RequestInit = {},
  retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
) {
  const isAuthEndpoint = endpoint.startsWith('/api/auth/');
  const token = localStorage.getItem('auth_token');

  // Skip non-auth API calls if no token is present
  if (!token && !isAuthEndpoint) {
    console.warn(`Skipping API call to ${endpoint}: No auth token found.`);
    throw new AppErrorClass(
      ErrorCode.UNAUTHORIZED,
      'Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.',
      null,
      401,
      endpoint
    );
  }

  return retryAsync(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...getHeaders(),
          ...options.headers,
        },
      });

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = createErrorFromResponse(response, errorData, endpoint);

        // Handle auth errors specially
        if (isAuthError(error)) {
          window.dispatchEvent(new Event('auth-error'));
        }

        logError(error);
        throw error;
      }

      return response.json();
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError) {
        const networkError = createNetworkError(error as Error, endpoint);
        logError(networkError);
        throw networkError;
      }

      // Re-throw app errors
      if (error instanceof AppErrorClass) {
        throw error;
      }

      // Wrap unknown errors
      const unknownError = new AppErrorClass(
        ErrorCode.UNKNOWN_ERROR,
        getErrorMessage(error),
        { originalError: error },
        undefined,
        endpoint
      );
      logError(unknownError);
      throw unknownError;
    }
  }, retryConfig);
}

export const api = {
  auth: {
    register: (data: any) => fetchAPI('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: any) => fetchAPI('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    logout: () => fetchAPI('/api/auth/logout', { method: 'POST' }),
    me: () => fetchAPI('/api/auth/me'),
    updateProfile: (data: any) => fetchAPI('/api/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
    changePassword: (data: any) => fetchAPI('/api/auth/change-password', { method: 'POST', body: JSON.stringify(data) }),
    forgotPassword: (data: any) => fetchAPI('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify(data) }),
  },
  dashboard: {
    stats: () => fetchAPI('/api/dashboard/stats'),
  },
  exams: {
    getAll: (params?: any) => {
      const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
      return fetchAPI(`/api/exams${queryString}`);
    },
    getById: (id: string) => fetchAPI(`/api/exams/${id}`),
    create: (data: any) => fetchAPI('/api/exams', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string) => fetchAPI(`/api/exams/${id}`, { method: 'DELETE' }),
  },
  flashcards: {
    decks: {
      getAll: (params?: any) => {
        const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
        return fetchAPI(`/api/flashcards/decks${queryString}`);
      },
      getById: (id: string) => fetchAPI(`/api/flashcards/decks/${id}`),
      create: (data: any) => fetchAPI('/api/flashcards/decks', { method: 'POST', body: JSON.stringify(data) }),
      delete: (id: string) => fetchAPI(`/api/flashcards/decks/${id}`, { method: 'DELETE' }),
    },
    cards: {
      create: (deckId: string, data: any) => fetchAPI(`/api/flashcards/decks/${deckId}/cards`, { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => fetchAPI(`/api/flashcards/cards/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
      delete: (id: string) => fetchAPI(`/api/flashcards/cards/${id}`, { method: 'DELETE' }),
    }
  },
  chat: {
    getAll: (params?: any) => {
      const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
      return fetchAPI(`/api/chat/sessions${queryString}`);
    },
    getById: (id: string) => fetchAPI(`/api/chat/sessions/${id}`),
    create: (data: any) => fetchAPI('/api/chat/sessions', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchAPI(`/api/chat/sessions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchAPI(`/api/chat/sessions/${id}`, { method: 'DELETE' }),
  },
  progress: {
    recordSession: (data: any) => fetchAPI('/api/progress/sessions', { method: 'POST', body: JSON.stringify(data) }),
    getStats: () => fetchAPI('/api/progress/stats'),
    getChart: (period: string) => fetchAPI(`/api/progress/chart/${period}`),
  }
};

export const flashcardsAPI = api.flashcards;
export const chatAPI = api.chat;
export const examsAPI = api.exams;

export default api;
