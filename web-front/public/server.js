// https://github.com/gokulkrishh/demo-progressive-web-app
// https://medium.com/james-johnson/a-simple-progressive-web-app-tutorial-f9708e5f2605
//Files to save in cache
var cacheName = "handWriting";

var filesToCache = [
  './',
  './index.html', 
  './index.js',
  './index.css',
  './bootstrap.css',
  './demo.png',
  './favicon.svg',
  './preview.svg',
  './manifest.json',
  './server.js',
  '../favicon.svg',
  './new.svg'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});