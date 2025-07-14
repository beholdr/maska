<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useMaska } from '../../src/vue/composable'

const inputEl = useTemplateRef('inputEl')

const { unmasked } = useMaska(inputEl, '#-#')

defineExpose({ unmasked })

</script>

<template>
  <input ref="inputEl" />
  <p>{{ unmasked }}</p>
</template>
