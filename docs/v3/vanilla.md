# Usage without a framework

## Installation

<!-- tabs:start -->
### **With NPM**

```sh
npm install maska@3
```

And then import it in your code:

```js
import { Mask, MaskInput } from 'maska'

new MaskInput("[data-maska]") // for masked input
const mask = new Mask({ mask: "#-#" }) // for programmatic use
```

### **From CDN / UMD**

You can use Maska directly from CDN with simple script tag. Library API will be exposed on the global `Maska` object:

```html
<script src="https://cdn.jsdelivr.net/npm/maska@3/dist/maska.umd.js"></script>
<script>
  const { Mask, MaskInput } = Maska

  new MaskInput("[data-maska]") // for masked input
  const mask = new Mask({ mask: "#-#" }) // for programmatic use
</script>
```

### **From CDN / ES**

For modern browsers you can use ES modules build with (optional) [import maps](https://caniuse.com/import-maps):

```html
<script type="importmap">
  {
    "imports": {
      "maska": "https://cdn.jsdelivr.net/npm/maska@3/dist/maska.mjs"
    }
  }
</script>
<script type="module">
  import { Mask, MaskInput } from 'maska'

  new MaskInput("[data-maska]") // for masked input
  const mask = new Mask({ mask: "#-#" }) // for programmatic use
</script>
```

?> Notice that we are using `<script type="module">` in this case.
<!-- tabs:end -->


## Minimal example

Add to your input element `data-maska` attribute:

```html
<input data-maska="#-#">
```

Then import and initialize `MaskInput`, passing input element(s) or `querySelector` expression as first argument:

```js
import { MaskInput } from "maska"

// init with query selector
new MaskInput("[data-maska]")

// or with element
const input = document.querySelector('[data-maska]')
new MaskInput(input)
```


## Set mask options

Usually you set mask via `data-maska` attribute. But you can pass mask and other [options](/options) via second argument. It will be a default options that can be overriden by `data-maska-` attributes:

```js
new MaskInput(input, { mask: "#-#" })
```

## Programmatic use

You can use mask function programmatically by importing `Mask` class.
There are three methods available:

- `masked(value)` returns masked version of given value
- `unmasked(value)` returns unmasked version of given value
- `completed(value)` returns `true` if given value makes mask completed

```js
import { Mask } from "maska"

const mask = new Mask({ mask: "#-#" })

mask.masked("12") // = 1-2
mask.unmasked("12") // = 12
mask.completed("12") // = true
```


## Destroy mask

To destroy mask use `destroy()` method:

```js
const mask = new MaskInput(input)
mask.destroy()
```
