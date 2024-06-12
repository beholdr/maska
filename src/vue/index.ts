import { Directive, DirectiveBinding } from 'vue'
import { MaskaDetail, MaskInput, MaskInputOptions } from '..'

type MaskaDirective = Directive<HTMLElement, MaskInputOptions | string | undefined>

const masks = new WeakMap<HTMLInputElement, MaskInput>()

const setArg = (binding: DirectiveBinding, value: string | boolean): void => {
  if (binding.arg == null || (binding.instance == null)) return

  const isComposition = 'setup' in binding.instance.$.type

  if (binding.arg in binding.instance) {
    // @ts-expect-error
    binding.instance[binding.arg] = value
  } else if (isComposition) {
    console.warn('Maska: please expose `%s` using defineExpose', binding.arg)
  }
}

export const vMaska: MaskaDirective = (el, binding) => {
  const input = el instanceof HTMLInputElement ? el : el.querySelector('input')

  if (input == null || input?.type === 'file') return

  let opts: MaskInputOptions = {}

  if (binding.value != null) {
    opts = typeof binding.value === 'string' ? { mask: binding.value } : { ...binding.value }
  }

  if (binding.arg != null) {
    const updateArg = (detail: MaskaDetail): void => {
      const value = binding.modifiers.unmasked
        ? detail.unmasked
        : binding.modifiers.completed
          ? detail.completed
          : detail.masked

      setArg(binding, value)
    }

    opts.onMaska =
      opts.onMaska == null
        ? updateArg
        : Array.isArray(opts.onMaska)
          ? [...opts.onMaska, updateArg]
          : [opts.onMaska, updateArg]
  }

  if (masks.has(input)) {
    masks.get(input)?.update(opts)
  } else {
    masks.set(input, new MaskInput(input, opts))
  }
}
