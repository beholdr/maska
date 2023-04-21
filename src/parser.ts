import { MaskOptions, MaskType } from './mask'
import { MaskTokens } from './tokens'

const parseJson = (value: string): any => JSON.parse(value.replaceAll("'", '"'))

export const parseInput = (
  input: HTMLInputElement,
  defaults: MaskOptions = {}
): MaskOptions => {
  const opts = { ...defaults }

  if (input.dataset.maska != null && input.dataset.maska !== '') {
    opts.mask = parseMask(input.dataset.maska)
  }
  if (input.dataset.maskaEager != null) {
    opts.eager = parseOpts(input.dataset.maskaEager)
  }
  if (input.dataset.maskaReversed != null) {
    opts.reversed = parseOpts(input.dataset.maskaReversed)
  }
  if (input.dataset.maskaTokensReplace != null) {
    opts.tokensReplace = parseOpts(input.dataset.maskaTokensReplace)
  }
  if (input.dataset.maskaTokens != null) {
    opts.tokens = parseTokens(input.dataset.maskaTokens)
  }

  return opts
}

const parseOpts = (value: string): boolean =>
  value !== '' ? Boolean(JSON.parse(value)) : true

const parseMask = (value: string): MaskType =>
  value.startsWith('[') && value.endsWith(']') ? parseJson(value) : value

const parseTokens = (value: string): MaskTokens => {
  if (value.startsWith('{') && value.endsWith('}')) {
    return parseJson(value)
  }

  const tokens: MaskTokens = {}
  value.split('|').forEach((token) => {
    const parts = token.split(':')
    tokens[parts[0]] = {
      pattern: new RegExp(parts[1]),
      optional: parts[2] === 'optional',
      multiple: parts[2] === 'multiple',
      repeated: parts[2] === 'repeated'
    }
  })

  return tokens
}
