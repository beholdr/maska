import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  MockInstance,
  test,
  vi
} from 'vitest'
import userEvent from '@testing-library/user-event'

import { MaskInput, MaskInputOptions } from '../src/input'

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

    expect([...mask.items][0][1].isEager()).toBe(true)
    expect([...mask.items][1][1].isEager()).toBe(false)
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

  test('test callbacks', async () => {
    document.body.innerHTML = `<input id="input" data-maska="#-#">`
    const input = <HTMLInputElement>document.getElementById('input')
    const onMaska1 = vi.fn()
    const onMaska2 = vi.fn()

    new MaskInput(input, { onMaska: [onMaska1, onMaska2] })

    await user.type(input, '12')
    expect(onMaska1).toHaveBeenCalledTimes(2)
    expect(onMaska2).toHaveBeenCalledTimes(2)
    expect(onMaska1).toHaveBeenLastCalledWith(
      expect.objectContaining({
        masked: '1-2',
        unmasked: '12',
        completed: true
      })
    )
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

    await user.type(input, '1a')
    expect(input).toHaveValue('1a')
  })

  test('no mask param', async () => {
    document.body.innerHTML = `<input id="input">`
    const input = <HTMLInputElement>document.getElementById('input')
    new MaskInput(input)

    await user.type(input, '1a')
    expect(input).toHaveValue('1a')
  })

  test('wrong input type', async () => {
    document.body.innerHTML = `<input id="input" type="email" data-maska-eager>`
    const input = <HTMLInputElement>document.getElementById('input')
    const logSpy = vi.spyOn(console, 'warn')

    new MaskInput(input)

    expect(logSpy).toHaveBeenCalledOnce();
    expect(logSpy).toHaveBeenCalledWith('Maska: input of `%s` type is not supported', 'email');
  })
})

interface HooksTestContext {
  onMaska: MockInstance
  preProcess: MockInstance
  postProcess: MockInstance
}

