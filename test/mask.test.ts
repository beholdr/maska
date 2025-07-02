import { expect, test } from 'vitest'

import { Mask } from '../src/mask'

test('null mask', () => {
  const mask = new Mask({ mask: null })

  expect(mask.masked('1a')).toBe('1a')
})

test('empty string mask', () => {
  const mask = new Mask({ mask: '' })

  expect(mask.masked('1a')).toBe('1a')
})

test('undefined mask', () => {
  const mask = new Mask({ mask: undefined })

  expect(mask.masked('1a')).toBe('1a')
})

test('@ @ mask', () => {
  const mask = new Mask({ mask: '@ @' })

  expect(mask.masked('1')).toBe('')
  expect(mask.masked('a')).toBe('a')
  expect(mask.masked('ab')).toBe('a b')
  expect(mask.masked('abc')).toBe('a b')
  expect(mask.masked('1abc')).toBe('a b')

  expect(mask.unmasked('1abc')).toBe('ab')

  expect(mask.completed('a')).toBe(false)
  expect(mask.completed('ab')).toBe(true)
})

test('@ @ eager mask', () => {
  const mask = new Mask({ mask: '@ @', eager: true })

  expect(mask.masked('1')).toBe('')
  expect(mask.masked('a')).toBe('a ')
  expect(mask.masked('ab')).toBe('a b')
  expect(mask.masked('abc')).toBe('a b')
  expect(mask.masked('1abc')).toBe('a b')

  expect(mask.unmasked('1abc')).toBe('ab')
})

test('#.# mask', () => {
  const mask = new Mask({ mask: '#.#' })

  expect(mask.masked('1')).toBe('1')
  expect(mask.masked('1.')).toBe('1.')
  expect(mask.masked('12')).toBe('1.2')
  expect(mask.masked('123')).toBe('1.2')
  expect(mask.masked('a123')).toBe('1.2')

  expect(mask.unmasked('a123')).toBe('12')
})

test('#.# eager mask', () => {
  const mask = new Mask({ mask: '#.#', eager: true })

  expect(mask.masked('1')).toBe('1.')
  expect(mask.masked('1.')).toBe('1.')
  expect(mask.masked('1 ')).toBe('1.')
  expect(mask.masked('12')).toBe('1.2')
  expect(mask.masked('123')).toBe('1.2')
  expect(mask.masked('a123')).toBe('1.2')

  expect(mask.unmasked('a123')).toBe('12')
})

test('@@-## mask', () => {
  const mask = new Mask({ mask: '@@-##' })

  expect(mask.masked('12')).toBe('')
  expect(mask.masked('ab')).toBe('ab')
  expect(mask.masked('ab12')).toBe('ab-12')
  expect(mask.masked('ab-12')).toBe('ab-12')
  expect(mask.masked('abc123')).toBe('ab-12')
  expect(mask.masked('a1b2a1b2')).toBe('ab-21')

  expect(mask.unmasked('a1b2a1b2')).toBe('ab21')
})

test('@@-## eager mask', () => {
  const mask = new Mask({ mask: '@@-##', eager: true })

  expect(mask.masked('12')).toBe('')
  expect(mask.masked('ab')).toBe('ab-')
  expect(mask.masked('ab12')).toBe('ab-12')
  expect(mask.masked('ab-12')).toBe('ab-12')
  expect(mask.masked('abc123')).toBe('ab-12')
  expect(mask.masked('a1b2a1b2')).toBe('ab-21')

  expect(mask.unmasked('a1b2a1b2')).toBe('ab21')
})

test('(#) mask', () => {
  const mask = new Mask({ mask: '(#)' })

  expect(mask.masked('1')).toBe('(1')
  expect(mask.masked('(1')).toBe('(1')
  expect(mask.masked('1 ')).toBe('(1)')
  expect(mask.masked('12')).toBe('(1)')
  expect(mask.masked('a12')).toBe('(1)')

  expect(mask.unmasked('a123')).toBe('1')
})

test('(#) eager mask', () => {
  const mask = new Mask({ mask: '(#)', eager: true })

  expect(mask.masked('1')).toBe('(1)')
  expect(mask.masked('(1')).toBe('(1)')
  expect(mask.masked('12')).toBe('(1)')
  expect(mask.masked('a12')).toBe('(1)')

  expect(mask.unmasked('a123')).toBe('1')
})

