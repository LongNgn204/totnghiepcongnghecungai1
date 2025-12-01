// API Client for backend communication

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

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const isAuthEndpoint = endpoint.startsWith('/api/auth/');
  const token = localStorage.getItem('auth_token');

  // Skip non-auth API calls if no token is present
  if (!token && !isAuthEndpoint) {
    console.warn(`Skipping API call to ${endpoint}: No auth token found.`);
    // Return a consistent empty/error-like state to prevent crashes
    return Promise.resolve({ data: [], error: 'Not authenticated' });
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      console.error('Unauthorized access. Token may be invalid or expired.');
      // Dispatch a global event to trigger logout in the AuthContext
      window.dispatchEvent(new Event('auth-error'));
    }
    const error = await response.json().catch(() => ({ error: 'Network error or invalid JSON response' }));
    throw new Error(error.error || `API Error: ${response.status}`);
  }

  return response.json();
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
