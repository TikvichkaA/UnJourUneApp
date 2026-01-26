/**
 * Service Worker for ReVie PWA
 * Enables offline caching and faster load times
 */

const CACHE_NAME = 'revie-v1';
const STATIC_ASSETS = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './manifest.json'
];

const EXTERNAL_ASSETS = [
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css',
    'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching static assets');
                // Cache local assets first
                return cache.addAll(STATIC_ASSETS)
                    .then(() => {
                        // Try to cache external assets (may fail due to CORS)
                        return Promise.allSettled(
                            EXTERNAL_ASSETS.map(url =>
                                cache.add(url).catch(err =>
                                    console.log('Failed to cache:', url)
                                )
                            )
                        );
                    });
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter(name => name !== CACHE_NAME)
                        .map(name => caches.delete(name))
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Handle API requests (always network-first for fresh data)
    if (url.hostname === 'data.ademe.fr') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Cache successful API responses briefly
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME + '-api').then(cache => {
                            cache.put(request, clone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Fall back to cached API response
                    return caches.match(request);
                })
        );
        return;
    }

    // Handle tile requests (cache-first for map tiles)
    if (url.hostname.includes('basemaps.cartocdn.com')) {
        event.respondWith(
            caches.match(request)
                .then((cached) => {
                    if (cached) return cached;

                    return fetch(request)
                        .then((response) => {
                            if (response.ok) {
                                const clone = response.clone();
                                caches.open(CACHE_NAME + '-tiles').then(cache => {
                                    cache.put(request, clone);
                                });
                            }
                            return response;
                        });
                })
        );
        return;
    }

    // Handle static assets (cache-first)
    event.respondWith(
        caches.match(request)
            .then((cached) => {
                if (cached) {
                    // Return cached version but update in background
                    fetch(request).then((response) => {
                        if (response.ok) {
                            caches.open(CACHE_NAME).then(cache => {
                                cache.put(request, response);
                            });
                        }
                    }).catch(() => {});

                    return cached;
                }

                return fetch(request)
                    .then((response) => {
                        if (response.ok && url.origin === self.location.origin) {
                            const clone = response.clone();
                            caches.open(CACHE_NAME).then(cache => {
                                cache.put(request, clone);
                            });
                        }
                        return response;
                    });
            })
    );
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});
