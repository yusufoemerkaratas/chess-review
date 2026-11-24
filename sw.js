// Caches every file the app needs, so after the first visit it opens and analyzes without internet.
// Bump CACHE when files change; the next visit then picks up the new version.
const CACHE = 'chess-review-v2';
const ASSETS = [
  './',
  'index.html',
  'vendor/chess.min.js',
  'fonts/fonts.css',
  'openings.json',
  'stockfish.js',
  'stockfish-17.1-lite-single-03e3232.js',
  'stockfish-17.1-lite-single-03e3232.wasm',
  'icon.svg',
  'manifest.webmanifest',
  'fonts/Inter-400-latin-ext.woff2',
  'fonts/Inter-400-latin.woff2',
  'fonts/Inter-500-latin-ext.woff2',
  'fonts/Inter-500-latin.woff2',
  'fonts/Inter-600-latin-ext.woff2',
  'fonts/Inter-600-latin.woff2',
  'fonts/Inter-700-latin-ext.woff2',
  'fonts/Inter-700-latin.woff2',
  'fonts/JetBrainsMono-500-latin-ext.woff2',
  'fonts/JetBrainsMono-500-latin.woff2',
  'fonts/JetBrainsMono-700-latin-ext.woff2',
  'fonts/JetBrainsMono-700-latin.woff2',
  'fonts/SpaceGrotesk-500-latin-ext.woff2',
  'fonts/SpaceGrotesk-500-latin.woff2',
  'fonts/SpaceGrotesk-700-latin-ext.woff2',
  'fonts/SpaceGrotesk-700-latin.woff2',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// Serve from cache right away and refresh the cached copy in the background.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async cache => {
    const hit = await cache.match(req, { ignoreSearch: true });
    const net = fetch(req).then(res => { if (res.ok) cache.put(req, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  }));
});
