<script setup lang="ts">
import { MaskaDetail, vMaska } from '../../src'

const emit = defineEmits(['mask'])

const onMaska = (e: CustomEvent<MaskaDetail>) => {
  emit('mask', e.detail)
}
</script>

<template>
  <input v-maska data-maska="#-#" @maska="onMaska" />
</template>