test('#-#--# mask', () => {
  const mask = new Mask({ mask: '#-#--#' })

  expect(mask.masked('1')).toBe('1')
  expect(mask.masked('12')).toBe('1-2')
  expect(mask.masked('123')).toBe('1-2--3')
  expect(mask.masked('a1234')).toBe('1-2--3')

  expect(mask.unmasked('a1234')).toBe('123')
})

test('#-#--# eager mask', () => {
  const mask = new Mask({ mask: '#-#--#', eager: true })

  expect(mask.masked('1')).toBe('1-')
  expect(mask.masked('12')).toBe('1-2--')
  expect(mask.masked('123')).toBe('1-2--3')
  expect(mask.masked('a1234')).toBe('1-2--3')

  expect(mask.unmasked('a1234')).toBe('123')
})

test('!##.# mask', () => {
  const mask = new Mask({ mask: '!##.#' })

  expect(mask.masked('1')).toBe('#1')
  expect(mask.masked('#1')).toBe('#1')
  expect(mask.masked('12')).toBe('#1.2')
  expect(mask.masked('1.2')).toBe('#1.2')
  expect(mask.masked('#1.2')).toBe('#1.2')
  expect(mask.masked('123')).toBe('#1.2')
  expect(mask.masked('a123')).toBe('#1.2')

  expect(mask.unmasked('a123')).toBe('12')
})

test('!##.# eager mask', () => {
  const mask = new Mask({ mask: '!##.#', eager: true })

  expect(mask.masked('1')).toBe('#1.')
  expect(mask.masked('#1')).toBe('#1.')
  expect(mask.masked('12')).toBe('#1.2')
  expect(mask.masked('1.2')).toBe('#1.2')
  expect(mask.masked('#1.2')).toBe('#1.2')
  expect(mask.masked('123')).toBe('#1.2')
  expect(mask.masked('a123')).toBe('#1.2')

  expect(mask.unmasked('a123')).toBe('12')
})

test('0#.# mask', () => {
  const mask = new Mask({ mask: '0#.#' })

  expect(mask.masked('1')).toBe('01')
  expect(mask.masked('0')).toBe('0')
  expect(mask.masked('01')).toBe('01')
  expect(mask.masked('01.')).toBe('01.')
  expect(mask.masked('12')).toBe('01.2')
  expect(mask.masked('1.2')).toBe('01.2')
  expect(mask.masked('01.2')).toBe('01.2')
  expect(mask.masked('123')).toBe('01.2')
  expect(mask.masked('a123')).toBe('01.2')

  expect(mask.unmasked('a123')).toBe('12')
})

test('0#.# eager mask', () => {
  const mask = new Mask({ mask: '0#.#', eager: true })

  expect(mask.masked('1')).toBe('01.')
  expect(mask.masked('0')).toBe('0')
  expect(mask.masked('01')).toBe('01.')
  expect(mask.masked('01.')).toBe('01.')
  expect(mask.masked('12')).toBe('01.2')
  expect(mask.masked('1.2')).toBe('01.2')
  expect(mask.masked('01.2')).toBe('01.2')
  expect(mask.masked('123')).toBe('01.2')
  expect(mask.masked('a123')).toBe('01.2')

  expect(mask.unmasked('a123')).toBe('12')
})

test('#.#!* mask', () => {
  const mask = new Mask({ mask: '#.#!*' })

  expect(mask.masked('1')).toBe('1')
  expect(mask.masked('12')).toBe('1.2')
  expect(mask.masked('1.2')).toBe('1.2')
  expect(mask.masked('12*')).toBe('1.2*')
  expect(mask.masked('1.2*')).toBe('1.2*')
  expect(mask.masked('1.2 ')).toBe('1.2*')
  expect(mask.masked('123')).toBe('1.2*')
  expect(mask.masked('a123')).toBe('1.2*')

  expect(mask.unmasked('a123')).toBe('12')
})

