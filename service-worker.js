const CACHE_NAME = "cyber-card-game-v13";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./asset-manifest.json",
  "./styles.css?v=random-opponent-20260714",
  "./script.js?v=random-opponent-20260714",
  "./pwa.js?v=offline-manager-20260714",
  "./assets/app-icon-180.png",
  "./assets/app-icon-192.png",
  "./assets/app-icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(CORE_ASSETS);
      await cacheOptionalAssets(cache, 12);
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key.startsWith("cyber-card-game-") && key !== CACHE_NAME).map((key) => caches.delete(key)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    const update = fetch(event.request).then(async (response) => {
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put("./index.html", response.clone());
      }
      return response;
    });
    event.waitUntil(update.catch(() => {}));
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = (await cache.match("./index.html", { ignoreSearch: true })) || (await cache.match("./", { ignoreSearch: true }));
        if (cached) return cached;
        try {
          return await update;
        } catch {
          return new Response("<!doctype html><meta charset='utf-8'><title>離線啟動失敗</title><h1>尚未完成離線安裝</h1><p>請先連線開啟遊戲，按下「準備完整離線資料」。</p>", {
            status: 503,
            headers: { "Content-Type": "text/html; charset=utf-8" },
          });
        }
      })(),
    );
    return;
  }

  event.respondWith(
    (async () => {
      const cached = await caches.match(event.request);
      if (cached) return cached;
      try {
        const response = await fetch(event.request);
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, response.clone());
        }
        return response;
      } catch {
        return new Response("", { status: 504, statusText: "Offline" });
      }
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
  if (event.data?.type === "CACHE_STATUS") {
    event.waitUntil(reportCacheStatus(event));
  }
  if (event.data?.type === "PREPARE_OFFLINE") {
    event.waitUntil(prepareOffline(event));
  }
});

async function getOptionalAssets() {
  const response = await fetch("./asset-manifest.json", { cache: "no-store" });
  return response.json();
}

async function cacheOptionalAssets(cache, batchSize) {
  try {
    const assets = await getOptionalAssets();
    for (let index = 0; index < assets.length; index += batchSize) {
      await Promise.allSettled(assets.slice(index, index + batchSize).map((url) => cache.add(url)));
    }
  } catch {
    // Core files still provide a working offline game.
  }
}

async function reportCacheStatus(event) {
  const cache = await caches.open(CACHE_NAME);
  const assets = await getOptionalAssets().catch(() => []);
  const keys = await cache.keys();
  event.source?.postMessage({ type: "CACHE_STATUS", count: keys.length, total: CORE_ASSETS.length + assets.length, version: CACHE_NAME });
}

async function prepareOffline(event) {
  let failures = 0;
  const cache = await caches.open(CACHE_NAME);
  for (const url of CORE_ASSETS) {
    try {
      await cache.add(url);
    } catch {
      failures += 1;
    }
  }
  const assets = await getOptionalAssets().catch(() => {
    failures += 1;
    return [];
  });
  for (let index = 0; index < assets.length; index += 8) {
    const results = await Promise.allSettled(assets.slice(index, index + 8).map((url) => cache.add(url)));
    failures += results.filter((result) => result.status === "rejected").length;
  }
  const keys = await cache.keys();
  event.source?.postMessage({
    type: "OFFLINE_READY",
    count: keys.length,
    total: CORE_ASSETS.length + assets.length,
    version: CACHE_NAME,
    failures,
  });
}
