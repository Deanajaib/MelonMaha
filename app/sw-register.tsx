"use client";

import { useEffect } from "react";

/**
 * One-time service worker cleanup. This no longer registers a service worker:
 * the previous caching SW broke returning visitors by serving stale hashed
 * assets. On load it unregisters any existing service worker and deletes all
 * caches, then does nothing further. Renders nothing. Kept mounted in layout.
 */
export default function SwRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    const onLoad = () => {
      void (async () => {
        try {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map((r) => r.unregister()));
        } catch {
          /* cleanup is best-effort; ignore failures */
        }
        try {
          if ("caches" in window) {
            const keys = await caches.keys();
            await Promise.all(keys.map((k) => caches.delete(k)));
          }
        } catch {
          /* cleanup is best-effort; ignore failures */
        }
      })();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return null;
}
