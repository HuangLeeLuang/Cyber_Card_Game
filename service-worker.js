const CACHE_VERSION = "cyber-card-game-v15";
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./asset-manifest.json",
  "./styles.css?v=iphone-offline-20260714",
  "./script.js?v=weapon-target-fix-20260714",
  "./pwa.js?v=guide-offline-20260714",
  "./assets/app-icon-home-180.png?v=20260714",
  "./assets/app-icon-192.png",
  "./assets/app-icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_VERSION);
      await cache.addAll(CORE);
      try {
        const assets = await loadAssetManifest();
        await cacheInBatches(cache, assets, 12);
      } catch (error) {
        console.warn("Optional asset precache incomplete", error);
      }
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key.startsWith("cyber-card-game-") && key !== CACHE_VERSION).map((key) => caches.delete(key)));
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
        const cache = await caches.open(CACHE_VERSION);
        await cache.put(event.request, response.clone());
        if (url.pathname.endsWith("/") || url.pathname.endsWith("/index") || url.pathname.endsWith("/index.html")) {
          await cache.put("./index.html", response.clone());
        }
      }
      return response;
    });
    event.waitUntil(update.catch(() => {}));
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_VERSION);
        const cached =
          (await cache.match(event.request, { ignoreSearch: true })) ||
          (await cache.match("./index.html", { ignoreSearch: true })) ||
          (await cache.match("./", { ignoreSearch: true }));
        if (cached) return cached;
        try {
          return await update;
        } catch {
          return new Response(
            "<!doctype html><html lang='zh-Hant'><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>離線啟動失敗</title><body style='font-family:sans-serif;background:#07111d;color:#edf8ff;padding:24px'><h1>遊戲尚未完成離線安裝</h1><p>請恢復網路，用 Safari 開啟遊戲，前往「攻略 → iPhone 離線遊玩」，按下「準備完整離線資料」，等待顯示完整離線已就緒後再試一次。</p></body></html>",
            { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } },
          );
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
          const cache = await caches.open(CACHE_VERSION);
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
  if (event.data?.type === "CACHE_STATUS") event.waitUntil(reportStatus(event, "CACHE_STATUS"));
  if (event.data?.type === "PREPARE_OFFLINE") event.waitUntil(prepareOffline(event));
});

async function loadAssetManifest() {
  const response = await fetch("./asset-manifest.json", { cache: "no-store" });
  if (!response.ok) throw new Error("Asset manifest unavailable");
  return response.json();
}

async function cacheInBatches(cache, assets, batchSize) {
  const results = [];
  for (let index = 0; index < assets.length; index += batchSize) {
    results.push(...(await Promise.allSettled(assets.slice(index, index + batchSize).map((url) => cache.add(url)))));
  }
  return results;
}

async function inspectCache(cache, assets) {
  const urls = [...new Set([...CORE, ...assets])];
  const matches = await Promise.all(urls.map((url) => cache.match(url, { ignoreSearch: false })));
  return { count: matches.filter(Boolean).length, total: urls.length, missing: matches.filter((match) => !match).length };
}

async function reportStatus(event, type, failures = 0) {
  const cache = await caches.open(CACHE_VERSION);
  const assets = await loadAssetManifest().catch(() => []);
  const status = await inspectCache(cache, assets);
  event.source?.postMessage({ type, ...status, failures: failures + status.missing, version: CACHE_VERSION });
}

async function prepareOffline(event) {
  let failures = 0;
  const cache = await caches.open(CACHE_VERSION);
  for (const url of CORE) {
    try {
      await cache.add(url);
    } catch {
      failures += 1;
    }
  }
  const assets = await loadAssetManifest().catch(() => {
    failures += 1;
    return [];
  });
  const results = await cacheInBatches(cache, assets, 8);
  failures += results.filter((result) => result.status === "rejected").length;
  await reportStatus(event, "OFFLINE_READY", failures);
}
