import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import userEvent from '@testing-library/user-event'

import { MaskInput, MaskInputOptions } from '../src/mask-input'

let input: HTMLInputElement
const user = userEvent.setup()

function prepareInput(opts: MaskInputOptions, value = '') {
  document.body.innerHTML = `<input id="input" value="${value}">`
  new MaskInput('#input', opts)

  return <HTMLInputElement>document.getElementById('input')!
}

describe('test init', () => {
  test('init and destroy', async () => {
    document.body.innerHTML = `<input id="input" data-maska="#">`
    const input = <HTMLInputElement>document.getElementById('input')
    const mask = new MaskInput(input)

    expect(mask.items.has(input)).toBe(true)

    await user.type(input, 'a12b')
    expect(input).toHaveValue('1')

    await user.clear(input)

    mask.destroy()

    expect(mask.items.has(input)).toBe(false)

    await user.type(input, 'a12b')
    expect(input).toHaveValue('a12b')
  })

  test('init multiple', async () => {
    document.body.innerHTML = `
      <input data-maska="#-#" data-maska-eager>
      <input data-maska="#-#">
    `
    const mask = new MaskInput('[data-maska]')

    expect([...mask.items][0][1].eager).toBe(true)
    expect([...mask.items][1][1].eager).toBe(false)
  })

  test('test callback', async () => {
    document.body.innerHTML = `<input id="input" data-maska="#-#">`
    const input = <HTMLInputElement>document.getElementById('input')
    const onMaska = vi.fn()

    new MaskInput(input, { onMaska })

    await user.type(input, '12')
    expect(onMaska).toHaveBeenCalledTimes(2)
    expect(onMaska).toHaveBeenLastCalledWith(
      expect.objectContaining({
        masked: '1-2',
        unmasked: '12',
        completed: true
      })
    )
  })

  test('test hooks', async () => {
    document.body.innerHTML = `<input id="input" data-maska="@-@">`
    const input = <HTMLInputElement>document.getElementById('input')

    const hooks = {
      preProcess: (value: string) => value.toUpperCase(),
      postProcess: (value: string) => value.toLowerCase()
    }
    const preProcess: any = vi.spyOn(hooks, 'preProcess')
    const postProcess: any = vi.spyOn(hooks, 'postProcess')

    new MaskInput(input, { preProcess, postProcess })

    await user.type(input, 'ab')

    expect(input).toHaveValue('a-b')

    expect(preProcess).toHaveBeenCalledTimes(2)
    expect(postProcess).toHaveBeenCalledTimes(2)

    expect(preProcess).toHaveBeenLastCalledWith('ab')
    expect(preProcess).toHaveLastReturnedWith('AB')

    expect(postProcess).toHaveBeenLastCalledWith('A-B')
    expect(postProcess).toHaveLastReturnedWith('a-b')
  })

  test('init with element list', async () => {
    document.body.innerHTML = `<input class="input"><input class="input">`
    const inputs = <NodeListOf<HTMLInputElement>>(
      document.querySelectorAll('.input')
    )
    const mask = new MaskInput(inputs)

    expect([...mask.items].length).toBe(2)
    expect(mask.items.has(inputs[0])).toBe(true)
  })

  test('no mask param', async () => {
    document.body.innerHTML = `<input id="input">`
    const input = <HTMLInputElement>document.getElementById('input')
    new MaskInput('#input')

    await user.type(input, '1')
    expect(input).toHaveValue('')
  })

  test('no mask param', async () => {
    document.body.innerHTML = `<input id="input">`
    const input = <HTMLInputElement>document.getElementById('input')
    new MaskInput(input)

    await user.type(input, '1')
    expect(input).toHaveValue('')
  })
})

