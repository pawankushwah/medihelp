const CACHE_NAME = 'medihelp-cache-v1';

// Add standard assets to cache
const URLS_TO_CACHE = [
  '/',
  '/auth',
  '/manifest.json',
  '/favicon.ico',
  '/hero.png',
  '/auth.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Simple network-first strategy
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Optional: Cache new requests here
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
