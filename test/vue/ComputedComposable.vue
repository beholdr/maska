<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { useMaska } from '../../src/vue/composable'

const maskTemplate = ref('#-#')

function setMaskTemplate(value: string) {
  maskTemplate.value = value
}

const inputEl = useTemplateRef('inputEl')

const maska = computed(() => ({
  mask: maskTemplate.value
}))

const { unmasked } = useMaska(inputEl, maska)

defineExpose({ unmasked, setMaskTemplate })

</script>

<template>
  <input id="maska" ref="inputEl" />
  <input v-model="maskTemplate" />
</template>
