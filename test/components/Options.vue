<script lang="ts">
import { vMaska } from '../../src'

export default {
  data() {
    return {
      binded: {
        masked: ''
      }
    }
  },
  directives: {
    maska: vMaska
  }
}
</script>

<template>
  <input v-maska="binded" data-maska="#-#" />
  <div>{{ binded.masked }}</div>
</template>
