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
import { buildIndex, exampleFrameRoutes } from './plugins/content.ts'
import { cssSourcesPlugin, writeDocsSources } from './plugins/css-sources.ts'
import { docsPlugin } from './plugins/docs-plugin.ts'
import { fontPreloadPlugin } from './plugins/font-preload.ts'
import { FOUNDATION_SLUGS } from './src/lib/foundations.ts'
import { localizedRoutes } from './src/lib/locale-path.ts'
import { PATTERN_SLUGS } from './src/lib/patterns.ts'

function staticRoutes(): string[] {
  const routes = pageRoutes()
  return [...routes, ...localizedRoutes(routes)]
}

function pageRoutes(): string[] {
  const { components, blocks } = buildIndex()
  return [
    '/',
    '/components',
    '/blocks',
    '/foundations',
    '/ai',
    '/assets',
    '/assets/icons',
    ...FOUNDATION_SLUGS.map((slug) => `/foundations/${slug}`),
    '/patterns',
    ...PATTERN_SLUGS.map((slug) => `/patterns/${slug}`),
    ...components.map((item) => `/components/${item.name}`),
    ...blocks.map((block) => `/blocks/${block.id}`),
    ...blocks.flatMap((block) =>
      block.states.map((state) => `/frame/block/${block.id}/${state.slug}`)
    ),
    '/frame/example',
    ...exampleFrameRoutes(),
    '/404'
  ]
}

const ssgOptions: Partial<ViteSSGOptions> = {
  entry: 'src/main.ts',
  dirStyle: 'nested',
  formatting: 'none',
  concurrency: 1,
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

writeDocsSources()

export default defineConfig({
  plugins: [
    docsPlugin(),
    cssSourcesPlugin(),
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
