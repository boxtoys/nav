(function() {
  let link = ''
  let cancelRequest = null
  const contextMenuElement = utils.$('.J_contextmenu')
  const updateDialogElement = utils.$('.J_update_dialog')
  const updateDialogLinkElement = utils.$('.J_update_link')
  const updateDialogNameElement = utils.$('.J_update_name')
  const updateDialogIconElement = utils.$('.J_update_icon')
  const updateDialogSubmitElement = utils.$('.J_update_submit')
  const updateDialogBoxElement = utils.$('.J_update_dialog .box')
  const updateDialogCategoryElement = utils.$('.J_update_category')
  const updateDialogCloseElement = utils.$('.J_update_dialog .close')
  const updateDialogIconRoundElement = utils.$('.J_update_icon_round')
  const updateDialogDescriptionElement = utils.$('.J_update_description')

  document.addEventListener('click', function() {
    link = ''
    contextMenuElement.classList.add('hidden')
  })

  document.addEventListener('contextmenu', function(event) {
    const element = getTargetElement(document.elementFromPoint(event.clientX, event.clientY))

    if (element) {
      event.preventDefault()

      link = element.dataset.id
      contextMenuElement.classList.remove('hidden')
      contextMenuElement.style.left = event.clientX + 4 + 'px'
      contextMenuElement.style.top = event.clientY - 6 + 'px'
    } else {
      link = ''
      contextMenuElement.classList.add('hidden')
    }
  })

  updateDialogBoxElement.addEventListener('click', function(e) {
    e.stopPropagation()
  })

  updateDialogCloseElement.addEventListener('click', function() {
    updateDialogElement.classList.remove('open')

    reset()
  })

  updateDialogElement.addEventListener('click', function() {
    updateDialogElement.classList.remove('open')

    reset()
  })

  updateDialogNameElement.addEventListener('input', function() {
    refreshSubmitElementState()
  })

  updateDialogIconElement.addEventListener('input', function() {
    refreshSubmitElementState()
    refreshIconElementState()
  })

  updateDialogSubmitElement.addEventListener('click', function() {
    const params = {
      link: updateDialogLinkElement.value.trim(),
      name: updateDialogNameElement.value.trim(),
      icon: updateDialogIconElement.value.trim(),
      desc: updateDialogDescriptionElement.value.trim(),
      category: updateDialogCategoryElement.value.trim(),
      round: parseInt(updateDialogIconRoundElement.value, 10)
    }

    let result = utils.request('POST', '/api/update', Object.assign({}, params, { token: VARS.token, sheetId: VARS.sheetId }))
    let promise = result[0]
    let cancel = result[1]

    cancelRequest = cancel

    updateDialogSubmitElement.setAttribute('disabled', 'disabled')

    return promise.then(function() {
      cancelRequest = null

      VARS.list = VARS.list.map(function(item) {
        if (item.link === params.link) {
          item.name = params.name
          item.icon = params.icon
          item.desc = params.desc
          item.round = params.round
          item.category = params.category
        }

        return item
      })
      
      if (localStorage.getItem('NAV_REQUEST_LIST')) {
        localStorage.setItem('NAV_REQUEST_LIST', JSON.stringify(VARS.list))
      }

      window.refreshList()

      reset()
      updateDialogElement.classList.remove('open')
      updateDialogSubmitElement.removeAttribute('disabled')
    })
    .catch(function(err) {
      cancelRequest = null
      utils.toast(err.message)
      updateDialogSubmitElement.removeAttribute('disabled')
    })
  })

  utils.$('.J_contextmenu_change').addEventListener('click', function() {
    if (!link) {
      return
    }

    const website = VARS.list.find(item => item.link === link)

    if (!website) {
      return
    }

    updateDialogElement.classList.add('open')
    updateDialogLinkElement.value = website.link
    updateDialogNameElement.value = website.name
    updateDialogIconElement.value = website.icon
    updateDialogDescriptionElement.value = website.desc
    updateDialogCategoryElement.value = website.category
    updateDialogIconRoundElement.value = website.round.toString()
  })

  utils.$('.J_contextmenu_delete').addEventListener('click', function() {
    if (!link) {
      return
    }

    const website = VARS.list.find(item => item.link === link)

    if (!website) {
      return
    }

    if (window.confirm('Do you really want to delete '.concat(website.name, '?'))) {
      const result = utils.request('POST', '/api/delete', {
        token: VARS.token,
        link: website.link,
        sheetId: VARS.sheetId
      })

      result[0].then(function() {
        VARS.list = VARS.list.filter(item => item.link !== website.link)
        localStorage.setItem('NAV_REQUEST_LIST', JSON.stringify(VARS.list))

        const element = document.querySelector('li[data-id="'.concat(website.link, '"]'))

        if (element) {
          element.parentNode.removeChild(element)
        }
      })
      .catch(function (err) {
        utils.toast(err.message)
      })
    }
  })

  function getTargetElement(element) {
    if (element.dataset.id) {
      return element
    } else {
      return element.parentElement ? getTargetElement(element.parentElement) : null
    }
  }

  function reset() {
    if (cancelRequest) {
      cancelRequest()
      cancelRequest = null
    }

    updateDialogLinkElement.value = ''
    updateDialogNameElement.value = ''
    updateDialogIconElement.value = ''
    updateDialogCategoryElement.value = ''
    updateDialogIconRoundElement.value = '0'
    updateDialogDescriptionElement.value = ''
  }

  function refreshSubmitElementState() {
    if (updateDialogNameElement.value.trim() && updateDialogIconElement.value.trim()) {
      updateDialogSubmitElement.removeAttribute('disabled')
    } else {
      updateDialogSubmitElement.setAttribute('disabled', 'disabled')
    }
  }

  function refreshIconElementState() {
    if (updateDialogIconElement.value.trim()) {
      updateDialogIconRoundElement.removeAttribute('disabled')
    } else {
      updateDialogIconRoundElement.setAttribute('disabled', 'disabled')
    }
  }
})();
