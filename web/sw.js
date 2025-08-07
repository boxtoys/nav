self.addEventListener("fetch", function (event) {
  if (event.request.destination === "image") {
    event.respondWith(
      caches
        .match(event.request)
        .then(function (responseFromCache) {
          if (responseFromCache) {
            return responseFromCache;
          }

          return fetch(event.request)
            .then(function (responseFromNetwork) {
              if (!responseFromNetwork || responseFromNetwork.status !== 200) {
                return responseFromNetwork;
              }

              caches
                .open("v1")
                .then(function (cache) {
                  return cache.put(event.request, responseFromNetwork.clone());
                })
                .catch(function (error) {
                  console.warn("Cache failed:", error.message);
                });

              return responseFromNetwork;
            })
            .catch(function (error) {
              console.warn("Fetch failed:", error.message);
              return new Response(null, {
                status: 404,
                statusText: "Image not found",
              });
            });
        })
        .catch(function (error) {
          console.warn("Cache match failed:", error.message);
          return new Response(null, {
            status: 404,
            statusText: "Image not found",
          });
        })
    );
  }
});
