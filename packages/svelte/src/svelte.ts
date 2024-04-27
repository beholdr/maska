import { Action } from 'svelte/action'
import { MaskaDetail, MaskInput, MaskInputOptions } from '.'

const masks = new WeakMap<HTMLInputElement, MaskInput>()

type MaskaAction = Action<HTMLElement, MaskInputOptions | undefined, {
  'on:maska': (detail: CustomEvent<MaskaDetail>) => void
}>

export const maska: MaskaAction = (node, opts = {}) => {
  const input = node instanceof HTMLInputElement ? node : node.querySelector('input')

  if (input == null || input?.type === 'file') return

  masks.set(input, new MaskInput(input, opts))

  return {
    update (opts) {
      masks.get(input)?.update(opts)
    },

    destroy () {
      masks.get(input)?.destroy()
    }
  }
}
