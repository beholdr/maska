import { MaskType } from './mask'
import { MaskTokens } from './tokens'

const parseJson = (value: string): any => JSON.parse(value.replaceAll("'", '"'))

export const parseOpts = (value: string): boolean =>
  value !== '' ? Boolean(JSON.parse(value)) : true

export const parseMask = (value: string): MaskType =>
  value.startsWith('[') && value.endsWith(']') ? parseJson(value) : value

export const parseTokens = (value: string): MaskTokens => {
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
