import { expect, test } from 'vitest'

import { Mask } from '../src/mask'

test('default number settings', () => {
  const mask = new Mask({ number: {} })

  expect(mask.masked('0')).toBe('0')
  expect(mask.masked('00')).toBe('0')
  expect(mask.masked('01')).toBe('1')
  expect(mask.masked('1a')).toBe('1')
  expect(mask.masked('12')).toBe('12')
  expect(mask.masked('123')).toBe('123')
  expect(mask.masked('1234')).toBe('1,234')
  expect(mask.masked('12345')).toBe('12,345')
  expect(mask.masked('123456')).toBe('123,456')
  expect(mask.masked('1234567')).toBe('1,234,567')
  expect(mask.masked('1234567.')).toBe('1,234,567')
  expect(mask.masked('1234567.1')).toBe('1,234,567')
  expect(mask.masked('-1234')).toBe('-1,234')
  expect(mask.masked('--1234')).toBe('-1,234')
})

test('default number unmasked', () => {
  const mask = new Mask({ number: {} })

  expect(mask.unmasked('0')).toBe('0')
  expect(mask.unmasked('00')).toBe('0')
  expect(mask.unmasked('01')).toBe('1')
  expect(mask.unmasked('1a')).toBe('1')
  expect(mask.unmasked('12')).toBe('12')
  expect(mask.unmasked('123')).toBe('123')
  expect(mask.unmasked('1234')).toBe('1234')
  expect(mask.unmasked('12345')).toBe('12345')
  expect(mask.unmasked('123456')).toBe('123456')
  expect(mask.unmasked('1234567')).toBe('1234567')
  expect(mask.unmasked('1234567.')).toBe('1234567')
  expect(mask.unmasked('1234567.1')).toBe('1234567')
  expect(mask.unmasked('-1234')).toBe('-1234')
  expect(mask.unmasked('--1234')).toBe('-1234')
})

test('fraction number', () => {
  const mask = new Mask({ number: { fraction: 2 } })

  expect(mask.masked('0')).toBe('0')
  expect(mask.masked('1a')).toBe('1')
  expect(mask.masked('12')).toBe('12')
  expect(mask.masked('123')).toBe('123')
  expect(mask.masked('1234')).toBe('1,234')
  expect(mask.masked('1234567.')).toBe('1,234,567.')
  expect(mask.masked('1234567..')).toBe('1,234,567.')
  expect(mask.masked('1234567.1')).toBe('1,234,567.1')
  expect(mask.masked('1234567.10')).toBe('1,234,567.10')
  expect(mask.masked('1234567.109')).toBe('1,234,567.10')
  expect(mask.masked('1234567.0')).toBe('1,234,567.0')
  expect(mask.masked('1234567.01')).toBe('1,234,567.01')
  expect(mask.masked('1234567.019')).toBe('1,234,567.01')
  expect(mask.masked('1234567.1.')).toBe('1,234,567.1')
  expect(mask.masked('1234567.1.2')).toBe('1,234,567.1')
})

test('fraction number unmasked', () => {
  const mask = new Mask({ number: { fraction: 2 } })

  expect(mask.unmasked('0')).toBe('0')
  expect(mask.unmasked('1a')).toBe('1')
  expect(mask.unmasked('12')).toBe('12')
  expect(mask.unmasked('123')).toBe('123')
  expect(mask.unmasked('1234')).toBe('1234')
  expect(mask.unmasked('1234567.')).toBe('1234567')
  expect(mask.unmasked('1234567..')).toBe('1234567')
  expect(mask.unmasked('1234567.1')).toBe('1234567.1')
  expect(mask.unmasked('1234567.10')).toBe('1234567.10')
  expect(mask.unmasked('1234567.109')).toBe('1234567.10')
  expect(mask.unmasked('1234567.0')).toBe('1234567.0')
  expect(mask.unmasked('1234567.01')).toBe('1234567.01')
  expect(mask.unmasked('1234567.019')).toBe('1234567.01')
  expect(mask.unmasked('1234567.1.')).toBe('1234567.1')
  expect(mask.unmasked('1234567.1.2')).toBe('1234567.1')
})

test('unsigned number', () => {
  const mask = new Mask({ number: { unsigned: true } })

  expect(mask.masked('1')).toBe('1')
  expect(mask.masked('-1')).toBe('1')
  expect(mask.masked('--1')).toBe('1')
})

test('unsigned false number', () => {
  const mask = new Mask({ number: { unsigned: false } })

  expect(mask.masked('1')).toBe('1')
  expect(mask.masked('-1')).toBe('-1')
  expect(mask.masked('--1')).toBe('-1')
})