describe('test data-attr', () => {
  function prepareMaskWithHtml(html: string) {
    document.body.innerHTML = html

    return new MaskInput('#input')
  }

  test('empty mask', () => {
    const mask = prepareMaskWithHtml(`<input id="input" data-maska>`)
    expect([...mask.items][0][1].mask).toBe('')
  })

  test('simple mask', () => {
    const mask = prepareMaskWithHtml(`<input id="input" data-maska="#-#">`)
    expect([...mask.items][0][1].mask).toBe('#-#')
  })

  test('dynamic mask', () => {
    const mask = prepareMaskWithHtml(
      `<input id="input" data-maska="['#--#', '#-#--#']">`
    )
    expect([...mask.items][0][1].mask.length).toBe(2)
  })

  test('eager mask', () => {
    const mask = prepareMaskWithHtml(`<input id="input" data-maska-eager>`)
    expect([...mask.items][0][1].eager).toBe(true)
  })

  test('eager mask true', () => {
    const mask = prepareMaskWithHtml(
      `<input id="input" data-maska-eager="true">`
    )
    expect([...mask.items][0][1].eager).toBe(true)
  })

  test('eager mask false', () => {
    const mask = prepareMaskWithHtml(
      `<input id="input" data-maska-eager="false">`
    )
    expect([...mask.items][0][1].eager).toBe(false)
  })

  test('reversed mask', () => {
    const mask = prepareMaskWithHtml(`<input id="input" data-maska-reversed>`)
    expect([...mask.items][0][1].reversed).toBe(true)
  })

  test('custom tokens mask', () => {
    const mask = prepareMaskWithHtml(
      `<input id="input" data-maska-tokens='{ "Z": { "pattern": "[0-9]" } }'>`
    )
    expect([...mask.items][0][1].tokens).toHaveProperty('#.pattern')
    expect([...mask.items][0][1].tokens).toHaveProperty('Z.pattern')
  })

  test('replace tokens mask', () => {
    const mask = prepareMaskWithHtml(
      `<input id="input" data-maska-tokens='{ "Z": { "pattern": "[0-9]" } }' data-maska-tokens-replace>`
    )
    expect([...mask.items][0][1].tokens).toHaveProperty('Z.pattern')
    expect([...mask.items][0][1].tokens).not.toHaveProperty('#.pattern')
  })

  test('single quotes tokens mask', () => {
    const mask = prepareMaskWithHtml(
      `<input id="input" data-maska-tokens="{ 'Z': { 'pattern': '[0-9]' } }">`
    )
    expect([...mask.items][0][1].tokens).toHaveProperty('Z.pattern')
  })

  test('simple tokens mask', () => {
    const mask = prepareMaskWithHtml(
      `<input id="input" data-maska-tokens="Z:[0-9]|X:[0-9]:optional">`
    )
    expect([...mask.items][0][1].tokens).toHaveProperty('Z.optional', false)
    expect([...mask.items][0][1].tokens).toHaveProperty('X.optional', true)
  })
})

describe('initial value', () => {
  beforeAll(() => {
    input = prepareInput({ mask: '#-#' }, '123')
  })

  test('check masked value', () => {
    expect(input).toHaveValue('1-2')
  })
})

describe('#-# mask', () => {
  beforeAll(() => {
    input = prepareInput({ mask: '#-#' })
  })

  afterEach(async () => {
    await user.clear(input)
  })

  test('input 1', async () => {
    await user.type(input, '1')
    expect(input).toHaveValue('1')
  })

  test('input 1-', async () => {
    await user.type(input, '1-')
    expect(input).toHaveValue('1-')
  })

  test('input 12', async () => {
    await user.type(input, '12')
    expect(input).toHaveValue('1-2')
  })

  test('input 1-2', async () => {
    await user.type(input, '1-2')
    expect(input).toHaveValue('1-2')
  })

  test('input 123', async () => {
    await user.type(input, '123')
    expect(input).toHaveValue('1-2')
  })

  test('input 1{ }', async () => {
    await user.type(input, '1{ }')
    expect(input).toHaveValue('1-')
  })

  test('input 1{ }2', async () => {
    await user.type(input, '1{ }2')
    expect(input).toHaveValue('1-2')
  })

  test('input 12{backspace}', async () => {
    await user.type(input, '12{backspace}')
    expect(input).toHaveValue('1-')
  })

  test('input 12{backspace}{backspace}', async () => {
    await user.type(input, '12{backspace}{backspace}')
    expect(input).toHaveValue('1')
  })

  test('input 12 and {backspace} 1', async () => {
    await user.type(input, '12')
    await user.type(input, '{backspace}', { initialSelectionStart: 1 })
    expect(input).toHaveValue('2')
  })

  test('input 12 and {backspace} -', async () => {
    await user.type(input, '12')
    await user.type(input, '{backspace}', { initialSelectionStart: 2 })
    expect(input).toHaveValue('1-2')
  })

  test('input 12 and {delete} 1', async () => {
    await user.type(input, '12')
    await user.type(input, '{delete}', { initialSelectionStart: 0 })
    expect(input).toHaveValue('2')
  })

  test('input 12 and {delete} -', async () => {
    await user.type(input, '12')
    await user.type(input, '{delete}', { initialSelectionStart: 1 })
    expect(input).toHaveValue('1-2')
  })

  test('input 12 and {delete} 2', async () => {
    await user.type(input, '12')
    await user.type(input, '{delete}', { initialSelectionStart: 2 })
    expect(input).toHaveValue('1-')
  })

  test('input 12 and then 3 at 0', async () => {
    await user.type(input, '12')
    await user.type(input, '3', { initialSelectionStart: 0 })
    expect(input).toHaveValue('3-1')
  })

  test('input 12 and then 3 at 1', async () => {
    await user.type(input, '12')
    await user.type(input, '3', { initialSelectionStart: 1 })
    expect(input).toHaveValue('1-3')
  })

  test('input 12 and then 3 at 2', async () => {
    await user.type(input, '12')
    await user.type(input, '3', { initialSelectionStart: 2 })
    expect(input).toHaveValue('1-3')
  })
})

