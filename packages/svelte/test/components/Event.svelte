<script lang="ts">
  import { type MaskaDetail, maska } from '../../src'

  const onMaska = (e: CustomEvent<MaskaDetail>) => console.log(e.detail.masked)
</script>

<main>
  <input use:maska data-maska="#-#" on:maska={onMaska} />
</main>
