/* eslint quote-props: ["error", "consistent"] */
export default {
  '#': { pattern: /[0-9]/ },
  'X': { pattern: /[0-9a-zA-Z]/ },
  'S': { pattern: /[a-zA-Z]/ },
  'A': { pattern: /[a-zA-Z]/, uppercase: true },
  'a': { pattern: /[a-zA-Z]/, lowercase: true },
  '!': { escape: true },
  '*': { repeat: true }
}