describe('#-# eager mask', () => {
  beforeAll(() => {
    input = prepareInput({ mask: '#-#', eager: true })
  })

  afterEach(async () => {
    await user.clear(input)
  })

  test('input 1', async () => {
    await user.type(input, '1')
    expect(input).toHaveValue('1-')
  })

  test('input 12', async () => {
    await user.type(input, '12')
    expect(input).toHaveValue('1-2')
  })

  test('input 123', async () => {
    await user.type(input, '123')
    expect(input).toHaveValue('1-2')
  })

  test('input 1{ }', async () => {
    await user.type(input, '1{ }')
    expect(input).toHaveValue('1-')
  })

  test('input 1{ }2', async () => {
    await user.type(input, '1{ }2')
    expect(input).toHaveValue('1-2')
  })

  test('input 12{backspace}', async () => {
    await user.type(input, '12{backspace}')
    expect(input).toHaveValue('1-')
  })

  test('input 12{backspace}{backspace}', async () => {
    await user.type(input, '12{backspace}{backspace}')
    expect(input).toHaveValue('')
  })

  test('input 12 and {backspace} 1', async () => {
    await user.type(input, '12')
    await user.type(input, '{backspace}', { initialSelectionStart: 1 })
    expect(input).toHaveValue('2-')
  })

  test('input 12 and {backspace} -', async () => {
    await user.type(input, '12')
    await user.type(input, '{backspace}', { initialSelectionStart: 2 })
    expect(input).toHaveValue('1-2')
  })

  test('input 12 and {delete} 1', async () => {
    await user.type(input, '12')
    await user.type(input, '{delete}', { initialSelectionStart: 0 })
    expect(input).toHaveValue('2-')
  })

  test('input 12 and {delete} -', async () => {
    await user.type(input, '12')
    await user.type(input, '{delete}', { initialSelectionStart: 1 })
    expect(input).toHaveValue('1-2')
  })

  test('input 12 and {delete} 2', async () => {
    await user.type(input, '12')
    await user.type(input, '{delete}', { initialSelectionStart: 2 })
    expect(input).toHaveValue('1-')
  })

  test('input 12 and then 3 at 0', async () => {
    await user.type(input, '12')
    await user.type(input, '3', { initialSelectionStart: 0 })
    expect(input).toHaveValue('3-1')
  })

  test('input 12 and then 3 at 1', async () => {
    await user.type(input, '12')
    await user.type(input, '3', { initialSelectionStart: 1 })
    expect(input).toHaveValue('1-3')
  })

  test('input 12 and then 3 at 2', async () => {
    await user.type(input, '12')
    await user.type(input, '3', { initialSelectionStart: 2 })
    expect(input).toHaveValue('1-3')
  })
})

describe('#-#--# mask', () => {
  beforeAll(() => {
    input = prepareInput({ mask: '#-#--#' })
  })

  afterEach(async () => {
    await user.clear(input)
  })

  test('input 12', async () => {
    await user.type(input, '12')
    expect(input).toHaveValue('1-2')
  })

  test('input 12-', async () => {
    await user.type(input, '12-')
    expect(input).toHaveValue('1-2-')
  })

  test('input 12--', async () => {
    await user.type(input, '12--')
    expect(input).toHaveValue('1-2--')
  })

  test('input 12---', async () => {
    await user.type(input, '12---')
    expect(input).toHaveValue('1-2--')
  })

  test('input 12{ }', async () => {
    await user.type(input, '12{ }')
    expect(input).toHaveValue('1-2--')
  })

  test('input 1234', async () => {
    await user.type(input, '1234')
    expect(input).toHaveValue('1-2--3')
  })

  test('input 1234{backspace}', async () => {
    await user.type(input, '1234{backspace}')
    expect(input).toHaveValue('1-2--')
  })

  test('input 1234{backspace}{backspace}', async () => {
    await user.type(input, '1234{backspace}{backspace}')
    expect(input).toHaveValue('1-2-')
  })

  test('input 123 and {backspace}{backspace} --', async () => {
    await user.type(input, '123')
    await user.type(input, '{backspace}{backspace}', {
      initialSelectionStart: 5
    })
    expect(input).toHaveValue('1-2--3')
  })

  test('input 123 and {backspace} 2', async () => {
    await user.type(input, '123')
    await user.type(input, '{backspace}', { initialSelectionStart: 3 })
    expect(input).toHaveValue('1-3')
  })
})

describe('#-#--# eager mask', () => {
  beforeAll(() => {
    input = prepareInput({ mask: '#-#--#', eager: true })
  })

  afterEach(async () => {
    await user.clear(input)
  })

  test('input 12', async () => {
    await user.type(input, '12')
    expect(input).toHaveValue('1-2--')
  })

  test('input 12{ }', async () => {
    await user.type(input, '12{ }')
    expect(input).toHaveValue('1-2--')
  })

  test('input 1234', async () => {
    await user.type(input, '1234')
    expect(input).toHaveValue('1-2--3')
  })

  test('input 1234{backspace}', async () => {
    await user.type(input, '1234{backspace}')
    expect(input).toHaveValue('1-2--')
  })

  test('input 1234{backspace}{backspace}', async () => {
    await user.type(input, '1234{backspace}{backspace}')
    expect(input).toHaveValue('1-2--')
  })

  test('input 123 and {backspace}{backspace} --', async () => {
    await user.type(input, '123')
    await user.type(input, '{backspace}{backspace}', {
      initialSelectionStart: 5
    })
    expect(input).toHaveValue('1-2--3')
  })

  test('input 123 and {backspace} 2', async () => {
    await user.type(input, '123')
    await user.type(input, '{backspace}', { initialSelectionStart: 3 })
    expect(input).toHaveValue('1-3--')
  })
})

