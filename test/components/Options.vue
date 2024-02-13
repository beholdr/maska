<script lang="ts">
import { vMaska } from '../../src'

export default {
  data() {
    return {
      bound: {
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
  <input v-maska="bound" data-maska="#-#" />
  <div>{{ bound.masked }}</div>
</template>