describe('test hooks', () => {
  beforeEach<HooksTestContext>((context) => {
    document.body.innerHTML = `<input id="input"
      data-maska="0.99"
      data-maska-tokens="0:[0-9]:multiple|9:[0-9]:optional">`
    input = <HTMLInputElement>document.getElementById('input')

    const hooks = {
      onMaska: (value) => value,
      preProcess: (value: string) => value.replace(/[$,]/g, ''),
      postProcess: val => {
        if (!val) return ''

        const sub = 3 - (val.includes('.') ? val.length - val.indexOf('.') : 0)

        return Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(val)
          .slice(0, sub ? -sub : undefined)
      }
    }

    context.onMaska = vi.spyOn(hooks, 'onMaska')
    context.preProcess = vi.spyOn(hooks, 'preProcess')
    context.postProcess = vi.spyOn(hooks, 'postProcess')

    new MaskInput(input, {
      onMaska: context.onMaska as any,
      preProcess: context.preProcess as any,
      postProcess: context.postProcess as any
    })
  })

  test<HooksTestContext>('input 1', async (context) => {
    await user.type(input, '1')
    expect(input).toHaveValue('$1')

    expect(context.preProcess).toHaveBeenCalledOnce()
    expect(context.postProcess).toHaveBeenCalledOnce()

    expect(context.onMaska).toHaveBeenCalledOnce()
    expect(context.onMaska).toHaveBeenCalledWith({
      completed: false,
      masked: '$1',
      unmasked: '1'
    })
  })

  test<HooksTestContext>('input 123', async (context) => {
    await user.type(input, '123')
    expect(input).toHaveValue('$123')

    expect(context.preProcess).toHaveBeenCalledTimes(3)
    expect(context.postProcess).toHaveBeenCalledTimes(3)

    expect(context.onMaska).toHaveBeenCalledTimes(3)
    expect(context.onMaska).toHaveBeenLastCalledWith({
      completed: false,
      masked: '$123',
      unmasked: '123'
    })
  })

  test<HooksTestContext>('input 1234', async (context) => {
    await user.type(input, '1234')
    expect(input).toHaveValue('$1,234')

    expect(context.preProcess).toHaveBeenCalledTimes(4)
    expect(context.postProcess).toHaveBeenCalledTimes(4)

    expect(context.onMaska).toHaveBeenCalledTimes(4)
    expect(context.onMaska).toHaveBeenLastCalledWith({
      completed: true,
      masked: '$1,234',
      unmasked: '1234'
    })
  })

  test<HooksTestContext>('input 1234567', async (context) => {
    await user.type(input, '1234567')
    expect(input).toHaveValue('$1,234,567')

    expect(context.preProcess).toHaveBeenCalledTimes(7)
    expect(context.postProcess).toHaveBeenCalledTimes(7)

    expect(context.onMaska).toHaveBeenCalledTimes(7)
    expect(context.onMaska).toHaveBeenLastCalledWith({
      completed: true,
      masked: '$1,234,567',
      unmasked: '1234567'
    })
  })

  test<HooksTestContext>('input 123.4', async (context) => {
    await user.type(input, '123.4')
    expect(input).toHaveValue('$123.4')

    expect(context.preProcess).toHaveBeenCalledTimes(5)
    expect(context.postProcess).toHaveBeenCalledTimes(5)

    expect(context.onMaska).toHaveBeenCalledTimes(5)
    expect(context.onMaska).toHaveBeenLastCalledWith({
      completed: true,
      masked: '$123.4',
      unmasked: '1234'
    })
  })

  test<HooksTestContext>('input 123.45', async (context) => {
    await user.type(input, '123.45')
    expect(input).toHaveValue('$123.45')

    expect(context.preProcess).toHaveBeenCalledTimes(6)
    expect(context.postProcess).toHaveBeenCalledTimes(6)

    expect(context.onMaska).toHaveBeenCalledTimes(6)
    expect(context.onMaska).toHaveBeenLastCalledWith({
      completed: true,
      masked: '$123.45',
      unmasked: '12345'
    })
  })

  test<HooksTestContext>('input 123.456', async (context) => {
    await user.type(input, '123.456')
    expect(input).toHaveValue('$123.45')

    expect(context.preProcess).toHaveBeenCalledTimes(7)
    expect(context.postProcess).toHaveBeenCalledTimes(7)

    expect(context.onMaska).toHaveBeenCalledTimes(7)
    expect(context.onMaska).toHaveBeenLastCalledWith({
      completed: true,
      masked: '$123.45',
      unmasked: '12345'
    })
  })

  test<HooksTestContext>('input 1234.567', async (context) => {
    await user.type(input, '1234.567')
    expect(input).toHaveValue('$1,234.56')

    expect(context.preProcess).toHaveBeenCalledTimes(8)
    expect(context.postProcess).toHaveBeenCalledTimes(8)

    expect(context.onMaska).toHaveBeenCalledTimes(8)
    expect(context.onMaska).toHaveBeenLastCalledWith({
      completed: true,
      masked: '$1,234.56',
      unmasked: '123456'
    })
  })

  test<HooksTestContext>('input $1234.56', async (context) => {
    await user.type(input, '$1234.56')
    expect(input).toHaveValue('$1,234.56')

    expect(context.preProcess).toHaveBeenCalledTimes(8)
    expect(context.postProcess).toHaveBeenCalledTimes(8)

    expect(context.onMaska).toHaveBeenCalledTimes(8)
    expect(context.onMaska).toHaveBeenLastCalledWith({
      completed: true,
      masked: '$1,234.56',
      unmasked: '123456'
    })
  })

  test<HooksTestContext>('input 1234.56 and {backspace}', async (context) => {
    await user.type(input, '1234.56{backspace}')
    expect(input).toHaveValue('$1,234.5')

    expect(context.preProcess).toHaveBeenCalled()
    expect(context.postProcess).toHaveBeenCalled()

    expect(context.onMaska).toHaveBeenCalled()
    expect(context.onMaska).toHaveBeenLastCalledWith({
      completed: true,
      masked: '$1,234.5',
      unmasked: '12345'
    })
  })

  test<HooksTestContext>('input 1234.56 and {backspace}×2', async (context) => {
    await user.type(input, '1234.56{backspace}{backspace}')
    expect(input).toHaveValue('$1,234.')

    expect(context.preProcess).toHaveBeenCalled()
    expect(context.postProcess).toHaveBeenCalled()

    expect(context.onMaska).toHaveBeenCalled()
    expect(context.onMaska).toHaveBeenLastCalledWith({
      completed: true,
      masked: '$1,234.',
      unmasked: '1234'
    })
  })

  test<HooksTestContext>('input 1234.56 and {backspace}×3', async (context) => {
    await user.type(input, '1234.56{backspace}{backspace}{backspace}')
    expect(input).toHaveValue('$1,234')

    expect(context.preProcess).toHaveBeenCalled()
    expect(context.postProcess).toHaveBeenCalled()

    expect(context.onMaska).toHaveBeenCalled()
    expect(context.onMaska).toHaveBeenLastCalledWith({
      completed: true,
      masked: '$1,234',
      unmasked: '1234'
    })
  })

  test('input 12345678, delete 6 and check cursor position', async () => {
    await user.type(input, '12345678')
    expect(input).toHaveValue('$12,345,678')

    await user.type(input, '{ArrowLeft}{ArrowLeft}{backspace}')
    expect(input).toHaveValue('$1,234,578')
    expect(input.selectionStart).toBe(8)

    await user.type(input, '6', { initialSelectionStart: 8 })
    expect(input).toHaveValue('$12,345,678')
    expect(input.selectionStart).toBe(9)
  })
})

