// Simple Service Worker - Pass Through All Requests
// This service worker doesn't cache anything and just passes all requests through

self.addEventListener('install', function(event) {
  console.log('Service Worker installing...');
  // Skip waiting to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker activating...');
  // Claim all clients immediately
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
  // Just pass through all requests without caching
  event.respondWith(
    fetch(event.request).catch(function(error) {
      console.error('Fetch failed:', error);
      throw error;
    })
  );
});
