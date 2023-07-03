(function() {
  let step = 1
  let cancelRequest = null
  let params = {
    link: '',
    name: '',
    icon: '',
    desc: '',
    round: '0',
    category: ''
  }

  const addElement = utils.$('.J_add')
  const addDialogElement = utils.$('.J_add_dialog')
  const addDialogLinkElement = utils.$('.J_add_link')
  const addDialogNameElement = utils.$('.J_add_name')
  const addDialogIconElement = utils.$('.J_add_icon')
  const addDialogSubmitElement = utils.$('.J_add_submit')
  const addDialogBoxElement = utils.$('.J_add_dialog .box')
  const addDialogCategoryElement = utils.$('.J_add_category')
  const addDialogCloseElement = utils.$('.J_add_dialog .close')
  const addDialogIconRoundElement = utils.$('.J_add_icon_round')
  const addDialogDescriptionElement = utils.$('.J_add_description')

  addElement.addEventListener('click', function() {
    addDialogElement.classList.add('open')

    refreshSubmitElementState()
  })

  addDialogBoxElement.addEventListener('click', function(e) {
    e.stopPropagation()
  })

  addDialogCloseElement.addEventListener('click', function() {
    addDialogElement.classList.remove('open')

    reset()
  })

  addDialogElement.addEventListener('click', function() {
    addDialogElement.classList.remove('open')

    reset()
  })

  addDialogLinkElement.addEventListener('input', function() {
    params.link = addDialogLinkElement.value.trim()

    refreshSubmitElementState()
  })

  addDialogLinkElement.addEventListener('keyup', function(e) {
    if (e.keyCode === 13 && step === 1) {
      addDialogSubmitElement.click()
    }
  })

  addDialogNameElement.addEventListener('input', function() {
    params.name = addDialogNameElement.value.trim()

    refreshSubmitElementState()
  })

  addDialogIconElement.addEventListener('input', function() {
    params.icon = addDialogIconElement.value.trim()

    refreshSubmitElementState()
    refreshIconElementState()
  })

  addDialogDescriptionElement.addEventListener('input', function() {
    params.desc = addDialogDescriptionElement.value.trim()
  })

  addDialogCategoryElement.addEventListener('input', function() {
    params.category = addDialogCategoryElement.value.trim()
  })

  addDialogIconRoundElement.addEventListener('change', function() {
    params.round = addDialogIconRoundElement.value
  })

  addDialogSubmitElement.addEventListener('click', function() {
    if (step === 1 && params.link) {
      addDialogSubmitElement.textContent = 'Parseing'
      addDialogSubmitElement.setAttribute('disabled', 'disabled')

      let result = utils.request('POST', '/api/extract', { link: params.link, token: VARS.token })
      let promise = result[0]
      let cancel = result[1]

      cancelRequest = cancel

      return promise.then(function (res) {
          step = 2
          cancelRequest = null
          params.name = addDialogNameElement.value = res.name || ''
          params.icon = addDialogIconElement.value = res.icon || ''
          params.desc = addDialogDescriptionElement.value = res.desc || ''

          addDialogElement.querySelector('.box-body').classList.remove('off')

          addDialogNameElement.parentElement.classList.remove('hidden')
          addDialogIconElement.parentElement.classList.remove('hidden')
          addDialogCategoryElement.parentElement.classList.remove('hidden')
          addDialogIconRoundElement.parentElement.classList.remove('hidden')
          addDialogDescriptionElement.parentElement.classList.remove('hidden')

          addDialogSubmitElement.textContent = 'Submit'
          addDialogSubmitElement.removeAttribute('disabled')
        })
        .catch(function(err) {
          cancelRequest = null
          utils.toast(err.message)
          addDialogSubmitElement.textContent = 'Parse'
          addDialogSubmitElement.removeAttribute('disabled')
        })
    }

    if (step === 2 && params.link && params.name && params.icon) {
      params.round = parseInt(params.round, 10)
      addDialogSubmitElement.setAttribute('disabled', 'disabled')

      let result = utils.request('POST', '/api/add', Object.assign({}, params, { token: VARS.token, sheetId: VARS.sheetId }))
      let promise = result[0]
      let cancel = result[1]

      cancelRequest = cancel

      return promise.then(function() {
          cancelRequest = null

          render(params)
          VARS.list.push(params)

          reset()
          addDialogElement.classList.remove('open')
          addDialogSubmitElement.removeAttribute('disabled')
        })
        .catch(function(err) {
          cancelRequest = null
          utils.toast(err.message)
          addDialogSubmitElement.removeAttribute('disabled')
        })
    }
  })

  function render(data) {
    const linksElement = utils.$('.links')
    const tpl = document.querySelector('#listTemplate').textContent.trim()
    const html = tpl.replace('{name}', data.name).replace('{icon}', data.icon).replace('{desc}', data.desc).replace('{link}', data.link.replace(/(https?:\/\/)/g, '')).replace('{url}', data.link).replace('{round}', data.round === 1 ? 'round' : '')

    if (data.category) {
      let categoryElement = document.querySelector('h3[title='.concat(data.category, ']'))

      if (categoryElement) {
        categoryElement.nextElementSibling.appendChild(utils.htmlToDom(html))
      } else {
        linksElement.appendChild(utils.htmlToDom('<h3 title="'.concat(data.category, '">').concat(data.category, '</h3>')))
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
  }

  function reset() {
    if (cancelRequest) {
      cancelRequest()
      cancelRequest = null
    }
    
    step = 1
    params = {
      link: '',
      name: '',
      icon: '',
      desc: '',
      round: '0',
      category: ''
    }
    addDialogLinkElement.value = ''
    addDialogNameElement.value = ''
    addDialogIconElement.value = ''
    addDialogCategoryElement.value = ''
    addDialogIconRoundElement.value = '0'
    addDialogDescriptionElement.value = ''
    addDialogSubmitElement.textContent = 'Parse'
    addDialogNameElement.parentElement.classList.add('hidden')
    addDialogIconElement.parentElement.classList.add('hidden')
    addDialogCategoryElement.parentElement.classList.add('hidden')
    addDialogIconRoundElement.parentElement.classList.add('hidden')
    addDialogDescriptionElement.parentElement.classList.add('hidden')
    addDialogElement.querySelector('.box-body').classList.add('off')
  }

  function refreshSubmitElementState() {
    if (step === 1 && params.link) {
      addDialogSubmitElement.removeAttribute('disabled')
    } else if (step === 2 && params.link && params.name && params.icon) {
      addDialogSubmitElement.removeAttribute('disabled')
    } else {
      addDialogSubmitElement.setAttribute('disabled', 'disabled')
    }
  }

  function refreshIconElementState() {
    if (params.icon) {
      addDialogIconRoundElement.removeAttribute('disabled')
    } else {
      addDialogIconRoundElement.setAttribute('disabled', 'disabled')
    }
  }
})();