describe('test callback', () => {
  beforeEach<HooksTestContext>((context) => {
    document.body.innerHTML = `<input id="input" data-maska="+1 ###">`
    input = <HTMLInputElement>document.getElementById('input')

    const hooks = {
      onMaska: (value) => value,
    }

    context.onMaska = vi.spyOn(hooks, 'onMaska')

    new MaskInput(input, {
      onMaska: context.onMaska as any,
    })
  })

  test<HooksTestContext>('input 1', async (context) => {
    await user.type(input, '1')
    expect(input).toHaveValue('+1')

    expect(context.onMaska).toHaveBeenLastCalledWith({
      completed: false,
      masked: '+1',
      unmasked: ''
    })
  })

  test<HooksTestContext>('input 12', async (context) => {
    await user.type(input, '12')
    expect(input).toHaveValue('+1 2')

    expect(context.onMaska).toHaveBeenLastCalledWith({
      completed: false,
      masked: '+1 2',
      unmasked: '2'
    })
  })

  test<HooksTestContext>('input 2', async (context) => {
    await user.type(input, '2')
    expect(input).toHaveValue('+1 2')

    expect(context.onMaska).toHaveBeenLastCalledWith({
      completed: false,
      masked: '+1 2',
      unmasked: '2'
    })
  })

  test<HooksTestContext>('input 23', async (context) => {
    await user.type(input, '23')
    expect(input).toHaveValue('+1 23')

    expect(context.onMaska).toHaveBeenLastCalledWith({
      completed: false,
      masked: '+1 23',
      unmasked: '23'
    })
  })

  test<HooksTestContext>('input 234', async (context) => {
    await user.type(input, '234')
    expect(input).toHaveValue('+1 234')

    expect(context.onMaska).toHaveBeenLastCalledWith({
      completed: true,
      masked: '+1 234',
      unmasked: '234'
    })
  })

  test<HooksTestContext>('input 2345', async (context) => {
    await user.type(input, '2345')
    expect(input).toHaveValue('+1 234')

    expect(context.onMaska).toHaveBeenLastCalledWith({
      completed: true,
      masked: '+1 234',
      unmasked: '234'
    })
  })
})

