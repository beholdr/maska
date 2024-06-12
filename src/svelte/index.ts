import { Action } from 'svelte/action'
import { MaskaDetail, MaskInput, MaskInputOptions } from '..'

const masks = new WeakMap<HTMLInputElement, MaskInput>()

type MaskaAction = Action<HTMLElement, MaskInputOptions | string | undefined, {
  'on:maska': (detail: CustomEvent<MaskaDetail>) => void
}>

export const maska: MaskaAction = (node, value = {}) => {
  const input = node instanceof HTMLInputElement ? node : node.querySelector('input')

  if (input == null || input?.type === 'file') return

  let opts = value

  if (typeof opts === 'string') {
    opts = { mask: opts }
  }

  masks.set(input, new MaskInput(input, opts))

  return {
    update (opts) {
      if (typeof opts === 'string') {
        opts = { mask: opts }
      }

      masks.get(input)?.update(opts)
    },

    destroy () {
      masks.get(input)?.destroy()
    }
  }
}
