<script setup lang="ts">
import { ref } from 'vue'
import { vMaska } from '../../src/vue'

const value = ref('123')
</script>

<template>
  <input v-maska data-maska="#-#" data-maska-eager v-model="value" />
  <div>{{ value }}</div>
</template>
