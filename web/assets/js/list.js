(function() {
  const url = '/api/list?sheetId={sheetId}&token={token}'.replace('{sheetId}', VARS.sheetId).replace('{token}', VARS.token)

  if (VARS.sheetId && VARS.token) {
    return
  }

  utils.request('GET', url)
    .then(function (res) {
      if (res.length !== 0) {
        VARS.list = res
        utils.$('.links').innerHTML = render(res)
      }
    })
    .catch(function (err) {
      utils.toast(err.message)
    })

  function render(data) {
    const tpl = document.querySelector('#listTemplate').textContent.trim()

    data = normalize(data)

    return Object.keys(data).map(function (key) {
      const categoryName = key !== 'nil' ? '<h3 title="'.concat(key, '">').concat(key, '</h3>') : ''

      const list = data[key].reduce(function (prev, curr) {
        return prev + tpl.replace('{name}', curr.name).replace('{icon}', curr.icon).replace('{desc}', curr.desc).replace('{link}', curr.link).replace('{url}', curr.link)
      }, '')

      return categoryName + '<ul>' + list + '</ul>'
    }).join('')
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
})();
