/// <reference types="vitest" />
import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import banner from 'vite-plugin-banner'
import dts from 'vite-plugin-dts'

import pkg from './package.json'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Maska',
      fileName: (format) =>
        format !== 'es' ? `${pkg.name}.${format}.js` : `${pkg.name}.js`
    }
  },
  plugins: [
    vue(),
    dts({
      outputDir: 'dist/types',
      exclude: 'src/demo'
    }),
    banner(
      `/*! ${pkg.name} v${pkg.version} | (c) ${pkg.author} | Released under the ${pkg.license} license */`
    )
  ],
  test: {
    setupFiles: 'test/setup.ts',
    environment: 'happy-dom',
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json-summary']
    }
  }
})
