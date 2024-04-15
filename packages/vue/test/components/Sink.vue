<script setup>
import { reactive, ref } from 'vue'
import { vMaska } from '../../src'

const mask = ref('+1 (###) ###-####')
const show = ref(true)
const eager = ref(true)
const valueMasked = ref('1234567')
const valueunmasked = ref('1')

const onMaska = (e) => console.log(e.detail)

const options = reactive({
  mask,
  eager
})

const options2 = {
  preProcess: val => val.replace(/[$,]/g, ''),
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
</script>

<template>
  <div class="row">
    <div>
      show: <input type="checkbox" v-model="show">
      eager: <input type="checkbox" v-model="eager">
    </div>
    <div><input v-model="mask"></div>

    <div v-if="show">
      <input v-maska:valueunmasked.unmasked="options" v-model="valueMasked" @maska="onMaska">
      <div>Masked: {{ valueMasked }}</div>
      <div>Unmasked: {{ valueunmasked }}</div>
    </div>
  </div>

  <div class="row"><input type="email" v-maska data-maska="##-##" data-maska-eager value="12"></div>

  <div class="row"><input v-maska data-maska="####" value="1234"></div>

  <div><input v-maska="options2" value="1234567" data-maska="0.99" data-maska-tokens="0:\d:multiple|9:\d:optional"></div>
</template>

<style scoped>
.row {
  margin-bottom: 1em;
}
</style>
