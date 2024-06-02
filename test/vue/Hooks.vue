<script setup lang="ts">
import { MaskInputOptions } from '../../src'
import { vMaska } from '../../src/vue'

const config = <MaskInputOptions>{
  preProcess: (val) => val.toUpperCase()
}
</script>

<template>
  <input v-maska="config" data-maska="A A" data-maska-tokens="A:[A-Z]:multiple" />
</template>
