import { Directive } from 'vue'
import { MaskaDetail, MaskInput, MaskInputOptions } from './mask-input'

type MaskaDirective = Directive<HTMLElement, MaskaDetail | undefined>

const masks = new WeakMap<HTMLInputElement, MaskInput>()

export const vMaska: MaskaDirective = (el, binding) => {
  const input = el instanceof HTMLInputElement ? el : el.querySelector('input')
  if (input == null) return

  if (masks.get(input) != null) {
    masks.get(input)?.destroy()
  }

  const opts = { ...(binding.arg as MaskInputOptions) } ?? {}

  if (binding.value != null) {
    const binded = binding.value
    opts.onMaska = (detail: MaskaDetail) => {
      binded.masked = detail.masked
      binded.unmasked = detail.unmasked
      binded.completed = detail.completed
    }
  }

  masks.set(input, new MaskInput(input, opts))
}
