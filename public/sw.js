// Self-cleaning Service Worker for Be Coach PWA
// In dev and preview environments, clear old caches and unregister to prevent Vite asset collision.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((k) => caches.delete(k)));
    }).then(() => {
      return self.clients.claim();
    }).then(() => {
      // If running on dev/preview origin, unregister to avoid intercepting Vite dev server assets
      if (typeof self.registration !== 'undefined' && self.registration.unregister) {
        return self.registration.unregister();
      }
    })
  );
});

// Pass-through all requests without aggressive caching in dev mode
self.addEventListener('fetch', () => {
  // Allow network requests to proceed natively
});
