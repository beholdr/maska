import { Mask, MaskOptions } from './mask'
import { parseMask, parseOpts, parseTokens } from './parser'

export interface MaskInputOptions extends MaskOptions {
  onMaska?: (detail: MaskaDetail) => void
  preProcess?: (value: string) => string
  postProcess?: (value: string) => string
}

export interface MaskaDetail {
  masked: string
  unmasked: string
  completed: boolean
}

export class MaskInput {
  readonly items = new Map<HTMLInputElement, Mask>()

  constructor (
    target: string | NodeListOf<HTMLInputElement> | HTMLInputElement,
    readonly options: MaskInputOptions = {}
  ) {
    const { onMaska, preProcess, postProcess, ...opts } = options

    if (typeof target === 'string') {
      this.init(Array.from(document.querySelectorAll(target)), opts)
    } else {
      this.init('length' in target ? Array.from(target) : [target], opts)
    }
  }

  destroy (): void {
    for (const input of this.items.keys()) {
      input.removeEventListener('input', this.inputEvent)
      input.removeEventListener('beforeinput', this.beforeinputEvent)
    }
    this.items.clear()
  }

  private init (inputs: HTMLInputElement[], defaults: MaskOptions): void {
    for (const input of inputs) {
      const opts = { ...defaults }
      if (input.dataset.maska != null && input.dataset.maska !== '') {
        opts.mask = parseMask(input.dataset.maska)
      }
      if (input.dataset.maskaEager != null) {
        opts.eager = parseOpts(input.dataset.maskaEager)
      }
      if (input.dataset.maskaReversed != null) {
        opts.reversed = parseOpts(input.dataset.maskaReversed)
      }
      if (input.dataset.maskaTokensReplace != null) {
        opts.tokensReplace = parseOpts(input.dataset.maskaTokensReplace)
      }
      if (input.dataset.maskaTokens != null) {
        opts.tokens = parseTokens(input.dataset.maskaTokens)
      }

      const mask = new Mask(opts)
      this.items.set(input, mask)

      if (input.value !== '') {
        this.setMaskedValue(input, input.value)
      }

      input.addEventListener('input', this.inputEvent)
      input.addEventListener('beforeinput', this.beforeinputEvent)
    }
  }

  private readonly beforeinputEvent = (e: Event | InputEvent): void => {
    const input = e.target as HTMLInputElement
    const mask = this.items.get(input) as Mask

    // delete first character in eager mask when it's the only left
    if (
      mask.eager &&
      'inputType' in e &&
      e.inputType.startsWith('delete') &&
      mask.unmasked(input.value).length <= 1
    ) {
      this.setMaskedValue(input, '')
    }
  }

  private readonly inputEvent = (e: Event | InputEvent): void => {
    const input = e.target as HTMLInputElement
    const mask = this.items.get(input) as Mask

    const valueOld = input.value
    const ss = input.selectionStart
    const se = input.selectionEnd
    let value = valueOld

    if (mask.eager) {
      const unmasked = mask.unmasked(valueOld)
      const maskedUnmasked = mask.masked(unmasked)

      if (unmasked === '' && 'data' in e && e.data != null) {
        // empty state and something like `space` pressed
        value = e.data
      } else if (
        maskedUnmasked.startsWith(valueOld) ||
        mask.completed(unmasked)
      ) {
        value = unmasked
      }
    }

    this.setMaskedValue(input, value)

    // set caret position
    if ('inputType' in e) {
      if (
        e.inputType.startsWith('delete') ||
        (ss != null && ss < valueOld.length)
      ) {
        input.setSelectionRange(ss, se)
      }
    }
  }

  private setMaskedValue (input: HTMLInputElement, value: string): void {
    const mask = this.items.get(input) as Mask

    if (this.options.preProcess != null) {
      value = this.options.preProcess(value)
    }

    value = mask.masked(value)

    if (this.options.postProcess != null) {
      value = this.options.postProcess(value)
    }

    input.value = value

    const detail = {
      masked: mask.masked(value),
      unmasked: mask.unmasked(value),
      completed: mask.completed(value)
    }

    if (this.options.onMaska != null) {
      this.options.onMaska(detail)
    }
    input.dispatchEvent(new CustomEvent<MaskaDetail>('maska', { detail }))
  }
}