describe('#2 ## mask', () => {
  beforeAll(() => {
    input = prepareInput({ mask: '#2 ##' })
  })

  afterEach(async () => {
    await user.clear(input)
  })

  test('input 1', async () => {
    await user.type(input, '1')
    expect(input).toHaveValue('1')
  })

  test('input 12', async () => {
    await user.type(input, '12')
    expect(input).toHaveValue('12')
  })

  test('input 123', async () => {
    await user.type(input, '123')
    expect(input).toHaveValue('12 3')
  })

  test('input 13', async () => {
    await user.type(input, '13')
    expect(input).toHaveValue('12 3')
  })

  test('input 133', async () => {
    await user.type(input, '133')
    expect(input).toHaveValue('12 33')
  })
})

describe('#2 ## eager mask', () => {
  beforeAll(() => {
    input = prepareInput({ mask: '#2 ##', eager: true })
  })

  afterEach(async () => {
    await user.clear(input)
  })

  test('input 1', async () => {
    await user.type(input, '1')
    expect(input).toHaveValue('12 ')
  })

  test('input 2', async () => {
    await user.type(input, '2')
    expect(input).toHaveValue('22 ')
  })

  test('input 11', async () => {
    await user.type(input, '11')
    expect(input).toHaveValue('12 1')
  })

  test('input 111', async () => {
    await user.type(input, '111')
    expect(input).toHaveValue('12 11')
  })

  test('input 12', async () => {
    await user.type(input, '12')
    expect(input).toHaveValue('12 2')
  })

  test('input 123', async () => {
    await user.type(input, '123')
    expect(input).toHaveValue('12 23')
  })

  test('input 1234', async () => {
    await user.type(input, '1234')
    expect(input).toHaveValue('12 23')
  })

  test('input 13', async () => {
    await user.type(input, '13')
    expect(input).toHaveValue('12 3')
  })

  test('input 133', async () => {
    await user.type(input, '133')
    expect(input).toHaveValue('12 33')
  })

  test('input { }', async () => {
    await user.type(input, '{ }')
    expect(input).toHaveValue('')
  })
})

describe('(#) 2## mask', () => {
  beforeAll(() => {
    input = prepareInput({ mask: '(#) 2##' })
  })

  afterEach(async () => {
    await user.clear(input)
  })

  test('input 1', async () => {
    await user.type(input, '1')
    expect(input).toHaveValue('(1')
  })

  test('input 12', async () => {
    await user.type(input, '12')
    expect(input).toHaveValue('(1) 2')
  })

  test('input 123', async () => {
    await user.type(input, '123')
    expect(input).toHaveValue('(1) 23')
  })

  test('input 13', async () => {
    await user.type(input, '13')
    expect(input).toHaveValue('(1) 23')
  })

  test('input 133', async () => {
    await user.type(input, '133')
    expect(input).toHaveValue('(1) 233')
  })
})

describe('(#) 2## eager mask', () => {
  beforeAll(() => {
    input = prepareInput({ mask: '(#) 2##', eager: true })
  })

  afterEach(async () => {
    await user.clear(input)
  })

  test('input 1', async () => {
    await user.type(input, '1')
    expect(input).toHaveValue('(1) 2')
  })

  test('input 12', async () => {
    await user.type(input, '12')
    expect(input).toHaveValue('(1) 22')
  })

  test('input 123', async () => {
    await user.type(input, '123')
    expect(input).toHaveValue('(1) 223')
  })

  test('input 13', async () => {
    await user.type(input, '13')
    expect(input).toHaveValue('(1) 23')
  })

  test('input 133', async () => {
    await user.type(input, '133')
    expect(input).toHaveValue('(1) 233')
  })
})

describe('12## eager mask', () => {
  beforeAll(() => {
    input = prepareInput({ mask: '12##', eager: true })
  })

  afterEach(async () => {
    await user.clear(input)
  })

  test('input 1', async () => {
    await user.type(input, '1')
    expect(input).toHaveValue('121')
  })

  test('input 2', async () => {
    await user.type(input, '2')
    expect(input).toHaveValue('122')
  })

  test('input 3', async () => {
    await user.type(input, '3')
    expect(input).toHaveValue('123')
  })

  test('input 12', async () => {
    await user.type(input, '12')
    expect(input).toHaveValue('1212')
  })

  test('input 123', async () => {
    await user.type(input, '123')
    expect(input).toHaveValue('1212')
  })

  test('input 13', async () => {
    await user.type(input, '13')
    expect(input).toHaveValue('1213')
  })

  test('input 133', async () => {
    await user.type(input, '133')
    expect(input).toHaveValue('1213')
  })

  test('input { }', async () => {
    await user.type(input, '{ }')
    expect(input).toHaveValue('12')
  })

  test('input { }{ }', async () => {
    await user.type(input, '{ }{ }')
    expect(input).toHaveValue('12')
  })

  test('input 1{backspace}', async () => {
    await user.type(input, '1{backspace}')
    expect(input).toHaveValue('')
  })

  test('input 12{backspace}', async () => {
    await user.type(input, '123{backspace}')
    expect(input).toHaveValue('121')
  })
})