test('#.#!* eager mask', () => {
  const mask = new Mask({ mask: '#.#!*', eager: true })

  expect(mask.masked('1')).toBe('1.')
  expect(mask.masked('12')).toBe('1.2*')
  expect(mask.masked('1.2')).toBe('1.2*')
  expect(mask.masked('12*')).toBe('1.2*')
  expect(mask.masked('1.2*')).toBe('1.2*')
  expect(mask.masked('123')).toBe('1.2*')
  expect(mask.masked('a123')).toBe('1.2*')

  expect(mask.unmasked('a123')).toBe('12')
})

test('#.#!** mask', () => {
  const mask = new Mask({ mask: '#.#!**' })

  expect(mask.masked('1')).toBe('1')
  expect(mask.masked('12')).toBe('1.2')
  expect(mask.masked('1.2')).toBe('1.2')
  expect(mask.masked('12*')).toBe('1.2*')
  expect(mask.masked('1.2*')).toBe('1.2*')
  expect(mask.masked('1.2 ')).toBe('1.2*')
  expect(mask.masked('123')).toBe('1.2*3')
  expect(mask.masked('12*3')).toBe('1.2*3')
  expect(mask.masked('a123')).toBe('1.2*3')

  expect(mask.unmasked('a123')).toBe('123')
})

test('#.#!** eager mask', () => {
  const mask = new Mask({ mask: '#.#!**', eager: true })

  expect(mask.masked('1')).toBe('1.')
  expect(mask.masked('12')).toBe('1.2*')
  expect(mask.masked('1.2')).toBe('1.2*')
  expect(mask.masked('12*')).toBe('1.2*')
  expect(mask.masked('1.2*')).toBe('1.2*')
  expect(mask.masked('1.2*3')).toBe('1.2*3')
  expect(mask.masked('123')).toBe('1.2*3')
  expect(mask.masked('a123')).toBe('1.2*3')

  expect(mask.unmasked('a123')).toBe('123')
})

test('0#!-# mask', () => {
  const mask = new Mask({ mask: '0#!-#' })

  expect(mask.masked('a')).toBe('0')
  expect(mask.masked('0')).toBe('0')
  expect(mask.masked('01')).toBe('01')
  expect(mask.masked('1')).toBe('01')
  expect(mask.masked('12')).toBe('01-2')
  expect(mask.masked('01-2')).toBe('01-2')
  expect(mask.masked('123')).toBe('01-2')
  expect(mask.masked('a123')).toBe('01-2')

  expect(mask.unmasked('a123')).toBe('12')
})

test('!0#!-# eager mask', () => {
  const mask = new Mask({ mask: '!0#!-#', eager: true })

  expect(mask.masked('a')).toBe('0')
  expect(mask.masked('0')).toBe('0')
  expect(mask.masked('01')).toBe('01-')
  expect(mask.masked('1')).toBe('01-')
  expect(mask.masked('12')).toBe('01-2')
  expect(mask.masked('01-2')).toBe('01-2')
  expect(mask.masked('123')).toBe('01-2')
  expect(mask.masked('a123')).toBe('01-2')

  expect(mask.unmasked('a123')).toBe('12')
})

test('#2 ## mask', () => {
  const mask = new Mask({ mask: '#2 ##' })

  expect(mask.masked('1')).toBe('1')
  expect(mask.masked('12')).toBe('12')
  expect(mask.masked('12 ')).toBe('12 ')
  expect(mask.masked('13')).toBe('12 3')
  expect(mask.masked('123')).toBe('12 3')
  expect(mask.masked('134')).toBe('12 34')
  expect(mask.masked('1234')).toBe('12 34')
  expect(mask.masked('1345')).toBe('12 34')
  expect(mask.masked('12345')).toBe('12 34')
  expect(mask.masked('a1')).toBe('1')
  expect(mask.masked('a13')).toBe('12 3')

  expect(mask.unmasked('12345')).toBe('134')
})

test('#2 ## eager mask', () => {
  const mask = new Mask({ mask: '#2 ##', eager: true })

  expect(mask.masked('1')).toBe('12 ')
  expect(mask.masked('12')).toBe('12 ')
  expect(mask.masked('12 ')).toBe('12 ')
  expect(mask.masked('13')).toBe('12 3')
  expect(mask.masked('123')).toBe('12 3')
  expect(mask.masked('134')).toBe('12 34')
  expect(mask.masked('1234')).toBe('12 34')
  expect(mask.masked('1345')).toBe('12 34')
  expect(mask.masked('12345')).toBe('12 34')
  expect(mask.masked('a1')).toBe('12 ')
  expect(mask.masked('a13')).toBe('12 3')

  expect(mask.unmasked('12345')).toBe('134')
})

