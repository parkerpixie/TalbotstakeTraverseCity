const CACHE='talbots-tc-v36';
const BASE=self.registration.scope;
const CORE=[
  '',
  'index.html',
  'styles.css',
  'planner-upgrades.css',
  'app.js',
  'presentation-polish.js',
  'presentation-polish.css',
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
  'compact-rating-grid.css',
  'favorite-attribution.js',
  'favorite-attribution.css',
  'heart-rating-dashboard.css',
  'adventure-rating-clarity.js',
  'adventure-rating-clarity.css',
  'desktop-rating-fix.js',
  'desktop-rating-fix.css',
  'rating-visibility.js',
  'rating-visibility.css',
  'rating-flow-fix.js',
  'family-rating-queue.js',
  'family-rating-queue.css',
  'install-guide.js',
  'install-guide.css',
  'completion-polish.css',
  'brand-final.js',
  'brand-final.css',
  'brand-opening-fix.js',
  'brand-opening-fix.css',
  'manifest.webmanifest?v=20260803-4',
  '02-tttc-icon-only-q-transparent-1600x1600.png',
  '03-tttc-favicon-master-q-transparent-256x256.png',
  '05-tttc-monogram-t3c-transparent-1200x1200.png',
  '06-tttc-badge-circular-transparent-1600x1600.png',
  '07-tttc-app-icon-full-bleed-1024x1024.png?v=20260803-4',
  '08-tttc-social-avatar-q-transparent-1200x1200.png',
  '10-tttc-logo-horizontal-light-background-2400x800.png',
  '11-tttc-mascot-scene-transparent-2400x1400.png',
  'tttc-pwa-icon-192x192.png?v=20260803-4',
  'tttc-pwa-icon-512x512.png?v=20260803-4',
  'tttc-maskable-icon-512x512.png?v=20260803-4',
  'tttc-mani-michigan-guide-transparent-1536x1024.png',
  'tttc-mani-west-bay-scene-transparent-1536x1024.png'
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