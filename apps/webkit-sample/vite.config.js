import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { webkitViteConfig } from '@aziontech/webkit/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // Pre-bundle PrimeVue stateful singletons as a single chunk (see @aziontech/webkit/vite).
  optimizeDeps: {
    include: [...webkitViteConfig.optimizeDeps.include]
  },
  server: {
    port: 5173,
    open: true
  }
})
