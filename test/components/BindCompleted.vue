<script setup lang="ts">
import { ref } from 'vue'
import { vMaska } from '../../src'

const bound = ref(false)
</script>

<template>
  <input v-maska:bound.completed data-maska="#-#-#" />
  <div v-if="bound === true">Completed</div>
  <div v-else>Uncompleted</div>
</template>
