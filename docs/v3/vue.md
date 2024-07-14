# Usage with Vue

Maska provides custom Vue directive for use with input:

```html
<input v-maska:argument.modifier="value">
```

- `argument` is a name of the bound variable (see example below)
- `modifier` modifier for bound variable value, could be one of:
  - `masked` (default): variable will get a masked value (as in v-model)
  - `unmasked`: variable will get an unmasked (raw) value
  - `completed`: variable will be boolean, showing that mask is completed
- `value` could be one of:
  - `string` for the mask value (should be enclosed in additional quotation marks: `"'#-#'"`)
  - `object` with a default options

## Minimal example

Import `vMaska` directive and apply it to the input:

<!-- tabs:start -->
### **Composition API**

```vue
<script setup>
  import { vMaska } from "maska/vue"
</script>

<template>
  <input v-maska="'#-#'">
</template>
```

### **Options API**

```vue
<script>
  import { vMaska } from "maska/vue"

  export default {
    directives: { maska: vMaska }
  }
</script>

<template>
  <input v-maska="'#-#'">
</template>
```
<!-- tabs:end -->

?> Please note that the mask value is enclosed in additional quotation marks: `"'#-#'"`.

## Set mask options

To set default [options](/options) for the mask, pass options via **directive value**:

<!-- tabs:start -->
### **Composition API**

```vue
<script setup lang="ts">
  import { reactive } from "vue"
  import { vMaska } from "maska/vue"
  import type { MaskInputOptions } from "maska"

  // could be plain object too
  const options = reactive<MaskInputOptions>({
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
  import { vMaska } from "maska/vue"

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
  import { vMaska } from "maska/vue"

  const maskedValue = ref('')
  const unmaskedValue = ref('')

  defineExpose({ unmaskedValue }) // make sure you expose the bound variable
</script>

<template>
  <input v-maska:unmaskedValue.unmasked="'#-#'" v-model="maskedValue">

  Masked value: {{ maskedValue }}
  Unmasked value: {{ unmaskedValue }}
</template>
```

!> Make sure you expose the bound variable using `defineExpose` macro.

### **Options API**

```vue
<script>
  import { vMaska } from "maska/vue"

  export default {
    directives: { maska: vMaska },
    data: () => ({
      maskedValue: "",
      unmaskedValue: ""
    })
  }
</script>

<template>
  <input v-maska:unmaskedValue.unmasked="'#-#'" v-model="maskedValue">

  Masked value: {{ maskedValue }}
  Unmasked value: {{ unmaskedValue }}
</template>
```
<!-- tabs:end -->

?> If you want to access both unmasked and completed values, you can use [`@maska` event](hooks?id=events).


## Usage with Nuxt

To use Maska in Nuxt 3 you can make a simple plugin. Create file `maska.ts` in `plugins` folder:

```js
import { vMaska } from "maska/vue"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("maska", vMaska)
})
```

Now you can use v-maska directive in your app:

```html
<input v-maska="'#-#'" />
```


## Global registration of directive

<!-- tabs:start -->
### **Vue 3**

```js
import { createApp } from "vue"
import { vMaska } from "maska/vue"

createApp({}).directive("maska", vMaska)

// or in case of CDN load
Vue.createApp({}).directive("maska", Maska.vMaska)
```

### **Vue 2**

```js
import Vue from "vue"
import { vMaska } from "maska/vue"

Vue.directive("maska", vMaska)

// or in case of CDN load
Vue.directive("maska", Maska.vMaska)
```
<!-- tabs:end -->
