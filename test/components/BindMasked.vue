<script setup lang="ts">
import { reactive } from 'vue'
import { MaskaDetail, vMaska } from '../../src'

const bound = reactive<Partial<MaskaDetail>>({})
</script>

<template>
  <input v-maska="bound" data-maska="#-#" />
  <div>{{ bound.masked }}</div>
</template>
