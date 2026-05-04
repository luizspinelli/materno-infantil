// Service worker para "Monte o Prato do Bebê"
// Faz cache do app shell e dos ícones do OpenMoji para funcionar offline.

const VERSION = "v2";
const APP_CACHE = `monte-o-prato-app-${VERSION}`;
const ICONS_CACHE = `monte-o-prato-icons-${VERSION}`;

const APP_SHELL = ["/", "/manifest.json", "/icon-192.svg", "/icon-512.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(APP_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== APP_CACHE && k !== ICONS_CACHE)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Imagens do OpenMoji — cache first, fallback rede
  if (url.hostname === "cdn.jsdelivr.net" && url.pathname.includes("/openmoji@")) {
    event.respondWith(cacheFirst(ICONS_CACHE, req));
    return;
  }

  // App shell em mesma origem — network first, fallback cache
  if (url.origin === self.location.origin) {
    event.respondWith(networkFirst(APP_CACHE, req));
  }
});

async function cacheFirst(cacheName, req) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch {
    return cached || Response.error();
  }
}

async function networkFirst(cacheName, req) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(req);
    if (res.ok && req.method === "GET") cache.put(req, res.clone());
    return res;
  } catch {
    const cached = await cache.match(req);
    if (cached) return cached;
    if (req.mode === "navigate") {
      const fallback = await cache.match("/");
      if (fallback) return fallback;
    }
    return Response.error();
  }
}
