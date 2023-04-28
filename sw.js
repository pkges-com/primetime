const CACHE_NAME = 'my-cache';

const urlsToCache = ['/', '/index.html', '/static/*.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
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
