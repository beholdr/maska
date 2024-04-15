import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '',
  build: {
    outDir: 'docs/dist',
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        demo: 'src/index.ts',
        demo_v2: 'src/v2/index.ts'
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name][extname]'
      }
    }
  },
  plugins: [vue()]
})
