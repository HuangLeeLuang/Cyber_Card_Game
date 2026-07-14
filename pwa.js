(() => {
  if (!("serviceWorker" in navigator) || location.protocol === "file:") return;

  showOfflineStatus("正在準備離線模式…", "loading");
  registerOfflineApp();

  async function registerOfflineApp() {
    try {
      await navigator.serviceWorker.register("./service-worker.js", {
        scope: "./",
        updateViaCache: "none",
      });
      await navigator.serviceWorker.ready;
      showOfflineStatus("離線模式已就緒", "ready");
    } catch (error) {
      showOfflineStatus(`離線模式安裝失敗：${error?.name || "請重新整理"}`, "error");
    }
  }

  function showOfflineStatus(message, state) {
    let notice = document.querySelector("#offlineReadyToast");
    if (!notice) {
      notice = document.createElement("div");
      notice.id = "offlineReadyToast";
      notice.className = "offline-ready-toast";
      notice.setAttribute("role", "status");
      document.body.appendChild(notice);
    }
    notice.dataset.state = state;
    notice.textContent = message;
    window.clearTimeout(showOfflineStatus.timer);
    if (state === "ready") {
      showOfflineStatus.timer = window.setTimeout(() => notice.remove(), 9000);
    }
  }
})();
