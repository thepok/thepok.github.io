// Endless: a minimal service worker - the app shell and the static engine / composer files, cached per page version
// (sw.js?v=<version>), so a home-screen start is fast. Samples, the bank and Pyodide are left to the browser's HTTP
// cache; nothing else is stored offline.
const Q = new URL(self.location.href).searchParams, V = Q.get('v') || 'dev', A = Q.get('a') || '0';
const CACHE = `endless-${V}-${A}`;
const SHELL = ['./', 'index.html', `app.js?v=${V}&a=${A}`, `compose-worker.js?v=${V}`, `engine-worker.js?v=${V}`,
               `engine/agentsound.js?v=${V}`, `engine/agentsound.wasm?v=${V}`, `py/repo.zip?v=${V}`,
               'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('endless-') && k !== CACHE)
    .map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  const rel = u.pathname.slice(new URL('./', location.href).pathname.length) + u.search;
  if (rel === '' || rel === 'index.html' || rel.startsWith('?') || rel.startsWith('index.html?')) {
    // the page: the network first (a new version shows up at once), the cache when offline / slow to fail
    e.respondWith(fetch(e.request).then((r) => {
      if (r.ok && !u.search) { const copy = r.clone(); caches.open(CACHE).then((c) => c.put('index.html', copy)); }
      return r;
    }).catch(() => caches.match('index.html')));
    return;
  }
  if (SHELL.includes(rel)) e.respondWith(caches.match(rel, { ignoreSearch: false }).then((hit) => hit || fetch(e.request)));
});
