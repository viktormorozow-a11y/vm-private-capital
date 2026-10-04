const CACHE_NAME = 'vm-private-capital-shell-v8.0.3';
const STATIC_ASSETS = [
  './manifest.webmanifest',
  './icons/vm-private-capital-180.png',
  './icons/vm-private-capital-192.png',
  './icons/vm-private-capital-512.png'
];

function staticAssetUrl(asset) {
  return new URL(asset, self.registration.scope).href;
}

self.addEventListener('install', event => {
  const urls = STATIC_ASSETS.map(staticAssetUrl);
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urls)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isSensitiveRequest(request) {
  if (!request || request.method !== 'GET') return true;
  const url = new URL(request.url);
  const host = url.hostname.toLowerCase();
  const path = url.pathname.toLowerCase();
  if (host === 'hlrvwzqwxqmycuttvzbx.supabase.co' || host.endsWith('.supabase.co')) return true;
  if (/\/(auth|rest|storage|realtime)\/v\d+\//.test(path)) return true;
  if (/\b(export|download|backup)\b/.test(path)) return true;
  if (/\.html?$/.test(path)) return true;
  return false;
}

function isExplicitStaticAsset(url) {
  const href = typeof url === 'string' ? url : url.href;
  return STATIC_ASSETS.some(asset => staticAssetUrl(asset) === href);
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (isSensitiveRequest(request)) return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !isExplicitStaticAsset(url)) return;
  event.respondWith(
    caches.match(request).then(hit => hit || fetch(request).then(response => {
      if (!response || !response.ok) return response;
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      return response;
    }))
  );
});
