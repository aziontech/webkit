import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { createServer, type ViteDevServer } from 'vite'
import type { BrowserCommand } from 'vitest/node'
import { type Component, createSSRApp } from 'vue'
import { renderToString, type SSRContext } from 'vue/server-renderer'

export const SERVER_TIME_ZONE = 'Pacific/Kiritimati'

export interface ServerRender {
  html: string
  teleports: Record<string, string>
  error: string | null
}

const PKG = fileURLToPath(new URL('../..', import.meta.url))
const EXPORTS: Record<string, string | { default: string }> = JSON.parse(
  readFileSync(join(PKG, 'package.json'), 'utf8')
).exports

const selfExports = {
  name: 'webkit-self-exports',
  enforce: 'pre' as const,
  resolveId(id: string) {
    if (!id.startsWith('@aziontech/webkit/')) return null
    const entry = EXPORTS[`./${id.slice('@aziontech/webkit/'.length)}`]
    const target = typeof entry === 'string' ? entry : entry?.default
    return target ? join(PKG, target) : null
  }
}

declare module 'vitest/browser' {
  interface BrowserCommands {
    renderOnServer: (file: string) => Promise<ServerRender>
  }
}

let server: Promise<ViteDevServer> | null = null

const ssrServer = (): Promise<ViteDevServer> => {
  server ??= createServer({
    root: PKG,
    configFile: false,
    logLevel: 'error',
    appType: 'custom',
    server: { middlewareMode: true, hmr: false, ws: false },
    plugins: [selfExports, vue({ template: { transformAssetUrls: { includeAbsolute: false } } })],
    define: { 'process.env.NODE_ENV': JSON.stringify('test') },
    optimizeDeps: { noDiscovery: true, include: [] }
  })
  return server
}

export const renderOnServer: BrowserCommand<[file: string]> = async (
  { project },
  file
): Promise<ServerRender> => {
  if (!server) project.vitest.onClose(async () => (await server)?.close())
  const vite = await ssrServer()
  const previous = process.env['TZ']
  process.env['TZ'] = SERVER_TIME_ZONE
  try {
    const mod = (await vite.ssrLoadModule(join(PKG, file))) as { default: Component }
    const app = createSSRApp(mod.default)
    app.config.warnHandler = () => {}
    const ctx: SSRContext = {}
    const html = await renderToString(app, ctx)
    return { html, teleports: ctx.teleports ?? {}, error: null }
  } catch (err) {
    return { html: '', teleports: {}, error: String((err as Error)?.message ?? err) }
  } finally {
    if (previous === undefined) delete process.env['TZ']
    else process.env['TZ'] = previous
  }
}
