const CACHE_NAME = 'poi-explorer-v5';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Install: cache app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first for API/tiles, cache-first for app shell
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Network-first for map tiles and geocoding
  if (url.hostname.includes('tile.openstreetmap.org') ||
      url.hostname.includes('nominatim.openstreetmap.org')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache tiles for offline use
          if (url.hostname.includes('tile.openstreetmap.org')) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for app shell
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