describe('+1 (###) ###-##-## mask', () => {
  beforeAll(() => {
    input = prepareInput({ mask: '+1 (###) ###-##-##' })
  })

  afterEach(async () => {
    await user.clear(input)
  })

  test('input 1', async () => {
    await user.type(input, '1')
    expect(input).toHaveValue('+1')
  })

  test('input 9', async () => {
    await user.type(input, '9')
    expect(input).toHaveValue('+1 (9')
  })

  test('input 90', async () => {
    await user.type(input, '90')
    expect(input).toHaveValue('+1 (90')
  })

  test('input 903', async () => {
    await user.type(input, '903')
    expect(input).toHaveValue('+1 (903')
  })

  test('input 9034', async () => {
    await user.type(input, '9034')
    expect(input).toHaveValue('+1 (903) 4')
  })

  test('input 19991234567', async () => {
    await user.type(input, '19991234567')
    expect(input).toHaveValue('+1 (999) 123-45-67')
  })

  test('input 9991234567', async () => {
    await user.type(input, '9991234567')
    expect(input).toHaveValue('+1 (999) 123-45-67')
  })

  test('input { }', async () => {
    await user.type(input, '{ }')
    expect(input).toHaveValue('+1 ')
  })
})

describe('+1 (###) ###-##-## eager mask', () => {
  beforeAll(() => {
    input = prepareInput({ mask: '+1 (###) ###-##-##', eager: true })
  })

  afterEach(async () => {
    await user.clear(input)
  })

  test('input 1', async () => {
    await user.type(input, '1')
    expect(input).toHaveValue('+1 (1')
  })

  test('input 9', async () => {
    await user.type(input, '9')
    expect(input).toHaveValue('+1 (9')
  })

  test('input 90', async () => {
    await user.type(input, '90')
    expect(input).toHaveValue('+1 (90')
  })

  test('input 903', async () => {
    await user.type(input, '903')
    expect(input).toHaveValue('+1 (903) ')
  })

  test('input 9034', async () => {
    await user.type(input, '9034')
    expect(input).toHaveValue('+1 (903) 4')
  })

  test('input 903456', async () => {
    await user.type(input, '903456')
    expect(input).toHaveValue('+1 (903) 456-')
  })

  test('input 19991234567', async () => {
    await user.type(input, '19991234567')
    expect(input).toHaveValue('+1 (199) 912-34-56')
  })

  test('input 9991234567', async () => {
    await user.type(input, '9991234567')
    expect(input).toHaveValue('+1 (999) 123-45-67')
  })

  test('input { }', async () => {
    await user.type(input, '{ }')
    expect(input).toHaveValue('+1 (')
  })
})

describe("Multiple pattern '+ +' mask", () => {
  beforeAll(() => {
    input = prepareInput({
      mask: '+ +',
      tokens: { '+': { pattern: /\d/, multiple: true } }
    })
  })

  afterEach(async () => {
    await user.clear(input)
  })

  test('input { }', async () => {
    await user.type(input, '{ }')
    expect(input).toHaveValue('')
  })

  test('input 1', async () => {
    await user.type(input, '1')
    expect(input).toHaveValue('1')
  })

  test('input 12', async () => {
    await user.type(input, '12')
    expect(input).toHaveValue('12')
  })

  test('input 12{ }', async () => {
    await user.type(input, '12{ }')
    expect(input).toHaveValue('12 ')
  })

  test('input 12{ }{ }', async () => {
    await user.type(input, '12{ }{ }')
    expect(input).toHaveValue('12 ')
  })

  test('input 12{ }{ }3', async () => {
    await user.type(input, '12{ }{ }3')
    expect(input).toHaveValue('12 3')
  })

  test('input 12{ }{ }34', async () => {
    await user.type(input, '12{ }{ }34')
    expect(input).toHaveValue('12 34')
  })

  test('input 12{ }{ }34{ }', async () => {
    await user.type(input, '12{ }{ }34{ }')
    expect(input).toHaveValue('12 34')
  })

  test('input 12{ }34{ }5', async () => {
    await user.type(input, '12{ }34{ }5')
    expect(input).toHaveValue('12 345')
  })

  test('input 12{ }{ }3{backspace}', async () => {
    await user.type(input, '12{ }{ }3{backspace}')
    expect(input).toHaveValue('12 ')
  })

  test('input 12{ }{ }3{backspace}{backspace}', async () => {
    await user.type(input, '12{ }{ }3{backspace}{backspace}')
    expect(input).toHaveValue('12')
  })

  test('input 12{ArrowLeft}{ }', async () => {
    await user.type(input, '12{ArrowLeft}{ }')
    expect(input).toHaveValue('1 2')
  })

  test('input 12{ArrowLeft}{ }{ }', async () => {
    await user.type(input, '12{ArrowLeft}{ }{ }')
    expect(input).toHaveValue('1 2')
  })
})

