# Upgrade from v2

## New package structure

Maska v3 has different entries for framework-specific exports.
Import of vue directive in v2:

```js
import { vMaska } from "maska"
```

Now you should import vue directive from `maska/vue`:

```js
import { vMaska } from "maska/vue"
```

!> Filenames have also been changed. Please see the [Installation](install) for more information.

## New directive format

### Bind value

To bind a masked value with Maska v2 you used the **directive value** with a bound variable as an object:

```vue
<script setup>
const boundObject = reactive({
  masked: '',
  unmasked: '',
  completed: false
})
</script>

<template>
<input v-maska="boundObject">
</template>
```

With v3, you need to use a **directive argument** and (optionally) a **directive modifier**:

```vue
<script setup>
const boundobject = ref('')
</script>

<template>
<input v-maska:boundobject.unmasked>
</template>
```

### Mask options

To pass mask options with v2 you have used the **directive argument**:

```vue
<script setup>
const options = reactive({
  mask: "#-#",
  eager: true
})
</script>

<template>
<input v-maska:[options]>
</template>
```

With v3, you need to use for this a **directive value**:

```vue
<script setup>
const options = reactive({
  mask: "#-#",
  eager: true
})
</script>

<template>
  <input v-maska="options">
</template>
```

## Changed eager mode

With v2, when using eager mode, entered characters appeared after the static mask characters:

```js
const mask = new Mask({ mask: '1##', eager: true })
mask.masked('1') // -> 11
mask.masked('12') // -> 112
mask.masked('2') // -> 12
```

Now they are taken into account as these static symbols:

```js
const mask = new Mask({ mask: '1##', eager: true })
mask.masked('1') // -> 1
mask.masked('12') // -> 12
mask.masked('2') // -> 12
```
