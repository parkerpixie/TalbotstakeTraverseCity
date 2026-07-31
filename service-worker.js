const CACHE='talbots-tc-v12';
const CORE=['/','/index.html','/styles.css','/planner-upgrades.css','/app.js','/presentation-polish.js','/gallery-correction.js','/debut-upgrades.js','/debut-upgrades.css','/house-final-upgrades.js','/room-selection-gallery.css','/navigation-ux.js','/navigation-ux.css','/discover-field-guide.js','/discover-field-guide.css','/choose-explorer.js','/choose-explorer.css','/your-adventure.js','/your-adventure.css','/places-hub.js','/places-hub.css','/favorite-attribution.js','/favorite-attribution.css','/manifest.webmanifest','/app-icon.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  event.respondWith(fetch(event.request).then(response=>{
    const copy=response.clone();
    caches.open(CACHE).then(cache=>cache.put(event.request,copy));
    return response;
  }).catch(()=>caches.match(event.request).then(hit=>hit||caches.match('/index.html'))));
});
