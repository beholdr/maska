<script setup lang="ts">
import { ref } from 'vue'
import { vMaska } from '../../src/vue'

const boundMasked = ref('')

defineExpose({ boundMasked })
</script>

<template>
  <input v-maska:boundMasked.masked data-maska="#-#" />
  <div>{{ boundMasked }}</div>
</template>
