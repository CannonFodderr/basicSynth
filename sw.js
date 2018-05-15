let cacheName = "synthCach"
let urlsToCache = [
    '/',
    '/class.js',
]

if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js')
    .then((reg)=>{
        console.log(`Service worker registered on ${reg.scope}`);
    }).catch((err)=>{
        console.error(err);
    })
}

self.addEventListener('install', (e)=>{
    e.waitUntil(
        caches.open(cacheName)
        .then((cache)=>{
            cache.addAll(urlsToCache);
            console.log('Added urls to cache');
        })
    )
})