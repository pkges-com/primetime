const cacheName = 'my-cache';

const precachedAssets = [
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
    caches.open(cacheName).then((cache) => {
      return cache.addAll(precachedAssets);
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isPrecachedRequest = precachedAssets.includes(url.pathname);

  if (isPrecachedRequest) {
    event.respondWith(
      caches.open(cacheName).then((cache) => {
        return cache.match(event.request.url);
      })
    );
  } else {
    return;
  }
});
