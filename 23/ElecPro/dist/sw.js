const CACHE_NAME = 'elecpro-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/vite.svg'
];

// Installation du service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Stratégie de cache: Network First avec fallback sur cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone la réponse car elle ne peut être utilisée qu'une fois
        const responseClone = response.clone();

        caches.open(CACHE_NAME)
          .then((cache) => {
            // Ne cache que les requêtes GET réussies
            if (event.request.method === 'GET' && response.status === 200) {
              cache.put(event.request, responseClone);
            }
          });

        return response;
      })
      .catch(() => {
        // Si le réseau échoue, essaye le cache
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            // Page hors ligne par défaut pour les navigations
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
          });
      })
  );
});
