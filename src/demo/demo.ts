import { createApp } from 'vue'

import { vMaska } from '..'
import Demo from './Demo.vue'

createApp(Demo)
  .directive('maska', vMaska)
  .mount('#demo-app')
