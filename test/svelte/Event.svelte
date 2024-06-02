<script lang="ts">
  import type { MaskaDetail } from '../../src'
  import { maska } from '../../src/svelte'

  const onMaska = (e: CustomEvent<MaskaDetail>) => console.log(e.detail.masked)
</script>

<main>
  <input use:maska data-maska="#-#" on:maska={onMaska} />
</main>
