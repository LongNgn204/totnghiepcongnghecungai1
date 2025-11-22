// API Client for backend communication

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ai-hoc-tap-api.your-account.workers.dev';

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add auth token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Add user ID for backward compatibility
  const userId = localStorage.getItem('user_id');
  if (userId) {
    headers['X-User-ID'] = userId;
  } else {
    const newId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('user_id', newId);
    headers['X-User-ID'] = newId;
  }

  return headers;
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `API Error: ${response.status}`);
  }

  return response.json();
}

// ============= USERS API =============

export const usersAPI = {
  register: async (name?: string) => {
    return fetchAPI('/api/users/register', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },

  getMe: async () => {
    return fetchAPI('/api/users/me');
  },

  updateProfile: async (data: { name?: string; email?: string; avatar?: string }) => {
    return fetchAPI('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// ============= EXAMS API =============

export const examsAPI = {
  create: async (exam: any) => {
    return fetchAPI('/api/exams', {
      method: 'POST',
      body: JSON.stringify(exam),
    });
  },

  getAll: async (limit = 20, offset = 0) => {
    return fetchAPI(`/api/exams?limit=${limit}&offset=${offset}`);
  },

  getById: async (id: string) => {
    return fetchAPI(`/api/exams/${id}`);
  },

  delete: async (id: string) => {
    return fetchAPI(`/api/exams/${id}`, { method: 'DELETE' });
  },

  getStats: async () => {
    return fetchAPI('/api/exams/stats');
  },
};

// ============= FLASHCARDS API =============

export const flashcardsAPI = {
  decks: {
    create: async (deck: any) => {
      return fetchAPI('/api/flashcards/decks', {
        method: 'POST',
        body: JSON.stringify(deck),
      });
    },

    getAll: async () => {
      return fetchAPI('/api/flashcards/decks');
    },

    getById: async (id: string) => {
      return fetchAPI(`/api/flashcards/decks/${id}`);
    },

    delete: async (id: string) => {
      return fetchAPI(`/api/flashcards/decks/${id}`, { method: 'DELETE' });
    },

    addCard: async (deckId: string, card: any) => {
      return fetchAPI(`/api/flashcards/decks/${deckId}/cards`, {
        method: 'POST',
        body: JSON.stringify(card),
      });
    },
  },

  cards: {
    update: async (id: string, updates: any) => {
      return fetchAPI(`/api/flashcards/cards/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },

    delete: async (id: string) => {
      return fetchAPI(`/api/flashcards/cards/${id}`, { method: 'DELETE' });
    },
  },
};

// ============= CHAT API =============

export const chatAPI = {
  create: async (session: any) => {
    return fetchAPI('/api/chat/sessions', {
      method: 'POST',
      body: JSON.stringify(session),
    });
  },

  getAll: async () => {
    return fetchAPI('/api/chat/sessions');
  },

  getById: async (id: string) => {
    return fetchAPI(`/api/chat/sessions/${id}`);
  },

  update: async (id: string, messages: any[]) => {
    return fetchAPI(`/api/chat/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ messages }),
    });
  },

  delete: async (id: string) => {
    return fetchAPI(`/api/chat/sessions/${id}`, { method: 'DELETE' });
  },
};

// ============= PROGRESS API =============

export const progressAPI = {
  recordSession: async (session: any) => {
    return fetchAPI('/api/progress/sessions', {
      method: 'POST',
      body: JSON.stringify(session),
    });
  },

  getStats: async () => {
    return fetchAPI('/api/progress/stats');
  },

  getChartData: async (period: number = 7) => {
    return fetchAPI(`/api/progress/chart/${period}`);
  },
};

// ============= LEADERBOARD API =============

export const leaderboardAPI = {
  get: async () => {
    return fetchAPI('/api/leaderboard');
  },
};

// ============= ADMIN API =============

export const adminAPI = {
  getStats: async () => {
    return fetchAPI('/api/admin/stats');
  },

  getUsers: async () => {
    return fetchAPI('/api/admin/users');
  },

  getChats: async () => {
    return fetchAPI('/api/admin/chats');
  },

  getExamStats: async () => {
    return fetchAPI('/api/admin/exams/stats');
  },
};

// ============= DASHBOARD API =============

export const dashboardAPI = {
  getStats: async () => {
    return fetchAPI('/api/dashboard/stats');
  },
};

// Export all
export const api = {
  users: usersAPI,
  exams: examsAPI,
  flashcards: flashcardsAPI,
  chat: chatAPI,
  progress: progressAPI,
  leaderboard: leaderboardAPI,
  dashboard: dashboardAPI,
  admin: adminAPI,
};

export default api;
