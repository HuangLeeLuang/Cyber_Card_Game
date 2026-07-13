const CACHE_NAME = "cyber-card-game-v1";
const OFFLINE_ASSETS = [
  "./",
  "./index.html",
  "./modifier.html",
  "./story.html",
  "./guide.html",
  "./styles.css",
  "./styles.css?v=mobile-gauntlets-20260713",
  "./script.js?v=unit-balance-webp-20260713",
  "./modifier.js?v=webp-20260713",
  "./story.js",
  "./pwa.js",
  "./manifest.webmanifest",
  "./assets/app-icon-180.png",
  "./assets/app-icon-192.png",
  "./assets/app-icon-512.png",
  "./assets/card-back.svg",
  "./assets/cyber-city.svg",
  "./assets/card-art-atlas.webp",
  "./assets/card-art-atlas-2.webp",
  "./assets/card-art-atlas-3.webp",
  "./assets/card-art-atlas-4.webp",
  "./assets/card-art-atlas-5.webp",
  "./assets/story-clear-atlas.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type === "opaque") return response;
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => {
          if (event.request.mode === "navigate") return caches.match("./index.html");
          return Response.error();
        });
    }),
  );
});
