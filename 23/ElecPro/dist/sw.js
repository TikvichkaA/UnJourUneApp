const CACHE_NAME = 'elecpro-offline-v4';

// Chemins relatifs pour fonctionner sur n'importe quel hébergement
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './vite.svg',
  './assets/index-Qv5vnTPI.css',
  './assets/index-CfYZG41o.js',
  './icons/icon-72x72.png',
  './icons/icon-96x96.png',
  './icons/icon-128x128.png',
  './icons/icon-144x144.png',
  './icons/icon-152x152.png',
  './icons/icon-192x192.png',
  './icons/icon-384x384.png',
  './icons/icon-512x512.png'
];

// Installation du service worker - pré-charge tout
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('ElecPro: Téléchargement hors-ligne...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('ElecPro: Prêt pour le mode hors-ligne!');
        self.skipWaiting();
      })
      .catch((err) => {
        console.error('ElecPro: Erreur de cache', err);
      })
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

// Stratégie Cache First pour le mode hors-ligne
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Si en cache, utilise le cache
        if (cachedResponse) {
          return cachedResponse;
        }

        // Sinon, fetch depuis le réseau et met en cache
        return fetch(event.request)
          .then((response) => {
            // Ne cache que les requêtes GET réussies
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Pour les navigations, retourne index.html
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
          });
      })
  );
});
