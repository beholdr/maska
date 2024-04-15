import { createApp } from 'vue'

import App from '../App.vue'

const examples = [
  {
    label: 'Simple mask',
    code: `<input v-maska data-maska="#-#" value="12">`
  },
  {
    label: 'Phone mask',
    code: `<input v-maska data-maska="+1 ### ###-##-##">`
  },
  {
    label: 'HEX-color',
    code: `<input\n  v-maska\n  data-maska="!#HHHHHH"\n  data-maska-tokens="H:[0-9a-fA-F]"\n>`
  },
  {
    label: 'IP address with optional digits',
    code: `<input\n  v-maska\n  data-maska="#00.#00.#00.#00"\n  data-maska-tokens="0:[0-9]:optional"\n>`
  },
  {
    label: 'Dynamic mask: CPF/CNPJ',
    code: `<input\n  v-maska\n  data-maska="[\n    '###.###.###-##',\n    '##.###.###/####-##'\n  ]"\n>`
  },
  {
    label: 'Cardholder name: via hook',
    code: `const options = {\n  preProcess: val => val.toUpperCase()\n}\n\n<input\n  v-maska:[options]\n  data-maska="A A"\n  data-maska-tokens="A:[A-Z]:multiple"\n>`
  },
  {
    label: 'Cardholder name: via token transform',
    code: `const options = {\n  tokens: {\n    A: {\n      pattern: /[A-Z]/,\n      multiple: true,\n      transform: chr => chr.toUpperCase()\n    }\n  }\n}\n\n<input v-maska:[options] data-maska="A A">`
  },
  {
    label: 'Year: with current year as a limit',
    code: `const options = {\n  postProcess: val => {\n    const max = "" + new Date().getFullYear()\n    return val > max ? max : val\n  }\n}\n\n<input v-maska:[options] data-maska="####">`
  },
  {
    label: 'Money format: simple',
    code: `<input\n  v-maska\n  data-maska="0.99"\n  data-maska-tokens="0:\\d:multiple|9:\\d:optional"\n>`
  },
  {
    label: 'Money format: full via hooks',
    code: `const options = {\n  preProcess: val => val.replace(/[$,]/g, ''),\n  postProcess: val => {\n    if (!val) return ''\n\n    const sub = 3 - (val.includes('.') ? val.length - val.indexOf('.') : 0)\n\n    return Intl.NumberFormat('en-US', {\n      style: 'currency',\n      currency: 'USD'\n    }).format(val)\n      .slice(0, sub ? -sub : undefined)\n  }\n}\n\n<input\n  v-maska:[options]\n  data-maska="0.99"\n  data-maska-tokens="0:\\d:multiple|9:\\d:optional"\n>`
  },
  {
    label: 'Reversed number format with thousand separators',
    code: `<input\n  v-maska\n  data-maska="9 99#.##"\n  data-maska-tokens="9:[0-9]:repeated"\n  data-maska-reversed\n>`
  }
]

createApp(App, { examples })
  .directive('maska', Maska.vMaska)
  .mount('#demo-app')
