// Osmida Production Service Worker (PWA Offline Cache & Web Push)
const CACHE_NAME = 'osmida-static-v2';
const STATIC_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/worker-manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/partner-icon-192x192.png',
  '/icons/partner-icon-512x512.png',
  '/icons/apple-touch-icon.png',
  '/favicon.ico',
];

// Install: Cache core static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('SW pre-cache warning:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: Immediately clean up all older cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('SW deleting legacy cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Stale-while-revalidate for static assets, strictly Network-first for navigations and portals
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip cross-origin or non-GET requests
  if (event.request.method !== 'GET' || !url.origin.includes(self.location.origin)) {
    return;
  }

  // 1. Navigation requests (Opening pages in the browser):
  // Always fetch live from network first so portals (partner, admin, booking) never fail or hang
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        const rootCached = await caches.match('/');
        if (rootCached) return rootCached;
        return new Response('Network error. Please check your connection and reload.', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain' },
        });
      })
    );
    return;
  }

  // 2. Network-first for API routes and dynamic portals
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/partner') ||
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/booking/') ||
    url.pathname.startsWith('/book')
  ) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
    return;
  }

  // 3. Stale-while-revalidate for static assets (images, icons, fonts)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// ---------------------------------------------------------------------------
// WEB PUSH NOTIFICATION DISPATCH (FOR WORKER JOB ALERTS)
// ---------------------------------------------------------------------------
self.addEventListener('push', (event) => {
  let data = {
    title: '🚨 New Osmida Job Alert!',
    body: 'A customer in Nellore needs home service. ₹140 Guaranteed payout.',
    icon: '/icons/partner-icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    url: '/partner',
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      data = { ...data, ...parsed };
    } catch {
      data.body = event.data.text() || data.body;
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icons/partner-icon-192x192.png',
    badge: data.badge || '/icons/icon-192x192.png',
    vibrate: [300, 150, 300, 150, 500],
    data: {
      url: data.url || '/partner',
      timestamp: Date.now(),
    },
    actions: [
      { action: 'open', title: 'Open Job' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
    tag: 'osmida-job-alert',
    renotify: true,
    requireInteraction: true,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification click: Focus or open the worker app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const targetUrl = event.notification.data?.url || '/partner';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
