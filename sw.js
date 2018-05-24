let cacheName = "synthCach"
let urlsToCache = [
    '/',
    'scripts/class.js',
    'scripts/base.js',
]
// Check if browser supports service workers
if('serviceWorker' in navigator){
    // Reegister service worker on window scope
    navigator.serviceWorker.register('sw.js')
    .then((reg)=>{
        console.log(`Service worker registered on ${reg.scope}`);
    }).catch((err)=>{
        console.error(err);
    })
}
// add urls to cache
self.addEventListener('install', (e)=>{
    e.waitUntil(
        caches.open(cacheName)
        .then((cache)=>{
            cache.addAll(urlsToCache);
            console.log('Added urls to cache');
        })
    )
})