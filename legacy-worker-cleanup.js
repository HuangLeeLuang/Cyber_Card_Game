(() => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });
  }
  if ("caches" in window) {
    caches.keys().then((keys) => {
      keys.filter((key) => key.startsWith("cyber-card-game-")).forEach((key) => caches.delete(key));
    });
  }
})();
