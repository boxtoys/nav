(function() {
  const settingElement = utils.$('.J_setting')
  const settingDialogElement = utils.$('.J_setting_dialog')
  const settingDialogTokenElement = utils.$('.J_setting_token')
  const settingDialogSubmitElement = utils.$('.J_setting_submit')
  const settingDialogSheetIdElement = utils.$('.J_setting_sheetId')
  const settingDialogBoxElement = utils.$('.J_setting_dialog .box')
  const settingDialogCloseElement = utils.$('.J_setting_dialog .close')

  settingElement.addEventListener('click', function() {
    settingDialogTokenElement.value = VARS.token
    settingDialogSheetIdElement.value = VARS.sheetId

    settingDialogElement.classList.add('open')

    refreshSubmitElementState()
  })

  settingDialogBoxElement.addEventListener('click', function(e) {
    e.stopPropagation()
  })

  settingDialogCloseElement.addEventListener('click', function(e) {
    settingDialogElement.classList.remove('open')

    reset()
  })

  settingDialogElement.addEventListener('click', function() {
    settingDialogElement.classList.remove('open')

    reset()
  })

  settingDialogSheetIdElement.addEventListener('input', function() {
    VARS.sheetId = settingDialogSheetIdElement.value.trim()

    refreshSubmitElementState()
  })

  settingDialogTokenElement.addEventListener('input', function(e) {
    VARS.token = settingDialogTokenElement.value.trim()

    refreshSubmitElementState()
  })

  settingDialogSubmitElement.addEventListener('click', function(e) {
    if (!VARS.sheetId || !VARS.token) {
      return
    }

    localStorage.setItem('NAV_REQUEST_TOKEN', VARS.token)
    localStorage.setItem('NAV_REQUEST_SHEET_ID', VARS.sheetId)
    settingDialogElement.classList.remove('open')
  })

  function reset() {
    VARS.token = localStorage.getItem('NAV_REQUEST_TOKEN') || ''
    VARS.sheetId = localStorage.getItem('NAV_REQUEST_SHEET_ID') || ''
  }

  function refreshSubmitElementState() {
    if (VARS.sheetId && VARS.token) {
      settingDialogSubmitElement.removeAttribute('disabled')
    } else {
      settingDialogSubmitElement.setAttribute('disabled', 'disabled')
    }
  }
})();
