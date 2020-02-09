import mask from './mask'
import tokens from './tokens'
import { event, findInputElement, fixInputSelection, isString } from './utils'

export default class Maska {
  constructor (el, opts = {}) {
    if (!el) throw new Error('Maska: no element for mask')

    if (opts.tokens) {
      for (const i in opts.tokens) {
        opts.tokens[i] = { ...opts.tokens[i] }
        if (opts.tokens[i].pattern && isString(opts.tokens[i].pattern)) {
          opts.tokens[i].pattern = new RegExp(opts.tokens[i].pattern)
        }
      }
    }

    this._opts = {
      mask: opts.mask,
      tokens: { ...tokens, ...opts.tokens }
    }
    this._el = isString(el) ? document.querySelectorAll(el) : !el.length ? [el] : el

    this.init()
  }

  init () {
    for (let i = 0; i < this._el.length; i++) {
      const el = findInputElement(this._el[i])
      if (this._opts.mask && (!el.dataset.mask || el.dataset.mask !== this._opts.mask)) {
        el.dataset.mask = this._opts.mask
      }
      this.updateValue(el)
      if (!el.dataset.maskInited) {
        el.dataset.maskInited = true
        el.addEventListener('input', evt => this.updateValue(evt.target))
        el.addEventListener('beforeinput', evt => this.beforeInput(evt))
      }
    }
  }

  destroy () {
    for (let i = 0; i < this._el.length; i++) {
      const el = findInputElement(this._el[i])
      el.removeEventListener('input', evt => this.updateValue(evt.target))
      el.removeEventListener('beforeinput', evt => this.beforeInput(evt))
      delete el.dataset.mask
      delete el.dataset.maskInited
    }
  }

  updateValue (el) {
    const wrongNum = el.type.match(/^number$/i) && el.validity.badInput
    if ((!el.value && !wrongNum) || !el.dataset.mask) return

    const position = el.selectionEnd
    const oldValue = el.value
    const digit = oldValue[position - 1]
    el.value = mask(el.value, el.dataset.mask, this._opts.tokens)
    fixInputSelection(el, position, digit)
    if (el.value !== oldValue) {
      el.dispatchEvent(event('input'))
    }
  }

  beforeInput (e) {
    if (e.target.type.match(/^number$/i) && e.data && isNaN(e.target.value + e.data)) {
      e.preventDefault()
    }
  }
}
