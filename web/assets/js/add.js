(function() {
  let step = 1
  let link = ''
  let name = ''
  let icon = ''
  let desc = ''
  let category = ''
  const addElement = utils.$('.J_add')
  const addDialogElement = utils.$('.J_add_dialog')
  const addDialogLinkElement = utils.$('.J_add_link')
  const addDialogNameElement = utils.$('.J_add_name')
  const addDialogIconElement = utils.$('.J_add_icon')
  const addDialogSubmitElement = utils.$('.J_add_submit')
  const addDialogCategoryElement = utils.$('.J_add_category')
  const addDialogCloseElement = utils.$('.J_add_dialog .close')
  const addDialogDescriptionElement = utils.$('.J_add_description')

  addElement.addEventListener('click', function() {
    addDialogElement.classList.add('open')

    refreshSubmitElementState()
  })

  addDialogCloseElement.addEventListener('click', function() {
    step = 1
    addDialogLinkElement.value = ''
    addDialogNameElement.value = ''
    addDialogIconElement.value = ''
    addDialogCategoryElement.value = ''
    addDialogDescriptionElement.value = ''
    addDialogElement.classList.remove('open')
    addDialogSubmitElement.textContent = 'Parse'
    addDialogNameElement.parentElement.classList.add('hidden')
    addDialogIconElement.parentElement.classList.add('hidden')
    addDialogCategoryElement.parentElement.classList.add('hidden')
    addDialogDescriptionElement.parentElement.classList.add('hidden')
  })

  addDialogLinkElement.addEventListener('input', function() {
    link = addDialogLinkElement.value.trim()
    refreshSubmitElementState()
  })

  addDialogNameElement.addEventListener('input', function() {
    name = addDialogNameElement.value.trim()
    refreshSubmitElementState()
  })
  
  addDialogIconElement.addEventListener('input', function() {
    icon = addDialogIconElement.value.trim()
    refreshSubmitElementState()
  })

  addDialogDescriptionElement.addEventListener('input', function() {
    desc = addDialogDescriptionElement.value.trim()
  })

  addDialogCategoryElement.addEventListener('input', function() {
    category = addDialogCategoryElement.value.trim()
  })

  addDialogSubmitElement.addEventListener('click', function() {
    if (step === 1 && link) {
      addDialogSubmitElement.textContent = 'Parseing'
      addDialogSubmitElement.setAttribute('disabled', 'disabled')

      utils.request('POST', '/api/extract', { link, token })
        .then(res => {
          step = 2
          name = addDialogNameElement.value = res.name || ''
          icon = addDialogIconElement.value = res.icon || ''
          desc = addDialogDescriptionElement.value = res.desc || ''

          addDialogNameElement.parentElement.classList.remove('hidden')
          addDialogIconElement.parentElement.classList.remove('hidden')
          addDialogCategoryElement.parentElement.classList.remove('hidden')
          addDialogDescriptionElement.parentElement.classList.remove('hidden')

          addDialogSubmitElement.textContent = 'Submit'
          addDialogSubmitElement.removeAttribute('disabled')
        })
        .catch(err => {
          utils.toast(err.message)
          addDialogSubmitElement.textContent = 'Parse'
          addDialogSubmitElement.removeAttribute('disabled')
        })

      return
    }

    if (step === 2 && link && name && icon) {
      addDialogSubmitElement.setAttribute('disabled', 'disabled')

      utils.request('POST', '/api/add', { sheetId, token, link, name, icon, desc, category })
        .then(res => {
          step = 1
          addDialogLinkElement.value = ''
          addDialogNameElement.value = ''
          addDialogIconElement.value = ''
          addDialogCategoryElement.value = ''
          addDialogDescriptionElement.value = ''
          addDialogElement.classList.remove('open')
          addDialogSubmitElement.textContent = 'Parse'
          addDialogNameElement.parentElement.classList.add('hidden')
          addDialogIconElement.parentElement.classList.add('hidden')
          addDialogCategoryElement.parentElement.classList.add('hidden')
          addDialogDescriptionElement.parentElement.classList.add('hidden')
          addDialogSubmitElement.removeAttribute('disabled')
        })
        .catch(err => {
          utils.toast(err.message)
          addDialogSubmitElement.removeAttribute('disabled')
        })
    }
  })

  function refreshSubmitElementState() {
    if (step === 1) {
      if (link) {
        addDialogSubmitElement.removeAttribute('disabled')
      } else {
        addDialogSubmitElement.setAttribute('disabled', 'disabled')
      }

      return
    }

    if (step === 2) {
      if (link && name && icon) {
        addDialogSubmitElement.removeAttribute('disabled')
      } else {
        addDialogSubmitElement.setAttribute('disabled', 'disabled')
      }
    }
  }
})();
