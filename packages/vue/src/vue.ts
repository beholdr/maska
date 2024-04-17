import { Directive, DirectiveBinding } from 'vue'
import { MaskaDetail, MaskInput, MaskInputOptions } from '.'

type MaskaDirective = Directive<HTMLElement, MaskInputOptions | undefined>

const masks = new WeakMap<HTMLInputElement, MaskInput>()

// hacky way to update binding.arg without using defineExposed
const setArg = (binding: DirectiveBinding, value: string | boolean): void => {
  if (binding.arg == null || (binding.instance == null)) return

  const inst = binding.instance as any

  if (binding.arg in inst) {
    inst[binding.arg] = value // options api
  } else if (inst.$?.setupState != null && binding.arg in inst.$.setupState) {
    inst.$.setupState[binding.arg] = value // composition api
  }
}

export const vMaska: MaskaDirective = (el, binding) => {
  const input = el instanceof HTMLInputElement ? el : el.querySelector('input')
  const opts = binding.value != null ? { ...binding.value } : {}

  if (input == null || input?.type === 'file') return

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