test('(#) 3## mask', () => {
  const mask = new Mask({ mask: '(#) 3##' })

  expect(mask.masked('1')).toBe('(1')
  expect(mask.masked('12')).toBe('(1) 32')
  expect(mask.masked('123')).toBe('(1) 323')
  expect(mask.masked('1234')).toBe('(1) 323')
  expect(mask.masked('13')).toBe('(1) 3')
  expect(mask.masked('134')).toBe('(1) 34')
  expect(mask.masked('(1) 23')).toBe('(1) 323')
  expect(mask.masked('(1) 34')).toBe('(1) 34')

  expect(mask.unmasked('1')).toBe('1')
  expect(mask.unmasked('1234')).toBe('123')
  expect(mask.unmasked('(1) 3')).toBe('1')
  expect(mask.unmasked('(1) 32')).toBe('12')
})

test('(#) 3## eager mask', () => {
  const mask = new Mask({ mask: '(#) 3##', eager: true })

  expect(mask.masked('1')).toBe('(1) 3')
  expect(mask.masked('1 ')).toBe('(1) 3')
  expect(mask.masked('12')).toBe('(1) 32')
  expect(mask.masked('1 2')).toBe('(1) 32')
  expect(mask.masked('123')).toBe('(1) 323')
  expect(mask.masked('1234')).toBe('(1) 323')
  expect(mask.masked('13')).toBe('(1) 3')
  expect(mask.masked('1 3')).toBe('(1) 3')
  expect(mask.masked('134')).toBe('(1) 34')
  expect(mask.masked('(1) 23')).toBe('(1) 323')
  expect(mask.masked('(1) 34')).toBe('(1) 34')

  expect(mask.unmasked('1')).toBe('1')
  expect(mask.unmasked('1234')).toBe('123')
  expect(mask.unmasked('(1) 3')).toBe('1')
  expect(mask.unmasked('(1) 32')).toBe('12')
})

test('(1) 2# mask', () => {
  const mask = new Mask({ mask: '(1) 2#' })

  expect(mask.masked(' ')).toBe('(1) ')
  expect(mask.masked('.')).toBe('(1) 2')
  expect(mask.masked('1')).toBe('(1')
  expect(mask.masked('12')).toBe('(1) 2')
  expect(mask.masked('123')).toBe('(1) 23')
  expect(mask.masked('1234')).toBe('(1) 23')
  expect(mask.masked('13')).toBe('(1) 23')
  expect(mask.masked('(1) 23')).toBe('(1) 23')
  expect(mask.masked('(1) 34')).toBe('(1) 23')
  expect(mask.masked('2')).toBe('(1) 2')
  expect(mask.masked('23')).toBe('(1) 23')
  expect(mask.masked('3')).toBe('(1) 23')
  expect(mask.masked('4')).toBe('(1) 24')

  expect(mask.unmasked('1')).toBe('')
  expect(mask.unmasked('12')).toBe('')
  expect(mask.unmasked('123')).toBe('3')
  expect(mask.unmasked('(1) 23')).toBe('3')
})

test('(1) 2## eager mask', () => {
  const mask = new Mask({ mask: '(1) 2##', eager: true })

  expect(mask.masked(' ')).toBe('(1) 2')
  expect(mask.masked('.')).toBe('(1) 2')
  expect(mask.masked('1')).toBe('(1) 2')
  expect(mask.masked('1 ')).toBe('(1) 2')
  expect(mask.masked('12')).toBe('(1) 2')
  expect(mask.masked('1 2')).toBe('(1) 2')
  expect(mask.masked('123')).toBe('(1) 23')
  expect(mask.masked('1 23')).toBe('(1) 23')
  expect(mask.masked('12 3')).toBe('(1) 23')
  expect(mask.masked('13')).toBe('(1) 23')
  expect(mask.masked('134')).toBe('(1) 234')
  expect(mask.masked('(1) 23')).toBe('(1) 23')
  expect(mask.masked('(1) 34')).toBe('(1) 234')
  expect(mask.masked('2')).toBe('(1) 2')
  expect(mask.masked('23')).toBe('(1) 23')
  expect(mask.masked('3')).toBe('(1) 23')
  expect(mask.masked('34')).toBe('(1) 234')

  expect(mask.unmasked('1')).toBe('')
  expect(mask.unmasked('12')).toBe('')
  expect(mask.unmasked('123')).toBe('3')
  expect(mask.unmasked('(1) 23')).toBe('3')
})

