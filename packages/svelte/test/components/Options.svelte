<script lang="ts">
  import { maska } from '../../src'

  const options = {
    mask: '#-#',
    eager: false
  }
</script>

<main>
  <input type="checkbox" bind:checked={options.eager} />
  <input type="text" use:maska={options} />
</main>
