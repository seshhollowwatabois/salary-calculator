const CACHE_NAME = "salary-calculator-v2";

const FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest"
];

self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES);
    })
  );
});


self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});


self.addEventListener("fetch", event => {

  event.respondWith(
    fetch(event.request)
      .then(response => {

        const responseClone =
          response.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(
            event.request,
            responseClone
          );
        });

        return response;
      })
      .catch(() => {

        return caches.match(
          event.request
        );

      })
  );

});