test('12## mask', () => {
  const mask = new Mask({ mask: '12##' })

  expect(mask.masked('.')).toBe('12')
  expect(mask.masked('1')).toBe('1')
  expect(mask.masked('1 ')).toBe('12')
  expect(mask.masked('2')).toBe('12')
  expect(mask.masked('3')).toBe('123')
  expect(mask.masked('12')).toBe('12')
  expect(mask.masked('12 ')).toBe('12')
  expect(mask.masked('123')).toBe('123')
  expect(mask.masked('13')).toBe('123')
  expect(mask.masked('134')).toBe('1234')

  expect(mask.unmasked('1')).toBe('')
  expect(mask.unmasked('12')).toBe('')
  expect(mask.unmasked('123')).toBe('3')
  expect(mask.unmasked('3')).toBe('3')
  expect(mask.unmasked('(1) 23')).toBe('12')
})

test('12## eager mask', () => {
  const mask = new Mask({ mask: '12##', eager: true })

  expect(mask.masked(' ')).toBe('12')
  expect(mask.masked('.')).toBe('12')
  expect(mask.masked('1')).toBe('12')
  expect(mask.masked('1 ')).toBe('12')
  expect(mask.masked('2')).toBe('12')
  expect(mask.masked('3')).toBe('123')
  expect(mask.masked('12')).toBe('12')
  expect(mask.masked('123')).toBe('123')
  expect(mask.masked('13')).toBe('123')
  expect(mask.masked('134')).toBe('1234')
  expect(mask.masked('34')).toBe('1234')

  expect(mask.unmasked('1')).toBe('')
  expect(mask.unmasked('12')).toBe('')
  expect(mask.unmasked('123')).toBe('3')
  expect(mask.unmasked('3')).toBe('3')
  expect(mask.unmasked('(1) 23')).toBe('12')
})

test('#!!# mask', () => {
  const mask = new Mask({ mask: '#!!#' })

  expect(mask.masked('1')).toBe('1')
  expect(mask.masked('12')).toBe('1!2')
  expect(mask.masked('1!2')).toBe('1!2')
  expect(mask.masked('123')).toBe('1!2')
  expect(mask.masked('a123')).toBe('1!2')

  expect(mask.unmasked('a123')).toBe('12')
})

test('#!!# eager mask', () => {
  const mask = new Mask({ mask: '#!!#', eager: true })

  expect(mask.masked('1')).toBe('1!')
  expect(mask.masked('12')).toBe('1!2')
  expect(mask.masked('1!2')).toBe('1!2')
  expect(mask.masked('123')).toBe('1!2')
  expect(mask.masked('a123')).toBe('1!2')

  expect(mask.unmasked('a123')).toBe('12')
})

test('+1 (###) ###-##-## mask', () => {
  const mask = new Mask({ mask: '+1 (###) ###-##-##' })

  expect(mask.masked('999')).toBe('+1 (999')
  expect(mask.masked('999123')).toBe('+1 (999) 123')
  expect(mask.masked('19991234567')).toBe('+1 (999) 123-45-67')
  expect(mask.masked('+19991234567')).toBe('+1 (999) 123-45-67')
  expect(mask.masked('9991234567')).toBe('+1 (999) 123-45-67')
  expect(mask.masked('a9991234567')).toBe('+1 (999) 123-45-67')

  expect(mask.unmasked('+19991234567')).toBe('9991234567')
})

