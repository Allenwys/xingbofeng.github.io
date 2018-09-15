var urlsToCache = [
  '/',
  '/index.js',
  '/style.css',
  '/favicon.ico',
];

var CACHE_NAME = 'counterxing_blog_v1';

self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
    .then(function(response) {
      if (response) {
        console.log(response);
        return response;
      }
      return fetch(event.request);
    })
  );
});


self.addEventListener('activate', function(event) {
  var cacheWhitelist = ['counterxing_blog_v1'];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
