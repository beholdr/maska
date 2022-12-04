import { expect, test } from 'vitest'

import { parseMask, parseOpts, parseTokens } from '../src/parser'

test('mask: empty', () => {
  expect(parseMask('')).toBe('')
})

test('mask: string', () => {
  expect(parseMask('#-#')).toBe('#-#')
})

test('mask: array', () => {
  expect(parseMask('["#", "##"]')).toEqual(expect.arrayContaining(['#', '##']))
})

test('opts: empty', () => {
  expect(parseOpts('')).toBe(true)
})

test('opts: true', () => {
  expect(parseOpts('true')).toBe(true)
})

test('opts: truthy', () => {
  expect(parseOpts('1')).toBe(true)
})

test('opts: false', () => {
  expect(parseOpts('false')).toBe(false)
})

test('opts: falsy', () => {
  expect(parseOpts('0')).toBe(false)
})

test('tokens: json', () => {
  expect(parseTokens('{ "Z": { "pattern": "[0-9]" } }')).toEqual(
    expect.objectContaining({ Z: { pattern: '[0-9]' } })
  )
})

test('tokens: code', () => {
  expect(parseTokens('Z:[0-9]')).toEqual(
    expect.objectContaining({
      Z: { pattern: /[0-9]/, multiple: false, optional: false, repeated: false }
    })
  )

  expect(parseTokens('Z:[0-9]:multiple')).toEqual(
    expect.objectContaining({
      Z: { pattern: /[0-9]/, multiple: true, optional: false, repeated: false }
    })
  )

  expect(parseTokens('Z:[0-9]:optional')).toEqual(
    expect.objectContaining({
      Z: { pattern: /[0-9]/, multiple: false, optional: true, repeated: false }
    })
  )

  expect(parseTokens('Z:[0-9]:repeated')).toEqual(
    expect.objectContaining({
      Z: { pattern: /[0-9]/, multiple: false, optional: false, repeated: true }
    })
  )
})
