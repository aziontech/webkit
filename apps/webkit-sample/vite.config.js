import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { webkitViteConfig } from '@aziontech/webkit/vite'

// https://vite.dev/config/
export default defineConfig({
  // Tailwind v4 CSS-first pipeline: resolves `@import "tailwindcss"` in
  // `@aziontech/theme` (imported from src/main.js) and scans project sources
  // plus the theme's `@source` (webkit src) for utility usage.
  plugins: [vue(), tailwindcss()],
  // Pre-bundle PrimeVue stateful singletons as a single chunk (see @aziontech/webkit/vite).
  optimizeDeps: {
    include: [...webkitViteConfig.optimizeDeps.include]
  },
  server: {
    port: 5173,
    open: true
  }
})
