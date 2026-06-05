'use strict';

// ── Version hier bei jedem Deploy auf die neue ?v=... anpassen ──
const CACHE_NAME = 'fp-20260605b';

const SHELL = [
  './',
  './index.html',
  './style.css?v=20260526f',
  './store.js?v=20260526f',
  './app.js?v=20260526f',
];

// Beim Installieren: App-Shell vorläufig cachen
self.addEventListener('install', evt => {
  evt.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

// Beim Aktivieren: alte Caches löschen
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch-Strategie: Cache-First für App-Shell, Network-Only für API/CDN
self.addEventListener('fetch', evt => {
  if (evt.request.method !== 'GET') return;
  const url = evt.request.url;

  // GitHub API und externe CDNs: nie cachen, immer netzwerk
  if (
    url.includes('api.github.com') ||
    url.includes('cdn.jsdelivr.net') ||
    url.includes('unpkg.com')
  ) return;

  evt.respondWith(
    caches.match(evt.request).then(cached => {
      if (cached) return cached;
      return fetch(evt.request).then(resp => {
        if (resp && resp.status === 200 && resp.type !== 'opaque') {
          caches.open(CACHE_NAME).then(c => c.put(evt.request, resp.clone()));
        }
        return resp;
      }).catch(() => {
        // Bei Navigationsanfragen: gecachte index.html als Fallback
        if (evt.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
