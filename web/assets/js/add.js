(function() {
  let step = 1
  let params = {
    link: '',
    name: '',
    icon: '',
    desc: '',
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

  addDialogNameElement.addEventListener('input', function() {
    params.name = addDialogNameElement.value.trim()

    refreshSubmitElementState()
  })

  addDialogIconElement.addEventListener('input', function() {
    params.icon = addDialogIconElement.value.trim()

    refreshSubmitElementState()
  })

  addDialogDescriptionElement.addEventListener('input', function() {
    params.desc = addDialogDescriptionElement.value.trim()
  })

  addDialogCategoryElement.addEventListener('input', function() {
    params.category = addDialogCategoryElement.value.trim()
  })

  addDialogSubmitElement.addEventListener('click', function() {
    if (step === 1 && params.link) {
      addDialogSubmitElement.textContent = 'Parseing'
      addDialogSubmitElement.setAttribute('disabled', 'disabled')

      return utils.request('POST', '/api/extract', { link: params.link, token: VARS.token })
        .then(function (res) {
          step = 2
          params.name = addDialogNameElement.value = res.name || ''
          params.icon = addDialogIconElement.value = res.icon || ''
          params.desc = addDialogDescriptionElement.value = res.desc || ''

          addDialogElement.querySelector('.box-body').classList.remove('off')

          addDialogNameElement.parentElement.classList.remove('hidden')
          addDialogIconElement.parentElement.classList.remove('hidden')
          addDialogCategoryElement.parentElement.classList.remove('hidden')
          addDialogDescriptionElement.parentElement.classList.remove('hidden')

          addDialogSubmitElement.textContent = 'Submit'
          addDialogSubmitElement.removeAttribute('disabled')
        })
        .catch(function(err) {
          utils.toast(err.message)
          addDialogSubmitElement.textContent = 'Parse'
          addDialogSubmitElement.removeAttribute('disabled')
        })
    }

    if (step === 2 && params.link && params.name && params.icon) {
      addDialogSubmitElement.setAttribute('disabled', 'disabled')

      return utils.request('POST', '/api/add', Object.assign({}, params, { token: VARS.token, sheetId: VARS.sheetId }))
        .then(function() {
          render(params)
          VARS.list.push(params)

          reset()
          addDialogElement.classList.remove('open')
          addDialogSubmitElement.removeAttribute('disabled')
        })
        .catch(function(err) {
          utils.toast(err.message)
          addDialogSubmitElement.removeAttribute('disabled')
        })
    }
  })

  function render(data) {
    const linksElement = utils.$('.links')
    const tpl = document.querySelector('#listTemplate').textContent.trim()
    const html = tpl.replace('{name}', data.name).replace('{icon}', data.icon).replace('{desc}', data.desc).replace('{link}', data.link).replace('{url}', data.link)

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
    step = 1
    params = {
      link: '',
      name: '',
      icon: '',
      desc: '',
      category: ''
    }
    addDialogLinkElement.value = ''
    addDialogNameElement.value = ''
    addDialogIconElement.value = ''
    addDialogCategoryElement.value = ''
    addDialogDescriptionElement.value = ''
    addDialogSubmitElement.textContent = 'Parse'
    addDialogNameElement.parentElement.classList.add('hidden')
    addDialogIconElement.parentElement.classList.add('hidden')
    addDialogCategoryElement.parentElement.classList.add('hidden')
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
})();
