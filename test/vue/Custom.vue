<script setup lang="ts">
import { ref } from 'vue'

import { vMaska } from '../../src/vue'
import CustomInput from './CustomInput.vue'

const value = ref('')
</script>

<template>
  <CustomInput v-maska data-maska="#-#" data-maska-eager v-model="value" />
  <div>{{ value }}</div>
</template>
