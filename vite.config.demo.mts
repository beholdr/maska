import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '',
  build: {
    outDir: 'docs/dist',
    rollupOptions: {
      input: {
        demo: 'demo/index.ts'
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name][extname]'
      }
    }
  },
  plugins: [vue()]
})
