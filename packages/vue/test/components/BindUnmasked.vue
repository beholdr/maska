<script setup lang="ts">
import { ref } from 'vue'
import { vMaska } from '../../src'

const bound = ref('')
</script>

<template>
  <input v-maska:bound.unmasked data-maska="#-#" />
  <div>{{ bound }}</div>
</template>
