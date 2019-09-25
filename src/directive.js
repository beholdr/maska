import Maska from './maska'
import { isString } from './utils'

function getOpts (mask) {
  const opts = {}

  if (isString(mask)) {
    opts.mask = mask
  } else if (mask.mask) {
    opts.mask = mask.mask
    opts.tokens = mask.tokens ? mask.tokens : {}
  }

  return opts
}

function needUpdate (mask) {
  if (isString(mask.value) && isString(mask.oldValue) && mask.value === mask.oldValue) {
    return false
  }

  if (mask.value && mask.oldValue && mask.value.mask === mask.oldValue.mask) {
    return false
  }

  return true
}

export default function directive (el, mask) {
  if (!mask.value) return

  if (mask.value && needUpdate(mask)) {
    return new Maska(el, getOpts(mask.value))
  }
}