describe("Optional with multiple '-9' mask", () => {
  beforeAll(() => {
    input = prepareInput({
      mask: '-9',
      tokens: {
        '-': { pattern: /-/, optional: true },
        '9': { pattern: /\d/, multiple: true }
      }
    })
  })

  afterEach(async () => {
    await user.clear(input)
  })

  test('input { }', async () => {
    await user.type(input, '{ }')
    expect(input).toHaveValue('')
  })

  test('input 1', async () => {
    await user.type(input, '1')
    expect(input).toHaveValue('1')
  })

  test('input 12', async () => {
    await user.type(input, '12')
    expect(input).toHaveValue('12')
  })

  test('input -', async () => {
    await user.type(input, '-')
    expect(input).toHaveValue('-')
  })

  test('input -1', async () => {
    await user.type(input, '-1')
    expect(input).toHaveValue('-1')
  })

  test('input 1{ArrowLeft}-', async () => {
    await user.type(input, '1{ArrowLeft}-')
    expect(input).toHaveValue('-1')
  })

  test('input 1{ArrowLeft}--', async () => {
    await user.type(input, '1{ArrowLeft}--')
    expect(input).toHaveValue('-1')
  })
})

describe('IP mask', () => {
  beforeAll(() => {
    input = prepareInput({
      mask: '#00.#00.#00.#00',
      tokens: {
        0: { pattern: /[\d]/, optional: true }
      }
    })
  })

  afterEach(async () => {
    await user.clear(input)
  })

  test('input 1', async () => {
    await user.type(input, '1')
    expect(input).toHaveValue('1')
  })

  test('input 12', async () => {
    await user.type(input, '12')
    expect(input).toHaveValue('12')
  })

  test('input 123', async () => {
    await user.type(input, '123')
    expect(input).toHaveValue('123')
  })

  test('input 1234', async () => {
    await user.type(input, '1234')
    expect(input).toHaveValue('123.4')
  })

  test('input 123{ }', async () => {
    await user.type(input, '123{ }')
    expect(input).toHaveValue('123.')
  })

  test('input 123.', async () => {
    await user.type(input, '123.')
    expect(input).toHaveValue('123.')
  })

  test('input 123..', async () => {
    await user.type(input, '123..')
    expect(input).toHaveValue('123.')
  })

  test('input 1.2.', async () => {
    await user.type(input, '1.2.')
    expect(input).toHaveValue('1.2.')
  })

  test('input 1.2..', async () => {
    await user.type(input, '1.2..')
    expect(input).toHaveValue('1.2.')
  })

  test('input 1.23', async () => {
    await user.type(input, '1.23')
    expect(input).toHaveValue('1.23')
  })

  test('input 1.234', async () => {
    await user.type(input, '1.234')
    expect(input).toHaveValue('1.234')
  })

  test('input 1.2345', async () => {
    await user.type(input, '1.2345')
    expect(input).toHaveValue('1.234.5')
  })

  test('input 1.23.456.7', async () => {
    await user.type(input, '1.23.456.7')
    expect(input).toHaveValue('1.23.456.7')
  })

  test('input 1.23.456.7.', async () => {
    await user.type(input, '1.23.456.7.')
    expect(input).toHaveValue('1.23.456.7')
  })

  test('input 1.2.3.4', async () => {
    await user.type(input, '1.2.3.4')
    expect(input).toHaveValue('1.2.3.4')
  })

  test('input 123.456.789.012', async () => {
    await user.type(input, '123.456.789.012')
    expect(input).toHaveValue('123.456.789.012')
  })

  test('input 123.456.789.0123', async () => {
    await user.type(input, '123.456.789.0123')
    expect(input).toHaveValue('123.456.789.012')
  })
})

describe('IP eager mask', () => {
  beforeAll(() => {
    input = prepareInput({
      mask: '#00.#00.#00.#00',
      eager: true,
      tokens: {
        0: { pattern: /[\d]/, optional: true }
      }
    })
  })

  afterEach(async () => {
    await user.clear(input)
  })

  test('input 1', async () => {
    await user.type(input, '1')
    expect(input).toHaveValue('1')
  })

  test('input 12', async () => {
    await user.type(input, '12')
    expect(input).toHaveValue('12')
  })

  test('input 123', async () => {
    await user.type(input, '123')
    expect(input).toHaveValue('123.')
  })

  test('input 1234', async () => {
    await user.type(input, '1234')
    expect(input).toHaveValue('123.4')
  })

  test('input 123{ }', async () => {
    await user.type(input, '123{ }')
    expect(input).toHaveValue('123.')
  })

  test('input 123.', async () => {
    await user.type(input, '123.')
    expect(input).toHaveValue('123.')
  })

  test('input 123..', async () => {
    await user.type(input, '123..')
    expect(input).toHaveValue('123.')
  })

  test('input 1.2.', async () => {
    await user.type(input, '1.2.')
    expect(input).toHaveValue('1.2.')
  })

  test('input 1.2..', async () => {
    await user.type(input, '1.2..')
    expect(input).toHaveValue('1.2.')
  })

  test('input 1.23', async () => {
    await user.type(input, '1.23')
    expect(input).toHaveValue('1.23')
  })

  test('input 1.234', async () => {
    await user.type(input, '1.234')
    expect(input).toHaveValue('1.234.')
  })

  test('input 1.2345', async () => {
    await user.type(input, '1.2345')
    expect(input).toHaveValue('1.234.5')
  })

  test('input 1.23.456.7', async () => {
    await user.type(input, '1.23.456.7')
    expect(input).toHaveValue('1.23.456.7')
  })

  test('input 1.23.456.7.', async () => {
    await user.type(input, '1.23.456.7.')
    expect(input).toHaveValue('1.23.456.7')
  })

  test('input 1.2.3.4', async () => {
    await user.type(input, '1.2.3.4')
    expect(input).toHaveValue('1.2.3.4')
  })

  test('input 123.456.789.012', async () => {
    await user.type(input, '123.456.789.012')
    expect(input).toHaveValue('123.456.789.012')
  })

  test('input 123.456.789.0123', async () => {
    await user.type(input, '123.456.789.0123')
    expect(input).toHaveValue('123.456.789.012')
  })
})

