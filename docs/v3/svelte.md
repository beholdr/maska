# Usage with Svelte

## Installation

You can install Maska with following command:

```sh
npm install @maskajs/svelte@3
```

And then use it in your `.svelte` component:

```svelte
import { maska } from '@maskajs/svelte'

<input use:maska data-maska="#-#" />
```


## Action signature

Maska provides simple Svelte action for use with input:

```html
<input use:maska={options}>
```

- `options` is object with default options


## Minimal example

Apply `maska` action to the input along with `data-maska` attribite:

```svelte
<script>
import { maska } from '@maskajs/svelte'
</script>

<input use:maska data-maska="#-#">
```


## Set mask options

To set default [options](/options) for the mask, pass options via **directive value**:

```svelte
<script>
import { maska } from '@maskajs/svelte'

const options = {
  mask: "#-#",
  eager: true
}
</script>

<input use:maska={options} data-maska-reversed>
```

You can override default options with `data-maska-` attributes on the input. In the example above we set **eager** mode using options and **reversed** mode using `data-maska-reversed` attribute.
