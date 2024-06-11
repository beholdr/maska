<script setup lang="ts">
import { ref } from 'vue'
import { vMaska } from '../../src/vue'

const valueMasked = ref('123')
const boundUnmasked = ref('')

defineExpose({ boundUnmasked })
</script>

<template>
  <input v-maska:boundUnmasked.unmasked data-maska="#-#" data-maska-eager v-model="valueMasked" />
  <div id="value1">{{ valueMasked }}</div>
  <div id="value2">{{ boundUnmasked }}</div>
</template>
