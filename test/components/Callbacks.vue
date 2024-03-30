<script setup lang="ts">
import { MaskInputOptions, vMaska } from '../../src'

const emit = defineEmits(['mask1', 'mask2', 'mask3'])

const options1 = <MaskInputOptions>{
  onMaska: (detail) => emit('mask1', detail)
}
const options2 = <MaskInputOptions>{
  onMaska: [
    (detail) => emit('mask2', detail),
    (detail) => emit('mask3', detail),
  ]
}
</script>

<template>
  <input id="input1" v-maska="options1" data-maska="#-#" />
  <input id="input2" v-maska="options2" data-maska="#-#" />
</template>
