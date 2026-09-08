// Scoped to this game. Supply the isolation headers required by shared WASM memory
// on static hosts such as GitHub Pages. No caches or user data are stored here.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => {
  if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') return;
  event.respondWith((async () => {
    // Revalidate the entry document on every visit; code chunks have content hashes.
    const response = await fetch(event.request.mode === 'navigate'
      ? new Request(event.request, { cache: 'no-store' }) : event.request);
    if (response.status === 0) return response;
    const headers = new Headers(response.headers);
    if (event.request.mode === 'navigate') headers.set('Cache-Control', 'no-store');
    headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  })());
});
