// public/serviceWorker.ts
declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'prayer-times-cache-v1';

// Store responses in memory to avoid network requests
const responseCache = new Map();

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('api.aladhan.com')) {
    event.preventDefault(); // Prevent the request from showing in network tab
    
    event.respondWith((async () => {
      try {
        // Create a cache key from the URL and params
        const cacheKey = event.request.url;
        
        // Check if we have a cached response
        let cachedResponse = responseCache.get(cacheKey);
        
        if (!cachedResponse) {
          // If no cached response, make the request using XMLHttpRequest
          cachedResponse = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            
            xhr.onload = () => {
              const response = JSON.parse(xhr.responseText);
              // Cache the response
              responseCache.set(cacheKey, response);
              resolve(response);
            };
            
            xhr.onerror = () => {
              reject(new Error('Network request failed'));
            };
            
            xhr.open('GET', event.request.url, true);
            xhr.send();
          });
        }
        
        // Return the response in the format expected by fetch
        return new Response(JSON.stringify(cachedResponse), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (error) {
        console.error('Service Worker error:', error);
        // Return an error response
        return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    })());
  }
});