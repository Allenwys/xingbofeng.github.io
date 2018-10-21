var urlsToCache = [
  '/',
  '/index.js',
  '/style.css',
  '/favicon.ico',
  '/sw-register.js',
  '/manifest.json',
];

var CACHE_NAME = 'counterxing_blog_v1';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function(cache) {
      return cache.addAll(urlsToCache);
    }).then(function() {
      self.skipWaiting();
    })
  )
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
    .then(function(response) {
      if (response) {
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
    }).then(function() {
      return self.clients.claim();
    })
  )
});

self.addEventListener('push', function(event) {
  const title = event.data.text();
  const options = {
    body: event.data.text(),
    icon: './images/logo/logo512.png',
    badge: './images/logo/logo512.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('http://http://qm36mmz.xyz/')
  );
});