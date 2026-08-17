import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { webkitViteConfig } from '@aziontech/webkit/vite'

const src = (segment) => fileURLToPath(new URL(`./src/${segment}`, import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  // One alias per top-level area, so a cross-area import is visible as such in
  // the import line itself. The rule the tree encodes:
  //
  //   @site / @hub / @console  — the three products. NEVER import each other.
  //   @shared                  — what more than one of them needs. Imports none of them.
  //
  // Inside an area, imports stay relative; the moment a path leaves its area it
  // has to name the area it is going to, which is what keeps the boundary honest
  // (a `@console/...` line inside `src/site` is a bug you can grep for).
  resolve: {
    alias: {
      '@shared': src('shared'),
      '@site': src('site'),
      '@hub': src('hub'),
      '@console': src('console')
    }
  },
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