describe('test eager callback', () => {
  beforeEach<HooksTestContext>((context) => {
    document.body.innerHTML = `<input id="input" data-maska="+1 ###" data-maska-eager>`
    input = <HTMLInputElement>document.getElementById('input')

    const hooks = {
      onMaska: (value) => value,
    }

    context.onMaska = vi.spyOn(hooks, 'onMaska')

    new MaskInput(input, {
      onMaska: context.onMaska as any,
    })
  })

  test<HooksTestContext>('input 1', async (context) => {
    await user.type(input, '1')
    expect(input).toHaveValue('+1 ')

    expect(context.onMaska).toHaveBeenLastCalledWith({
      completed: false,
      masked: '+1 ',
      unmasked: ''
    })
  })

  test<HooksTestContext>('input 12', async (context) => {
    await user.type(input, '12')
    expect(input).toHaveValue('+1 2')

    expect(context.onMaska).toHaveBeenLastCalledWith({
      completed: false,
      masked: '+1 2',
      unmasked: '2'
    })
  })

  test<HooksTestContext>('input 2', async (context) => {
    await user.type(input, '2')
    expect(input).toHaveValue('+1 2')

    expect(context.onMaska).toHaveBeenLastCalledWith({
      completed: false,
      masked: '+1 2',
      unmasked: '2'
    })
  })

  test<HooksTestContext>('input 23', async (context) => {
    await user.type(input, '23')
    expect(input).toHaveValue('+1 23')

    expect(context.onMaska).toHaveBeenLastCalledWith({
      completed: false,
      masked: '+1 23',
      unmasked: '23'
    })
  })

  test<HooksTestContext>('input 234', async (context) => {
    await user.type(input, '234')
    expect(input).toHaveValue('+1 234')

    expect(context.onMaska).toHaveBeenLastCalledWith({
      completed: true,
      masked: '+1 234',
      unmasked: '234'
    })
  })

  test<HooksTestContext>('input 2345', async (context) => {
    await user.type(input, '2345')
    expect(input).toHaveValue('+1 234')

    expect(context.onMaska).toHaveBeenLastCalledWith({
      completed: true,
      masked: '+1 234',
      unmasked: '234'
    })
  })
})

