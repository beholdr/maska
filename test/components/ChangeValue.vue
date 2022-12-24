<script setup>
import { ref } from 'vue'
import { vMaska } from '../../src'

const data = ref('123')
</script>

<template>
  <input v-maska data-maska="#-#" v-model="data" />
  <button @click="data = '345'">Set</button>
</template>
