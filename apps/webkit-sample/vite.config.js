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
  // Pre-bundle PrimeVue stateful singletons as a single chunk (see @aziontech/webkit/vite),
  // and with them every dependency reachable ONLY through a lazy route.
  //
  // Monaco (the Functions editor at `/functions/new` and `/functions/:id`) and Vue Flow
  // (the Diagrams page) sit behind `() => import(...)`, so the dep optimizer cannot see
  // them at startup. It discovers them the first time one of those routes opens, re-runs,
  // and bumps the `?v=` hash on every prebundled chunk — leaving the page holding the
  // app's Vue from the OLD generation while the freshly optimized library imports the NEW
  // one. Two Vue runtimes in one page, and `.vite/deps` is served `immutable`, so an
  // ordinary reload keeps the stale half alive.
  //
  // What that broke, concretely: `@guolao/vue-monaco-editor` gives its container div a
  // STRING ref (`ref: "containerRef"`). A vnode created by the second Vue copy has no
  // rendering instance to own that ref, so Vue logs `Missing ref owner context` and skips
  // it — `containerRef` stays null, the library never reaches `createEditor()`, and the
  // editor's boot slot (our Skeleton) renders forever on a page that looks like it is
  // still fetching. Naming them here prebundles them at server start, so no first visit
  // can split Vue in two.
  optimizeDeps: {
    include: [
      ...webkitViteConfig.optimizeDeps.include,
      '@guolao/vue-monaco-editor',
      '@monaco-editor/loader',
      'monaco-editor',
      '@vue-flow/core'
    ]
  },
  server: {
    port: 5173,
    open: true
  }
})
