import { nextTick } from 'vue'
import { expect, test } from 'vitest'
import { mount } from '@vue/test-utils'

import BindCompleted from './vue/BindCompleted.vue'
import BindMasked from './vue/BindMasked.vue'
import BindModel from './vue/BindModel.vue'
import BindUnmasked from './vue/BindUnmasked.vue'
import Callbacks from './vue/Callbacks.vue'
import ChangeValue from './vue/ChangeValue.vue'
import Config from './vue/Config.vue'
import Custom from './vue/Custom.vue'
import DataAttr from './vue/DataAttr.vue'
import Dynamic from './vue/Dynamic.vue'
import Events from './vue/Events.vue'
import Hooks from './vue/Hooks.vue'
import Initial from './vue/Initial.vue'
import Model from './vue/Model.vue'
import Multiple from './vue/Multiple.vue'
import Options from './vue/Options.vue'
import Parent from './vue/Parent.vue'
import Simple from './vue/Simple.vue'

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

test('parent element', async () => {
  const wrapper = mount(Parent)
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
  const wrapper = mount(Initial)
  const input1 = wrapper.get<HTMLInputElement>('#input1')
  const input2 = wrapper.get<HTMLInputElement>('#input2')

  await nextTick()

  expect(input1.element.value).toBe('1-2')
  expect(input2.element.value).toBe('3-4')
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
  const wrapper = mount(BindCompleted)
  const input = wrapper.get('input')

  await input.setValue('12')

  expect(input.element.value).toBe('1-2')
  expect(wrapper.get('div').element.textContent).toBe('Uncompleted')

  await input.setValue('123')

  expect(input.element.value).toBe('1-2-3')
  expect(wrapper.get('div').element.textContent).toBe('Completed')
})

test('bind v-model', async () => {
  const wrapper = mount(BindModel)
  const input = wrapper.get('input')

  await new Promise((r) => setTimeout(r))

  expect(input.element.value).toBe('1-2')
  expect(wrapper.get('#value1').element.textContent).toBe('1-2')
  expect(wrapper.get('#value2').element.textContent).toBe('12')

  await input.setValue('345')

  expect(input.element.value).toBe('3-4')
  expect(wrapper.get('#value1').element.textContent).toBe('3-4')
  expect(wrapper.get('#value2').element.textContent).toBe('34')
})

test('v-model', async () => {
  const wrapper = mount(Model)
  const input = wrapper.get('input')

  await new Promise((r) => setTimeout(r))

  expect(input.element.value).toBe('1-2')
  expect(wrapper.get('div').element.textContent).toBe('1-2')

  await input.setValue('1')

  expect(input.element.value).toBe('1-')
  expect(wrapper.get('div').element.textContent).toBe('1-')

  await input.setValue('123')

  expect(input.element.value).toBe('1-2')
  expect(wrapper.get('div').element.textContent).toBe('1-2')
})

test('custom component', async () => {
  const wrapper = mount(Custom)
  const input = wrapper.get('input')

  await input.setValue('1')

  expect(input.element.value).toBe('1-')
  expect(wrapper.get('div').element.textContent).toBe('1-')

  await input.setValue('123')

  expect(input.element.value).toBe('1-2')
  expect(wrapper.get('div').element.textContent).toBe('1-2')
})

// TODO: find a way to test keyboard input, like backspace after input '567'
test('change value', async () => {
  const wrapper = mount(ChangeValue)
  const input = wrapper.get('input')

  await nextTick()

  expect(input.element.value).toBe('12-3')

  await wrapper.get('button').trigger('click')

  expect(input.element.value).toBe('56-7')
})

test('multiple inputs', async () => {
  const wrapper = mount(Multiple)
  const input = wrapper.get<HTMLInputElement>('#input1')
  const checkbox = wrapper.get<HTMLInputElement>('#checkbox')

  await new Promise((r) => setTimeout(r))

  expect(wrapper.get('#value1').element.textContent).toBe('1-2')
  expect(wrapper.get('#value2').element.textContent).toBe('3-2')

  expect(wrapper.emitted()).toHaveProperty('mask1')
  expect(wrapper.emitted()).toHaveProperty('mask2')
  expect(wrapper.emitted('mask1')).toHaveLength(1)
  expect(wrapper.emitted('mask2')).toHaveLength(1)

  await input.setValue('1')

  expect(input.element.value).toBe('1')
  expect(wrapper.get('#value1').element.textContent).toBe('1')
  expect(wrapper.emitted()).toHaveProperty('mask1')
  expect(wrapper.emitted('mask1')).toHaveLength(2)
  expect(wrapper.emitted('mask2')).toHaveLength(1)

  await checkbox.setValue()

  expect(checkbox.element).toBeChecked()
  expect(input.element.value).toBe('1-')
  expect(wrapper.emitted('mask1')).toHaveLength(3)
  expect(wrapper.emitted('mask2')).toHaveLength(1)
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

test('callbacks', async () => {
  const wrapper = mount(Callbacks)
  const input1 = wrapper.get('#input1')
  const input2 = wrapper.get('#input2')

  await input1.setValue('1')

  expect(wrapper.emitted()).toHaveProperty('mask1')
  expect(wrapper.emitted('mask1')).toHaveLength(1)
  expect(wrapper.emitted('mask1')[0][0]).toHaveProperty('completed', false)

  await input1.setValue('12')

  expect(wrapper.emitted('mask1')).toHaveLength(2)
  expect(wrapper.emitted('mask1')[1][0]).toHaveProperty('completed', true)

  await input2.setValue('3')

  expect(wrapper.emitted()).toHaveProperty('mask2')
  expect(wrapper.emitted()).toHaveProperty('mask3')
  expect(wrapper.emitted('mask2')).toHaveLength(1)
  expect(wrapper.emitted('mask3')).toHaveLength(1)
  expect(wrapper.emitted('mask2')[0][0]).toHaveProperty('completed', false)
  expect(wrapper.emitted('mask3')[0][0]).toHaveProperty('completed', false)

  await input2.setValue('34')

  expect(wrapper.emitted('mask2')).toHaveLength(2)
  expect(wrapper.emitted('mask3')).toHaveLength(2)
  expect(wrapper.emitted('mask2')[1][0]).toHaveProperty('completed', true)
  expect(wrapper.emitted('mask3')[1][0]).toHaveProperty('completed', true)

  expect(wrapper.get('.bound1').element.textContent).toBe('1-2')
  expect(wrapper.get('.bound2').element.textContent).toBe('3-4')
})

test('options api component', async () => {
  const wrapper = mount(Options)
  const input = wrapper.get('input')

  await input.setValue('123')

  expect(input.element.value).toBe('1-2')
  expect(wrapper.get('div').element.textContent).toBe('1-2')
})
