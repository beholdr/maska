import mask from './../src/mask'
import tokens from './../src/tokens'
import Maska from './../src/maska'

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
    expect(mask('1', '#.#', tokens)).toBe('1.')
})

test('1. #.#', () => {
    expect(mask('1.', '#.#', tokens)).toBe('1.')
})

test('1-23A #-##!A', () => {
    expect(mask('123', '#-##!A', tokens)).toBe('1-23A')
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

test('Dynamic floats', () => {
    expect(mask('1', '["# cm", "#.# cm", "#.## cm"]', tokens)).toBe('1 cm')
    expect(mask('12', '["# cm", "#.# cm", "#.## cm"]', tokens)).toBe('1.2 cm')
    expect(mask('123', '["# cm", "#.# cm", "#.## cm"]', tokens)).toBe('1.23 cm')
})

test('Dynamic CPF/CNPJ', () => {
    expect(mask('12345678901', '["###.###.###-##", "##.###.###/####-##"]', tokens)).toBe('123.456.789-01')
    expect(mask('12345678901234', '["###.###.###-##", "##.###.###/####-##"]', tokens)).toBe('12.345.678/9012-34')
})

test('Dynamic boundaries', () => {
    expect(mask('12', '["!###", "!###-##", "!###-##-##"]', tokens)).toBe('#12')
    expect(mask('1234', '["!###", "!###-##", "!###-##-##"]', tokens)).toBe('#12-34')
    expect(mask('1234567', '["!###", "!###-##", "!###-##-##"]', tokens)).toBe('#12-34-56')
    expect(mask('123', '["###", "###-##", "###.##.##"]', tokens)).toBe('123')
    expect(mask('12345', '["###", "###-##", "###.##.##"]', tokens)).toBe('123-45')
    expect(mask('12345678', '["###", "###-##", "###.##.##"]', tokens)).toBe('123.45.67')
})

test('Custom transform: odd number -> 1, even number -> 0', () => {
    // isOdd
    const transform = (numberLike) => String(Number(numberLike) % 2)

    expect((mask('1234567890', '#*', {
        ...tokens,
        ...{
            '#': {
                pattern: /[0-9]/,
                transform
            }
        }
    }))).toBe('1010101010')
})

function transliterate(char) {
    const rule = Object.entries({
        a: 'а',
        b: 'в',
        k: 'к',
        m: 'м',
        h: 'н',
        o: 'о',
        p: 'р',
        c: 'с',
        t: 'т',
        y: 'у',
        x: 'х',
    }).reduce((acc, [from, to]) => {
        acc[from] = to
        acc[from.toLocaleUpperCase()] = to.toLocaleUpperCase()
        return acc
    }, {})
    return rule[char]
}

test('Custom transform: transliterate abkTYX -> авкТУХ', () => {
    expect(mask('abkTYX', 'T*', {
        ...tokens,
        ...{
            'T': {
                pattern: /[a-zA-Z]/,
                transform: transliterate
            }
        }
    })).toBe('авкТУХ')
})

test('Custom transform with `uppercase` and `lowercase` enabled: abkTYX -> АВКТУХ, abkTYX -> авктух', () => {
    expect(mask('abkTYX', 'T*', {
        ...tokens,
        ...{
            'T': {
                pattern: /[a-zA-Z]/,
                transform: transliterate,
                uppercase: true,
            }
        }
    })).toBe('АВКТУХ')

    expect(mask('abkTYX', 'T*', {
        ...tokens,
        ...{
            'T': {
                pattern: /[a-zA-Z]/,
                transform: transliterate,
                lowercase: true,
            }
        }
    })).toBe('авктух')
})

test('Custom value preprocessing', () => {
    const elem = document.createElement('input')
    document.body.appendChild(elem)

    const mask = new Maska(elem, {
        mask: 'S*',
        preprocessor: function(val) {
            return val.toLocaleUpperCase()
        }
    })
    elem.value = "abkTYX"
    elem.dispatchEvent(new Event('input', {bubbles: true}))

    expect(elem.value).toBe("ABKTYX")   
})
