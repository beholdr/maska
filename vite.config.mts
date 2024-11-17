import { UserConfig } from 'vite'
import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

import vue from '@vitejs/plugin-vue'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { svelteTesting } from '@testing-library/svelte/vite'
import banner from 'vite-plugin-banner'
import dts from 'vite-plugin-dts'

import pkg from './package.json'

const generateConfig = (entry: string, file: string): UserConfig['build'] => ({
  lib: {
    entry: resolve(__dirname, entry),
    name: 'Maska',
    fileName: () => `${file}.js`,
    formats: ['umd']
  },
  outDir: 'dist/cdn',
  emptyOutDir: false
})

const config: Record<string, UserConfig['build']> = {
  default: {
    lib: {
      entry: {
        maska: resolve(__dirname, 'src/index.ts'),
        alpine: resolve(__dirname, 'src/alpine/index.ts'),
        svelte: resolve(__dirname, 'src/svelte/index.ts'),
        vue: resolve(__dirname, 'src/vue/index.ts')
      },
      formats: ['es', 'cjs']
    },
    emptyOutDir: true
  },
  alpine: generateConfig('src/alpine/cdn.ts', 'alpine'),
  maska: generateConfig('src/index.ts', 'maska'),
  vue: generateConfig('src/vue/cdn.ts', 'vue')
}

export default defineConfig(({ mode }) => ({
  build: config[mode] ?? config['default'],
  plugins: [
    vue(),
    svelte(),
    svelteTesting(),
    dts({ rollupTypes: true }),
    banner({
      content: `/*! ${pkg.name} v${pkg.version} by ${pkg.author} | Released under the ${pkg.license} license */`,
      outDir: 'dist/cdn'
    })
  ],
  test: {
    setupFiles: 'test/setup.ts',
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary']
    }
  }
}))
