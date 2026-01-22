// Very small service worker to cache core assets (for PWA install / offline)
const CACHE = 'vanmap-v1';
const ASSETS = [
  './',
  './index.html',
  './markers.json',
  './manifest.json',
  // add other assets you want cached (icons, css, js)
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(res => res || fetch(event.request)));
});