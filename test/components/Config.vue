<script setup lang="ts">
import { reactive } from 'vue'
import { vMaska, MaskaDetail, MaskInputOptions } from '../../src'

const binded = reactive<Partial<MaskaDetail>>({})
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
  <input v-maska:[config]="binded" />
  <div>{{ binded.masked }}</div>
</template>
