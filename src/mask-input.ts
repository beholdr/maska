import { Mask, MaskOptions } from './mask'
import { parseInput } from './parser'

type OnMaskaType = (detail: MaskaDetail) => void

export interface MaskInputOptions extends MaskOptions {
  onMaska?: OnMaskaType | OnMaskaType[]
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
    if (typeof target === 'string') {
      this.init(
        Array.from(document.querySelectorAll(target)),
        this.getMaskOpts(options)
      )
    } else {
      this.init(
        'length' in target ? Array.from(target) : [target],
        this.getMaskOpts(options)
      )
    }
  }

  destroy (): void {
    for (const input of this.items.keys()) {
      input.removeEventListener('input', this.inputEvent)
      input.removeEventListener('beforeinput', this.beforeinputEvent)
    }
    this.items.clear()
  }

  needUpdate (input: HTMLInputElement, opts: MaskInputOptions): boolean {
    const mask = this.items.get(input) as Mask
    const maskNew = new Mask(parseInput(input, this.getMaskOpts(opts)))

    return JSON.stringify(mask.opts) !== JSON.stringify(maskNew.opts)
  }

  private getMaskOpts (options: MaskInputOptions): MaskOptions {
    const { onMaska, preProcess, postProcess, ...opts } = options

    return opts
  }

  private init (inputs: HTMLInputElement[], defaults: MaskOptions): void {
    for (const input of inputs) {
      const mask = new Mask(parseInput(input, defaults))
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
      mask.isEager() &&
      'inputType' in e &&
      e.inputType.startsWith('delete') &&
      mask.unmasked(input.value).length <= 1
    ) {
      this.setMaskedValue(input, '')
    }
  }

  private readonly inputEvent = (e: Event | InputEvent): void => {
    if (
      e instanceof CustomEvent &&
      e.type === 'input' &&
      e.detail != null &&
      typeof e.detail === 'object' &&
      'masked' in e.detail
    ) {
      return
    }

    const input = e.target as HTMLInputElement
    const mask = this.items.get(input) as Mask

    const valueOld = input.value
    const ss = input.selectionStart
    const se = input.selectionEnd
    let value = valueOld

    if (mask.isEager()) {
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
        try {
          // see https://github.com/beholdr/maska/issues/118
          input.setSelectionRange(ss, se)
        } catch {}
      }
    }
  }

  private setMaskedValue (input: HTMLInputElement, value: string): void {
    const mask = this.items.get(input) as Mask

    if (this.options.preProcess != null) {
      value = this.options.preProcess(value)
    }

    value = mask.masked(value)

    const detail = {
      masked: mask.masked(value),
      unmasked: mask.unmasked(value),
      completed: mask.completed(value)
    }

    if (this.options.postProcess != null) {
      value = this.options.postProcess(value)
    }

    input.value = value
    input.dataset.maskaValue = value

    if (this.options.onMaska != null) {
      if (Array.isArray(this.options.onMaska)) {
        this.options.onMaska.forEach((f) => f(detail))
      } else {
        this.options.onMaska(detail)
      }
    }
    input.dispatchEvent(new CustomEvent<MaskaDetail>('maska', { detail }))
    input.dispatchEvent(new CustomEvent<MaskaDetail>('input', { detail }))
  }
}
