import { Directive } from 'vue'
import { MaskaDetail, MaskInput, MaskInputOptions } from './mask-input'

type MaskaDirective = Directive<HTMLElement, MaskaDetail | undefined>

const masks = new WeakMap<HTMLInputElement, MaskInput>()

const checkValue = (input: HTMLInputElement): void => {
  const value = input.dataset.maskaValue
  if (
    (value == null && input.value !== '') ||
    (value != null && value !== input.value)
  ) {
    input.dispatchEvent(new CustomEvent('input'))
  }
}

export const vMaska: MaskaDirective = (el, binding) => {
  const input = el instanceof HTMLInputElement ? el : el.querySelector('input')
  const opts = { ...(binding.arg as MaskInputOptions) } ?? {}

  if (input == null) return

  const existed = masks.get(input)
  if (existed != null) {
    checkValue(input)

    if (!existed.needUpdate(input, opts)) {
      return
    }

    existed.destroy()
  }

  if (binding.value != null) {
    const binded = binding.value
    const onMaska = (detail: MaskaDetail): void => {
      binded.masked = detail.masked
      binded.unmasked = detail.unmasked
      binded.completed = detail.completed
    }

    opts.onMaska =
      opts.onMaska == null
        ? onMaska
        : Array.isArray(opts.onMaska)
          ? [...opts.onMaska, onMaska]
          : [opts.onMaska, onMaska]
  }

  masks.set(input, new MaskInput(input, opts))

  // timeout to process initial v-model value
  setTimeout(() => {
    checkValue(input)
  })
}
