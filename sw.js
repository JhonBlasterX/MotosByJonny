const CACHE ='cache-1';
const CACHE_DINAMICO ='dinamico-1';
const CACHE_INMUTABLE ='inmutable-1';

self.addEventListener('install', evento=>{

    const promesa =caches.open(CACHE)
        .then(cache=>{
            return cache.addAll([
                '/',
                '/index.html',
                '/cascos.html',
                '/tipos_motos.html',
                '/avances.html',
                '/motores.html',
                '/offline.html',
                '/images/fevicon.png',
                '/css/bootstrap.min.css',
                '/css/style.css',
                '/css/responsive.css',
                '/css/jquery.mCustomScrollbar.min.css',
                '/images/logo.png',
                '/images/about.png',
                '/images/about_bg.jpg',
                '/images/banner2.jpg',
                '/images/jhh.png',
                '/images/up.jpg',
                '/images/gallery1.jpg',
                '/images/gallery2.jpg',
                '/images/gallery3.jpg',
                '/images/gallery4.jpg',
                '/icon/h.png',
                '/js/jquery.min.js',
                '/js/popper.min.js',
                '/js/bootstrap.bundle.min.js',
                '/js/jquery-3.0.0.min.js',
                '/js/plugin.js',
                '/js/jquery.mCustomScrollbar.concat.min.js',
                '/js/custom.js',
                '/js/app.js'

            ]);
        });

    const cacheInmutable = caches.open(CACHE_INMUTABLE)
        .then(cache=>{
            cache.add('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css');
        });
    evento.waitUntil(Promise.all([promesa, cacheInmutable]));
});

self.addEventListener('fetch', evento =>{

    const respuesta=caches.match(evento.request)
        .then(res=>{
            if (res) return res;
            console.log('No existe', evento.request.url);
            return fetch(evento.request)
                .then(resWeb=>{
                    caches.open(CACHE_DINAMICO)
                        .then(cache=>{
                            cache.put(evento.request,resWeb);
                            limpiarCache(CACHE_DINAMICO,50);
                        })
                    return resWeb.clone();
                });
        })
        .catch(err => {
            if(evento.request.headers.get('accept').includes('text/html')){
                return caches.match('/offline.html');
            }
        });
     evento.respondWith(respuesta);
});

function limpiarCache(nombreCache, numeroItems){
    caches.open(nombreCache)
       .then(cache=>{
            return cache.keys()
                .then(keys=>{
                    if (keys.length>numeroItems){
                        cache.delete(keys[0])
                            .then(limpiarCache(nombreCache, numeroItems));
                        }
                    });
        });
}   