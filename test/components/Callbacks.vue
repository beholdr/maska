<script setup lang="ts">
import { reactive } from 'vue';
import { MaskaDetail, vMaska } from '../../src'

const emit = defineEmits(['mask1', 'mask2', 'mask3'])

const bound1 = reactive({})
const bound2 = reactive({})

const options1 = {
  onMaska: (detail: MaskaDetail) => emit('mask1', detail)
}
const options2 = {
  onMaska: [
    (detail: MaskaDetail) => emit('mask2', detail),
    (detail: MaskaDetail) => emit('mask3', detail),
  ]
}
</script>

<template>
  <input id="input1" v-maska:[options1]="bound1" data-maska="#-#" />
  <input id="input2" v-maska:[options2]="bound2" data-maska="#-#" />
</template>