test('+1 (###) ###-##-## eager mask', () => {
  const mask = new Mask({ mask: '+1 (###) ###-##-##', eager: true })

  expect(mask.masked('.')).toBe('+1 (')
  expect(mask.masked(' ')).toBe('+1 (')
  expect(mask.masked('+')).toBe('+1 (')
  expect(mask.masked('99')).toBe('+1 (99')
  expect(mask.masked('999')).toBe('+1 (999) ')
  expect(mask.masked('99912')).toBe('+1 (999) 12')
  expect(mask.masked('999123')).toBe('+1 (999) 123-')
  expect(mask.masked('19')).toBe('+1 (9')
  expect(mask.masked('19991234567')).toBe('+1 (999) 123-45-67')
  expect(mask.masked('+19991234567')).toBe('+1 (999) 123-45-67')
  expect(mask.masked('9991234567')).toBe('+1 (999) 123-45-67')
  expect(mask.masked('a9991234567')).toBe('+1 (999) 123-45-67')

  expect(mask.unmasked('+19991234567')).toBe('9991234567')
})

test('1 (###) ###-##-## eager mask', () => {
  const mask = new Mask({ mask: '1 (###) ###-##-##', eager: true })

  expect(mask.masked('+')).toBe('1 (')
  expect(mask.masked('+19991234567')).toBe('1 (199) 912-34-56')
  expect(mask.masked('19991234567')).toBe('1 (999) 123-45-67')
  expect(mask.masked('9991234567')).toBe('1 (999) 123-45-67')
  expect(mask.masked('a9991234567')).toBe('1 (999) 123-45-67')

  expect(mask.unmasked('19991234567')).toBe('9991234567')
  expect(mask.unmasked('+19991234567')).toBe('1999123456')
})

test('transform mask', () => {
  const mask = new Mask({
    mask: 'ZZzz',
    tokens: {
      Z: { pattern: /[a-zA-Z]/, transform: (char) => char.toUpperCase() },
      z: { pattern: /[a-zA-Z]/, transform: (char) => char.toLowerCase() }
    }
  })
  expect(mask.masked('abcd')).toBe('ABcd')
  expect(mask.masked('ABCD')).toBe('ABcd')
  expect(mask.masked('1AB2CD')).toBe('ABcd')

  expect(mask.unmasked('1AB2CD')).toBe('ABcd')
})

test('transform strict mask', () => {
  const mask = new Mask({
    mask: 'ZZzz',
    tokens: {
      Z: { pattern: /[A-Z]/, transform: (char) => char.toUpperCase() },
      z: { pattern: /[a-z]/, transform: (char) => char.toLowerCase() }
    }
  })
  expect(mask.masked('abcd')).toBe('ABcd')
  expect(mask.masked('ABCD')).toBe('ABcd')
  expect(mask.masked('1AB2CD')).toBe('ABcd')

  expect(mask.unmasked('1AB2CD')).toBe('ABcd')
})

test('IP mask', () => {
  const mask = new Mask({
    mask: '#00.#00.#00.#00',
    tokens: {
      0: { pattern: /[\d]/, optional: true }
    }
  })

  expect(mask.masked('127.0.0.1')).toBe('127.0.0.1')
  expect(mask.masked('254254254254')).toBe('254.254.254.254')
  expect(mask.masked('1.23.456.7890')).toBe('1.23.456.789')
  expect(mask.masked('a1.23.456.7890')).toBe('1.23.456.789')

  expect(mask.unmasked('a254.254.254.254')).toBe('254254254254')
})

test('repeated simple mask', () => {
  const mask = new Mask({
    mask: '9',
    tokens: {
      9: { pattern: /[\d]/, repeated: true }
    }
  })

  expect(mask.masked('1')).toBe('1')
  expect(mask.masked('12')).toBe('12')
  expect(mask.masked('12 ')).toBe('12')

  expect(mask.unmasked('a12')).toBe('12')
})

test('repeated 99.9 mask', () => {
  const mask = new Mask({
    mask: '99.9',
    tokens: {
      9: { pattern: /[\d]/, repeated: true }
    }
  })

  expect(mask.masked('12')).toBe('12')
  expect(mask.masked('123')).toBe('12.3')
  expect(mask.masked('1234')).toBe('12.34')
  expect(mask.masked('12345')).toBe('12.345')
  expect(mask.masked('123456')).toBe('12.345.6')
  expect(mask.masked('1234567')).toBe('12.345.67')
  expect(mask.masked('12345678')).toBe('12.345.678')
  expect(mask.masked('123456789')).toBe('12.345.678.9')
  expect(mask.masked('a123456789')).toBe('12.345.678.9')

  expect(mask.unmasked('a123456789')).toBe('123456789')
})

