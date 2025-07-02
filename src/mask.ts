import { MaskTokens, tokens } from './tokens'
import { processNumber } from './number'
import { supportsUnicodeRegex } from './parser'

export type MaskType = string | string[] | ((input: string) => string) | null

interface MaskNumber {
  locale?: string
  fraction?: number
  unsigned?: boolean
}

export interface MaskOptions {
  mask?: MaskType
  tokens?: MaskTokens
  tokensReplace?: boolean
  eager?: boolean
  reversed?: boolean
  number?: MaskNumber
}

export class Mask {
  readonly opts: MaskOptions = {}
  private readonly memo = new Map()

  constructor (defaults: MaskOptions = {}) {
    const opts = { ...defaults }

    if (opts.tokens != null) {
      opts.tokens = (opts.tokensReplace as boolean)
        ? { ...opts.tokens }
        : { ...tokens, ...opts.tokens }

      for (const token of Object.values(opts.tokens)) {
        if (typeof token.pattern === 'string') {
          token.pattern = supportsUnicodeRegex()
            ? new RegExp(token.pattern, 'u')
            : new RegExp(token.pattern)
        }
      }
    } else {
      opts.tokens = tokens
    }

    if (Array.isArray(opts.mask)) {
      if (opts.mask.length > 1) {
        opts.mask = [...opts.mask].sort((a, b) => a.length - b.length)
      } else {
        opts.mask = opts.mask[0] ?? ''
      }
    }
    if (opts.mask === '') {
      opts.mask = null
    }

    this.opts = opts
  }

  masked (value: string | number): string {
    return this.process(String(value), this.findMask(String(value)))
  }

  unmasked (value: string | number): string {
    return this.process(String(value), this.findMask(String(value)), false)
  }

  isEager (): boolean {
    return this.opts.eager === true
  }

  isReversed (): boolean {
    return this.opts.reversed === true
  }

  completed (value: string | number): boolean {
    const mask = this.findMask(String(value))

    if (this.opts.mask == null || mask == null) return false

    const length = this.process(String(value), mask).length

    if (typeof this.opts.mask === 'string') {
      return length >= this.opts.mask.length
    }

    return length >= mask.length
  }

  private findMask (value: string): string | null {
    const mask = this.opts.mask

    if (mask == null) {
      return null
    } else if (typeof mask === 'string') {
      return mask
    } else if (typeof mask === 'function') {
      return mask(value)
    }

    const l = this.process(value, mask.slice(-1).pop() ?? '', false)

    return mask.find((el) => this.process(value, el, false).length >= l.length) ?? ''
  }

  private escapeMask (maskRaw: string): { mask: string, escaped: number[] } {
    const chars: string[] = []
    const escaped: number[] = []

    maskRaw.split('').forEach((ch, i) => {
      if (ch === '!' && maskRaw[i - 1] !== '!') {
        escaped.push(i - escaped.length)
      } else {
        chars.push(ch)
      }
    })

    return { mask: chars.join(''), escaped }
  }

  private process (value: string, maskRaw: string | null, masked = true): string {
    if (this.opts.number != null) return processNumber(value, masked, this.opts)

    if (maskRaw == null) return value

    const memoKey = `v=${value},mr=${maskRaw},m=${masked ? 1 : 0}`

    if (this.memo.has(memoKey)) return this.memo.get(memoKey)

    const { mask, escaped } = this.escapeMask(maskRaw)
    const result: string[] = []
    const tokens = this.opts.tokens != null ? this.opts.tokens : {}
    const offset = this.isReversed() ? -1 : 1
    const method = this.isReversed() ? 'unshift' : 'push'
    const lastMaskChar = this.isReversed() ? 0 : mask.length - 1

    const check = this.isReversed()
      ? () => m > -1 && v > -1
      : () => m < mask.length && v < value.length

    const notLastMaskChar = (m: number): boolean =>
      (!this.isReversed() && m <= lastMaskChar) ||
      (this.isReversed() && m >= lastMaskChar)

    let lastRawMaskChar
    let repeatedPos = -1
    let m = this.isReversed() ? mask.length - 1 : 0
    let v = this.isReversed() ? value.length - 1 : 0
    let multipleMatched = false

    while (check()) {
      const maskChar = mask.charAt(m)
      const token = tokens[maskChar]
      const valueChar = token?.transform != null
        ? token.transform(value.charAt(v))
        : value.charAt(v)

      // mask symbol is token
      if (!escaped.includes(m) && token != null) {
        // value symbol matched token
        if (valueChar.match(token.pattern) != null) {
          result[method](valueChar)

          if (token.repeated as boolean) {
            if (repeatedPos === -1) {
              repeatedPos = m
            } else if (m === lastMaskChar && m !== repeatedPos) {
              m = repeatedPos - offset
            }

            if (lastMaskChar === repeatedPos) {
              m -= offset
            }
          } else if (token.multiple as boolean) {
            multipleMatched = true
            m -= offset
          }

          m += offset
        } else if (token.multiple as boolean) {
          if (multipleMatched) {
            m += offset
            v -= offset
            multipleMatched = false
          } else {
            // invalid input
          }
        } else if (valueChar === lastRawMaskChar) {
          // matched the last untranslated (raw) mask character that we encountered
          // likely an insert offset the mask character from the last entry;
          // fall through and only increment v
          lastRawMaskChar = undefined
        } else if (token.optional as boolean) {
          m += offset
          v -= offset
        } else {
          // invalid input
        }

        v += offset
      } else {
        // mask symbol is placeholder
        if (masked && !this.isEager()) {
          result[method](maskChar)
        }

        if (valueChar === maskChar && !this.isEager()) {
          v += offset
        } else {
          lastRawMaskChar = maskChar
        }

        if (!this.isEager()) {
          m += offset
        }
      }

      if (this.isEager()) {
        // fill up result with placeholder symbols
        while (notLastMaskChar(m) && (tokens[mask.charAt(m)] == null || escaped.includes(m))) {
          if (masked) {
            result[method](mask.charAt(m))

            if (value.charAt(v) === mask.charAt(m)) {
              m += offset
              v += offset
              continue
            }
          } else if (mask.charAt(m) === value.charAt(v)) {
            v += offset
          }

          m += offset
        }
      }
    }

    this.memo.set(memoKey, result.join(''))

    return this.memo.get(memoKey)
  }
}
