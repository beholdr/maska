import {
  Mask,
  MaskType,
  MaskOptions,
  MaskInput,
  MaskInputOptions,
  MaskaDetail,
  tokens,
  MaskTokens
} from 'maska'
import { xMaska } from './alpine'

export { Mask, MaskInput, tokens, xMaska }
export type { MaskaDetail, MaskInputOptions, MaskOptions, MaskTokens, MaskType }

if (document.currentScript?.dataset.init !== undefined) {
  document.addEventListener('alpine:init', () => {
    // @ts-expect-error
    window.Alpine.plugin(xMaska)
  })
}