test('repeated 99.9 eager mask', () => {
  const mask = new Mask({
    mask: '99.9',
    eager: true,
    tokens: {
      9: { pattern: /[\d]/, repeated: true }
    }
  })

  expect(mask.masked('12')).toBe('12.')
  expect(mask.masked('123')).toBe('12.3')
  expect(mask.masked('1234')).toBe('12.34')
  expect(mask.masked('12345')).toBe('12.345.')
  expect(mask.masked('123456')).toBe('12.345.6')
  expect(mask.masked('1234567')).toBe('12.345.67')
  expect(mask.masked('12345678')).toBe('12.345.678.')
  expect(mask.masked('123456789')).toBe('12.345.678.9')

  expect(mask.unmasked('123456789')).toBe('123456789')
})

test('#-## reversed mask', () => {
  const mask = new Mask({ mask: '#-##', reversed: true })

  expect(mask.masked('1')).toBe('1')
  expect(mask.masked('12')).toBe('12')
  expect(mask.masked('123')).toBe('1-23')
  expect(mask.masked('1234')).toBe('2-34')
  expect(mask.masked('a1234')).toBe('2-34')

  expect(mask.unmasked('a1234')).toBe('234')
})

test('#-## reversed eager mask', () => {
  const mask = new Mask({ mask: '#-##', reversed: true, eager: true })

  expect(mask.masked('1')).toBe('1')
  expect(mask.masked('12')).toBe('-12')
  expect(mask.masked('123')).toBe('1-23')
  expect(mask.masked('1234')).toBe('2-34')
  expect(mask.masked('a1234')).toBe('2-34')

  expect(mask.unmasked('a1234')).toBe('234')
})

test('repeated reversed mask', () => {
  const mask = new Mask({
    mask: '9 99#,##',
    reversed: true,
    tokens: {
      9: { pattern: /[\d]/, repeated: true }
    }
  })

  expect(mask.masked('12')).toBe('12')
  expect(mask.masked('123')).toBe('1,23')
  expect(mask.masked('1234')).toBe('12,34')
  expect(mask.masked('12345')).toBe('123,45')
  expect(mask.masked('123456')).toBe('1 234,56')
  expect(mask.masked('1234567')).toBe('12 345,67')
  expect(mask.masked('12345678')).toBe('123 456,78')
  expect(mask.masked('123456789')).toBe('1 234 567,89')

  expect(mask.unmasked('123456789')).toBe('123456789')
})

test('repeated reversed eager mask', () => {
  const mask = new Mask({
    mask: '9 99#,##',
    reversed: true,
    eager: true,
    tokens: {
      9: { pattern: /[\d]/, repeated: true }
    }
  })

  expect(mask.masked('1')).toBe('1')
  expect(mask.masked('12')).toBe(',12')
  expect(mask.masked('123')).toBe('1,23')
  expect(mask.masked('1234')).toBe('12,34')
  expect(mask.masked('12345')).toBe(' 123,45')
  expect(mask.masked('123456')).toBe('1 234,56')
  expect(mask.masked('1234567')).toBe('12 345,67')
  expect(mask.masked('12345678')).toBe(' 123 456,78')
  expect(mask.masked('123456789')).toBe('1 234 567,89')

  expect(mask.unmasked('123456789')).toBe('123456789')
})

test('multiple numbers mask', () => {
  const mask = new Mask({
    mask: '+ +',
    tokens: { '+': { pattern: /\d/, multiple: true } }
  })

  expect(mask.masked('1')).toBe('1')
  expect(mask.masked('1 2')).toBe('1 2')
  expect(mask.masked('1 2 3')).toBe('1 2')
  expect(mask.masked('12')).toBe('12')
  expect(mask.masked('12 ')).toBe('12 ')
  expect(mask.masked('12 3')).toBe('12 3')
  expect(mask.masked('12 34')).toBe('12 34')
  expect(mask.masked('12 34 ')).toBe('12 34')
  expect(mask.masked('12 34 5')).toBe('12 34')
  expect(mask.masked('a12 34 5')).toBe('12 34')
  expect(mask.masked('12.34.5')).toBe('12 34')

  expect(mask.unmasked('a1 2 3')).toBe('12')
  expect(mask.unmasked('12 3')).toBe('123')
  expect(mask.unmasked('12 34 5')).toBe('1234')
})

