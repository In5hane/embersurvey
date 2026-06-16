// EmberSurvey — offline service worker.
// Cache-first so the app opens on site with no signal. Bump CACHE on every release
// (the version suffix is what makes installed iPads pick up a new build).
// NOTE: keep this version in sync with the <span class="ver"> in index.html's header.
const CACHE = 'ember-survey-v046';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // ignoreSearch: the dev cache-bust query (?v=...) must still hit the cached app
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request))
  );
});
