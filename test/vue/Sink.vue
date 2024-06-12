<script setup lang="ts">
import { reactive, ref } from 'vue'
import { vMaska } from '../../src/vue'
import type { MaskInputOptions, MaskaDetail } from '../../src'

const show = ref(true)
const valueMasked = ref('1234567')
const valueUnmasked = ref('1')

const onMaska = (e: CustomEvent<MaskaDetail>) => console.log(e.detail)

const options = reactive<MaskInputOptions>({
  mask: '+1 (###) ###-####',
  eager: true
})

defineExpose({ valueUnmasked })
</script>

<template>
  <p>
    <div>
      show: <input type="checkbox" v-model="show">
      eager: <input type="checkbox" v-model="options.eager">
    </div>

    <input v-model="options.mask">

    <div v-if="show">
      <input v-maska:valueUnmasked.unmasked="options" v-model="valueMasked" @maska="onMaska">
      <div>Masked: {{ valueMasked }}</div>
      <div>Unmasked: {{ valueUnmasked }}</div>
    </div>
  </p>

  <p>
    <input v-maska data-maska="##-##" data-maska-eager value="123">
  </p>

  <p>
    <input v-maska="'####'" value="12345">
  </p>

  <p>
    <input
      v-maska
      value="1234567.89"
      data-maska-number-locale="en"
      data-maska-number-fraction="2"
    >
  </p>
</template>
