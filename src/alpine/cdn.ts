import { Mask } from '../mask'
import { MaskInput } from '../input'
import { tokens } from '../tokens'
import { xMaska } from '.'

export { Mask, MaskInput, tokens, xMaska }

document.addEventListener('alpine:init', () => {
  // @ts-expect-error
  window.Alpine.plugin(xMaska)
})