describe('test data-attr', () => {
  function prepareMaskWithHtml(html: string) {
    document.body.innerHTML = html

    return new MaskInput('#input')
  }

  test('empty mask', () => {
    const mask = prepareMaskWithHtml(`<input id="input" data-maska>`)
    expect([...mask.items][0][1].opts.mask).toBe(undefined)
  })

  test('simple mask', () => {
    const mask = prepareMaskWithHtml(`<input id="input" data-maska="#-#">`)
    expect([...mask.items][0][1].opts.mask).toBe('#-#')
  })

  test('dynamic mask', () => {
    const mask = prepareMaskWithHtml(
      `<input id="input" data-maska="['#--#', '#-#--#']">`
    )
    expect([...mask.items][0][1].opts.mask?.length).toBe(2)
  })

  test('eager mask', () => {
    const mask = prepareMaskWithHtml(`<input id="input" data-maska-eager>`)
    expect([...mask.items][0][1].isEager()).toBe(true)
  })

  test('eager mask true', () => {
    const mask = prepareMaskWithHtml(
      `<input id="input" data-maska-eager="true">`
    )
    expect([...mask.items][0][1].isEager()).toBe(true)
  })

  test('eager mask false', () => {
    const mask = prepareMaskWithHtml(
      `<input id="input" data-maska-eager="false">`
    )
    expect([...mask.items][0][1].isEager()).toBe(false)
  })

  test('reversed mask', () => {
    const mask = prepareMaskWithHtml(`<input id="input" data-maska-reversed>`)
    expect([...mask.items][0][1].opts.reversed).toBe(true)
  })

  test('custom tokens mask', () => {
    const mask = prepareMaskWithHtml(
      `<input id="input" data-maska-tokens="{ 'Z': { 'pattern': '[0-9]' } }">`
    )
    expect([...mask.items][0][1].opts.tokens).toHaveProperty('#.pattern')
    expect([...mask.items][0][1].opts.tokens).toHaveProperty('Z.pattern')
  })

  test('replace tokens mask', () => {
    const mask = prepareMaskWithHtml(
      `<input id="input" data-maska-tokens="{ 'Z': { 'pattern': '[0-9]' } }" data-maska-tokens-replace>`
    )
    expect([...mask.items][0][1].opts.tokens).toHaveProperty('Z.pattern')
    expect([...mask.items][0][1].opts.tokens).not.toHaveProperty('#.pattern')
  })

  test('single quotes tokens mask', () => {
    const mask = prepareMaskWithHtml(
      `<input id="input" data-maska-tokens="{ 'Z': { 'pattern': '[0-9]' } }">`
    )
    expect([...mask.items][0][1].opts.tokens).toHaveProperty('Z.pattern')
  })

  test('simple tokens mask', () => {
    const mask = prepareMaskWithHtml(
      `<input id="input" data-maska-tokens="Z:[0-9]|X:[0-9]:optional">`
    )
    expect([...mask.items][0][1].opts.tokens).toHaveProperty(
      'Z.optional',
      false
    )
    expect([...mask.items][0][1].opts.tokens).toHaveProperty('X.optional', true)
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

  test('input 12{backspace}×2', async () => {
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

  test('input 12{backspace}×2', async () => {
    await user.type(input, '12{backspace}{backspace}')
    expect(input).toHaveValue('1-')
  })

  test('input 12{backspace}×3', async () => {
    await user.type(input, '12{backspace}{backspace}{backspace}')
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

describe('+1 (#) #-# eager mask', () => {
  beforeAll(() => {
    input = prepareInput({ mask: '+1 (#) #-#', eager: true })
  })

  afterEach(async () => {
    await user.clear(input)
  })

  test('input 1', async () => {
    await user.type(input, '1')
    expect(input).toHaveValue('+1 (')
  })

  test('input 12', async () => {
    await user.type(input, '12')
    expect(input).toHaveValue('+1 (2) ')
  })

  test('input 123', async () => {
    await user.type(input, '123')
    expect(input).toHaveValue('+1 (2) 3-')
  })

  test('input 1234', async () => {
    await user.type(input, '1234')
    expect(input).toHaveValue('+1 (2) 3-4')
  })

  test('input 2', async () => {
    await user.type(input, '2')
    expect(input).toHaveValue('+1 (2) ')
  })

  test('input 234', async () => {
    await user.type(input, '234')
    expect(input).toHaveValue('+1 (2) 3-4')
  })

  test('input 2{ArrowLeft}3', async () => {
    await user.type(input, '2{ArrowLeft}3')
    expect(input).toHaveValue('+1 (2) 3-')
  })

  test('input 234{backspace}', async () => {
    await user.type(input, '234{backspace}')
    expect(input).toHaveValue('+1 (2) 3-')
  })

  test('input 234{backspace}×2', async () => {
    await user.type(input, '234{backspace}{backspace}')
    expect(input).toHaveValue('+1 (2) 3-')
  })

  test('input 234{backspace}×3', async () => {
    await user.type(input, '234{backspace}{backspace}{backspace}')
    expect(input).toHaveValue('+1 (2) ')
  })

  test('input 234{backspace}×4', async () => {
    await user.type(input, '234{backspace}{backspace}{backspace}{backspace}')
    expect(input).toHaveValue('+1 (2) ')
  })

  test('input 234{backspace}×5', async () => {
    await user.type(input, '234{backspace}{backspace}{backspace}{backspace}{backspace}')
    expect(input).toHaveValue('+1 (2) ')
  })

  test('input 234{backspace}×6', async () => {
    await user.type(input, '234{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}')
    expect(input).toHaveValue('')
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

  test('input 1234{backspace}×2', async () => {
    await user.type(input, '1234{backspace}{backspace}')
    expect(input).toHaveValue('1-2-')
  })

  test('input 123 and {backspace}×2 --', async () => {
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

  test('input 1234{backspace}×2', async () => {
    await user.type(input, '1234{backspace}{backspace}')
    expect(input).toHaveValue('1-2--')
  })

  test('input 123 and {backspace}×2 --', async () => {
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
    expect(input).toHaveValue('12')
  })

  test('input 2', async () => {
    await user.type(input, '2')
    expect(input).toHaveValue('12')
  })

  test('input 3', async () => {
    await user.type(input, '3')
    expect(input).toHaveValue('123')
  })

  test('input 11', async () => {
    await user.type(input, '11')
    expect(input).toHaveValue('121')
  })

  test('input 12', async () => {
    await user.type(input, '12')
    expect(input).toHaveValue('122')
  })

  test('input 123', async () => {
    await user.type(input, '123')
    expect(input).toHaveValue('1223')
  })

  test('input 13', async () => {
    await user.type(input, '13')
    expect(input).toHaveValue('123')
  })

  test('input 133', async () => {
    await user.type(input, '133')
    expect(input).toHaveValue('1233')
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

  test('input 123{backspace}', async () => {
    await user.type(input, '123{backspace}')
    expect(input).toHaveValue('122')
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

  test('input +', async () => {
    await user.type(input, '+')
    expect(input).toHaveValue('+1 (')
  })

  test('input 1', async () => {
    await user.type(input, '1')
    expect(input).toHaveValue('+1 (')
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
    expect(input).toHaveValue('+1 (999) 123-45-67')
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

  test('input 12{ }{ }3{backspace}×2', async () => {
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

  test('input 12.3{ArrowLeft}a', async () => {
    await user.type(input, '12.3{ArrowLeft}a')
    expect(input).toHaveValue('12.3')
  })

  test('input 12.3{ArrowLeft}1', async () => {
    await user.type(input, '12.3{ArrowLeft}1')
    expect(input).toHaveValue('12.13')
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

describe('Cursor position eager mask', () => {
  beforeAll(() => {
    input = prepareInput({ mask: '##-##', eager: true })
  })

  afterEach(async () => {
    await user.clear(input)
  })

  test('input 123 {ArrowLeft}×2 ', async () => {
    await user.type(input, '123{ArrowLeft}{ArrowLeft}')
    expect(input).toHaveValue('12-3')
    expect(input.selectionStart).toBe(2)
  })

  test('input 123 {ArrowLeft}×2 0', async () => {
    await user.type(input, '123{ArrowLeft}{ArrowLeft}0')
    expect(input).toHaveValue('12-03')
    expect(input.selectionStart).toBe(4)
  })

  test('input 123 {ArrowLeft} {space}', async () => {
    await user.type(input, '123{ArrowLeft}{space}')
    expect(input).toHaveValue('12-3')
    expect(input.selectionStart).toBe(3)
  })
})

describe('Number mask', () => {
  test('default number', async () => {
    document.body.innerHTML = `<input id="input" data-maska-number>`
    const input = <HTMLInputElement>document.getElementById('input')
    const mask = new MaskInput(input)

    expect(mask.items.get(input)?.opts.number).toStrictEqual({})

    await user.type(input, '1234.56')
    expect(input).toHaveValue('123,456')

    await user.clear(input)
  })

  test('fraction number', async () => {
    document.body.innerHTML = `<input id="input" data-maska-number-fraction="2">`
    const input = <HTMLInputElement>document.getElementById('input')
    new MaskInput(input)

    await user.type(input, '1234.56')
    expect(input).toHaveValue('1,234.56')

    await user.clear(input)
  })

  test('russian number', async () => {
    document.body.innerHTML = `<input id="input" data-maska-number-fraction="2" data-maska-number-locale="ru">`
    const input = <HTMLInputElement>document.getElementById('input')
    new MaskInput(input)

    await user.type(input, '1234.56')
    expect(input).toHaveValue('1 234,56')
  })

  test('unsigned number', async () => {
    document.body.innerHTML = `<input id="input" data-maska-number-unsigned>`
    const input = <HTMLInputElement>document.getElementById('input')
    new MaskInput(input)

    await user.type(input, '-')
    expect(input).toHaveValue('')

    await user.type(input, '-1234')
    expect(input).toHaveValue('1,234')
  })
})

describe('Unicode tokens mask', () => {
  test('default number', async () => {
    document.body.innerHTML = `<input id="input" data-maska="A" data-maska-tokens="A:[\\p{L}]:multiple">`
    const input = <HTMLInputElement>document.getElementById('input')
    new MaskInput(input)

    await user.type(input, '1')
    expect(input).toHaveValue('')

    await user.type(input, 'z')
    expect(input).toHaveValue('z')

    await user.type(input, 'я')
    expect(input).toHaveValue('zя')

    await user.type(input, '1')
    expect(input).toHaveValue('zя')

    await user.clear(input)
  })
})
