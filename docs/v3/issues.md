# Known issues

## Unsupported input types

Please use Maska only for inputs of the following types: `text`, `search`, `URL`, `tel` and `password`.
If you need a numeric keyboard, use `type="text"` with attribute `inputmode="numeric"`:

```html
<input type="text" inputmode="numeric">
```

## Vuetify and other UI frameworks

Some frameworks with custom components may not pass `data-` attributes to native input elements. In such cases, you will need to set the mask and other options using directive value:

```vue
<script setup>
  const options = { mask: '#-#' }
</script>

<input v-maska="options">
```
