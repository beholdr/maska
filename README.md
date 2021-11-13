# Maska

Simple zero-dependency input mask for Vue.js and vanilla JS. [Demo and examples](https://beholdr.github.io/maska/).

- No dependencies
- Small size (~2 Kb gziped)
- Ability to define custom tokens
- Supports repeat symbols and dynamic masks
- Works on any input (custom or native)

## Install

    npm install maska

To load latest version from CDN you can use:

``` html
<script src="https://cdn.jsdelivr.net/npm/maska@latest/dist/maska.js"></script>
```

## Usage with Vue 2.x

If you load Vue.js via `<script>` then just add `v-maska` directive to your input:

``` html
<input v-maska="'###'">
```

You can add custom tokens by passing in object instead of string to directive:

``` html
<input v-maska="{ mask: 'Z*', tokens: { 'Z': { pattern: /[а-яА-Я]/ }}}">
```

With bundlers you can add global directive:

``` javascript
import Maska from 'maska'
Vue.use(Maska)
```

or import `maska` directive for local usage in component:

``` html
<template>
    <form>
        <input v-maska="'###'">
    </form>
</template>

<script>
import { maska } from 'maska'

export default {
    directives: { maska }
}
</script>
```

With Vue you could use computed property as mask value. In this case mask will be reactive.

## Usage with Vue 3.x

With Vue 3.x you need to explicitly add Maska `plugin` or `directive` to your app:

``` javascript
const app = Vue.createApp({...})
// use as plugin
app.use(Maska);
// or as directive
// app.directive('maska', Maska.maska);
app.mount('#app');
```

## Usage with vanilla JS

Just load script `maska.js` and init it, passing element(s) or `document.querySelector` expression:

``` javascript
var mask = Maska.create('.masked');
```

Mask could be set as `data-mask` attribute on element:

``` html
<input data-mask='##/##/####'>
```

or can be set by `mask` option on initialization:

``` javascript
var mask = Maska.create('.masked', {
    mask: '##/##/####'
});
```

You can pass custom tokens while initialization:

``` javascript
var mask = Maska.create('.masked', {
    tokens: { 'Z': { pattern: /[а-яА-Я]/ }}
});
```

You also can pass custom preprocessing transformation function for entire input:

``` javascript
var mask = Maska.create('.masked', {
    tokens: { 'Z': { pattern: /[а-яА-Я]/ }},
    preprocessor: value => {
        return value.toUpperCase();
    }
});
```

You can destroy mask like that:

``` javascript
var mask = Maska.create('.masked');
mask.destroy();
```

## Mask syntax

Default tokens:

``` javascript
{
    '#': { pattern: /[0-9]/ },
    'X': { pattern: /[0-9a-zA-Z]/ },
    'S': { pattern: /[a-zA-Z]/ },
    'A': { pattern: /[a-zA-Z]/, uppercase: true },
    'a': { pattern: /[a-zA-Z]/, lowercase: true },
    '!': { escape: true },
    '*': { repeat: true }
}
```

- Escape symbol escapes next token (mask `!#` will render `#`)
- Repeat symbol allows repeating current token until it’s valid (e.g. mask `#*` for all digits or `A* A*` for `CARDHOLDER NAME`)

You can add your own tokens by passing them in `maska` directive or `create` method at initialization (see above). **Important**: `pattern` field should be JS *regular expression* (`/[0-9]/`) or *string without delimiters* (`"[0-9]"`).

### Transform function for tokens

While specifying custom tokens you can also add a symbol-transformation behavior such as uppercase, lowercase, or even define a transform function:

``` javascript
{
    'T': { pattern: /[0-9]/, transform: (char) => String(Number(char) % 2) } // '1234567890' -> '1010101010'
}
```

## Use mask programmatically

You can use `mask` function directly by importing it (or using `Maska.mask` if you use script tag)

``` javascript
    import { mask } from 'maska'

    const maskedValue = mask(value, '###')
```

## Getting raw (unmasked) value

To get raw value read `data-mask-raw-value` property of input. You can subscribe to `@maska` event to know when this value updates. Please see [examples page](https://beholdr.github.io/maska/).

## Dynamic masks

To use several masks on single input, pass array instead of string as mask value.

You could use it with Vue directives:

``` html
<input v-maska="['+1 (###) ##-##-##', '+1 (###) ###-##-##']">

<input v-maska="{ mask: ['!#HHHHHH', '!#HHHHHH-HH'], tokens: { 'H': { pattern: /[0-9a-fA-F]/, uppercase: true }}}">
```

and with vanilla JS attribute, but make sure that mask value is proper `JSON`, so use double quotes inside array:

``` html
<input data-mask='["# cm", "#.# cm", "#.## cm"]'>
```

## Known issues

When used on input of type `number` could have inconsistent behavior in different browsers. Use attribute `inputmode` if you just need a numeric keyboard for given input.

## Source of Inspiration

- [vue-the-mask](https://vuejs-tips.github.io/vue-the-mask/)
- [jQuery Mask Plugin](http://igorescobar.github.io/jQuery-Mask-Plugin/)
