<script setup lang="ts">
import { ref } from 'vue'
import { MaskInputOptions } from '../../src'
import { vMaska } from '../../src/vue'

const boundMasked = ref('')
const config = <MaskInputOptions>{
  mask: 'A A',
  tokens: {
    A: {
      pattern: /[A-Z]/,
      multiple: true,
      transform: (chr) => chr.toUpperCase()
    }
  }
}

defineExpose({ boundMasked })
</script>

<template>
  <input v-maska:boundMasked="config" />
  <div>{{ boundMasked }}</div>
</template>
