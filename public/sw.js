// public/sw.js
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

const responseCache = new Map();

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('api.aladhan.com')) {
    event.preventDefault();
    
    event.respondWith((async () => {
      try {
        const cacheKey = event.request.url;
        let cachedResponse = responseCache.get(cacheKey);
        
        if (!cachedResponse) {
          // Create a new request without preflight
          const modifiedRequest = new Request(event.request.url, {
            method: 'GET',
            mode: 'no-cors', // This prevents CORS issues
            cache: 'no-store',
            credentials: 'omit'
          });

          const response = await fetch(modifiedRequest);
          
          // Since we're using no-cors, we need to handle the response differently
          if (!response.ok && response.type === 'opaque') {
            // Make a direct fetch without service worker
            const directResponse = await fetch(event.request.url);
            cachedResponse = await directResponse.json();
          } else {
            cachedResponse = await response.json();
          }
          
          responseCache.set(cacheKey, cachedResponse);
        }
        
        return new Response(JSON.stringify(cachedResponse), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (error) {
        console.error('Service Worker error:', error);
        
        // If service worker fetch fails, try direct fetch
        try {
          const directResponse = await fetch(event.request);
          const data = await directResponse.json();
          return new Response(JSON.stringify(data), {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        } catch (directError) {
          return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }
      }
    })());
  }
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    responseCache.clear();
  }
});