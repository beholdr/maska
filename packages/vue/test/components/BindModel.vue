<script setup lang="ts">
import { ref } from 'vue'
import { vMaska } from '../../src'

const value = ref('123')
const bound = ref('')
</script>

<template>
  <input v-maska:bound.unmasked data-maska="#-#" data-maska-eager v-model="value" />
  <div id="value1">{{ value }}</div>
  <div id="value2">{{ bound }}</div>
</template>
