/* MahaMelon service worker — self-unregistering kill-switch.
 *
 * The previous version cached hashed build assets (mahamelon-v1) and served
 * them cache-first, which served stale /_next/static chunks after a redeploy
 * and broke the JS module graph ("This page couldn't load"). This replacement
 * does the opposite: it deletes every cache, unregisters itself, and forces
 * controlled clients to reload so stuck visitors self-heal. The fetch handler
 * is a pure pass-through — nothing is ever served from cache.
 */

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        await self.clients.claim();
      } catch {
        /* best-effort */
      }
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      } catch {
        /* best-effort */
      }
      try {
        await self.registration.unregister();
      } catch {
        /* best-effort */
      }
      try {
        const clients = await self.clients.matchAll();
        for (const client of clients) {
          client.navigate(client.url);
        }
      } catch {
        /* best-effort */
      }
    })()
  );
});

/* Pure pass-through: never call event.respondWith, so every request hits the
 * network and no asset is ever served from cache. */
self.addEventListener("fetch", () => {
  /* intentionally empty */
});
