import { expect, test } from 'vitest'
import { tick } from 'svelte'
import { render } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'

import BindValue from './svelte/BindValue.svelte'
import InitialValue from './svelte/InitialValue.svelte'
import Options from './svelte/Options.svelte'
import Simple from './svelte/Simple.svelte'

const user = userEvent.setup()

test('simple directive', async () => {
  const { container } = render(Simple as any)
  const input = container.querySelector('input')!

  await user.type(input, '123')
  expect(input).toHaveValue('1-2')
})

test('initial value', async () => {
  const { container } = render(InitialValue as any)
  const input = container.querySelector('input')!

  await tick()

  expect(input).toHaveValue('1-2')
})

test('bind value', async () => {
  const { container } = render(BindValue as any)
  const input = container.querySelector('input')!

  await tick()

  expect(input).toHaveValue('1-2')
})

test('options', async () => {
  const { container } = render(Options as any)
  const input = container.querySelector('input[type="text"]')!
  const checkbox = container.querySelector('input[type="checkbox"]')!

  await user.type(input, '1')
  expect(input).toHaveValue('1')

  await user.click(checkbox)
  expect(input).toHaveValue('1-')

  await user.type(input, '23')
  expect(input).toHaveValue('1-2')
})