test('multiple letters mask', () => {
  const mask = new Mask({
    mask: '+ +',
    tokens: { '+': { pattern: /[a-zA-Z]/, multiple: true } }
  })

  expect(mask.masked('a')).toBe('a')
  expect(mask.masked('ab')).toBe('ab')
  expect(mask.masked('a b')).toBe('a b')
  expect(mask.masked('a b с')).toBe('a b')
  expect(mask.masked('ab ')).toBe('ab ')
  expect(mask.masked('ab c')).toBe('ab c')
  expect(mask.masked('ab cd')).toBe('ab cd')
  expect(mask.masked('ab cd ')).toBe('ab cd')
  expect(mask.masked('ab cd e')).toBe('ab cd')
  expect(mask.masked('1ab cd e')).toBe('ab cd')
  expect(mask.masked('ab.cd.e')).toBe('ab cd')

  expect(mask.unmasked('1a b c')).toBe('ab')
  expect(mask.unmasked('ab c')).toBe('abc')
  expect(mask.unmasked('ab cd e')).toBe('abcd')
})

test('dynamic empty mask', () => {
  const mask = new Mask({ mask: [] })

  expect(mask.masked('1')).toBe('1')
})

test('dynamic single mask', () => {
  const mask = new Mask({ mask: ['#-#'] })

  expect(mask.masked('123')).toBe('1-2')
  expect(mask.unmasked('123')).toBe('12')
})

test('dynamic mask', () => {
  const mask = new Mask({ mask: ['###.###.###-##', '##.###.###/####-##'] })

  expect(mask.masked('12345678901')).toBe('123.456.789-01')
  expect(mask.masked('123456789012')).toBe('12.345.678/9012')
  expect(mask.masked('12345678901234')).toBe('12.345.678/9012-34')
  expect(mask.masked('a123456789012345')).toBe('12.345.678/9012-34')

  expect(mask.unmasked('a123456789012345')).toBe('12345678901234')

  expect(mask.completed('1234567890')).toBe(false)
  expect(mask.completed('12345678901')).toBe(true)
  expect(mask.completed('123456789012')).toBe(false)
  expect(mask.completed('1234567890123')).toBe(false)
  expect(mask.completed('12345678901234')).toBe(true)
})

test('dynamic function mask', () => {
  const mask = new Mask({
    mask: (value) => (value.startsWith('1') ? '#-#--#' : '## ##')
  })

  expect(mask.masked('12')).toBe('1-2')
  expect(mask.masked('1234')).toBe('1-2--3')
  expect(mask.masked('23')).toBe('23')
  expect(mask.masked('23456')).toBe('23 45')
  expect(mask.masked('a23456')).toBe('23 45')

  expect(mask.unmasked('a123')).toBe('123')
  expect(mask.unmasked('a2345')).toBe('2345')

  expect(mask.completed('12')).toBe(false)
  expect(mask.completed('123')).toBe(true)
  expect(mask.completed('234')).toBe(false)
  expect(mask.completed('2345')).toBe(true)
})

test('dynamic escaped mask', () => {
  const mask = new Mask({ mask: ['!###', '!###-##', '!###.##.##'] })

  expect(mask.masked('12')).toBe('#12')
  expect(mask.masked('1234')).toBe('#12-34')
  expect(mask.masked('12345')).toBe('#12.34.5')
  expect(mask.masked('1234567')).toBe('#12.34.56')
})

test('tokens replaced', () => {
  const mask = new Mask({
    mask: 'Z-#',
    tokens: { Z: { pattern: /[0-9]/ } },
    tokensReplace: true
  })

  expect(mask.masked('1')).toBe('1')
  expect(mask.masked('12')).toBe('1-#')
  expect(mask.masked('123')).toBe('1-#')
  expect(mask.masked('1-#')).toBe('1-#')

  expect(mask.unmasked('12')).toBe('1')
})

test('unicode tokens', () => {
  const mask = new Mask({
    mask: 'A',
    // @ts-expect-error
    tokens: { A: { pattern: '[\\p{L}]', multiple: true } }
  })

  expect(mask.masked('1')).toBe('')
  expect(mask.masked('z')).toBe('z')
  expect(mask.masked('zя')).toBe('zя')
  expect(mask.masked('zя1')).toBe('zя')
})
