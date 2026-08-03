const CACHE='talbots-tc-v23';
const BASE=self.registration.scope;
const CORE=[
  '',
  'index.html',
  'styles.css',
  'planner-upgrades.css',
  'app.js',
  'presentation-polish.js',
  'gallery-correction.js',
  'debut-upgrades.js',
  'debut-upgrades.css',
  'house-final-upgrades.js',
  'room-selection-gallery.css',
  'room-ranking.css',
  'navigation-ux.js',
  'navigation-ux.css',
  'discover-field-guide.js',
  'discover-field-guide.css',
  'choose-explorer.js',
  'choose-explorer.css',
  'missing-places-restoration.js',
  'your-adventure.js',
  'your-adventure.css',
  'places-hub.js',
  'places-hub.css',
  'favorite-attribution.js',
  'favorite-attribution.css',
  'heart-rating-dashboard.css',
  'adventure-rating-clarity.js',
  'adventure-rating-clarity.css',
  'desktop-rating-fix.js',
  'desktop-rating-fix.css',
  'brand-refresh.js',
  'brand-refresh.css',
  'manifest.webmanifest',
  'tttc-icon-only-t3c-otter-transparent-1600x1600.png',
  'tttc-mascot-lockup-full-color-transparent-2400x1400.png',
  'tttc-pattern-ecosystem-transparent-2400x1200.png',
  'tttc-swoosh-divider-transparent-1800x400.png',
  'tttc-watermark-transparent-1600x1600.png',
  'tttc-pwa-icon-192x192.png',
  'tttc-pwa-icon-512x512.png',
  'tttc-maskable-icon-512x512.png',
  'tttc-apple-touch-icon-180x180.png',
  'tttc-favicon-transparent-32x32.png',
  'tttc-favicon-transparent-16x16.png',
  'tttc-favicon.ico'
].map(path=>new URL(path,BASE).href);
const FALLBACK=new URL('index.html',BASE).href;
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  event.respondWith(fetch(event.request).then(response=>{
    const copy=response.clone();
    caches.open(CACHE).then(cache=>cache.put(event.request,copy));
    return response;
  }).catch(()=>caches.match(event.request).then(hit=>hit||caches.match(FALLBACK))));
});