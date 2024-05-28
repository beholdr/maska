# Usage with Alpine.js

## Installation

<!-- tabs:start -->
### **With NPM**

```sh
npm install @maskajs/alpine@3
```

And then register it:

```js
import Alpine from 'alpinejs'
import { xMaska } from '@maskajs/alpine'

Alpine.plugin(xMaska)
...
```

### **From CDN**

You can use Maska directly from CDN using simple script tag with `data-init` attribute, just make sure to include it BEFORE Alpine's core JS file:

```html
<!-- Maska Plugin -->
<script data-init src="https://cdn.jsdelivr.net/npm/@maskajs/alpine@3/dist/maska.umd.js"></script>
<!-- Alpine Core -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

This will automatically register Maska plugin inside Alpine.
<!-- tabs:end -->


## Directive signature

Maska provides custom Alpine.js directive for use with input:

```html
<input x-maska:argument.modifier="options">
```

- `argument` is a name of the bound variable (see example below)
- `modifier` modifier for bound variable value, could be one of:
  - `masked` (default): variable will get a masked value (as in v-model)
  - `unmasked`: variable will get an unmasked (raw) value
  - `completed`: variable will be boolean, showing that mask is completed
- `options` is object with default options


## Minimal example

Apply `xMaska` directive to the input along with `data-maska` attribite:

```html
<input x-maska data-maska="#-#">
```


## Set mask options

To set default [options](/options) for the mask, pass options via **directive value**:

```html
<div x-data="{ options: { mask: '#-#', eager: true }}">
  <input x-maska="options" data-maska-reversed>
</div>
```

You can override default options with `data-maska-` attributes on the input. In the example above we set **eager** mode using options and **reversed** mode using `data-maska-reversed` attribute.


## Bind value

To get masked value you can use standard `x-model` directive on the input. But if you want to access an unmasked (raw) value or get to know when mask is completed, you can use **directive argument** and (optionally) **directive modifier**:

```html
<div x-data="{ maskedvalue: '', unmaskedvalue: '' }">
  <input x-maska:unmaskedvalue.unmasked data-maska="#-#" x-model="maskedvalue">

  Masked value: <span x-text="maskedvalue"></span>
  Unmasked value: <span x-text="unmaskedvalue"></span>
</div>
```

!> For correct work as directive argument, name of the bounded variable should be in **lower case**. So instead of `unmaskedValue` use `unmaskedvalue` or `unmasked_value`.
