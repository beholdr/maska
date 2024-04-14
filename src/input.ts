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
  private readonly abort = new AbortController()

  constructor (target: MaskaTarget, private options: MaskInputOptions = {}) {
    this.init(this.getInputs(target))
  }

  update (options: MaskInputOptions = {}): void {
    const needUpdate = JSON.stringify(options) !== JSON.stringify(this.options)
    this.options = options

    this.init(Array.from(this.items.keys()), needUpdate)
  }

  updateValue (input: HTMLInputElement): void {
    if (input.value !== '' && input.value !== this.processInput(input).masked) {
      this.setValue(input, input.value)
    }
  }

  destroy (): void {
    this.abort.abort()
    this.items.clear()
  }

  private init (inputs: HTMLInputElement[], update = true): void {
    const defaults = this.getOptions(this.options)

    for (const input of inputs) {
      if (!this.items.has(input)) {
        input.addEventListener('input', this.onInput, {
          signal: this.abort.signal,
          capture: true
        })
      }

      const mask = new Mask(parseInput(input, defaults))
      this.items.set(input, mask)

      if (update) {
        this.updateValue(input)

        if (input.selectionStart === null && mask.isEager()) {
          console.warn('Maska: input of `%s` type is not supported', input.type)
        }
      }
    }
  }

  private getInputs (target: MaskaTarget): HTMLInputElement[] {
    if (typeof target === 'string') {
      return Array.from(document.querySelectorAll(target))
    }

    return 'length' in target ? Array.from(target) : [target]
  }

  private getOptions (options: MaskInputOptions): MaskOptions {
    const { onMaska, preProcess, postProcess, ...opts } = options

    return opts
  }

  private readonly onInput = (e: Event | InputEvent): void => {
    if (e instanceof CustomEvent && e.type === 'input') {
      return
    }

    const input = e.target as HTMLInputElement
    const mask = this.items.get(input) as Mask
    const isDelete = 'inputType' in e && e.inputType.startsWith('delete')
    const isEager = mask.isEager()

    const value = (isDelete && isEager && mask.unmasked(input.value) === '')
      ? ''
      : input.value

    this.fixCursor(input, isDelete, () => this.setValue(input, value))
  }

  private fixCursor (input: HTMLInputElement, isDelete: boolean, closure: CallableFunction): void {
    const pos = input.selectionStart
    const value = input.value

    closure()

    // if pos is null, it means element does not support setSelectionRange
    // and when cursor at the end, process only on delete event
    if (pos === null || (pos === value.length && !isDelete)) return

    const valueNew = input.value
    const leftPart = value.slice(0, pos)
    const leftPartNew = valueNew.slice(0, pos)
    const unmasked = this.processInput(input, leftPart).unmasked
    const unmaskedNew = this.processInput(input, leftPartNew).unmasked
    const newPos = pos + (unmasked.length - unmaskedNew.length)

    input.setSelectionRange(newPos, newPos)
  }

  private setValue (input: HTMLInputElement, value: string): void {
    const detail = this.processInput(input, value)

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

  private processInput (input: HTMLInputElement, value?: string): MaskaDetail {
    const mask = this.items.get(input) as Mask
    let valueNew = value ?? input.value

    if (this.options.preProcess != null) {
      valueNew = this.options.preProcess(valueNew)
    }

    let masked = mask.masked(valueNew)

    if (this.options.postProcess != null) {
      masked = this.options.postProcess(masked)
    }

    return {
      masked,
      unmasked: mask.unmasked(valueNew),
      completed: mask.completed(valueNew)
    }
  }
}
