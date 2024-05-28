# Usage with Vue

## Installation

<!-- tabs:start -->
### **With NPM**

```sh
npm install @maskajs/vue@3
```

And then import it in your `.vue` component:

```js
import { vMaska } from '@maskajs/vue'
```

### **From CDN / UMD**

You can use Maska directly from CDN with simple script tag. Library API will be exposed on the global `Maska` object:

```html
<script src="https://cdn.jsdelivr.net/npm/@maskajs/vue@3/dist/maska.umd.js"></script>
<script>
  const { vMaska } = Maska

  Vue.createApp({ directives: { maska: vMaska }}).mount('#app')
</script>
```

### **From CDN / ES**

For modern browsers you can use ES modules build with (optional) [import maps](https://caniuse.com/import-maps):

```html
<script type="importmap">
  {
    "imports": {
      "maska": "https://cdn.jsdelivr.net/npm/@maskajs/vue@3/dist/maska.mjs"
    }
  }
</script>
<script type="module">
  import { vMaska } from 'maska'

  Vue.createApp({ directives: { maska: vMaska }}).mount('#app')
</script>
```

?> Notice that we are using `<script type="module">` in this case.
<!-- tabs:end -->


## Directive signature

Maska provides custom Vue directive for use with input:

```html
<input v-maska:argument.modifier="options">
```

- `argument` is a name of the bound variable (see example below)
- `modifier` modifier for bound variable value, could be one of:
  - `masked` (default): variable will get a masked value (as in v-model)
  - `unmasked`: variable will get an unmasked (raw) value
  - `completed`: variable will be boolean, showing that mask is completed
- `options` is object with default options

## Minimal example

Import `vMaska` directive and apply it to the input along with `data-maska` attribite:

<!-- tabs:start -->
### **Composition API**

```vue
<script setup>
import { vMaska } from "maska"
</script>

<template>
  <input v-maska data-maska="#-#">
</template>
```

### **Options API**

```vue
<script>
import { vMaska } from "maska"

export default {
  directives: { maska: vMaska }
}
</script>

<template>
  <input v-maska data-maska="#-#">
</template>
```
<!-- tabs:end -->


## Set mask options

To set default [options](/options) for the mask, pass options via **directive value**:

<!-- tabs:start -->
### **Composition API**

```vue
<script setup>
import { reactive } from "vue"
import { vMaska } from "maska"

// could be plain object too
const options = reactive({
  mask: "#-#",
  eager: true
})
</script>

<template>
  <input v-maska="options" data-maska-reversed>
</template>
```

### **Options API**

```vue
<script>
import { vMaska } from "maska"

export default {
  directives: { maska: vMaska },
  data: () => ({
    options: {
      mask: "#-#",
      eager: true
    }
  })
}
</script>

<template>
  <input v-maska="options" data-maska-reversed>
</template>
```
<!-- tabs:end -->

You can override default options with `data-maska-` attributes on the input. In the example above we set **eager** mode using options and **reversed** mode using `data-maska-reversed` attribute.

?> Sometimes using directive value is the only way to configure a mask, because you don't have access to the input element: for example, when using Maska with Vuetify.


## Bind value

To get masked value you can use standard `v-model` directive on the input. But if you want to access an unmasked (raw) value or get to know when mask is completed, you can use **directive argument** and (optionally) **directive modifier**:

<!-- tabs:start -->
### **Composition API**

```vue
<script setup>
import { ref } from "vue"
import { vMaska } from "maska"

const maskedvalue = ref('')
const unmaskedvalue = ref('')
</script>

<template>
  <input v-maska:unmaskedvalue.unmasked data-maska="#-#" v-model="maskedvalue">

  Masked value: {{ maskedvalue }}
  Unmasked value: {{ unmaskedvalue }}
</template>
```

### **Options API**

```vue
<script>
import { vMaska } from "maska"

export default {
  directives: { maska: vMaska },
  data: () => ({
    maskedvalue: "",
    unmaskedvalue: ""
  })
}
</script>

<template>
  <input v-maska:unmaskedvalue.unmasked data-maska="#-#" v-model="maskedvalue">

  Masked value: {{ maskedvalue }}
  Unmasked value: {{ unmaskedvalue }}
</template>
```
<!-- tabs:end -->

!> For correct work as directive argument, name of the bounded variable should be in **lower case**. So instead of `unmaskedValue` use `unmaskedvalue` or `unmasked_value`.


## Usage with Nuxt

To use Maska in Nuxt 3 you can make a simple plugin. Create file `maska.ts` in `plugins` folder:

```js
import { vMaska } from "maska"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("maska", vMaska)
})
```

Now you can use v-maska directive in your app:

```html
<input v-model="value" v-maska data-maska="#-#" />
```


## Global registration of directive

<!-- tabs:start -->
### **Vue 3**

```js
import { createApp } from "vue"
import { vMaska } from "maska"

createApp({}).directive("maska", vMaska)

// or in case of CDN load
Vue.createApp({}).directive("maska", Maska.vMaska)
```

### **Vue 2**

```js
import Vue from "vue"
import { vMaska } from "maska"

Vue.directive("maska", vMaska)

// or in case of CDN load
Vue.directive("maska", Maska.vMaska)
```
<!-- tabs:end -->
