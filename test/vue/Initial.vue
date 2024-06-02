<script setup lang="ts">
import { ref } from 'vue'
import { vMaska } from '../../src/vue'

const initial = ref('345')
</script>

<template>
  <input v-maska data-maska="#-#" id="input1" value="123" />
  <input v-maska data-maska="#-#" id="input2" v-model="initial" />
</template>
