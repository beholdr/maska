<script setup lang="ts">
import { reactive } from 'vue'
import { vMaska, MaskaDetail, MaskInputOptions } from '../../src'

const bound = reactive<Partial<MaskaDetail>>({})
const config = reactive<MaskInputOptions>({
  mask: 'A A',
  tokens: {
    A: {
      pattern: /[A-Z]/,
      multiple: true,
      transform: (chr) => chr.toUpperCase()
    }
  }
})
</script>

<template>
  <input v-maska:[config]="bound" />
  <div>{{ bound.masked }}</div>
</template>
