'use strict';

// Netz-Zeitlimit für App-Dateien, danach gilt die gespeicherte Fassung
const NET_TIMEOUT_MS = 3000;

// ── Version hier bei jedem Deploy auf die neue ?v=... anpassen ──
const CACHE_NAME = 'fp-20261025e';

// Bewusst OHNE ?v-Marker: Für JS/CSS gilt unten Network-First (echte Version kommt immer
// frisch aus dem Netz + wird unter ihrer ?v-URL gecacht). Der SHELL-Precache ist nur der
// allererste Offline-Fallback → muss nicht pro Deploy gepflegt werden (war früher veraltet).
const SHELL = [
  './',
  './index.html',
  './style.css',
  './store.js',
  './app.js',
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

  // Gecacht wird NUR, was ausdrücklich erlaubt ist (Allowlist statt Denylist, Paket 4):
  // eigene Dateien und Google Fonts. Alles andere — Azure-Blob (Finanzdaten), Kurs-APIs,
  // Alpha Vantage (Key in der URL) — geht immer direkt ans Netz und landet nie im Cache.
  const host = new URL(url).host;
  if (host !== self.location.host && host !== 'fonts.googleapis.com' && host !== 'fonts.gstatic.com') return;

  // App-Shell (HTML/JS/CSS + Navigation): NETWORK-FIRST — online immer frischer Code,
  // Cache nur als Offline-Fallback. Verhindert, dass alte Versionen "kleben bleiben".
  const isShell = evt.request.mode === 'navigate' || /\.(?:js|css|html)(?:\?|$)/.test(url);
  if (isShell) {
    // Zeitlimit: Bei schlechtem Netz (Funkloch, Zug) nach NET_TIMEOUT_MS die gespeicherte Fassung nehmen —
    // der Abruf läuft weiter und aktualisiert den Cache für den nächsten Start. Ohne Cache-Treffer
    // wird auf das Netz gewartet. Cache-Schlüssel enthält ?v=, also nie altes JS zu neuem HTML.
    const net = fetch(evt.request).then(resp => {
      if (resp && resp.status === 200 && resp.type !== 'opaque') {
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(c => c.put(evt.request, clone));
      }
      return resp;
    });
    evt.respondWith(
      caches.match(evt.request)
        .then(c => c || (evt.request.mode === 'navigate' ? caches.match('./index.html') : undefined))
        .then(cached => {
          if (!cached) return net;
          const timeout = new Promise(r => setTimeout(() => r(null), NET_TIMEOUT_MS));
          return Promise.race([net, timeout]).then(r => r || cached, () => cached);
        })
    );
    net.catch(() => {});   // Fehler im Hintergrund nicht als unbehandelt melden
    return;
  }

  // Sonstiges (Bilder etc.): cache-first
  evt.respondWith(
    caches.match(evt.request).then(cached => {
      if (cached) return cached;
      return fetch(evt.request).then(resp => {
        if (resp && resp.status === 200 && resp.type !== 'opaque') {
          caches.open(CACHE_NAME).then(c => c.put(evt.request, resp.clone()));
        }
        return resp;
      }).catch(() => {
        if (evt.request.mode === 'navigate') return caches.match('./index.html');
      });
    })
  );
});
