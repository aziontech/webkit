// Server rendering (M1.7): every block and example renders with vue/server-renderer in Node, where
// window and document do not exist. A component that touches a browser API during setup or render
// fails here; move that access into onMounted or a guarded handler.
import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { after, before, describe, test } from 'node:test'
import { fileURLToPath } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { createServer } from 'vite'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'

const PKG = join(dirname(fileURLToPath(import.meta.url)), '../..')
const EXPORTS = JSON.parse(readFileSync(join(PKG, 'package.json'), 'utf8')).exports

const selfExports = {
  name: 'webkit-self-exports',
  enforce: 'pre',
  resolveId(id) {
    if (!id.startsWith('@aziontech/webkit/')) return null
    const entry = EXPORTS[`./${id.slice('@aziontech/webkit/'.length)}`]
    const target = typeof entry === 'string' ? entry : entry?.default
    return target ? join(PKG, target) : null
  }
}

function walk(dir, match, out = []) {
  if (!existsSync(dir)) return out
  for (const e of readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name)
  )) {
    const p = join(dir, e.name)
    if (e.isDirectory()) walk(p, match, out)
    else if (match(e.name)) out.push(p)
  }
  return out
}

function blockFiles() {
  return walk(join(PKG, 'blocks'), (name) => name === 'block.json').flatMap((manifest) => {
    const block = JSON.parse(readFileSync(manifest, 'utf8'))
    const dir = dirname(manifest)
    return [block.primary, ...(block.variants || [])].map((v) => join(dir, v.file))
  })
}

const FILES = [...blockFiles(), ...walk(join(PKG, 'examples'), (name) => name.endsWith('.vue'))]

let server
const errors = []

before(async () => {
  server = await createServer({
    root: PKG,
    configFile: false,
    logLevel: 'error',
    appType: 'custom',
    server: { middlewareMode: true, hmr: false, ws: false },
    plugins: [selfExports, vue({ template: { transformAssetUrls: { includeAbsolute: false } } })],
    define: { 'process.env.NODE_ENV': JSON.stringify('test') },
    optimizeDeps: { noDiscovery: true, include: [] }
  })
})

after(async () => {
  await server?.close()
})

describe('every block and example renders on the server', () => {
  test(`${FILES.length} SFCs render with renderToString`, async () => {
    let current = ''
    const onRejection = (err) => {
      errors.push(`${current}: after render, ${String(err?.message ?? err).split('\n')[0]}`)
    }
    process.on('unhandledRejection', onRejection)
    for (const file of FILES) {
      const name = relative(PKG, file)
      current = name
      try {
        const mod = await server.ssrLoadModule(file)
        const app = createSSRApp(mod.default)
        app.config.warnHandler = () => {}
        let thrown = null
        app.config.errorHandler = (err) => {
          thrown ??= err
        }
        const html = await renderToString(app)
        if (thrown) throw thrown
        assert.equal(typeof html, 'string')
      } catch (err) {
        const frame = String(err?.stack ?? '')
          .split('\n')
          .find((line) => line.includes('/src/') && !line.includes('node_modules'))
        const at = frame ? ` (${relative(PKG, frame.replace(/^.*?\(|\)$|^\s*at\s+/g, ''))})` : ''
        errors.push(`${name}: ${String(err?.message ?? err).split('\n')[0]}${at}`)
      }
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
    process.off('unhandledRejection', onRejection)
    assert.deepEqual(errors, [], `${errors.length} SFC(s) fail to render on the server`)
  })
})

describe('motion does not hide server-rendered content', () => {
  test('the active Tabs panel renders visible without JS', async () => {
    const mod = await server.ssrLoadModule(join(PKG, 'examples/tabs/default.vue'))
    const html = await renderToString(createSSRApp(mod.default))
    const panel = html.match(/role="tabpanel"[^>]*data-state="active"[^>]*>\s*<div class="([^"]*)"/)
    assert.ok(panel, 'active tab panel not found')
    assert.ok(!panel[1].split(/\s+/).includes('opacity-0'), `active panel classes: ${panel[1]}`)
  })
})

describe('trigger ARIA is in the server HTML', () => {
  for (const [example, popup] of [
    ['examples/dropdown-menu/default.vue', 'menu'],
    ['examples/popover/default.vue', 'dialog']
  ]) {
    test(`${example} renders aria-haspopup="${popup}" on the slotted button`, async () => {
      const mod = await server.ssrLoadModule(join(PKG, example))
      const html = await renderToString(createSSRApp(mod.default))
      const trigger = html.match(/<span[^>]*data-testid="[^"]*__trigger"[^>]*>\s*(<button[^>]*>)/)
      assert.ok(trigger, 'trigger wrapper with a button child not found')
      const [wrapper, button] = [trigger[0].slice(0, trigger[0].indexOf('>') + 1), trigger[1]]
      assert.doesNotMatch(wrapper, /aria-|role=|tabindex=/, wrapper)
      assert.match(button, new RegExp(`aria-haspopup="${popup}"`), button)
      assert.match(button, /aria-expanded="false"/, button)
      assert.match(button, /aria-controls="[^"]+"/, button)
      assert.match(button, /\sid="[^"]+"/, button)
    })
  }
})

describe('trigger ARIA reaches controls behind a Tooltip and leaf components', () => {
  test('a Tooltip-wrapped IconButton trigger carries the ARIA on the button', async () => {
    const file = 'blocks/platform/create/create-in-drawer/variants/edit-domain.vue'
    const mod = await server.ssrLoadModule(join(PKG, file))
    const html = await renderToString(createSSRApp(mod.default))
    const trigger = html.match(
      /(<span[^>]*data-testid="[^"]*__trigger"[^>]*>)(?:\s|<!--\[-->)*(<span[^>]*data-testid="overlay-tooltip"[^>]*>)(?:\s|<!--\[-->)*(<button[^>]*>)/
    )
    assert.ok(trigger, 'trigger wrapper > tooltip wrapper > button not found')
    const [, wrapper, tooltip, button] = trigger
    assert.doesNotMatch(wrapper, /aria-|role=|tabindex=/, wrapper)
    assert.doesNotMatch(tooltip, /aria-|role=|tabindex=/, tooltip)
    assert.match(button, /aria-haspopup="menu"/, button)
    assert.match(button, /aria-expanded="false"/, button)
    assert.match(button, /aria-controls="[^"]+"/, button)
    assert.match(button, /\sid="[^"]+"/, button)
  })

  test('an Avatar trigger renders the wrapper as the button', async () => {
    const mod = await server.ssrLoadModule(join(PKG, 'examples/dropdown-menu/custom-triggers.vue'))
    const html = await renderToString(createSSRApp(mod.default))
    const trigger = html.match(
      /(<span[^>]*data-testid="[^"]*__trigger"[^>]*>)\s*<span[^>]*data-testid="content-avatar"/
    )
    assert.ok(trigger, 'trigger wrapper with an Avatar child not found')
    const wrapper = trigger[1]
    assert.match(wrapper, /role="button"/, wrapper)
    assert.match(wrapper, /tabindex="0"/, wrapper)
    assert.match(wrapper, /aria-haspopup="menu"/, wrapper)
    assert.match(wrapper, /aria-expanded="false"/, wrapper)
    assert.match(wrapper, /\sid="[^"]+"/, wrapper)
  })
})
