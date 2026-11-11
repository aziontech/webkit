import { cpSync, createReadStream, existsSync, readFileSync, statSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'

import type { Plugin, ResolvedConfig } from 'vite'

import {
  buildComponent,
  buildIndex,
  buildTokens,
  highlight,
  highlighter,
  renderMarkdownFile
} from './content.ts'
import { CATALOG, LLMS, readCatalog, STATIC_ASSETS, THEME } from './paths.ts'

const INDEX = 'virtual:docs-index'
const TOKENS = 'virtual:docs-tokens'
const LOADERS = 'virtual:docs-component-loaders'
const COMPONENT = 'virtual:docs-component:'
const HIGHLIGHT = '\0docs-highlight:'
const MARKDOWN = '\0docs-markdown:'

const STATIC_DIRS: { prefix: string; dir: string }[] = [
  { prefix: '/llms/', dir: LLMS },
  { prefix: '/', dir: STATIC_ASSETS }
]

const MIME: Record<string, string> = {
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4'
}

function languageOf(file: string): string {
  const ext = extname(file).slice(1)
  return ext === 'mjs' ? 'js' : ext
}

export function docsPlugin(): Plugin {
  let config: ResolvedConfig
  return {
    name: 'webkit-docs',
    enforce: 'pre',
    configResolved(resolved) {
      config = resolved
    },
    async resolveId(id, importer) {
      if (id === INDEX || id === TOKENS || id === LOADERS || id.startsWith(COMPONENT)) {
        return `\0${id}`
      }
      const query = id.match(/\?(highlight|markdown)$/)
      if (query) {
        const resolved = await this.resolve(id.slice(0, -query[0].length), importer, {
          skipSelf: true
        })
        if (!resolved) return null
        const prefix = query[1] === 'highlight' ? HIGHLIGHT : MARKDOWN
        return `${prefix}${resolved.id}.js`
      }
      return null
    },
    async load(id) {
      if (id === `\0${INDEX}`) {
        this.addWatchFile(CATALOG)
        return `export default ${JSON.stringify(buildIndex())}`
      }
      if (id === `\0${TOKENS}`) {
        this.addWatchFile(join(THEME, 'dist/v4/globals.css'))
        return `export default ${JSON.stringify(buildTokens())}`
      }
      if (id === `\0${LOADERS}`) {
        this.addWatchFile(CATALOG)
        const { components } = buildIndex()
        const lines = components.map(
          (item) =>
            `  ${JSON.stringify(item.name)}: () => import(${JSON.stringify(COMPONENT + item.name)})`
        )
        return `export default {\n${lines.join(',\n')}\n}`
      }
      if (id.startsWith(`\0${COMPONENT}`)) {
        this.addWatchFile(CATALOG)
        const data = await buildComponent(id.slice(COMPONENT.length + 1), readCatalog())
        return `export default ${JSON.stringify(data)}`
      }
      if (id.startsWith(HIGHLIGHT)) {
        const file = id.slice(HIGHLIGHT.length, -3)
        this.addWatchFile(file)
        const code = readFileSync(file, 'utf8').trimEnd()
        const html = highlight(await highlighter(), code, languageOf(file))
        return `export default ${JSON.stringify({ code, html })}`
      }
      if (id.startsWith(MARKDOWN)) {
        const file = id.slice(MARKDOWN.length, -3)
        this.addWatchFile(file)
        return `export default ${JSON.stringify(await renderMarkdownFile(file))}`
      }
      return null
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = decodeURIComponent((req.url ?? '').split('?')[0])
        for (const { prefix, dir } of STATIC_DIRS) {
          if (!url.startsWith(prefix)) continue
          const file = normalize(join(dir, url.slice(prefix.length)))
          if (!file.startsWith(dir) || !existsSync(file) || !statSync(file).isFile()) continue
          res.setHeader('Content-Type', MIME[extname(file)] ?? 'application/octet-stream')
          createReadStream(file).pipe(res)
          return
        }
        next()
      })
    },
    writeBundle() {
      if (config.build.ssr) return
      const out = config.build.outDir
      if (existsSync(STATIC_ASSETS)) cpSync(STATIC_ASSETS, out, { recursive: true })
      if (existsSync(LLMS)) {
        cpSync(LLMS, join(out, 'llms'), { recursive: true })
        if (existsSync(join(LLMS, 'llms.txt')))
          cpSync(join(LLMS, 'llms.txt'), join(out, 'llms.txt'))
      }
    }
  }
}
