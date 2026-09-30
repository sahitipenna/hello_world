// Go Dilly's Web Push service worker. Deliberately plain, un-bundled JS —
// it runs outside the Next.js app, registered as-is from NotifyMeButton.tsx.
// See README's "Push notifications" section for the full setup.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = { title: "Go Dilly", body: "Today's desk is ready for you." };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch {
    // Non-JSON payload (shouldn't happen — lib/webPush.ts always sends JSON)
    // falls back to the default text above rather than throwing.
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      tag: "godilly-daily", // replaces any still-showing reminder instead of stacking
      data: { url: data.url || "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data && event.notification.data.url ? event.notification.data.url : "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
