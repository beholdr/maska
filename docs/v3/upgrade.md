# Upgrade from v2

## New package for Vue

Maska v2 was a universal package for both vanilla JS and Vue version. Maska v3 is separated to several different packages:

- package `maska` is for vanilla version
- package `@maskajs/vue` is for Vue version

If you used Maska with Vue you need to delete `maska` package and install `@maskajs/vue` package.

?> If you used Maska without a framework, just upgrade package to `maska@3` version.

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
