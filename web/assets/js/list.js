(function() {
  const linksElement = utils.$('.links')

  if (VARS.sheetId && VARS.token) {
    getList()
  }

  function getList() {
    const cache = localStorage.getItem('NAV_REQUEST_LIST') || ''
    const url = '/api/list?sheetId={sheetId}&token={token}'.replace('{sheetId}', VARS.sheetId).replace('{token}', VARS.token)
    let result = utils.request('GET', url)

    if (cache) {
      VARS.list = list = JSON.parse(cache)
      linksElement.innerHTML = render(list)
    }

    result[0].then(function (res) {
      if (res.length !== 0) {
        if (JSON.stringify(res) === cache) {
          return
        }

        localStorage.setItem('NAV_REQUEST_LIST', JSON.stringify(res))
        VARS.list = res

        if (!cache) {
          linksElement.innerHTML = render(res)
        } else {
          update(diff(res, JSON.parse(cache)))
        }
      }
    })
    .catch(function (err) {
      utils.toast(err.message)
    })
  }

  function render(data) {
    const tpl = document.querySelector('#listTemplate').textContent.trim()

    data = normalize(data)

    return Object.keys(data).map(function (key) {
      if (data[key].length === 0) {
        return ''
      }

      const categoryName = key !== 'nil' ? '<h3 title="'.concat(key, '">').concat(key, '</h3>') : ''

      const list = data[key].reduce(function (prev, curr) {
        return prev + tpl.replace('{name}', curr.name).replace('{icon}', curr.icon).replace('{desc}', curr.desc).replace('{link}', curr.link.replace(/(https?:\/\/)/g, '')).replaceAll('{url}', curr.link).replace('{round}', curr.round === 1 ? 'round' : '')
      }, '')

      return categoryName + '<ul>' + list + '</ul>'
    }).join('')
  }

  function update(data) {
    if (data.patch.length) {
      data.patch.forEach(function (item) {
        const element = linksElement.querySelector('a[href="'.concat(item.link, '"]'))

        if (element) {
          element.querySelector('.name').innerText = item.name
          element.querySelector('.description').innerText = item.desc
          element.querySelector('.logo img').setAttribute('src', item.icon)

          if(item.round === 1) {
            element.querySelector('.logo').classList.add('round')
          } else {
            element.querySelector('.logo').classList.remove('round')
          }
        }
      })
    }

    if (data.del.length) {
      data.del.forEach(function (item) {
        const element = linksElement.querySelector('a[href="'.concat(item.link, '"]'))

        if (element) {
          element.parentNode.parentNode.removeChild(element.parentNode)
        }
      })
    }

    if (data.add.length) {
      const tpl = document.querySelector('#listTemplate').textContent.trim()

      data.add.forEach(function (item) {
        const html = tpl.replace('{name}', item.name).replace('{icon}', item.icon).replace('{desc}', item.desc).replace('{link}', item.link.replace(/(https?:\/\/)/g, '')).replace('{url}', item.link).replace('{round}', item.round === 1 ? 'round' : '')

        if (item.category) {
          let categoryElement = document.querySelector('h3[title='.concat(item.category, ']'))
  
          if (categoryElement) {
            categoryElement.nextElementSibling.appendChild(utils.htmlToDom(html))
          } else {
            linksElement.appendChild(utils.htmlToDom('<h3 title="'.concat(item.category, '">').concat(item.category, '</h3>')))
            linksElement.appendChild(utils.htmlToDom('<ul>'.concat(html, '</ul>')))
          }
        } else {
          const el = linksElement.firstElementChild
  
          if (el.tagName.toUpperCase() === 'UL') {
            el.appendChild(utils.htmlToDom(html))
          } else {
            linksElement.insertBefore(utils.htmlToDom('<ul>'.concat(html, '</ul>')), linksElement.firstElementChild)
          }
        }
      })
    }
  }

  function normalize(data) {
    return data.reduce(function (prev, curr) {
      if (!curr.category) {
        prev.nil.push(curr)
      }

      if (!prev[curr.category]) {
        prev[curr.category] = []
      }

      prev[curr.category].push(curr)

      return prev
    }, { nil: [] })
  }

  function diff(newData, cacheData) {
    const result = newData.reduce(function (prev, curr) {
      const index = cacheData.findIndex(function (item) {
        return item.link === curr.link
      })

      if (index === -1) {
        prev.add.push(curr)
      } else if (JSON.stringify(curr) !== JSON.stringify(cacheData[index])) {
        if (curr.category !== cacheData[index].category) {
          prev.add.push(curr)
          prev.del.push(cacheData[index])
        } else {
          prev.patch.push(curr)
        }
      }

      return prev
    }, {
      add: [],
      del: [],
      patch: []
    })

    result.del = result.del.concat(cacheData.filter(function (item) {
      return newData.findIndex(function (curr) {
        return curr.link === item.link
      }) === -1
    }))

    return result
  }

  window.refreshList = getList
})();
