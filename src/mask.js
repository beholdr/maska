export default function mask (value, mask, tokens, masked = true) {
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
