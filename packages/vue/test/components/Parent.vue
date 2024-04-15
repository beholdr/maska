<script setup lang="ts">
import { vMaska } from '../../src'
</script>

<template>
  <div v-maska>
    <input data-maska="#-#" data-maska-eager />
  </div>

  <div v-maska>
    <!-- no input here -->
  </div>
</template>
