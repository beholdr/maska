;(function () {
  function versionPlugin(hook) {
    hook.mounted(function () {
      document
        .getElementById('version-selector')
        .addEventListener('change', (e) => {
          window.location.href = '../' + e.target.value + '/'
        })
    })
  }

  $docsify = $docsify || {}
  $docsify.plugins = [].concat($docsify.plugins || [], versionPlugin)
})()
