<script setup lang="ts">
import { reactive, ref } from 'vue'
import { vMaska } from '../../src/vue'

const emit = defineEmits(['mask1', 'mask2'])

const isEager = ref(false)

const value1 = ref('123')
const value2 = ref('321')

const options = reactive({
  eager: isEager,
  onMaska: () => null
})

const onMaska1 = () => {
  emit('mask1')
}

const onMaska2 = () => {
  emit('mask2')
}
</script>

<template>
  <input id="checkbox" type="checkbox" v-model="isEager" />
  <input
    id="input1"
    v-maska="options"
    data-maska="#-#"
    v-model="value1"
    @maska="onMaska1"
  />
  <input
    id="input2"
    v-maska
    data-maska="#-#"
    v-model="value2"
    @maska="onMaska2"
  />
  <div id="value1">{{ value1 }}</div>
  <div id="value2">{{ value2 }}</div>
</template>
