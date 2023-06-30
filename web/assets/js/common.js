(function() {
  const VARS = {
    token: localStorage.getItem('NAV_REQUEST_TOKEN') || '',
    sheetId: localStorage.getItem('NAV_REQUEST_SHEET_ID') || ''
  }

  const utils = {
    $: function(selector) {
      return document.querySelector(selector)
    },
    request: function(method, url, data) {
      return new Promise(function(resolve, reject) {
        const xhr = new XMLHttpRequest()
  
        xhr.open(method, url, true)
        xhr.setRequestHeader('Content-Type', 'application/json')
  
        xhr.onload = function() {
          if (this.status >= 200 && this.status < 300) {
            resolve(xhr.response ? JSON.parse(xhr.response) : '')
          } else {
            reject(new Error(xhr.statusText))
          }
        }
  
        xhr.onerror = function() {
          reject(new Error(xhr.statusText))
        }
  
        xhr.send(JSON.stringify(data))
      })
    },
    toast: function(text) {
      const element = document.querySelector('#message')

      element.textContent = text || ''
      element.duration = 1000
      element.type = 'error'
      element.show = true
    }
  }

  window.VARS = VARS
  window.utils = utils
})();
