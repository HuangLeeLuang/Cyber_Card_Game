(() => {
  if (!("serviceWorker" in navigator) || location.protocol === "file:") return;

  registerOfflineApp();

  async function registerOfflineApp() {
    try {
      await navigator.serviceWorker.register("./service-worker.js", {
        scope: "./",
        updateViaCache: "none",
      });
      await navigator.serviceWorker.ready;
      showOfflineReady();
    } catch {
      // The game remains playable online if offline registration is unavailable.
    }
  }

  function showOfflineReady() {
    if (sessionStorage.getItem("cyberOfflineReadyShown")) return;
    sessionStorage.setItem("cyberOfflineReadyShown", "1");
    const notice = document.createElement("div");
    notice.className = "offline-ready-toast";
    notice.setAttribute("role", "status");
    notice.textContent = "離線模式已就緒";
    document.body.appendChild(notice);
    window.setTimeout(() => notice.remove(), 4200);
  }
})();
