  (function() {
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

        xhr.send(data ?JSON.stringify(data) : null)
      })
    },
    toast: function(text) {
      const element = document.querySelector('#message')

      element.textContent = text || ''
      element.duration = 1000
      element.type = 'error'
      element.show = true
    },
    render: function(data) {
      data = normalize(data)
      
      const tpl = document.querySelector('#listTemplate').textContent.trim()

      return Object.keys(data).map(function (key) {
        const categoryName = key !== 'nil' ? '<h3>' + key + '</h3>' : ''

        const list = data[key].reduce(function (prev, curr) {
          return prev + tpl.replace('{name}', curr.name).replace('{icon}', curr.icon).replace('{desc}', curr.desc).replace('{link}', curr.link).replace('{url}', curr.link)
        }, '')

        return categoryName + '<ul>' + list + '</ul>'
      }).join('')
    }
  }

  function normalize(data) {
    return data.reduce(function (prev, curr) {
      if (!curr.category) {
        curr.category = 'nil'
      }

      if (!prev[curr.category]) {
        prev[curr.category] = []
      }

      prev[curr.category].push(curr)

      return prev
    }, {})
  }

  window.VARS = VARS
  window.utils = utils
})();
