import { nextTick } from 'vue'
import { expect, test } from 'vitest'
import { mount } from '@vue/test-utils'

import BindInitial from './components/BindInitial.vue'
import BindMasked from './components/BindMasked.vue'
import BindUnmasked from './components/BindUnmasked.vue'
import Completed from './components/Completed.vue'
import Config from './components/Config.vue'
import DataAttr from './components/DataAttr.vue'
import Dynamic from './components/Dynamic.vue'
import Events from './components/Events.vue'
import Hooks from './components/Hooks.vue'
import Options from './components/Options.vue'
import Simple from './components/Simple.vue'

test('simple directive', async () => {
  const wrapper = mount(Simple)
  expect(wrapper.exists).toBeTruthy()

  const input = wrapper.get('input')
  await input.setValue('123')
  expect(input.element.value).toBe('1-2')
})

test('data-attr', async () => {
  const wrapper = mount(DataAttr)
  const input = wrapper.get('input')

  await input.setValue('1')
  expect(input.element.value).toBe('1-')

  await input.setValue('123')
  expect(input.element.value).toBe('1-2')
})

test('dynamic mask', async () => {
  const wrapper = mount(Dynamic)
  const input = wrapper.get('input')

  await input.setValue('12')
  expect(input.element.value).toBe('1--2')

  await input.setValue('123')
  expect(input.element.value).toBe('1-2--3')
})

test('initial value', async () => {
  const wrapper = mount(BindInitial)
  const input = wrapper.get('input')

  await nextTick()

  expect(input.element.value).toBe('1-2')
  expect(wrapper.get('div').element.textContent).toBe('1-2')
})

test('bind masked', async () => {
  const wrapper = mount(BindMasked)
  const input = wrapper.get('input')

  await input.setValue('123')
  expect(input.element.value).toBe('1-2')
  expect(wrapper.get('div').element.textContent).toBe('1-2')
})

test('bind unmasked', async () => {
  const wrapper = mount(BindUnmasked)
  const input = wrapper.get('input')

  await input.setValue('123')
  expect(input.element.value).toBe('1-2')
  expect(wrapper.get('div').element.textContent).toBe('12')
})

test('bind completed', async () => {
  const wrapper = mount(Completed)
  const input = wrapper.get('input')

  await input.setValue('12')
  await nextTick()

  expect(input.element.value).toBe('1-2')
  expect(wrapper.get('div').element.textContent).toBe('Uncompleted')

  await input.setValue('123')
  await nextTick()

  expect(input.element.value).toBe('1-2-3')
  expect(wrapper.get('div').element.textContent).toBe('Completed')
})

test('config and bind', async () => {
  const wrapper = mount(Config)
  const input = wrapper.get('input')

  await input.setValue('1')
  expect(input.element.value).toBe('')
  expect(wrapper.get('div').element.textContent).toBe('')

  await input.setValue('ab')
  expect(input.element.value).toBe('AB')
  expect(wrapper.get('div').element.textContent).toBe('AB')

  await input.setValue('ab cd ')
  expect(input.element.value).toBe('AB CD')
  expect(wrapper.get('div').element.textContent).toBe('AB CD')

  await input.setValue('ab cd1')
  expect(input.element.value).toBe('AB CD')
  expect(wrapper.get('div').element.textContent).toBe('AB CD')
})

test('hooks', async () => {
  const wrapper = mount(Hooks)
  const input = wrapper.get('input')

  await input.setValue('1')
  expect(input.element.value).toBe('')

  await input.setValue('ab')
  expect(input.element.value).toBe('AB')

  await input.setValue('ab cd ')
  expect(input.element.value).toBe('AB CD')

  await input.setValue('ab cd1')
  expect(input.element.value).toBe('AB CD')
})

test('events', async () => {
  const wrapper = mount(Events)
  const input = wrapper.get('input')

  await input.setValue('1')
  expect(wrapper.emitted()).toHaveProperty('mask')
  expect(wrapper.emitted('mask')).toHaveLength(1)
  expect(wrapper.emitted('mask')[0][0]).toHaveProperty('completed', false)

  await input.setValue('12')
  expect(wrapper.emitted('mask')).toHaveLength(2)
  expect(wrapper.emitted('mask')[1][0]).toHaveProperty('completed', true)
})

test('options api component', async () => {
  const wrapper = mount(Options)
  const input = wrapper.get('input')

  await input.setValue('123')
  expect(input.element.value).toBe('1-2')
  expect(wrapper.get('div').element.textContent).toBe('1-2')
})
