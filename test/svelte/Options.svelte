<script lang="ts">
  import { maska } from '../../src/svelte'

  const options = {
    mask: '#-#',
    eager: false
  }
</script>

<main>
  <input type="checkbox" bind:checked={options.eager} /> Eager<br>
  <input type="text" use:maska={options} />
</main>
