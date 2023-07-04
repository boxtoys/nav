self.addEventListener('fetch', function (event) {
  if (event.request.destination === 'image') {
    event.respondWith(new Promise(function (resolve, reject) {
      caches.match(event.request).then(function (responseFromCache) {
        if (responseFromCache) {
          resolve(responseFromCache)
        } else {
          fetch(event.request).then(function (responseFromNetwork) {
            caches.open('v1').then(function (cache) {
              cache.put(event.request, responseFromNetwork.clone())
              resolve(responseFromNetwork)
            })
          }).catch((error) => {
            reject(error)
          })
        }
      })
    }))
  }
})
