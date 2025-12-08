const CACHE_NAME = 'nexus-prime-v1';
const ASSETS = [
    './',
    './index.html',
    './api.js',
    './manifest.json',
    'https://unpkg.com/react@18/umd/react.development.js',
    'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
    'https://unpkg.com/@babel/standalone/babel.min.js',
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/lucide-react@0.556.0/dist/umd/lucide-react.js',
    'https://fonts.googleapis.com/css?family=Black+Ops+One&family=Courier+Prime:wght@400;700&display=swap'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (e) => {
    // Stale-while-revalidate strategy for most things
    e.respondWith(
        caches.match(e.request).then((cached) => {
            const fetchPromise = fetch(e.request).then((networkResponse) => {
                // Cache the new response if valid
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const clone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
                }
                return networkResponse;
            }).catch(() => {
                // Fallback?
            });
            return cached || fetchPromise;
        })
    );
});
