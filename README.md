# Maska

Simple zero-dependency input mask for Vue.js and vanilla JS.

- No dependencies
- Small size (~2 Kb gziped)
- Ability to define custom tokens
- Supports repeat symbols
- Works on any input (custom or native)

## Usage with Vue.js

If you load Vue.js via `<script>` then just add `v-maska` directive to your input:

``` html
<input v-maska="'###'">
```

You can add custom tokens by passing in object instead of string to directive:

``` html
<input v-maska="{ mask: 'Z*', tokens: { 'Z': { pattern: /[а-яА-Я]/ }}}">
```

If you use SFC then import `directive` component from library:

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

## Usage with vanilla JS

Just load script `maska.js` and init it, passing element(s) or selector expression:

``` javascript
var mask = Maska.create('.masked');
```

You can pass custom tokens while initialization:

``` javascript
var mask = Maska.create('.masked', {
    tokens: { 'Z': { pattern: /[а-яА-Я]/ }}
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

## Source of Inspiration

- [vue-the-mask](https://vuejs-tips.github.io/vue-the-mask/)
- [jQuery Mask Plugin](http://igorescobar.github.io/jQuery-Mask-Plugin/)
