<script lang="ts">
  import { maska } from '../../src'

  const options = {
    number: {}
  }
</script>

<main>
  <input use:maska={options} />
  <input use:maska data-maska-number />
  <input use:maska data-maska-number-locale="ru" />
</main>
