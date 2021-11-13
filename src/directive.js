import Maska from './maska'
import { isString } from './utils'

function getOpts (mask) {
  const opts = {}

  if (mask.mask) {
    opts.mask = Array.isArray(mask.mask) ? JSON.stringify(mask.mask) : mask.mask
    opts.tokens = mask.tokens ? { ...mask.tokens } : {}
    opts.preprocessor = mask.preprocessor
  } else {
    opts.mask = Array.isArray(mask) ? JSON.stringify(mask) : mask
  }

  return opts
}

function needUpdate (mask) {
  return !(
    (isString(mask.value) && mask.value === mask.oldValue) ||
    (Array.isArray(mask.value) && JSON.stringify(mask.value) === JSON.stringify(mask.oldValue)) ||
    (mask.value && mask.value.mask && mask.oldValue && mask.oldValue.mask && mask.value.mask === mask.oldValue.mask)
  )
}

const directive = () => {
  const state = new WeakMap()

  return (el, mask) => {
    if (!mask.value) return

    if (state.has(el) && !needUpdate(mask)) {
      return
    }

    state.set(el, new Maska(el, getOpts(mask.value)))
  }
}

export default directive()
