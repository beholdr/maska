<script lang="ts">
import { vMaska } from '../../src/vue'

export default {
  data() {
    return {
      bound: ''
    }
  },
  directives: {
    maska: vMaska
  }
}
</script>

<template>
  <input v-maska:bound data-maska="#-#" />
  <div>{{ bound }}</div>
</template>
