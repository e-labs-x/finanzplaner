'use strict';

// ── Version hier bei jedem Deploy auf die neue ?v=... anpassen ──
const CACHE_NAME = 'fp-20260606d';

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

  // GitHub API, externe CDNs UND Azure-Blob-Sync: nie cachen, immer netzwerk.
  // H3: Azure-Blob ausnehmen — sonst landet das komplette Klartext-Finanzdaten-Backup
  // im SW-Cache und künftige Pulls würden veraltete Daten aus dem Cache bedienen.
  if (
    url.includes('api.github.com') ||
    url.includes('cdn.jsdelivr.net') ||
    url.includes('unpkg.com') ||
    url.includes('.blob.core.windows.net')
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
