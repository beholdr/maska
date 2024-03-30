import { Mask, MaskOptions } from './mask'
import { parseInput } from './parser'

type OnMaskaType = (detail: MaskaDetail) => void
type MaskaTarget = string | NodeListOf<HTMLInputElement> | HTMLInputElement

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

  constructor(target: MaskaTarget, readonly options: MaskInputOptions = {}) {
    this.init(this.getInputs(target), this.getOptions(options))
  }

  update(options: MaskInputOptions = {}): void {
    this.init(Array.from(this.items.keys()), this.getOptions(options))
  }

  checkValue(input: HTMLInputElement) {
    if (input.value && input.value !== this.process(input).masked) {
      this.setMaskedValue(input, input.value)
    }
  }

  destroy(): void {
    for (const input of this.items.keys()) {
      input.removeEventListener('input', this.inputEvent)
      input.removeEventListener('beforeinput', this.beforeinputEvent)
    }
    this.items.clear()
  }

  private init(inputs: HTMLInputElement[], defaults: MaskOptions): void {
    for (const input of inputs) {
      if (!this.items.has(input)) {
        input.addEventListener('input', this.inputEvent)
        input.addEventListener('beforeinput', this.beforeinputEvent)
      }

      this.items.set(input, new Mask(parseInput(input, defaults)))
      this.checkValue(input)
    }
  }

  private getInputs(target: MaskaTarget): HTMLInputElement[] {
    if (typeof target === 'string') {
      return Array.from(document.querySelectorAll(target))
    }

    return 'length' in target ? Array.from(target) : [target]
  }

  private getOptions(options: MaskInputOptions): MaskOptions {
    const { onMaska, preProcess, postProcess, ...opts } = options

    return opts
  }

  private readonly beforeinputEvent = (e: InputEvent): void => {
    const input = e.target as HTMLInputElement
    const mask = this.items.get(input) as Mask

    if (
      mask.isEager() &&
      e.inputType.startsWith('delete') &&
      mask.unmasked(input.value).length <= 1
    ) {
      this.setMaskedValue(input, '')
    }
  }

  private readonly inputEvent = (e: Event | InputEvent): void => {
    if (e instanceof CustomEvent && e.type === 'input') {
      return
    }

    const input = e.target as HTMLInputElement
    const mask = this.items.get(input) as Mask
    const selection = input.selectionStart
    let value = input.value

    if (mask.isEager()) {
      const masked = mask.masked(value)
      const unmasked = mask.unmasked(value)
      const unmaskedMasked = mask.unmasked(masked)

      if (unmasked === '' && 'data' in e && e.data != null) {
        // empty state and something like `space` pressed
        value = e.data
      } else if (unmasked !== unmaskedMasked) {
        value = unmasked
      }
    }

    this.setMaskedValue(input, value)
    this.updateCursor(e, selection, value)
  }

  private updateCursor(e: Event | InputEvent, s: number | null, value: string) {
    if (!('inputType' in e) || s === null) return

    const input = e.target as HTMLInputElement

    if (e.inputType.startsWith('delete') || (s != null && s < value.length)) {
      // see https://github.com/beholdr/maska/issues/118
      try {
        input.setSelectionRange(s, s)
      } catch {}
    }
  }

  private setMaskedValue(input: HTMLInputElement, value: string): void {
    const detail = this.process(input, value)

    input.value = detail.masked

    if (this.options.onMaska != null) {
      if (Array.isArray(this.options.onMaska)) {
        this.options.onMaska.forEach((f) => f(detail))
      } else {
        this.options.onMaska(detail)
      }
    }

    input.dispatchEvent(new CustomEvent<MaskaDetail>('maska', { detail }))
    input.dispatchEvent(new CustomEvent('input', { detail: detail.masked }))
  }

  private process(input: HTMLInputElement, value?: string): MaskaDetail {
    const mask = this.items.get(input) as Mask
    let valueNew = value ?? input.value

    if (this.options.preProcess != null) {
      valueNew = this.options.preProcess(valueNew)
    }

    let masked = mask.masked(valueNew)
    const unmasked = mask.unmasked(mask.isEager() ? masked : valueNew)
    const completed = mask.completed(valueNew)

    if (this.options.postProcess != null) {
      masked = this.options.postProcess(masked)
    }

    return { masked, unmasked, completed }
  }
}
