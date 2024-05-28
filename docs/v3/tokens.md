# Tokens

## Default tokens

There are 3 tokens defined by default:

```js
{
  '#': { pattern: /[0-9]/ },       // digits
  '@': { pattern: /[a-zA-Z]/ },    // letters
  '*': { pattern: /[a-zA-Z0-9]/ }, // letters & digits
}
```

?> Use `!` before token to escape symbol. For example `!#` will render `#` instead of a digit.


## Custom tokens

Add custom tokens via `data-maska-tokens` attribute or by `tokens` option:

<!-- tabs:start -->
### **By data-attributes**

When using `data-maska-tokens`, there are two possible formats:

- **JSON form** should be a valid JSON-string (but can use both single and double quotes) with pattern in a string format without delimiters
- **Simple form** should be a string in format: `T:P:M|...` where:
  - `T` is token
  - `P` is pattern in string form
  - `M` is optional modifier (see below)
  - `|` is separator for multiple tokens

```html
<input data-maska="Z-Z" data-maska-tokens="{ 'Z': { 'pattern': '[A-Z]' }}">
<input data-maska="Z-Z" data-maska-tokens="Z:[A-Z]">
<input data-maska="Z-z" data-maska-tokens="Z:[A-Z]|z:[a-z]:multiple">
```

?> You can’t set the `transform` function for a token using `data-maska-tokens` attribute.
If you need to do this, you should use the `tokens` option instead.

### **By option**

```js
new MaskInput("[data-maska]", {
  mask: "A-A",
  tokens: {
    A: { pattern: /[A-Z]/, transform: (chr: string) => chr.toUpperCase() }
  }
})
```

!> When using `tokens` option, pattern should be a valid regular expression object.
<!-- tabs:end -->


## Token modifiers

Every token can have a modifier, for example:

```js
{
  0: { pattern: /[0-9]/, optional: true },
  9: { pattern: /[0-9]/, repeated: true },
}
```

- `optional` for optional token
- `multiple` for token that can match multiple characters till the next token starts
- `repeated` for token that should be repeated. This token will match only one character, but the token itself (or group of such tokens) can be repeated any number of times

| Modifier   | Example usage    | Mask                               | Tokens
| ---        | ---              | ---                                | ---
| `optional` | IP address       | `#00.#00.#00.#00`                  | `0:[0-9]:optional`
| `multiple` | CARDHOLDER NAME  | `A A`                              | `A:[A-Z]:multiple`
| `repeated` | Money (1 234,56) | `9 99#,##` <small>reversed</small> | `9:[0-9]:repeated`


## Transform tokens

For custom tokens you can define `transform` function, applied to a character before masking.
For example, transforming letters to uppercase on input:

```js
{
  A: { pattern: /[A-Z]/, transform: (chr: string) => chr.toUpperCase() }
}
```

?> You can also use [hooks](/hooks) for transforming whole value before/after masking.
