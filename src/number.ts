import { MaskOptions } from './mask'

const prepare = (input: string, group: string, decimal: string): string =>
  input.replaceAll(group, '').replace(decimal, '.').replace('..', '.').replace(/[^.\d]/g, '')

const plainNumberFormatter = (min: number, max: number): Intl.NumberFormat =>
  new Intl.NumberFormat('en', {
    useGrouping: false,
    minimumFractionDigits: min,
    maximumFractionDigits: max,
    roundingMode: 'trunc'
  })

const truncNumber = (value: number, max: number): string =>
  plainNumberFormatter(0, max).format(value)

const maskFormatter = (min: number, max: number, opts: MaskOptions): Intl.NumberFormat =>
  new Intl.NumberFormat(opts.number?.locale ?? 'en', {
    minimumFractionDigits: min,
    maximumFractionDigits: max,
    roundingMode: 'trunc'
  })

const extractNumberFromString = (value: string, masked = true, fraction = 0, opts: MaskOptions): string => {
  const numParser = masked ? plainNumberFormatter(0, fraction) : maskFormatter(0, fraction, opts)
  const parts = numParser.formatToParts(1000.12)
  const group = parts.find((part) => part.type === 'group')?.value ?? ' '
  const decimal = parts.find((part) => part.type === 'decimal')?.value ?? '.'
  return prepare(value, group, decimal)
}

export const processNumber = (value: string, masked = true, opts: MaskOptions): string => {
  const sign = opts.number?.unsigned == null && value.startsWith('-') ? '-' : ''
  const fraction = opts.number?.fraction ?? 0

  const float = extractNumberFromString(value, masked, fraction, opts)
  const floatNum = parseFloat(float)
  if (Number.isNaN(floatNum)) return sign

  if (!masked) {
    return sign + truncNumber(floatNum, fraction)
  }

  let formatter = maskFormatter(0, fraction, opts)
  const parts = formatter.formatToParts(1000.12)
  const decimal = parts.find((part) => part.type === 'decimal')?.value ?? '.'

  // allow zero at the end
  const floatParts = float.split('.')
  if (floatParts[1] != null && floatParts[1].length >= 1) {
    const min = floatParts[1].length <= fraction ? floatParts[1].length : fraction
    formatter = maskFormatter(min, fraction, opts)
  }

  let result = formatter.format(parseFloat(float))

  if (fraction > 0 && float.endsWith('.') && !float.slice(0, -1).includes('.')) {
    // if ends with decimal separator
    result += decimal
  }

  return sign + result
}
