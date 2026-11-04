self.addEventListener('push', (event) => {
  let payload = {};
  try { payload = event.data ? event.data.json() : {}; } catch { payload = {}; }
  event.waitUntil(self.registration.showNotification(payload.title || '引體向上訓練提醒', {
    body: payload.body || '今天練了嗎？',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: 'pullup-training-reminder',
    renotify: false,
    data: { url: payload.url || '/' }
  }));
});
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || '/', self.location.origin).href;
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(async (windows) => {
    for (const windowClient of windows) {
      if (windowClient.url.startsWith(self.location.origin)) {
        await windowClient.focus();
        return;
      }
    }
    await clients.openWindow(target);
  }));
});
