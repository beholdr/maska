import mask from './../src/mask'
import tokens from './../src/tokens'

test('12 #.#', () => {
    expect(mask('12', '#.#', tokens)).toBe('1.2')
})

test('1 (#)', () => {
    expect(mask('1', '(#)', tokens)).toBe('(1)')
})

test('1 [(#)]', () => {
    expect(mask('1', '[(#)]', tokens)).toBe('[(1)]')
})

test('1 #.#', () => {
    expect(mask('1', '#.#', tokens)).toBe('1')
})

test('1. #.#', () => {
    expect(mask('1.', '#.#', tokens)).toBe('1.')
})

test('123 #.#', () => {
    expect(mask('123', '#.#', tokens)).toBe('1.2')
})

test('Raw phone number', () => {
    expect(mask('44998765432', '+55 (##) #####-####', tokens, false)).toBe('44998765432')
})

test('abcd12345 AAA-####', () => {
    expect(mask('abcd12345', 'AAA-####', tokens)).toBe('ABC-1234')
})

test('a5-12-34 (XX) - ## - ##', () => {
    expect(mask('a5-12-34', '(XX) - ## - ##', tokens)).toBe('(a5) - 12 - 34')
})

test('123 ##(#)', () => {
    expect(mask('123', '##(#)', tokens)).toBe('12(3)')
})

test('12 #!#(#)', () => {
    expect(mask('12', '#!#(#)', tokens)).toBe('1#(2)')
})

test('12 #!!#', () => {
    expect(mask('12', '#!!#', tokens)).toBe('1!2')
})

test('12 +1 #', () => {
    expect(mask('12', '+1 #', tokens)).toBe('+1 2')
})

test('2 +1 #', () => {
    expect(mask('2', '+1 #', tokens)).toBe('+1 2')
})

test('abc DEF AAA aaa', () => {
    expect(mask('abc DEF', 'AAA aaa', tokens)).toBe('ABC def')
})

test('123abc #*', () => {
    expect(mask('123abc', '#*', tokens)).toBe('123')
})

test('123abc A*', () => {
    expect(mask('123abc', 'A*', tokens)).toBe('ABC')
})

test('123abc #A*', () => {
    expect(mask('123abc', '#A*', tokens)).toBe('1ABC')
})

test('123abc ## A*', () => {
    expect(mask('123abc', '## A*', tokens)).toBe('12 ABC')
})

test('123abc #*A', () => {
    expect(mask('123abc', '#*A', tokens)).toBe('123A')
})

test('123abc #*A*', () => {
    expect(mask('123abc', '#*A*', tokens)).toBe('123ABC')
})

test('123 abc DEF 456 -> A* a*', () => {
    expect(mask('123 abc DEF 456', 'A* a*', tokens)).toBe('ABC def')
})

test('abc123 A!*', () => {
    expect(mask('abc123', 'A!*', tokens)).toBe('A*')
})

test('123abc #!*A*', () => {
    expect(mask('123abc', '#!*A*', tokens)).toBe('1*ABC')
})

test('123abc (#*)A*', () => {
    expect(mask('123abc', '(#*)A*', tokens)).toBe('(123)ABC')
})

test('123abc -> # (A*)', () => {
    expect(mask('123abc', '# (A*)', tokens)).toBe('1 (ABC')
    expect(mask('123abc ', '# (A*)', tokens)).toBe('1 (ABC)')
})

test('Raw 123abc ##(A*)', () => {
    expect(mask('123abc', '##(A*)', tokens, false)).toBe('12ABC')
})
