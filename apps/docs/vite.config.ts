import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig, type UserConfig } from 'vite'
import type { ViteSSGOptions } from 'vite-ssg'

import {
  bundlerRuntimePlugin,
  chunkGraphPlugin,
  moveBuildManifests
} from './plugins/chunk-graph.ts'
import { buildIndex } from './plugins/content.ts'
import { docsPlugin } from './plugins/docs-plugin.ts'
import { fontPreloadPlugin } from './plugins/font-preload.ts'
import { FOUNDATION_SLUGS } from './src/lib/foundations.ts'

function staticRoutes(): string[] {
  const { components, blocks } = buildIndex()
  return [
    '/',
    '/components',
    '/blocks',
    '/foundations',
    '/assets',
    '/assets/icons',
    ...FOUNDATION_SLUGS.map((slug) => `/foundations/${slug}`),
    ...components.map((item) => `/components/${item.name}`),
    ...blocks.map((block) => `/blocks/${block.id}`),
    ...blocks.flatMap((block) =>
      block.states.map((state) => `/frame/block/${block.id}/${state.slug}`)
    ),
    '/frame/example',
    '/404'
  ]
}

const ssgOptions: Partial<ViteSSGOptions> = {
  entry: 'src/main.ts',
  dirStyle: 'nested',
  formatting: 'none',
  concurrency: 2,
  beastiesOptions: false,
  onPageRendered: (_route, html, appCtx) => {
    const ssr = (appCtx.app as { ssrContext?: { teleports?: Record<string, string> } }).ssrContext
    const body = ssr?.teleports?.body
    const page = html.replace(/<link\b[^>]*rel="modulepreload"[^>]*>/g, '')
    return body ? page.replace(/<body([^>]*)>\s*/, (open) => `${open.trimEnd()}${body}`) : page
  },
  onFinished: () => moveBuildManifests(),
  includedRoutes: () => {
    const only = process.env.DOCS_ROUTES?.split(',').filter(Boolean)
    return only?.length ? only : staticRoutes()
  }
}

export default defineConfig({
  plugins: [
    docsPlugin(),
    bundlerRuntimePlugin(),
    chunkGraphPlugin(),
    fontPreloadPlugin(),
    vue({ template: { transformAssetUrls: { includeAbsolute: false } } }),
    tailwindcss()
  ],
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
  },
  resolve: {
    alias: [
      {
        find: /^tailwindcss$/,
        replacement: fileURLToPath(new URL('./node_modules/tailwindcss/index.css', import.meta.url))
      }
    ]
  },
  optimizeDeps: {
    include: ['vue', 'vue-router']
  },
  ssr: {
    noExternal: ['@aziontech/webkit', '@aziontech/icons', '@aziontech/theme']
  },
  build: {
    assetsDir: '_app',
    chunkSizeWarningLimit: 2000,
    modulePreload: {
      resolveDependencies: (_file, deps, { hostType }) => (hostType === 'html' ? [] : deps)
    },
    rollupOptions: {
      experimental: {
        chunkOptimization: { mergeCommonChunks: false }
      }
    }
  },
  ssgOptions
} as UserConfig)
