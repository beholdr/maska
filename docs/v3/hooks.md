# Hooks & Events

## Hooks

Use hooks to transform masking value:

- `preProcess` hook is called before the mask processing
- `postProcess` hook is called after the mask processing, but before the input's value is set

For example, you can use it to check for a maximum length of a masked string:

```js
new MaskInput("input", {
  postProcess: (value: string) => value.slice(0, 5)
})
```

## Events

You can subscribe to `maska` event that fires after each mask processing.
Event will contain `detail` property with a given structure:

<!-- tabs:start -->
### **Description**

- `masked`: masked value
- `unmasked`: unmasked value
- `completed`: flag that current mask is completed

### **Types**
```typescript
interface MaskaDetail {
  masked: string
  unmasked: string
  completed: boolean
}
```
<!-- tabs:end -->

```js
const onMaska = (event: CustomEvent<MaskaDetail>) => {
  console.log({
    masked: event.detail.masked,
    unmasked: event.detail.unmasked,
    completed: event.detail.completed
  })
}
```

<!-- tabs:start -->
## **Vanilla JS**

```js
document.querySelector("input").addEventListener("maska", onMaska)
```

## **Vue**

```vue
<input v-maska data-maska="#-#" @maska="onMaska" />
```

## **Alpine**

```html
<input x-maska data-maska="#-#" x-on:maska="onMaska" />
```

## **Svelte**

```svelte
<input use:maska data-maska="#-#" on:maska={onMaska} />
```
<!-- tabs:end -->

Alternatively, you can pass a callback function directly using the `onMaska` option:

<!-- tabs:start -->
### **Vanilla JS**
```js
new MaskInput("input", {
  onMaska: (detail: MaskaDetail) => console.log(detail.completed)
})
```

### **Vue**
```vue
<script setup lang="ts">
const options = {
  onMaska: (detail: MaskaDetail) => console.log(detail.completed)
}
</script>

<template>
  <input v-maska="options">
</template>
```

### **Alpine**
```html
<div x-data="{ options: { onMaska: (detail) => console.log(detail.completed) }}">
  <input x-maska="options">
</div>
```

### **Svelte**
```svelte
<script lang="ts">
const options = {
  onMaska: (detail: MaskaDetail) => console.log(detail.completed)
}
</script>

<input use:maska={options}>
```
<!-- tabs:end -->
