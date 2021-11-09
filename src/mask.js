import defaultTokens from './tokens'

export default function mask (value, mask, tokens = defaultTokens, masked = true) {
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
    const processed = masks.map(m => process(value, m, tokens, false))
    const last = processed.pop()

    for (const i in masks) {
      if (checkMask(last, masks[i], tokens)) {
        return process(value, masks[i], tokens, masked)
      }
    }

    return '' // empty masks
  }

  function checkMask (variant, mask, tokens) {
    for (const tok in tokens) {
      if (tokens[tok].escape) {
        mask = mask.replace(new RegExp(tok + '.{1}', 'g'), '')
      }
    }

    return (mask.split('').filter(el => tokens[el] && tokens[el].pattern).length >= variant.length)
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
        if (masked && mask[im]) {
          if (!tokens[mask[im]]) {
            ret += mask[im]
            im++
          } else if (tokens[mask[im]] && tokens[mask[im]].escape) {
            ret += mask[im + 1]
            im = im + 2
          }
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

  // fix mask that ends with parenthesis
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

/**
 *
 * @param {String} value
 * @param {'uppercase' | 'lowercase' | 'transform'} token
 */
function tokenTransform (value, token) {
  if (token.transform) {
    value = token.transform(value)
  }

  if (token.uppercase) {
    return value.toLocaleUpperCase()
  } else if (token.lowercase) {
    return value.toLocaleLowerCase()
  }

  return value
}
