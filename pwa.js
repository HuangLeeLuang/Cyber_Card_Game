(() => {
  if (!("serviceWorker" in navigator) || location.protocol === "file:") return;

  const state = {
    online: navigator.onLine,
    controlled: Boolean(navigator.serviceWorker.controller),
    cached: 0,
    total: 0,
    failures: 0,
    version: "",
    preparing: false,
  };

  createOfflinePanel();
  bindOfflineEvents();
  registerOfflineApp();

  async function registerOfflineApp() {
    try {
      const registration = await navigator.serviceWorker.register("./service-worker.js", {
        scope: "./",
        updateViaCache: "none",
      });
      await navigator.serviceWorker.ready;
      state.controlled = Boolean(navigator.serviceWorker.controller);
      registration.addEventListener("updatefound", renderOfflinePanel);
      requestCacheStatus();
      renderOfflinePanel();
    } catch (error) {
      showOfflineStatus(`離線功能註冊失敗：${error?.name || "請重新整理"}`, "error");
    }
  }

  function bindOfflineEvents() {
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      state.controlled = Boolean(navigator.serviceWorker.controller);
      requestCacheStatus();
      renderOfflinePanel();
    });

    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data?.type === "CACHE_STATUS" || event.data?.type === "OFFLINE_READY") {
        state.cached = event.data.count || 0;
        state.total = event.data.total || 0;
        state.failures = event.data.failures || 0;
        state.version = event.data.version || "";
        state.preparing = false;
        renderOfflinePanel();
        if (event.data.type === "OFFLINE_READY") {
          showOfflineStatus(
            state.failures ? `有 ${state.failures} 個檔案下載失敗，請保持連線再試一次` : "完整離線資料已準備完成",
            state.failures ? "error" : "ready",
          );
        }
      }
    });

    window.addEventListener("online", () => {
      state.online = true;
      renderOfflinePanel();
    });
    window.addEventListener("offline", () => {
      state.online = false;
      renderOfflinePanel();
    });
  }

  function requestCacheStatus() {
    navigator.serviceWorker.controller?.postMessage({ type: "CACHE_STATUS" });
  }

  function prepareOffline() {
    if (!navigator.serviceWorker.controller) {
      showOfflineStatus("離線功能尚未接管本頁，請保持連線並重新整理一次", "error");
      return;
    }
    state.preparing = true;
    renderOfflinePanel();
    showOfflineStatus("正在下載完整離線資料，請保持本頁開啟…", "loading");
    navigator.serviceWorker.controller.postMessage({ type: "PREPARE_OFFLINE" });
  }

  function createOfflinePanel() {
    const panel = document.createElement("aside");
    panel.id = "offlineInstallPanel";
    panel.className = "offline-install-panel";
    panel.setAttribute("aria-live", "polite");
    panel.innerHTML = `
      <button class="offline-panel-close" type="button" aria-label="關閉離線安裝面板">×</button>
      <strong>iPhone 離線遊玩</strong>
      <span class="offline-panel-status"></span>
      <button class="offline-prepare-button" type="button">準備完整離線資料</button>
    `;
    panel.querySelector(".offline-prepare-button").addEventListener("click", prepareOffline);
    panel.querySelector(".offline-panel-close").addEventListener("click", () => panel.remove());
    document.body.appendChild(panel);
    renderOfflinePanel();
  }

  function renderOfflinePanel() {
    const panel = document.querySelector("#offlineInstallPanel");
    if (!panel) return;
    const complete = state.controlled && state.total > 0 && state.cached >= state.total && state.failures === 0;
    const status = panel.querySelector(".offline-panel-status");
    const button = panel.querySelector(".offline-prepare-button");
    if (state.preparing) {
      status.textContent = "正在下載，請勿關閉 Safari…";
    } else if (complete) {
      status.textContent = `完整離線已就緒 · ${state.cached} 個檔案`;
    } else if (!state.online) {
      status.textContent = `目前離線 · 已快取 ${state.cached || "部分"} 個檔案`;
    } else if (!state.controlled) {
      status.textContent = "請重新整理一次，讓離線功能接管頁面";
    } else {
      status.textContent = `已快取 ${state.cached} / ${state.total || "?"} 個檔案`;
    }
    panel.dataset.ready = complete ? "true" : "false";
    button.disabled = state.preparing || !state.online;
    button.textContent = complete ? "重新檢查離線資料" : "準備完整離線資料";
  }

  function showOfflineStatus(message, statusState) {
    let notice = document.querySelector("#offlineReadyToast");
    if (!notice) {
      notice = document.createElement("div");
      notice.id = "offlineReadyToast";
      notice.className = "offline-ready-toast";
      notice.setAttribute("role", "status");
      document.body.appendChild(notice);
    }
    notice.dataset.state = statusState;
    notice.textContent = message;
    window.clearTimeout(showOfflineStatus.timer);
    if (statusState === "ready") showOfflineStatus.timer = window.setTimeout(() => notice.remove(), 9000);
  }
})();
