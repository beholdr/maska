import { MaskOptions } from './mask'

const prepare = (input: string, group: string, decimal: string): string =>
  input.replaceAll(group, '').replace(decimal, '.').replace('..', '.').replace(/[^.\d]/g, '')

const createFormatter = (min: number, max: number, opts: MaskOptions): Intl.NumberFormat =>
  new Intl.NumberFormat(opts.number?.locale ?? 'en', {
    minimumFractionDigits: min,
    maximumFractionDigits: max,
    roundingMode: 'trunc'
  })

export const processNumber = (value: string, masked = true, opts: MaskOptions): string => {
  const sign = opts.number?.unsigned !== true && value.startsWith('-') ? '-' : ''
  const fraction = opts.number?.fraction ?? 0

  let formatter = createFormatter(0, fraction, opts)
  const parts = formatter.formatToParts(1000.12)
  const group = parts.find((part) => part.type === 'group')?.value ?? ' '
  const decimal = parts.find((part) => part.type === 'decimal')?.value ?? '.'
  const float = prepare(value, group, decimal)

  if (Number.isNaN(parseFloat(float))) return sign

  // allow zero at the end
  const floatParts = float.split('.')
  if (floatParts[1] != null && floatParts[1].length >= 1) {
    const min = floatParts[1].length <= fraction ? floatParts[1].length : fraction
    formatter = createFormatter(min, fraction, opts)
  }

  let result = formatter.format(parseFloat(float))

  if (!masked) {
    result = prepare(result, group, decimal)
  } else if (fraction > 0 && float.endsWith('.') && !float.slice(0, -1).includes('.')) {
    // if ends with decimal separator
    result += decimal
  }

  return sign + result
}
