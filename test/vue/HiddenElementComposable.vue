<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { useMaska } from '../../src/vue/composable'

const inputEl = useTemplateRef('inputEl')

const { unmasked, instance } = useMaska(inputEl, '#-#')

const inputIsVisible = ref(false)

function setIsVisible(value: boolean) {
  inputIsVisible.value = value
}

defineExpose({ setIsVisible, unmasked, instance })

</script>

<template>
  <input v-if="inputIsVisible" ref="inputEl" data-maska="#-#" />
  <button @click="inputIsVisible = !inputIsVisible">toggle visible</button>
</template>
