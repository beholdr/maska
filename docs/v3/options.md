# Options

There are two main components that you can customize: the `Mask` class and the `MaskInput` class. You typically work directly with the latter, but since `MaskInput` options extend `Mask` options, you can configure both using a single object.

## `Mask` options

To set options for a `Mask` class you can pass an object when creating the class:

```js
new Mask({ mask: "#-#", eager: true, number: { locale: 'de' }})
```

Options passed in this way will be used as default values and can be overridden by `data-maska-` attributes of a given input element.

<!-- tabs:start -->
### **Description**

<table>
  <tr>
    <th>Option / data-attribute</th>
    <th>Default</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>mask</code><br><code>data-maska</code></td>
    <td><code>—</code></td>
    <td>Mask to apply (string, array of strings or function). If you pass an empty string or <code>null</code> it will disable a mask</td>
  </tr>
  <tr>
    <td><code>tokens</code><br><code>data-maska-tokens</code></td>
    <td><code>—</code></td>
    <td>Custom tokens object. See tokens page</td>
  </tr>
  <tr>
    <td><code>tokensReplace</code><br><code>data-maska-tokens-replace</code></td>
    <td><code>false</code></td>
    <td>If custom tokens should replace default tokens (if not set, they will merge)</td>
  </tr>
  <tr>
    <td><code>eager</code><br><code>data-maska-eager</code></td>
    <td><code>false</code></td>
    <td>Eager mode will show static characters before you type them, e.g. when you type <code>1</code>, eager mask <code>#-#</code> will show <code>1-</code> and non-eager will show <code>1</code></td>
  </tr>
  <tr>
    <td><code>reversed</code><br><code>data-maska-reversed</code></td>
    <td><code>false</code></td>
    <td>In reversed mode mask will grow backwards, e.g. for numbers</td>
  </tr>
  <tr>
    <td><code>number.locale</code><br><code>data-maska-number-locale</code></td>
    <td><code>en</code></td>
    <td>Locale for number mode. Determine the national format for the number</td>
  </tr>
  <tr>
    <td><code>number.fraction</code><br><code>data-maska-number-fraction</code></td>
    <td><code>0</code></td>
    <td>Fraction digits for the number (<code>0</code> allows only integer numbers)</td>
  </tr>
  <tr>
    <td><code>number.unsigned</code><br><code>data-maska-number-unsigned</code></td>
    <td><code>false</code></td>
    <td>Unsigned mode for the number: if you want to accept only positive numbers</td>
  </tr>
</table>

### **Types**
```typescript
interface MaskOptions {
  mask?: MaskType
  tokens?: MaskTokens
  tokensReplace?: boolean
  eager?: boolean
  reversed?: boolean
  number?: MaskNumber
}

type MaskType = string | string[] | ((input: string) => string) | null

interface MaskToken {
  pattern: RegExp
  multiple?: boolean
  optional?: boolean
  repeated?: boolean
  transform?: (char: string) => string
}

type MaskTokens = Record<string, MaskToken>

interface MaskNumber {
  locale?: string
  fraction?: number
  unsigned?: boolean
}
```
<!-- tabs:end -->


## `MaskInput` options

`MaskInput` options can only be set when creating a class, as they are too complex to use `data-maska-` attributes for them. Along with `MaskInput` options you can also pass any `Mask` class options (or set them using `data-maska-` attributes):

```js
new MaskInput("input", {
  onMaska: (detail) => console.log(detail.completed)
  mask: "#-#",
  reversed: true,
})
```

<!-- tabs:start -->
### **Description**

<table>
  <tr>
    <th>Option</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>onMaska</code></td>
    <td>Сallback (event analog), called after every mask processing</td>
  </tr>
  <tr>
    <td><code>preProcess</code></td>
    <td>Hook called before mask processing</td>
  </tr>
  <tr>
    <td><code>postProcess</code></td>
    <td>Hook called after mask processing</td>
  </tr>
</table>

### **Types**
```typescript
interface MaskInputOptions extends MaskOptions {
  onMaska?: (detail: MaskaDetail) => void
  preProcess?: (value: string) => string
  postProcess?: (value: string) => string
}

interface MaskaDetail {
  masked: string
  unmasked: string
  completed: boolean
}
```
<!-- tabs:end -->

!> Please note that `data-` attributes only accept strings, so if you need to set complex values such as functions (e.g. for hooks) you cannot use `data-maska-` attributes for that.

?> Examples on this page use vanilla version of Maska. The framework specific versions have the same options, but should be passed in a different way: for example, as a directive value.


## Number mask

Number mode makes it easy to format numbers according to the selected locale.

You can enable the number mode using `number` option or `data-maska-number-` attributes.
In that case you don't need to set `mask` or any other options. All number options are optional:

<!-- tabs:start -->
### **By data-attributes**

```html
<!-- Minimal example -->
<input data-maska-number>

<!-- Full example -->
<input
  data-maska-number-locale="ru"
  data-maska-number-fraction="2"
  data-maska-number-unsigned
>
```

### **By option**

```js
// minimal example
new MaskInput("input", {
  number: {}
})

// full example
new MaskInput("input", {
  number: {
    locale: "ru",
    fraction: 2,
    unsigned: true
  }
})
```
<!-- tabs:end -->

?> Under the hood Maska uses the [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) for number formatting. Therefore, the maximum number that can be formatted should be less than `9007199254740991`.

!> For some locales, such as `de` or `br`, which use a dot `.` as a thousand separator, you should manually format the initial value before passing it. For more information, please see [issue #225](https://github.com/beholdr/maska/issues/225).

## Dynamic masks

Pass `mask` as **array** or **function** to make it dynamic:

- With **array** a suitable mask will be chosen by length (smallest first)
- With **function** you can select mask with custom logic using value

```js
new MaskInput("input", {
  mask: (value: string) => value.startsWith('1') ? '#-#' : '##-##'
})
```
