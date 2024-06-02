# Usage without a framework

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
