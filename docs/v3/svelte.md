# Usage with Svelte

Maska provides simple Svelte action for use with input:

```html
<input use:maska={value}>
```

- `value` could be one of:
  - `string` for the mask value (should be enclosed in additional quotation marks: `{'#-#'}`)
  - `object` with a default options


## Minimal example

Apply `maska` action to the input:

```svelte
<script>
  import { maska } from "maska/svelte"
</script>

<input use:maska={'#-#'}>
```

?> Please note that the mask value is enclosed in additional quotation marks: `"'#-#'"`.

## Set mask options

To set default [options](/options) for the mask, pass options via **directive value**:

```svelte
<script lang="ts">
  import { maska } from "maska/svelte"
  import type { MaskInputOptions } from "maska"

  const options: MaskInputOptions = {
    mask: "#-#",
    eager: true
  }
</script>

<input use:maska={options} data-maska-reversed>
```

You can override default options with `data-maska-` attributes on the input. In the example above we set **eager** mode using options and **reversed** mode using `data-maska-reversed` attribute.
