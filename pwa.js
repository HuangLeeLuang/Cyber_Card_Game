(() => {
  if (!("serviceWorker" in navigator) || location.protocol === "file:") return;

  const state = { online: navigator.onLine, controlled: Boolean(navigator.serviceWorker.controller), cached: 0, total: 0, failures: 0, version: "", preparing: false };
  const panel = document.querySelector("#iphoneOfflinePanel");
  const status = document.querySelector("#offlineStatusText");
  const detail = document.querySelector("#offlineStatusDetail");
  const prepareButton = document.querySelector("#prepareOfflineBtn");
  const refreshButton = document.querySelector("#refreshOfflineBtn");

  prepareButton?.addEventListener("click", prepareOffline);
  refreshButton?.addEventListener("click", refreshOffline);
  navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);
  navigator.serviceWorker.addEventListener("message", handleWorkerMessage);
  window.addEventListener("online", () => updateOnlineState(true));
  window.addEventListener("offline", () => updateOnlineState(false));
  registerPwa();
  renderStatus();

  async function registerPwa() {
    try {
      const registration = await navigator.serviceWorker.register("./service-worker.js", { scope: "./", updateViaCache: "none" });
      await navigator.serviceWorker.ready;
      state.controlled = Boolean(navigator.serviceWorker.controller);
      registration.addEventListener("updatefound", renderStatus);
      requestStatus();
      renderStatus();
    } catch (error) {
      if (status) status.textContent = `離線功能註冊失敗：${error?.name || "請重新整理"}`;
      panel?.setAttribute("data-state", "error");
    }
  }

  function handleControllerChange() {
    state.controlled = Boolean(navigator.serviceWorker.controller);
    requestStatus();
    renderStatus();
  }

  function handleWorkerMessage(event) {
    if (event.data?.type !== "CACHE_STATUS" && event.data?.type !== "OFFLINE_READY") return;
    state.cached = event.data.count || 0;
    state.total = event.data.total || 0;
    state.failures = event.data.failures || 0;
    state.version = event.data.version || "";
    state.preparing = false;
    renderStatus();
  }

  function updateOnlineState(online) {
    state.online = online;
    renderStatus();
  }

  function requestStatus() {
    navigator.serviceWorker.controller?.postMessage({ type: "CACHE_STATUS" });
  }

  function prepareOffline() {
    if (!navigator.serviceWorker.controller) {
      if (status) status.textContent = "離線功能尚未接管本頁，請保持連線並重新整理一次。";
      return;
    }
    state.preparing = true;
    state.failures = 0;
    renderStatus();
    navigator.serviceWorker.controller.postMessage({ type: "PREPARE_OFFLINE" });
  }

  async function refreshOffline() {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration?.waiting) registration.waiting.postMessage({ type: "SKIP_WAITING" });
    await registration?.update();
    window.location.reload();
  }

  function renderStatus() {
    if (!panel) return;
    const complete = state.controlled && state.total > 0 && state.cached === state.total && state.failures === 0;
    panel.dataset.state = complete ? "ready" : state.failures ? "error" : "pending";
    if (state.preparing) {
      status.textContent = "正在重新下載並驗證所有離線資料…";
    } else if (complete) {
      status.textContent = `完整離線已就緒 · ${state.version}`;
    } else if (!state.online) {
      status.textContent = "目前沒有網路，無法補齊離線資料。";
    } else if (!state.controlled) {
      status.textContent = "離線功能尚未接管本頁，請重新整理一次。";
    } else if (state.failures) {
      status.textContent = `仍有 ${state.failures} 個檔案未通過驗證，請再準備一次。`;
    } else {
      status.textContent = "尚未確認完整離線資料。";
    }
    detail.textContent = state.total ? `已驗證 ${state.cached} / ${state.total} 個檔案` : "正在讀取快取狀態…";
    prepareButton.disabled = state.preparing || !state.online;
  }
})();
