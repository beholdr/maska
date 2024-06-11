<script setup lang="ts">
import { ref } from 'vue'
import { vMaska } from '../../src/vue'

const boundUnmasked = ref('')

defineExpose({ boundUnmasked })
</script>

<template>
  <input v-maska:boundUnmasked.unmasked data-maska="#-#" />
  <div>{{ boundUnmasked }}</div>
</template>
