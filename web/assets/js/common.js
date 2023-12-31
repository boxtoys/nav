(function() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(function() {
      console.log('ServiceWorker registration success')
    }).catch(function(err) {
      console.log('ServiceWorker registration failed: ', err)
    })
  }

  const VARS = {
    list: [],
    token: localStorage.getItem('NAV_REQUEST_TOKEN') || '',
    sheetId: localStorage.getItem('NAV_REQUEST_SHEET_ID') || ''
  }

  const utils = {
    $: function(selector) {
      return document.querySelector(selector)
    },
    request: function(method, url, data) {
      let cancel = function() {}

      return [new Promise(function(resolve, reject) {
        const xhr = new XMLHttpRequest()
  
        xhr.open(method, url, true)
        xhr.setRequestHeader('Content-Type', 'application/json')
  
        xhr.onload = function() {
          if (this.status >= 200 && this.status < 300) {
            resolve(xhr.response ? JSON.parse(xhr.response) : '')
          } else {
            reject(new Error(xhr.statusText || xhr.responseText))
          }
        }
  
        xhr.onerror = function() {
          reject(new Error(xhr.statusText))
        }

        cancel = function() {
          xhr.abort()
          reject(new Error('Request canceled'))
        }

        xhr.send(data ?JSON.stringify(data) : null)
      }), cancel]
    },
    toast: function(text) {
      const element = document.querySelector('#message')

      element.textContent = text || ''
      element.duration = 1000
      element.type = 'error'
      element.show = true
    },
    htmlToDom(str) {
      const el = document.createElement('div')

      el.innerHTML = str
      return el.firstChild
    }
  }

  window.VARS = VARS
  window.utils = utils
})();
