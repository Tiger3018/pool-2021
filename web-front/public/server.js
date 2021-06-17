// https://github.com/gokulkrishh/demo-progressive-web-app
// https://medium.com/james-johnson/a-simple-progressive-web-app-tutorial-f9708e5f2605
//Files to save in cache
var cacheName = "handWriting";

var filesToCache = [
  './',
  './index.html', 
  './index.js',
  './index.css',
  './bootstrap.min.css',
  './demo.png',
  './favicon.svg',
  './preview.svg',
  './manifest.json',
  './server.js',
  '../favicon.svg',
  '../webfonts/fa-solid-900.woff2'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
  // document.getElementById("ver").innerText = "PWA on - version alpha";
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  if (e.request.method === 'GET') {
    e.respondWith(
      caches.open(cacheName).then(function(cache) {
        return cache.match(e.request).then(function(response) {
          if(response == null) {
            return fetch(e.request); /* no cache is no cache! */
          }
          fetch(e.request).then(function(webResponse) {
            cache.put(e.request, webResponse);
          }).catch(function(webResponse){
          });
          return response;
        })
      })
    );
  }
  /* so any POST requests will be handled by default browser actions.*/
});
