<script setup lang="ts">
import { ref } from 'vue'
import { MaskInputOptions } from '../../src'
import { vMaska } from '../../src/vue'

const bound = ref('')
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
</script>

<template>
  <input v-maska:bound="config" />
  <div>{{ bound }}</div>
</template>