test('russian number', () => {
  const mask = new Mask({ number: { locale: 'ru', fraction: 2 } })

  expect(mask.masked('1a')).toBe('1')
  expect(mask.masked('12')).toBe('12')
  expect(mask.masked('123')).toBe('123')
  expect(mask.masked('1234')).toBe('1 234')
  expect(mask.masked('12345')).toBe('12 345')
  expect(mask.masked('123456')).toBe('123 456')
  expect(mask.masked('1234567')).toBe('1 234 567')
  expect(mask.masked('1234567.')).toBe('1 234 567,')
  expect(mask.masked('1234567..')).toBe('1 234 567,')
  expect(mask.masked('1234567.1')).toBe('1 234 567,1')
  expect(mask.masked('1234567.10')).toBe('1 234 567,10')
  expect(mask.masked('1234567.109')).toBe('1 234 567,10')
  expect(mask.masked('1234567.0')).toBe('1 234 567,0')
  expect(mask.masked('1234567.01')).toBe('1 234 567,01')
  expect(mask.masked('1234567.019')).toBe('1 234 567,01')
  expect(mask.masked('1234567.1.')).toBe('1 234 567,1')
  expect(mask.masked('1234567.1.2')).toBe('1 234 567,1')
  expect(mask.masked('-1234')).toBe('-1 234')
  expect(mask.masked('--1234')).toBe('-1 234')
})

test('russian unmasked number', () => {
  const mask = new Mask({ number: { locale: 'ru', fraction: 2 } })

  expect(mask.unmasked('1a')).toBe('1')
  expect(mask.unmasked('12')).toBe('12')
  expect(mask.unmasked('123')).toBe('123')
  expect(mask.unmasked('1234')).toBe('1234')
  expect(mask.unmasked('12345')).toBe('12345')
  expect(mask.unmasked('123456')).toBe('123456')
  expect(mask.unmasked('1234567')).toBe('1234567')
  expect(mask.unmasked('1234567.')).toBe('1234567')
  expect(mask.unmasked('1234567..')).toBe('1234567')
  expect(mask.unmasked('1234567.1')).toBe('1234567.1')
  expect(mask.unmasked('1234567.10')).toBe('1234567.10')
  expect(mask.unmasked('1234567.109')).toBe('1234567.10')
  expect(mask.unmasked('1234567.0')).toBe('1234567.0')
  expect(mask.unmasked('1234567.01')).toBe('1234567.01')
  expect(mask.unmasked('1234567.019')).toBe('1234567.01')
  expect(mask.unmasked('1234567.1.')).toBe('1234567.1')
  expect(mask.unmasked('1234567.1.2')).toBe('1234567.1')
  expect(mask.unmasked('-1234')).toBe('-1234')
  expect(mask.unmasked('--1234')).toBe('-1234')
})

test('initial number', () => {
  const mask = new Mask({ number: { fraction: 2 } })

  expect(mask.masked('1234.56')).toBe('1,234.56')
  expect(mask.masked('1234,56')).toBe('123,456')
  expect(mask.masked('1,234.56')).toBe('1,234.56')
  expect(mask.masked('1 234,56')).toBe('123,456')
  expect(mask.masked('1 234.56')).toBe('1,234.56')
  expect(mask.masked('1 234.56')).toBe('1,234.56')
})

test('initial russian number', () => {
  const mask = new Mask({ number: { locale: 'ru', fraction: 2 } })

  expect(mask.masked('1234.56')).toBe('1 234,56')
  expect(mask.masked('1234,56')).toBe('1 234,56')
  expect(mask.masked('1,234.56')).toBe('1,23')
  expect(mask.masked('1 234,56')).toBe('1 234,56')
  expect(mask.masked('1 234.56')).toBe('1 234,56')
  expect(mask.masked('1 234.56')).toBe('1 234,56')
})

test('initial brazilian number', () => {
  const mask = new Mask({ number: { locale: 'pt-BR', fraction: 2 } })

  expect(mask.masked('1234.56')).toBe('123.456')
  expect(mask.masked('1234,56')).toBe('1.234,56')
  expect(mask.masked('1.23')).toBe('123')
  expect(mask.masked('1,23')).toBe('1,23')
})

// https://github.com/beholdr/maska/issues/228
test('NaN check', () => {
  const mask = new Mask({ number: { locale: 'uk', fraction: 2 } })

  expect(mask.masked('.')).toBe('')
  expect(mask.masked(',')).toBe('')
})

test('float input', () => {
  const mask = new Mask({ number: { locale: 'uk', fraction: 2 } })

  expect(mask.masked(1234.56)).toBe('1 234,56')
  expect(mask.unmasked(1234.56)).toBe('1234.56')
})
