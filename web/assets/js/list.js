(function() {
  const url = '/api/list?sheetId={sheetId}&token={token}'.replace('{sheetId}', VARS.sheetId).replace('{token}', VARS.token)

  utils.request('GET', url)
    .then(function (res) {
      if (res.length !== 0) {
        VARS.list = res
        document.querySelector('.links').innerHTML = utils.render(res)
      }
    })
    .catch(function (err) {
      utils.toast(err.message)
    })
})();
