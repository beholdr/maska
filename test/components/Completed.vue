<script setup lang="ts">
import { reactive } from 'vue'
import { MaskaDetail, vMaska } from '../../src'

const binded = reactive<Partial<MaskaDetail>>({})
</script>

<template>
  <input v-maska="binded" data-maska="#-#-#" />
  <div v-if="binded.completed">Completed</div>
  <div v-else>Uncompleted</div>
</template>
