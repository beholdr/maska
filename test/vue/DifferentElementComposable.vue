<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { useMaska } from '../../src/vue/composable'

const inputEl1 = useTemplateRef('inputEl1')
const inputEl2 = useTemplateRef('inputEl2')

const inputIsSwitched = ref(false)

const currentInput = computed(() => {
  return inputIsSwitched.value ? inputEl2.value : inputEl1.value
})

function switchCurrentInput() {
  inputIsSwitched.value = !inputIsSwitched.value
}

const { unmasked, instance } = useMaska(currentInput, '#-#')

defineExpose({ switchCurrentInput, unmasked, instance })

</script>

<template>
  <input id="inputEl1" ref="inputEl1" />
  <input id="inputEl2" ref="inputEl2" />
  <button @click="switchCurrentInput" class="mb-1">toggle current input</button>
</template>
