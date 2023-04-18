import { MaskTokens, tokens } from './tokens'

export type MaskType = string | string[] | ((input: string) => string) | null

export interface MaskOptions {
  mask?: MaskType
  tokens?: MaskTokens
  tokensReplace?: boolean
  eager?: boolean
  reversed?: boolean
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
          token.pattern = new RegExp(token.pattern)
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

  masked (value: string): string {
    return this.process(value, this.findMask(value))
  }

  unmasked (value: string): string {
    return this.process(value, this.findMask(value), false)
  }

  isEager (): boolean {
    return this.opts.eager === true
  }

  isReversed (): boolean {
    return this.opts.reversed === true
  }

  completed (value: string): boolean {
    const mask = this.findMask(value)
    if (this.opts.mask == null || mask == null) return false

    const length = this.process(value, mask).length

    if (typeof this.opts.mask === 'string') {
      return length >= this.opts.mask.length
    } else if (typeof this.opts.mask === 'function') {
      return length >= mask.length
    } else {
      return (
        this.opts.mask.filter((m) => length >= m.length).length ===
        this.opts.mask.length
      )
    }
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

    return (
      mask.find((el) => this.process(value, el, false).length >= l.length) ?? ''
    )
  }

  private isEscape (ch: string) {
    if (ch === '!' && !this.opts.tokensReplace) {
      return true
    } else {
      for (let tokensKey in this.opts.tokens) {
        if (tokensKey === ch && this.opts.tokens[tokensKey].escape) {
          return true
        }
      }
    }
    return false;
  }

  private escapeMask (maskRaw: string): {
    mask: string
    escaped: number[]
  } {
    const chars: string[] = []
    const escaped: number[] = []
    maskRaw.split('').forEach((ch, i) => {
      if (this.isEscape(ch) && !this.isEscape(maskRaw[i - 1])) {
        escaped.push(i - escaped.length)
      } else {
        chars.push(ch)
      }
    })

    return { mask: chars.join(''), escaped }
  }

  private process (
    value: string,
    maskRaw: string | null,
    masked = true
  ): string {
    if (maskRaw == null) return value

    const key = `value=${value},mask=${maskRaw},masked=${masked ? 1 : 0}`
    if (this.memo.has(key)) return this.memo.get(key)

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

    while (check()) {
      const maskChar = mask.charAt(m)
      const token = tokens[maskChar]
      const valueChar =
        token?.transform != null
          ? token.transform(value.charAt(v))
          : value.charAt(v)

      if (!escaped.includes(m) && token != null) {
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
            m -= offset
          }

          m += offset
        } else if (token.multiple as boolean) {
          const hasValue = result[v - offset]?.match(token.pattern) != null
          const nextMask = mask.charAt(m + offset)
          if (hasValue && nextMask !== '' && tokens[nextMask] == null) {
            m += offset
            v -= offset
          } else {
            result[method]('')
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
        while (
          notLastMaskChar(m) &&
          (tokens[mask.charAt(m)] == null || escaped.includes(m))
        ) {
          if (masked) {
            result[method](mask.charAt(m))
          } else if (mask.charAt(m) === value.charAt(v)) {
            v += offset
          }
          m += offset
        }
      }
    }

    this.memo.set(key, result.join(''))

    return this.memo.get(key)
  }
}
