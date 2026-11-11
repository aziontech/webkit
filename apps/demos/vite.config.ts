import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue({ template: { transformAssetUrls: { includeAbsolute: false } } }), tailwindcss()],
  publicDir: fileURLToPath(new URL('../docs/public', import.meta.url)),
  resolve: {
    alias: [
      {
        find: /^tailwindcss$/,
        replacement: fileURLToPath(new URL('./node_modules/tailwindcss/index.css', import.meta.url))
      }
    ]
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'vee-validate']
  },
  build: {
    chunkSizeWarningLimit: 2000
  }
})
