<script setup lang="ts">
import { reactive } from 'vue'
import { MaskaDetail, vMaska } from '../../src'

const binded = reactive<Partial<MaskaDetail>>({})
</script>

<template>
  <input v-maska="binded" data-maska="#-#" />
  <div>{{ binded.unmasked }}</div>
</template>
