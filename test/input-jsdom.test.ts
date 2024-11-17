// @vitest-environment jsdom

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
