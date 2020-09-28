export default function mask (value, mask, tokens, masked = true) {
  return (processMask(mask).length > 1)
    ? dynamic(mask)(value, mask, tokens, masked)
    : process(value, mask, tokens, masked)
}

function processMask (mask) {
  try {
    return JSON.parse(mask)
  } catch {
    return [mask]
  }
}

function dynamic (mask) {
  const masks = processMask(mask).sort((a, b) => a.length - b.length)

  return function (value, mask, tokens, masked = true) {
    let i = 0
    while (i < masks.length) {
      const currentMask = masks[i]
      i++
      const nextMask = masks[i]
      if (!(nextMask && process(value, nextMask, tokens, true).length > currentMask.length)) {
        return process(value, currentMask, tokens, masked)
      }
    }
    return '' // empty masks
  }
}

function process (value, mask, tokens, masked = true) {
  let im = 0
  let iv = 0
  let ret = ''
  let rest = ''

  while (im < mask.length && iv < value.length) {
    let maskChar = mask[im]
    const valueChar = value[iv]
    const token = tokens[maskChar]

    if (token && token.pattern) {
      if (token.pattern.test(valueChar)) {
        ret += tokenTransform(valueChar, token)
        im++
        // check next char
        if (masked && mask[im] && !tokens[mask[im]]) {
          ret += mask[im]
          im++
        }
      }
      iv++
    } else if (token && token.repeat) {
      const tokenPrev = tokens[mask[im - 1]]
      if (tokenPrev && !tokenPrev.pattern.test(valueChar)) {
        im++
      } else {
        im--
      }
    } else {
      if (token && token.escape) {
        im++
        maskChar = mask[im]
      }
      if (masked) ret += maskChar
      if (valueChar === maskChar) iv++
      im++
    }
  }

  // fix mask that ends with parentesis
  while (masked && im < mask.length) { // eslint-disable-line no-unmodified-loop-condition
    const maskCharRest = mask[im]
    if (tokens[maskCharRest]) {
      rest = ''
      break
    }
    rest += maskCharRest
    im++
  }

  return ret + rest
}

function tokenTransform (value, token) {
  if (token.uppercase) {
    return value.toLocaleUpperCase()
  } else if (token.lowercase) {
    return value.toLocaleLowerCase()
  }

  return value
}
