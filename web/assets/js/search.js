(function() {
  const searchElement = utils.$('.J_search')

  document.addEventListener('visibilitychange', function() {
    searchElement.value = ''
    searchElement.focus()
  })

  document.addEventListener('DOMContentLoaded', function() {
    searchElement.focus()
  })

  searchElement.addEventListener('keypress', function(e) {
    const value = searchElement.value.trim()

    if (e.keyCode === 13 && value) {
      location.href = 'https://www.google.com/search?q=' + encodeURIComponent(value)
    }
  })
})();
