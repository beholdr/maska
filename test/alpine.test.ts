import { describe, expect, test } from 'vitest'
import userEvent from '@testing-library/user-event'
import Alpine from 'alpinejs'
import { nextTick } from 'alpinejs/src/nextTick'

import { xMaska } from '../src/alpine'

Alpine.plugin(xMaska)
Alpine.start()

let input: HTMLInputElement
const user = userEvent.setup()

const prepareInput = async (markup: string) => {
  document.body.innerHTML = markup

  await nextTick()

  return <HTMLInputElement>document.querySelector('input')
}

describe('init', () => {
  test('with string', async () => {
    input = await prepareInput(`<input x-maska="'#-#'" value="123">`)

    expect(input).toHaveValue('1-2')
  })

  test('with data attr', async () => {
    input = await prepareInput(`<input x-maska data-maska="#-#" value="123">`)

    expect(input).toHaveValue('1-2')
  })

  test('with wrapper', async () => {
    input = await prepareInput(
      `<div x-maska><input data-maska="#-#" value="123"></div>`
    )

    expect(input).toHaveValue('1-2')
  })

  test('with expression', async () => {
    input = await prepareInput(
      `<input x-maska="{ mask: '#-#', eager: true }" value="1">`
    )

    expect(input).toHaveValue('1-')

    await user.type(input, '23')

    expect(input).toHaveValue('1-2')
  })

  test('bind x-model', async () => {
    input = await prepareInput(
      `<div x-data="{ val: '1', options: { mask: '#-#', eager: true }}">
        <input x-maska="options" x-model="val">
        <span x-text="val"></span>
        <input type="checkbox" x-model="options.eager" />
      </div>`
    )
    const span = <HTMLSpanElement>document.querySelector('span')
    const checkbox = <HTMLInputElement>(
      document.querySelector('input[type="checkbox"]')
    )

    expect(input).toHaveValue('1-')
    expect(span).toHaveTextContent('1-')

    await user.type(input, '23')

    expect(input).toHaveValue('1-2')
    expect(span).toHaveTextContent('1-2')

    await user.click(checkbox)
    await user.clear(input)
    await user.type(input, '1')

    expect(input).toHaveValue('1')
    expect(span).toHaveTextContent('1')

    await user.click(checkbox)

    expect(input).toHaveValue('1-')
    expect(span).toHaveTextContent('1-')
  })
})

describe('bindings', () => {
  test('bind masked', async () => {
    input = await prepareInput(
      `<div x-data="{ maskedvalue: '' }">
        <input x-maska:maskedvalue data-maska="#-#">
        <span x-text="maskedvalue"></span>
      </div>`
    )
    const span = <HTMLSpanElement>document.querySelector('span')

    await user.type(input, '123')

    expect(input).toHaveValue('1-2')
    expect(span).toHaveTextContent('1-2')
  })

  test('bind unmasked', async () => {
    input = await prepareInput(
      `<div x-data="{ unmaskedvalue: '' }">
        <input x-maska:unmaskedvalue.unmasked data-maska="#-#">
        <span x-text="unmaskedvalue"></span>
      </div>`
    )
    const span = <HTMLSpanElement>document.querySelector('span')

    await user.type(input, '123')

    expect(input).toHaveValue('1-2')
    expect(span).toHaveTextContent('12')
  })

  test('bind completed', async () => {
    input = await prepareInput(
      `<div x-data="{ iscompleted: false }">
        <input x-maska:iscompleted.completed data-maska="#-#">
        <span x-text="\`Completed: \${iscompleted ? 'yes' : 'no'}\`"></span>
      </div>`
    )
    const span = <HTMLSpanElement>document.querySelector('span')

    await user.type(input, '1')

    expect(input).toHaveValue('1')
    expect(span).toHaveTextContent('Completed: no')

    await user.type(input, '2')

    expect(input).toHaveValue('1-2')
    expect(span).toHaveTextContent('Completed: yes')
  })

  test('bind masked with onMask', async () => {
    input = await prepareInput(
      `<div x-data="{ maskedvalue: '', options: { onMaska: () => null }}">
        <input x-maska:maskedvalue="options" data-maska="#-#">
        <span x-text="maskedvalue"></span>
      </div>`
    )
    const span = <HTMLSpanElement>document.querySelector('span')

    await user.type(input, '123')

    expect(input).toHaveValue('1-2')
    expect(span).toHaveTextContent('1-2')
  })
})