describe('Repeated mask', () => {
  beforeAll(() => {
    input = prepareInput({
      mask: '99.9',
      tokens: {
        9: { pattern: /[\d]/, repeated: true }
      }
    })
  })

  afterEach(async () => {
    await user.clear(input)
  })

  test('input 1', async () => {
    await user.type(input, '1')
    expect(input).toHaveValue('1')
  })

  test('input 12', async () => {
    await user.type(input, '12')
    expect(input).toHaveValue('12')
  })

  test('input 12.', async () => {
    await user.type(input, '12.')
    expect(input).toHaveValue('12.')
  })

  test('input 123', async () => {
    await user.type(input, '123')
    expect(input).toHaveValue('12.3')
  })

  test('input 12345', async () => {
    await user.type(input, '12345')
    expect(input).toHaveValue('12.345')
  })

  test('input 123456', async () => {
    await user.type(input, '123456')
    expect(input).toHaveValue('12.345.6')
  })

  test('input 1234567 and {backspace} 2', async () => {
    await user.type(input, '1234567')
    await user.type(input, '{backspace}', { initialSelectionStart: 2 })
    expect(input).toHaveValue('13.456.7')
  })
})

describe('Repeated eager mask', () => {
  beforeAll(() => {
    input = prepareInput({
      mask: '99.9',
      eager: true,
      tokens: {
        9: { pattern: /[\d]/, repeated: true }
      }
    })
  })

  afterEach(async () => {
    await user.clear(input)
  })

  test('input 1', async () => {
    await user.type(input, '1')
    expect(input).toHaveValue('1')
  })

  test('input 12', async () => {
    await user.type(input, '12')
    expect(input).toHaveValue('12.')
  })

  test('input 12.', async () => {
    await user.type(input, '12.')
    expect(input).toHaveValue('12.')
  })

  test('input 123', async () => {
    await user.type(input, '123')
    expect(input).toHaveValue('12.3')
  })

  test('input 12345', async () => {
    await user.type(input, '12345')
    expect(input).toHaveValue('12.345.')
  })

  test('input 123456', async () => {
    await user.type(input, '123456')
    expect(input).toHaveValue('12.345.6')
  })

  test('input 1234567 and {backspace} 2', async () => {
    await user.type(input, '1234567')
    await user.type(input, '{backspace}', { initialSelectionStart: 2 })
    expect(input).toHaveValue('13.456.7')
  })
})

describe('Reversed mask', () => {
  beforeAll(() => {
    input = prepareInput({ mask: '#-##', reversed: true })
  })

  afterEach(async () => {
    await user.clear(input)
  })

  test('input 1', async () => {
    await user.type(input, '1')
    expect(input).toHaveValue('1')
  })

  test('input 12', async () => {
    await user.type(input, '12')
    expect(input).toHaveValue('12')
  })

  test('input 123', async () => {
    await user.type(input, '123')
    expect(input).toHaveValue('1-23')
  })

  test('input 1234', async () => {
    await user.type(input, '1234')
    expect(input).toHaveValue('2-34')
  })

  test('input 1234{backspace}', async () => {
    await user.type(input, '1234{backspace}')
    expect(input).toHaveValue('23')
  })

  test('input 1-', async () => {
    await user.type(input, '1-')
    expect(input).toHaveValue('1')
  })

  test('input 12-', async () => {
    await user.type(input, '12-')
    expect(input).toHaveValue('12')
  })

  test('input 123-', async () => {
    await user.type(input, '123-')
    expect(input).toHaveValue('1-23')
  })
})

