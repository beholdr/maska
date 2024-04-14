import { createApp } from 'vue'

import { vMaska } from '..'
import App from './App.vue'

createApp(App)
  .directive('maska', vMaska)
  .mount('#demo-app')
