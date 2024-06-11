<script setup lang="ts">
import { ref } from 'vue';
import { MaskInputOptions } from '../../src'
import { vMaska } from '../../src/vue'

const emit = defineEmits(['mask1', 'mask2', 'mask3'])

const bound1 = ref('')
const bound2 = ref('')

const options1 = <MaskInputOptions>{
  onMaska: (detail) => emit('mask1', detail)
}
const options2 = <MaskInputOptions>{
  onMaska: [
    (detail) => emit('mask2', detail),
    (detail) => emit('mask3', detail),
  ]
}

defineExpose({ bound1, bound2 })
</script>

<template>
  <input id="input1" v-maska:bound1="options1" data-maska="#-#" />
  <input id="input2" v-maska:bound2="options2" data-maska="#-#" />
  <div class="bound1">{{ bound1 }}</div>
  <div class="bound2">{{ bound2 }}</div>
</template>
