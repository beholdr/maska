import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

import { svelte } from '@sveltejs/vite-plugin-svelte'
import { svelteTesting } from '@testing-library/svelte/vite'
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
    svelte(),
    svelteTesting(),
    dts({ rollupTypes: true, bundledPackages: ["maska"] }),
    banner(
      `/*! ${pkg.name} v${pkg.version} */`
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
