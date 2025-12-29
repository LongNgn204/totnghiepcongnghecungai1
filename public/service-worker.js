// Service Worker for PWA offline functionality
// Chú thích: Tăng version khi deploy để trigger update notification
const CACHE_VERSION = 'v2';
const CACHE_NAME = `ai-hoc-tap-${CACHE_VERSION}`;
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;

// Files to cache on install
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing new version...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[Service Worker] Caching static files');
      return cache.addAll(STATIC_FILES);
    })
  );
  // Bỏ qua waiting, kích hoạt ngay lập tức
  self.skipWaiting();
});

// Activate event - clean up old caches and notify clients
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating new version...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => !name.includes(CACHE_VERSION))
          .map((name) => {
            console.log('[Service Worker] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      // Chú thích: Gửi message tới tất cả clients để thông báo có update mới
      return self.clients.matchAll({ type: 'window' });
    }).then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'UPDATE_AVAILABLE',
          version: CACHE_VERSION,
          timestamp: Date.now()
        });
      });
      console.log('[Service Worker] Notified all clients about update');
    })
  );
  return self.clients.claim();
});

// Fetch event - hardened caching policy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip chrome-extension and non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  const isApi = url.pathname.startsWith('/api/');
  const isAI = url.hostname.endsWith('generativelanguage.googleapis.com');
  const hasAuth = request.headers.get('Authorization');

  // Do not cache API/AI or any authenticated requests
  if (isApi || isAI || hasAuth) {
    // Network only
    event.respondWith(
      fetch(request).catch(() => new Response(JSON.stringify({ error: 'Offline' }), { status: 503, headers: { 'Content-Type': 'application/json' } }))
    );
    return;
  }

  // Static files - cache first, network fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Update cache in background
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.ok) {
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, networkResponse);
              });
            }
          })
          .catch(() => { });
        return cachedResponse;
      }

      // Not in cache, fetch from network
      return fetch(request)
        .then((response) => {
          if (!response || !response.ok) return response;
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          if (request.destination === 'document') {
            return caches.match('/index.html');
          }
          return new Response('Offline', { status: 503 });
        });
    })
  );
});

// Background sync for pending actions
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);

  if (event.tag === 'sync-exam-results') {
    event.waitUntil(syncExamResults());
  } else if (event.tag === 'sync-flashcards') {
    event.waitUntil(syncFlashcards());
  } else if (event.tag === 'sync-chat-history') {
    event.waitUntil(syncChatHistory());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received:', event);

  const data = event.data ? event.data.json() : {};
  const title = data.title || 'AI Học Tập';
  const options = {
    body: data.body || 'Bạn có thông báo mới!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [200, 100, 200],
    data: data.url || '/',
    actions: [
      { action: 'open', title: 'Xem ngay' },
      { action: 'close', title: 'Đóng' },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event.action);

  event.notification.close();

  if (event.action === 'open' || !event.action) {
    const url = event.notification.data || '/';
    event.waitUntil(
      clients.openWindow(url)
    );
  }
});

// Sync functions
async function syncExamResults() {
  try {
    const pendingResults = await getFromIndexedDB('pending-exam-results');
    if (pendingResults && pendingResults.length > 0) {
      // Send to server when online
      console.log('[Service Worker] Syncing exam results:', pendingResults.length);
      // Implementation depends on your backend
    }
  } catch (error) {
    console.error('[Service Worker] Sync exam results failed:', error);
  }
}

async function syncFlashcards() {
  try {
    const pendingCards = await getFromIndexedDB('pending-flashcards');
    if (pendingCards && pendingCards.length > 0) {
      console.log('[Service Worker] Syncing flashcards:', pendingCards.length);
      // Implementation depends on your backend
    }
  } catch (error) {
    console.error('[Service Worker] Sync flashcards failed:', error);
  }
}

async function syncChatHistory() {
  try {
    const pendingChats = await getFromIndexedDB('pending-chats');
    if (pendingChats && pendingChats.length > 0) {
      console.log('[Service Worker] Syncing chat history:', pendingChats.length);
      // Implementation depends on your backend
    }
  } catch (error) {
    console.error('[Service Worker] Sync chat history failed:', error);
  }
}

// IndexedDB helper (simplified)
function getFromIndexedDB(storeName) {
  return new Promise((resolve, reject) => {
    // This is a simplified version
    // In production, implement proper IndexedDB operations
    resolve([]);
  });
}

console.log('[Service Worker] Loaded');
