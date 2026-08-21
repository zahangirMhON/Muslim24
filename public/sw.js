// Islamic Life 24/7 Service Worker for Progressive Web App (PWA), Offline Mode & Lockscreen Device Push Notifications
const CACHE_NAME = 'islamic-life-247-v3';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.svg',
  '/icon-512.svg'
];

let lastAmalOverview = {
  percent: 0,
  remainingTasksCount: 0,
  date: ''
};

let lockscreenConfig = {
  enabled: true,
  vibrate: true,
  sound: true
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.log('ServiceWorker install asset cache note:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch handler: Network First with Cache Fallback for dynamic content, Cache First for Static Assets
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = event.request.url;

  // Skip Vite HMR, WebSockets & extensions
  if (url.includes('/@vite/') || url.includes('ws://') || url.includes('wss://') || url.startsWith('chrome-extension:')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html');
          }
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// Listen for messages from client application
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'UPDATE_AMAL_PROGRESS') {
    if (event.data.overview) {
      lastAmalOverview = event.data.overview;
    }
    if (event.data.config) {
      lockscreenConfig = event.data.config;
    }
  }

  if (event.data.type === 'TRIGGER_LOCKSCREEN_NOTIFICATION') {
    const title = event.data.title || '📿 আমল প্রগ্রেস রিমাইন্ডার';
    const body = event.data.body || 'আপনার আজকের আমল সম্পন্ন করুন।';
    showLockscreenNotification(title, body, event.data.tag || 'amal-reminder');
  }
});

// Helper to show lock-screen system notification
function showLockscreenNotification(title, body, tag = 'amal-alert') {
  const options = {
    body,
    icon: '/icon-192.svg',
    badge: '/icon-192.svg',
    tag,
    renotify: true,
    requireInteraction: true,
    vibrate: lockscreenConfig.vibrate ? [300, 100, 300, 100, 300] : undefined,
    data: {
      url: '/',
      timestamp: Date.now()
    }
  };

  return self.registration.showNotification(title, options);
}

// Notification Click Handler: Focus or open app window directly on the Amal / Home tab
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.postMessage({ type: 'OPEN_AMAL_TAB' });
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

// Push Event listener for remote / web push notifications
self.addEventListener('push', (event) => {
  let data = {
    title: '🌙 ইসলামিক লাইফ ২৪/৭ - আমল রিমাইন্ডার',
    body: 'আজকের নামাজের ওয়াক্ত ও আমল প্রগ্রেস সম্পন্ন করুন।'
  };

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    if (event.data) {
      data.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.svg',
      badge: '/icon-192.svg',
      vibrate: [300, 100, 300, 100, 300],
      requireInteraction: true,
      tag: 'islamic-remote-push',
      renotify: true
    })
  );
});

// Periodic Background Sync (when supported by browser)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'islamic-amal-sync') {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'TRIGGER_AMAL_CHECK' });
        });
      })
    );
  }
});
