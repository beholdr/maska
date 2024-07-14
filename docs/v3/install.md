# Installation

## With bundler

```sh
npm install maska
```

<!-- tabs:start -->
### **Vanilla JS**

And then import it in your code:

```js
import { Mask, MaskInput } from "maska"

new MaskInput("[data-maska]") // for masked input
const mask = new Mask({ mask: "#-#" }) // for programmatic use
```

### **Alpine**

And then register it as custom plugin:

```js
import Alpine from "alpinejs"
import { xMaska } from "maska/alpine"

Alpine.plugin(xMaska)
```

```html
<input x-maska="'#-#'">
```

### **Svelte**

And then use it in your `.svelte` component:

```svelte
<script>
  import { maska } from "maska/svelte"
</script>

<input use:maska={'#-#'}>
```

### **Vue**

And then use it in your `.vue` component:

```js
<script setup>
  import { vMaska } from "maska/vue"
</script>

<template>
  <input v-maska="'#-#'">
</template>
```
<!-- tabs:end -->


## From CDN

<!-- tabs:start -->
### **Vanilla JS**

You can use Maska directly from CDN with a simple script tag as UMD-build.
Library API will be exposed on the global `Maska` object:

```html
<script src="https://cdn.jsdelivr.net/npm/maska@3/dist/cdn/maska.js"></script>
<script>
  const { Mask, MaskInput } = Maska

  new MaskInput("[data-maska]") // for masked input
  const mask = new Mask({ mask: "#-#" }) // for programmatic use
</script>
```

### **Alpine**

Include Maska from CDN, just make sure to include it **before** Alpine's core JS file:

```html
<!-- Maska Plugin -->
<script src="https://cdn.jsdelivr.net/npm/maska@3/dist/cdn/alpine.js"></script>
<!-- Alpine Core -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```
This will automatically register Maska plugin inside Alpine.

### **Vue**

You can use Maska directly from CDN and register directive:

```html
<script src="https://cdn.jsdelivr.net/npm/maska@3/dist/cdn/vue.js"></script>
<script>
  const { vMaska } = Maska

  Vue.createApp({ directives: { maska: vMaska }}).mount('#app')
</script>
```
<!-- tabs:end -->


## With importmap

For modern browsers you can use ES modules build with (optional) [import maps](https://caniuse.com/import-maps):

<!-- tabs:start -->
### **Vanilla JS**

```html
<script type="importmap">
  {
    "imports": {
      "maska": "https://cdn.jsdelivr.net/npm/maska@3/dist/maska.mjs"
    }
  }
</script>
<script type="module">
  import { Mask, MaskInput } from "maska"

  new MaskInput("[data-maska]") // for masked input
  const mask = new Mask({ mask: "#-#" }) // for programmatic use
</script>
```

### **Alpine**

```html
<script type="importmap">
  {
    "imports": {
      "maska/alpine": "https://cdn.jsdelivr.net/npm/maska@3/dist/alpine.mjs"
    }
  }
</script>
<script type="module">
  import Alpine from "alpinejs"
  import { xMaska } from "maska/alpine"

  Alpine.plugin(xMaska)
</script>
```

### **Vue**

```html
<script type="importmap">
  {
    "imports": {
      "maska/vue": "https://cdn.jsdelivr.net/npm/maska@3/dist/vue.mjs"
    }
  }
</script>
<script type="module">
  import { vMaska } from "maska/vue"

  Vue.createApp({ directives: { maska: vMaska }}).mount('#app')
</script>
```
<!-- tabs:end -->

?> Notice that we are using `<script type="module">` in this case.
