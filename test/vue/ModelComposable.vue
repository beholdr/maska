<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { useMaska } from '../../src/vue/composable'

const model = ref('123')

const inputEl = useTemplateRef('inputEl')

const { unmasked } = useMaska(inputEl, '#-#', model)

defineExpose({ unmasked, model })

</script>

<template>
  <input id="maska" ref="inputEl" />
</template>
