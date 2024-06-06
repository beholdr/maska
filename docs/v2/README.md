# Maska

> ❤️ [Please support](https://boosty.to/beholdr) Maska development!

# Live Demo

<iframe height="570" style="width: 100%;" scrolling="no" title="Maska v2 demo" src="https://codepen.io/beholdr/embed/QWREEMY?default-tab=result&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/beholdr/pen/QWREEMY">
  Maska v2 demo</a> by Alexander (<a href="https://codepen.io/beholdr">@beholdr</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

# Install

<!-- tabs:start -->
## **Via npm**

```
npm i maska
```

## **CDN / Global build**

You can use **Maska** directly from CDN with simple script tag.
Library API will be exposed on the global `Maska` object:

``` html
<script src="https://cdn.jsdelivr.net/npm/maska@2/dist/maska.umd.js"></script>
<script>
  const { Mask, MaskInput, vMaska } = Maska

  new MaskInput("[data-maska]") // for masked input
  const mask = new Mask({ mask: "#-#" }) // for programmatic use
  Vue.createApp({ directives: { maska: vMaska }}).mount('#app') // Vue directive
</script>
```

## **CDN / ES modules**

For modern browsers you can use ES modules build with (optional) [import maps](https://caniuse.com/import-maps):

``` html
<script type="importmap">
  {
    "imports": {
      "maska": "https://cdn.jsdelivr.net/npm/maska@2/dist/maska.js"
    }
  }
</script>
<script type="module">
  import { Mask, MaskInput, vMaska } from 'maska'

  new MaskInput("[data-maska]") // for masked input
  const mask = new Mask({ mask: "#-#" }) // for programmatic use
  Vue.createApp({ directives: { maska: vMaska }}).mount('#app') // Vue directive
</script>
```

Notice that we are using `<script type="module">` in this case.
<!-- tabs:end -->

# Usage

**Maska** library consists of three main components:

- `Mask` class to mask string values
- `MaskInput` class to apply `Mask` processing to `<input>`
- `vMaska` directive to simplify using of library within Vue components

<!-- tabs:start -->
## **Vanilla JS**

Start with simple input element and `data-maska` attribute:

``` html
<input data-maska="#-#">
```

Then import and init `MaskInput`, passing input element(s) or `querySelector` expression as first argument:

``` ts
import { MaskInput } from "maska"
new MaskInput("[data-maska]")
```

Usually you set mask via `data-maska` attribute. But you can pass mask and other [options](#options) via second argument (it will be a default options that can be overriden by `data-maska-` attributes):

``` ts
new MaskInput("input", { mask: "#-#" })
```

To destroy mask use `destroy()` method:

``` ts
const mask = new MaskInput(...)
mask.destroy()
```

## **Vue**

Import `vMaska` directive and apply it to the input along with `data-maska` attribite:

<!-- tabs:start -->
### **Composition API**

``` html
<script setup>
import { vMaska } from "maska"
</script>

<template>
  <input v-maska data-maska="#-#">
</template>
```

### **Options API**

``` html
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

### Bind value

To get masked value you can use standard `v-model` directive.
But if you want to access an unmasked (raw) value, you can pass a variable as `v-maska` directive value.
This variable should be a reactive object that will contains three fields after mask processing:

- `masked`: string with masked result
- `unmasked`: string with unmasked result
- `completed`: boolean flag indicating that mask is completed

<!-- tabs:start -->
### **Composition API**

``` html
<script setup>
import { reactive, ref } from "vue"
import { vMaska } from "maska"

const maskedValue = ref('')
const boundObject = reactive({})
</script>

<template>
  <input v-maska="boundObject" v-model="maskedValue">

  Masked value: {{ maskedValue }} or {{ boundObject.masked }}
  Unmasked value: {{ boundObject.unmasked }}
  <span v-if="boundObject.completed">✅ Mask completed</span>
</template>
```

### **Options API**

``` html
<script>
import { vMaska } from "maska"

export default {
  directives: { maska: vMaska },
  data: () => ({
    maskedValue: "",
    boundObject: {
      masked: "",
      unmasked: "",
      completed: false
    }
  })
}
</script>

<template>
  <input v-maska="boundObject" v-model="maskedValue">

  Masked value: {{ maskedValue }} or {{ boundObject.masked }}
  Unmasked value: {{ boundObject.unmasked }}
  <span v-if="boundObject.completed">✅ Mask completed</span>
</template>
```
<!-- tabs:end -->

### Set mask options

To set default options for the mask you could use directive *argument* (part after `v-maska:`). It can be plain or reactive object and should be wrapped in `[]`:

<!-- tabs:start -->
### **Composition API**

``` html
<script setup>
import { reactive } from "vue"
import { vMaska } from "maska"

const options = reactive({
  mask: "#-#",
  eager: true
})
</script>

<template>
  <input v-maska:[options]>
</template>
```

### **Options API**

``` html
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
  <input v-maska:[options]>
</template>
```
<!-- tabs:end -->

?> Please see [issue#149](https://github.com/beholdr/maska/issues/149): options object should be assigned in the current file.

You can set options and bind to an object at the same time:

``` html
<input v-maska:[options]="boundObject">
```

#### Global registration of directive

<!-- tabs:start -->
### **Vue 3**

``` ts
import { createApp } from "vue"
import { vMaska } from "maska"

createApp({}).directive("maska", vMaska)

// or in case of CDN load
Vue.createApp({}).directive("maska", Maska.vMaska)
```

### **Vue 2**

``` ts
import Vue from "vue"
import { vMaska } from "maska"

Vue.directive("maska", vMaska)

// or in case of CDN load
Vue.directive("maska", Maska.vMaska)
```
<!-- tabs:end -->

## **Nuxt 3**

To use Maska in Nuxt 3 you can make a simple plugin. Create file `maska.ts` in `plugins` folder:

``` ts
import { vMaska } from "maska"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("maska", vMaska)
})
```

Now you can use `v-maska` directive in your app:

``` html
<input v-model="value" v-maska data-maska="#-#" />
```
<!-- tabs:end -->

# Options

## `Mask` options

Every option of `Mask` class can be set via `data-maska-` attributes or by passing on init.
Options passed on init will be used as defaults and could be overriden by `data-maska-` attributes.

<!-- tabs:start -->
### **Description**

- `mask / data-maska` — mask to apply (**string**, **array of strings** or **function**). If you pass empty string or `null` it will disable a mask
- `tokens / data-maska-tokens` — custom tokens object
- `tokensReplace / data-maska-tokens-replace` — if custom tokens should replace default tokens (if not set, they will merge)
- `eager / data-maska-eager` — eager mode will show static characters before you type them, e.g. when you type `1`, eager mask `#-#` will show `1-` and non-eager will show `1`
- `reversed / data-maska-reversed` — in reversed mode mask will grow backwards, e.g. for numbers

### **Types**
``` ts
interface MaskOptions {
  mask?: MaskType
  tokens?: MaskTokens
  tokensReplace?: boolean
  eager?: boolean
  reversed?: boolean
}
```
<!-- tabs:end -->

``` html
<input data-maska="A-A" data-maska-tokens="A:[A-Z]" data-maska-eager>
```

## `MaskInput` options

`MaskInput` options could be set only by passing second argument on init.
Along with `MaskInput` options you could pass any `Mask` options as well (or set them via `data-maska-` attributes).

<!-- tabs:start -->
### **Description**

- `onMaska` — [callback](#events) on every mask processing
- `preProcess` — [hook](#hooks) before mask processing
- `postProcess` — [hook](#hooks) after mask processing

### **Types**
``` ts
interface MaskInputOptions extends MaskOptions {
  onMaska?: (detail: MaskaDetail) => void
  preProcess?: (value: string) => string
  postProcess?: (value: string) => string
}
```
<!-- tabs:end -->

``` ts
new MaskInput("input", {
  mask: "#-#",
  reversed: true,
  onMaska: (detail: MaskaDetail) => console.log(detail.completed)
})
```

# Tokens

There are 3 tokens defined by default:

``` ts
{
  '#': { pattern: /[0-9]/ },       // digits
  '@': { pattern: /[a-zA-Z]/ },    // letters
  '*': { pattern: /[a-zA-Z0-9]/ }, // letters & digits
}
```

?> Use `!` before token to escape symbol. For example `!#` will render `#` instead of a digit.

## Custom tokens

Add custom tokens via `data-maska-tokens` attribute or by `tokens` option:

<!-- tabs:start -->
### **By data-attr**

When using `data-maska-tokens`, there are two possible formats:

- **Full form** should be a valid JSON-string (but can use both single and double quotes) with pattern in string format without delimiters
- **Simple form** should be a string in format: `T:P:M|T:P:M` where:
  - `T` is token
  - `P` is pattern in string form
  - `M` is optional modifier (see below)
  - `|` is separator for multiple tokens

``` html
<input data-maska="Z-Z" data-maska-tokens="{ 'Z': { 'pattern': '[A-Z]' }}">
<input data-maska="Z-Z" data-maska-tokens="Z:[A-Z]">
<input data-maska="Z-z" data-maska-tokens="Z:[A-Z]|z:[a-z]:multiple">
```

?> You can’t set `transform` function for token via `data-maska-tokens`.
If you need this, use `tokens` option instead.

### **By option**

When using `tokens` option, pattern should be a valid regular expression object:

``` ts
new MaskInput("[data-maska]", {
  mask: "A-A",
  tokens: {
    A: { pattern: /[A-Z]/, transform: (chr: string) => chr.toUpperCase() }
  }
})
```
<!-- tabs:end -->

## Token modifiers

Every token can have a modifier, for example:

``` ts
{
  0: { pattern: /[0-9]/, optional: true },
  9: { pattern: /[0-9]/, repeated: true },
}
```

- `optional` for optional token
- `multiple` for token that can match multiple characters till the next token starts
- `repeated` for tokens that should be repeated. This token will match only one character, but the token itself (or group of such tokens) can be repeated any number of times

| Modifier   | Example usage    | Mask                               | Tokens
| ---        | ---              | ---                                | ---
| `optional` | IP address       | `#00.#00.#00.#00`                  | `0:[0-9]:optional`
| `multiple` | CARDHOLDER NAME  | `A A`                              | `A:[A-Z]:multiple`
| `repeated` | Money (1 234,56) | `9 99#,##` <small>reversed</small> | `9:[0-9]:repeated`

## Transform tokens

For custom tokens you can define `transform` function, applied to a character before masking.
For example, transforming letters to uppercase on input:

``` ts
{
  A: { pattern: /[A-Z]/, transform: (chr: string) => chr.toUpperCase() }
}
```

?> You can also use [hooks](#hooks) for transforming whole value before/after masking.

# Dynamic masks

Pass `mask` as **array** or **function** to make it dynamic:

- With **array** a suitable mask will be chosen by length (smallest first)
- With **function** you can select mask with custom logic using value

``` ts
new MaskInput("input", {
  mask: (value: string) => value.startsWith('1') ? '#-#' : '##-##'
})
```

# Hooks

Use hooks for transforming whole value:

- `preProcess` hook called before mask processing
- `postProcess` hook called after mask processing, but before setting input's value

For example, you can use it to check for a maximum length of masked string:

``` ts
new MaskInput("input", {
  postProcess: (value: string) => value.slice(0, 5)
})
```

# Events

There are two events you can subscribe to get the masking result:

- `maska` event
- `input` event

They are essentially the same, but the `input` event could be fired by any input logic, and the `maska` event is library specific.

<!-- tabs:start -->
## **Vanilla JS**

``` ts
document.querySelector("input").addEventListener("maska", onMaska)
```

## **Vue**

``` html
<input v-maska data-maska="#-#" @maska="onMaska" />
```
<!-- tabs:end -->

Both events contains `detail` property with given structure:

<!-- tabs:start -->
### **Description**

- `masked`: masked value
- `unmasked`: unmasked value
- `completed`: flag that current mask is completed

### **Types**
``` ts
interface MaskaDetail {
  masked: string
  unmasked: string
  completed: boolean
}
```
<!-- tabs:end -->

``` ts
const onMaska = (event: CustomEvent<MaskaDetail>) => {
  console.log({
    masked: event.detail.masked,
    unmasked: event.detail.unmasked,
    completed: event.detail.completed
  })
}
```

Alternatively, you can pass callback function directly with `MaskInput` option `onMaska`:

<!-- tabs:start -->
### **Vanilla JS**
``` ts
new MaskInput("input", {
  onMaska: (detail: MaskaDetail) => console.log(detail.completed)
})
```

### **Vue**
``` html
<script setup>
const options = {
  onMaska: (detail: MaskaDetail) => console.log(detail.completed)
}
</script>

<template>
  <input v-maska:[options]>
</template>
```
<!-- tabs:end -->

# Programmatic use

You can use mask function programmatically by importing `Mask` class.
There are three methods available:

- `masked(value)` returns masked version of given value
- `unmasked(value)` returns unmasked version of given value
- `completed(value)` returns `true` if given value makes mask complete

``` ts
import { Mask } from "maska"

const mask = new Mask({ mask: "#-#" })

mask.masked("12") // = 1-2
mask.unmasked("12") // = 12
mask.completed("12") // = true
```

# Known issues

When used on input of type `number`, could have inconsistent behavior in different browsers. Use attribute `inputmode="numeric"` with `type="text"` if you need a numeric keyboard.
