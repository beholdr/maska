<script setup lang="ts">
import { ref } from 'vue'
import { vMaska } from '../../src/vue'

const mask = ref('["#--#", "#-#--#"]')
</script>

<template>
  <input v-maska :data-maska="mask" />
</template>