describe('Reversed eager mask', () => {
  beforeAll(() => {
    input = prepareInput({ mask: '#-##', reversed: true, eager: true })
  })

  afterEach(async () => {
    await user.clear(input)
  })

  test('input 1', async () => {
    await user.type(input, '1')
    expect(input).toHaveValue('1')
  })

  test('input 12', async () => {
    await user.type(input, '12')
    expect(input).toHaveValue('-12')
  })

  test('input 123', async () => {
    await user.type(input, '123')
    expect(input).toHaveValue('1-23')
  })

  test('input 1234', async () => {
    await user.type(input, '1234')
    expect(input).toHaveValue('2-34')
  })

  test('input 1234{backspace}', async () => {
    await user.type(input, '1234{backspace}')
    expect(input).toHaveValue('-23')
  })

  test('input 1-', async () => {
    await user.type(input, '1-')
    expect(input).toHaveValue('1')
  })

  test('input 12-', async () => {
    await user.type(input, '12-')
    expect(input).toHaveValue('-12')
  })

  test('input 123-', async () => {
    await user.type(input, '123-')
    expect(input).toHaveValue('1-23')
  })
})

describe('Repeated reversed mask', () => {
  beforeAll(() => {
    input = prepareInput({
      mask: '9 99#,##',
      reversed: true,
      tokens: {
        9: { pattern: /[\d]/, repeated: true }
      }
    })
  })

  afterEach(async () => {
    await user.clear(input)
  })

  test('input 1', async () => {
    await user.type(input, '1')
    expect(input).toHaveValue('1')
  })

  test('input 12', async () => {
    await user.type(input, '12')
    expect(input).toHaveValue('12')
  })

  test('input 123', async () => {
    await user.type(input, '123')
    expect(input).toHaveValue('1,23')
  })

  test('input 1234', async () => {
    await user.type(input, '1234')
    expect(input).toHaveValue('12,34')
  })

  test('input 12345', async () => {
    await user.type(input, '12345')
    expect(input).toHaveValue('123,45')
  })

  test('input 123456', async () => {
    await user.type(input, '123456')
    expect(input).toHaveValue('1 234,56')
  })

  test('input 123456{backspace}', async () => {
    await user.type(input, '123456{backspace}')
    expect(input).toHaveValue('123,45')
  })

  test('input 123456 and then insert 0', async () => {
    await user.type(input, '123456')
    await user.type(input, '0', { initialSelectionStart: 1 })
    expect(input).toHaveValue('10 234,56')
  })
})

describe('Repeated reversed eager mask', () => {
  beforeAll(() => {
    input = prepareInput({
      mask: '9 99#,##',
      reversed: true,
      eager: true,
      tokens: {
        9: { pattern: /[\d]/, repeated: true }
      }
    })
  })

  afterEach(async () => {
    await user.clear(input)
  })

  test('input 1', async () => {
    await user.type(input, '1')
    expect(input).toHaveValue('1')
  })

  test('input 12', async () => {
    await user.type(input, '12')
    expect(input).toHaveValue(',12')
  })

  test('input 123', async () => {
    await user.type(input, '123')
    expect(input).toHaveValue('1,23')
  })

  test('input 1234', async () => {
    await user.type(input, '1234')
    expect(input).toHaveValue('12,34')
  })

  test('input 12345', async () => {
    await user.type(input, '12345')
    expect(input).toHaveValue(' 123,45')
  })

  test('input 123456', async () => {
    await user.type(input, '123456')
    expect(input).toHaveValue('1 234,56')
  })

  test('input 123456{backspace}', async () => {
    await user.type(input, '123456{backspace}')
    expect(input).toHaveValue(' 123,45')
  })

  test('input 123456 and then insert 0', async () => {
    await user.type(input, '123456')
    await user.type(input, '0', { initialSelectionStart: 1 })
    expect(input).toHaveValue('10 234,56')
  })
})

describe('Dynamic mask', () => {
  beforeAll(() => {
    input = prepareInput({ mask: ['#--#', '#-#--#'] })
  })

  afterEach(async () => {
    await user.clear(input)
  })

  test('input 1', async () => {
    await user.type(input, '1')
    expect(input).toHaveValue('1')
  })

  test('input 12', async () => {
    await user.type(input, '12')
    expect(input).toHaveValue('1--2')
  })

  test('input 123', async () => {
    await user.type(input, '123')
    expect(input).toHaveValue('1-2--3')
  })

  test('input 1234', async () => {
    await user.type(input, '1234')
    expect(input).toHaveValue('1-2--3')
  })

  test('input 123{backspace}', async () => {
    await user.type(input, '123{backspace}')
    expect(input).toHaveValue('1--2')
  })
})

describe('Dynamic eager mask', () => {
  beforeAll(() => {
    input = prepareInput({ mask: ['#--#', '#-#--#'], eager: true })
  })

  afterEach(async () => {
    await user.clear(input)
  })

  test('input 1', async () => {
    await user.type(input, '1')
    expect(input).toHaveValue('1--')
  })

  test('input 12', async () => {
    await user.type(input, '12')
    expect(input).toHaveValue('1--2')
  })

  test('input 123', async () => {
    await user.type(input, '123')
    expect(input).toHaveValue('1-2--3')
  })

  test('input 1234', async () => {
    await user.type(input, '1234')
    expect(input).toHaveValue('1-2--3')
  })

  test('input 123{backspace}', async () => {
    await user.type(input, '123{backspace}')
    expect(input).toHaveValue('1--2')
  })
})
