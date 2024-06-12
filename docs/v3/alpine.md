# Usage with Alpine.js

Maska provides custom Alpine.js directive for use with input:

```html
<input x-maska:argument.modifier="value">
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

Apply `xMaska` directive to the input:

```html
<input x-maska="'#-#'">
```

?> Please note that the mask value is enclosed in additional quotation marks: `"'#-#'"`.

## Set mask options

To set a default [options](/options) for the mask, pass options via **directive value**:

```html
<div x-data="{ options: { mask: '#-#', eager: true }}">
  <input x-maska="options" data-maska-reversed>
</div>
```

Or you can pass an options object directly:

```html
<input x-maska="{ mask: '#-#', eager: true }" data-maska-reversed>
```

You can override default options with `data-maska-` attributes on the input. In the example above we set **eager** mode using options and **reversed** mode using `data-maska-reversed` attribute.


## Bind value

To get masked value you can use standard `x-model` directive on the input. But if you want to access an unmasked (raw) value or get to know when mask is completed, you can use **directive argument** and (optionally) **directive modifier**:

```html
<div x-data="{ maskedvalue: '', unmaskedvalue: '' }">
  <input x-maska:unmaskedvalue.unmasked="'#-#'" x-model="maskedvalue">

  Masked value: <span x-text="maskedvalue"></span>
  Unmasked value: <span x-text="unmaskedvalue"></span>
</div>
```

!> For correct work as directive argument, name of the bounded variable should be in **lower case**. So instead of `unmaskedValue` use `unmaskedvalue` or `unmasked_value`.
