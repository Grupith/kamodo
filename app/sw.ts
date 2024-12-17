import { Serwist } from "serwist";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}
declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
});

serwist.addEventListeners();

// Exclude Google API scripts from service worker handling
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.hostname === "apis.google.com") {
    console.log("Bypassing SW for Google API:", url.href);
    return;
  }

  // Allow all other requests to pass through
  event.respondWith(fetch(event.request));
});
