import mask from './mask'
import tokens from './tokens'
import { event, findInputElement, fixInputSelection, isString } from './utils'

export default class Maska {
  constructor (el, opts = {}) {
    if (!el) throw new Error('Maska: no element for mask')

    if (opts.preprocessor != null && typeof opts.preprocessor !== 'function') {
      throw new Error('Maska: preprocessor must be a function')
    }

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
      tokens: { ...tokens, ...opts.tokens },
      preprocessor: opts.preprocessor
    }
    this._el = isString(el) ? document.querySelectorAll(el) : !el.length ? [el] : el
    this.inputEvent = (e) => this.updateValue(e.target, e)

    this.init()
  }

  init () {
    for (let i = 0; i < this._el.length; i++) {
      const el = findInputElement(this._el[i])
      if (this._opts.mask && (!el.dataset.mask || el.dataset.mask !== this._opts.mask)) {
        el.dataset.mask = this._opts.mask
      }
      setTimeout(() => this.updateValue(el), 0)
      if (!el.dataset.maskInited) {
        el.dataset.maskInited = true
        el.addEventListener('input', this.inputEvent)
        el.addEventListener('beforeinput', this.beforeInput)
      }
    }
  }

  destroy () {
    for (let i = 0; i < this._el.length; i++) {
      const el = findInputElement(this._el[i])
      el.removeEventListener('input', this.inputEvent)
      el.removeEventListener('beforeinput', this.beforeInput)
      delete el.dataset.mask
      delete el.dataset.maskInited
    }
  }

  updateValue (el, evt) {
    if (!el || !el.type) return

    const wrongNum = el.type.match(/^number$/i) && el.validity.badInput
    if ((!el.value && !wrongNum) || !el.dataset.mask) {
      el.dataset.maskRawValue = ''
      this.dispatch('maska', el, evt)
      return
    }

    let position = el.selectionEnd
    const oldValue = el.value
    const digit = oldValue[position - 1]

    el.dataset.maskRawValue = mask(el.value, el.dataset.mask, this._opts.tokens, false)
    let elValue = el.value

    if (this._opts.preprocessor) {
      elValue = this._opts.preprocessor(elValue)
    }

    el.value = mask(elValue, el.dataset.mask, this._opts.tokens)

    if (evt && evt.inputType === 'insertText' && position === oldValue.length) {
      position = el.value.length
    }
    fixInputSelection(el, position, digit)

    this.dispatch('maska', el, evt)
    if (el.value !== oldValue) {
      this.dispatch('input', el, evt)
    }
  }

  beforeInput (e) {
    if (e && e.target && e.target.type && e.target.type.match(/^number$/i) && e.data && isNaN(e.target.value + e.data)) {
      e.preventDefault()
    }
  }

  dispatch (name, el, evt) {
    el.dispatchEvent(event(name, (evt && evt.inputType) || null))
  }
}
