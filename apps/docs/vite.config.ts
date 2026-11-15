import { readFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig, type UserConfig } from 'vite'
import type { ViteSSGOptions } from 'vite-ssg'

import { buildIndex } from './plugins/content.ts'
import { docsPlugin } from './plugins/docs-plugin.ts'
import { walk, WEBKIT } from './plugins/paths.ts'
import { FOUNDATION_SLUGS } from './src/lib/foundations.ts'

function exampleFrames(): string[] {
  const root = join(WEBKIT, 'examples')
  return walk(root, (name) => name === 'examples.json').flatMap((file) => {
    const dir = relative(root, dirname(file))
    const data = JSON.parse(readFileSync(file, 'utf8')) as { examples: { file: string }[] }
    return data.examples.map(
      (example) => `/frame/example/${dir}/${example.file.replace(/\.vue$/, '')}`
    )
  })
}

function staticRoutes(): string[] {
  const { components, blocks } = buildIndex()
  return [
    '/',
    '/components',
    '/blocks',
    '/foundations',
    '/assets',
    ...FOUNDATION_SLUGS.map((slug) => `/foundations/${slug}`),
    ...components.map((item) => `/components/${item.name}`),
    ...blocks.map((block) => `/blocks/${block.id}`),
    ...blocks.flatMap((block) =>
      block.states.map((state) => `/frame/block/${block.id}/${state.slug}`)
    ),
    ...exampleFrames(),
    '/404'
  ]
}

const ssgOptions: Partial<ViteSSGOptions> = {
  dirStyle: 'nested',
  formatting: 'none',
  concurrency: 2,
  beastiesOptions: false,
  onPageRendered: (_route, html, appCtx) => {
    const ssr = (appCtx.app as { ssrContext?: { teleports?: Record<string, string> } }).ssrContext
    const body = ssr?.teleports?.body
    return body ? html.replace(/<body([^>]*)>\s*/, (open) => `${open.trimEnd()}${body}`) : html
  },
  includedRoutes: () => {
    const only = process.env.DOCS_ROUTES?.split(',').filter(Boolean)
    return only?.length ? only : staticRoutes()
  }
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
    include: ['vue', 'vue-router']
  },
  ssr: {
    noExternal: ['@aziontech/webkit', '@aziontech/icons', '@aziontech/theme']
  },
  build: {
    assetsDir: '_app',
    chunkSizeWarningLimit: 2000
  },
  ssgOptions
} as UserConfig)
