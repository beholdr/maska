import { MaskTokens, tokens } from './tokens'

export type MaskType = string | string[] | ((input: string) => string)

export interface MaskOptions {
  mask?: MaskType
  tokens?: MaskTokens
  tokensReplace?: boolean
  eager?: boolean
  reversed?: boolean
}

export class Mask {
  readonly mask: MaskType = ''
  readonly tokens = tokens
  readonly eager = false
  readonly reversed = false
  private readonly memo = new Map()

  constructor (opts: MaskOptions = {}) {
    if (opts.tokens != null) {
      opts.tokens = (opts.tokensReplace as boolean)
        ? { ...opts.tokens }
        : { ...tokens, ...opts.tokens }

      for (const token of Object.values(opts.tokens)) {
        if (typeof token.pattern === 'string') {
          token.pattern = new RegExp(token.pattern)
        }
      }
    }

    if (opts.mask == null) {
      opts.mask = ''
    } else if (typeof opts.mask === 'object') {
      if (opts.mask.length > 1) {
        opts.mask.sort((a, b) => a.length - b.length)
      } else {
        opts.mask = opts.mask[0] ?? ''
      }
    }

    Object.assign(this, opts)
  }

  masked (value: string): string {
    return this.process(value, this.findMask(value))
  }

  unmasked (value: string): string {
    return this.process(value, this.findMask(value), false)
  }

  completed (value: string): boolean {
    const length = this.process(value, this.findMask(value)).length

    if (typeof this.mask === 'string') {
      return length >= this.mask.length
    } else if (typeof this.mask === 'function') {
      return length >= this.findMask(value).length
    } else {
      return (
        this.mask.filter((m) => length >= m.length).length === this.mask.length
      )
    }
  }

  private findMask (value: string): string {
    if (typeof this.mask === 'string') {
      return this.mask
    } else if (typeof this.mask === 'function') {
      return this.mask(value)
    }

    const last = this.process(value, this.mask.slice(-1).pop() ?? '', false)

    return (
      this.mask.find(
        (mask) => this.process(value, mask, false).length >= last.length
      ) ?? ''
    )
  }

  private escapeMask (maskRaw: string): {
    mask: string
    escaped: number[]
  } {
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

  private process (value: string, maskRaw: string, masked = true): string {
    const key = `value=${value},mask=${maskRaw},masked=${masked ? 1 : 0}`
    if (this.memo.has(key)) return this.memo.get(key)

    const { mask, escaped } = this.escapeMask(maskRaw)
    const result: string[] = []
    const offset = this.reversed ? -1 : 1
    const method = this.reversed ? 'unshift' : 'push'
    const lastMaskChar = this.reversed ? 0 : mask.length - 1

    const check = this.reversed
      ? () => m > -1 && v > -1
      : () => m < mask.length && v < value.length

    const notLastMaskChar = (m: number): boolean =>
      (!this.reversed && m <= lastMaskChar) ||
      (this.reversed && m >= lastMaskChar)

    let lastRawMaskChar
    let repeatedPos = -1
    let m = this.reversed ? mask.length - 1 : 0
    let v = this.reversed ? value.length - 1 : 0

    while (check()) {
      const maskChar = mask.charAt(m)
      const token = this.tokens[maskChar]
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
          if (hasValue && nextMask !== '' && this.tokens[nextMask] == null) {
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
        if (masked && !this.eager) {
          result[method](maskChar)
        }

        if (valueChar === maskChar && !this.eager) {
          v += offset
        } else {
          lastRawMaskChar = maskChar
        }

        if (!this.eager) {
          m += offset
        }
      }

      if (this.eager) {
        while (
          notLastMaskChar(m) &&
          (this.tokens[mask.charAt(m)] == null || escaped.includes(m))
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
