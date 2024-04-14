import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

import vue from '@vitejs/plugin-vue'
import banner from 'vite-plugin-banner'
import dts from 'vite-plugin-dts'

import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Maska',
      fileName: 'maska'
    }
  },
  plugins: [
    vue(),
    dts({ rollupTypes: true }),
    banner(
      `/*! ${pkg.name} v${pkg.version} | (c) ${pkg.author} | Released under the ${pkg.license} license */`
    )
  ],
  test: {
    setupFiles: 'test/setup.ts',
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary']
    }
  }
})
