<script setup>
import { ref } from 'vue'
import { vMaska } from '../../src/vue'

const data = ref('1234')
</script>

<template>
  <input v-maska data-maska="##-#" v-model="data" data-maska-eager />
  <button @click="data = '5678'">Set</button>
</template>
