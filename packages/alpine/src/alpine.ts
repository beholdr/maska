import { Alpine } from 'alpinejs'
import { MaskaDetail, MaskInput, MaskInputOptions } from '.'

const masks = new WeakMap<HTMLInputElement, MaskInput>()

export const xMaska = (Alpine: Alpine): void => {
  Alpine.directive('maska', (el, directive, utilities) => {
    const input = el instanceof HTMLInputElement ? el : el.querySelector('input')

    if (input == null || input?.type === 'file') return

    utilities.effect(() => {
      const opts: MaskInputOptions =
        directive.expression != null
          ? utilities.evaluate(directive.expression)
          : {}

      if (directive.value != null) {
        const updateArg = (detail: MaskaDetail): void => {
          const value = directive.modifiers.includes('unmasked')
            ? detail.unmasked
            : directive.modifiers.includes('completed')
              ? detail.completed
              : detail.masked

          const data: Record<string, any> = utilities.Alpine.$data(input)
          if (directive.value in data) {
            data[directive.value] = value
          }
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
    })

    utilities.cleanup(() => masks.get(input)?.destroy())
  })
}
