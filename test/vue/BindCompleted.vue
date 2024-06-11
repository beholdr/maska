<script setup lang="ts">
import { ref } from 'vue'
import { vMaska } from '../../src/vue'

const boundCompleted = ref(false)

defineExpose({ boundCompleted })
</script>

<template>
  <input v-maska:boundCompleted.completed data-maska="#-#-#" />
  <div v-if="boundCompleted === true">Completed</div>
  <div v-else>Uncompleted</div>
</template>
