const CACHE_NAME = 'my-cache';

const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/static/11.png',
  '/static/12.png',
  '/static/13.png',
  '/static/pop-corn.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(
        urlsToCache.map(
          (url) => new Request(url, { credentials: 'same-origin' })
        )
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      // If not found in cache, fetch from network and cache for future use
      return fetch(event.request)
        .then((response) => {
          // Cache only successful responses
          if (
            !response ||
            response.status !== 200 ||
            response.type !== 'basic'
          ) {
            return response;
          }

          const responseToCache = response.clone();

          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseToCache));

          return response;
        })
        .catch(() => {
          // Return offline page or fallback if network request fails
          return caches.match('/offline.html');
        });
    })
  );
});
