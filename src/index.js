import directive from './directive'
import mask from './mask'
import Maska from './maska'
import tokens from './tokens'

function install (Vue) {
  Vue.directive('maska', directive)
}
// Install by default if included from script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install)
}

function create (el, options) {
  return new Maska(el, options)
}

export default install
export {
  create,
  mask,
  directive as maska,
  tokens
}
