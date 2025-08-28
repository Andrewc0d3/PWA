const CACHE_NAME = 'breakout-game-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/game.js',
  '/style.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Instalación del service worker: Caching de los archivos necesarios
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Archivos en caché durante la instalación');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activación del service worker: Elimina caches antiguos
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar las solicitudes de red y servir los archivos desde el caché
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Si el recurso está en caché, devolverlo
        if (cachedResponse) {
          return cachedResponse;
        }

        // Si no está en caché, realizar la solicitud a la red
        return fetch(event.request);
      })
  );
});
