import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

import { buildIndex } from './plugins/content.ts'
import { docsPlugin } from './plugins/docs-plugin.ts'
import { FOUNDATION_SLUGS } from './src/lib/foundations.ts'

function staticRoutes(): string[] {
  const { components, blocks } = buildIndex()
  return [
    '/',
    '/components',
    '/blocks',
    '/foundations',
    ...FOUNDATION_SLUGS.map((slug) => `/foundations/${slug}`),
    ...components.map((item) => `/components/${item.name}`),
    ...blocks.map((block) => `/blocks/${block.id}`),
    ...blocks.flatMap((block) => block.states.map((state) => `/frame/${state.slug}/${block.id}`)),
    '/404'
  ]
}

export default defineConfig({
  plugins: [
    docsPlugin(),
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
    include: ['vue', 'vue-router', 'vee-validate']
  },
  ssr: {
    noExternal: ['@aziontech/webkit', '@aziontech/icons', '@aziontech/theme']
  },
  build: {
    chunkSizeWarningLimit: 2000
  },
  ssgOptions: {
    dirStyle: 'nested',
    formatting: 'none',
    concurrency: 2,
    beastiesOptions: false,
    onPageRendered: (_route, html, appCtx) => {
      const ssr = (appCtx.app as { ssrContext?: { teleports?: Record<string, string> } })
        .ssrContext
      const body = ssr?.teleports?.body
      return body ? html.replace('</body>', `${body}</body>`) : html
    },
    includedRoutes: () => {
      const only = process.env.DOCS_ROUTES?.split(',').filter(Boolean)
      return only?.length ? only : staticRoutes()
    }
  }
})
