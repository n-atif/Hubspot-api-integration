const CACHE_NAME = 'book-app-cache-v1';
const urlsToCache = [
  '/',
  '/css/style.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Failed to cache resources during install:', error);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }

        // Fetch the request from the network
        return fetch(event.request).catch(error => {
          console.error('Failed to fetch resource:', error);

          // Provide fallback responses for specific requests
          if (event.request.url.includes('fonts.googleapis.com')) {
            return new Response('', { status: 200, statusText: 'OK' });
          }

          if (event.request.url.includes('manifest.json')) {
            return new Response(JSON.stringify({
              "name": "Custom Object Table - Books",
              "short_name": "Books",
              "start_url": "/",
              "display": "standalone",
              "background_color": "#ffffff",
              "theme_color": "#000000",
              "icons": [
                {
                  "src": "icons/icon-192x192.png",
                  "sizes": "192x192",
                  "type": "image/png"
                },
                {
                  "src": "icons/icon-512x512.png",
                  "sizes": "512x512",
                  "type": "image/png"
                }
              ]
            }), { headers: { 'Content-Type': 'application/json' } });
          }

          if (event.request.url.includes('favicon.ico')) {
            return new Response('', { status: 200, statusText: 'OK' });
          }

          return new Response('Resource not available offline', {
            status: 404,
            statusText: 'Not Found'
          });
        });
      })
  );
});