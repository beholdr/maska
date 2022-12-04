import { Directive } from 'vue'
import { MaskaDetail, MaskInput, MaskInputOptions } from './mask-input'

type MaskaDirective = Directive<HTMLInputElement, MaskaDetail | undefined>

const masks = new WeakMap<HTMLInputElement, MaskInput>()

export const vMaska: MaskaDirective = (el, binding) => {
  if (masks.get(el) != null) {
    masks.get(el)?.destroy()
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

  masks.set(el, new MaskInput(el, opts))
}
