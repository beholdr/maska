<script lang="ts">
  import { maska } from '../../src/svelte'

  let value = '123'
</script>

<main>
  <input use:maska data-maska="#-#" bind:value />
</main>
