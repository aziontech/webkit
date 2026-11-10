import { after, before, describe, test } from 'node:test'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { createServer } from 'vite'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'

const root = fileURLToPath(new URL('../..', import.meta.url))

let server

const load = async (path) => (await server.ssrLoadModule(path)).default

const render = async (component) => {
  const context = {}
  const html = await renderToString(createSSRApp(component), context)
  return { html, teleports: Object.values(context.teleports ?? {}).join('') }
}

before(async () => {
  server = await createServer({
    root,
    configFile: false,
    plugins: [vue()],
    logLevel: 'silent',
    appType: 'custom',
    server: { middlewareMode: true, hmr: false, watch: null }
  })
})

after(async () => {
  await server?.close()
})

describe('SSR render without a DOM', () => {
  test('no DOM globals exist in this environment', () => {
    assert.equal(typeof document, 'undefined')
    assert.equal(typeof window, 'undefined')
  })

  test('DocFrame renders an image with its caption', async () => {
    const DocFrame = await load('/src/components/documentation/doc-frame/doc-frame.vue')
    const { html } = await render({
      render: () => h(DocFrame, { src: '/flow.png', alt: 'Query flow', caption: 'The query flow' })
    })
    assert.match(html, /<img[^>]+src="\/flow\.png"[^>]+alt="Query flow"/)
    assert.match(html, /<figcaption[^>]*>(<!--\[-->)?The query flow(<!--\]-->)?<\/figcaption>/)
  })

  test('DocFrame renders a clip', async () => {
    const DocFrame = await load('/src/components/documentation/doc-frame/doc-frame.vue')
    const { html } = await render({
      render: () => h(DocFrame, { src: '/demo.mp4', alt: 'Demo' })
    })
    assert.match(html, /<video[^>]+src="\/demo\.mp4"/)
  })

  test('DocFrame renders slot content', async () => {
    const DocFrame = await load('/src/components/documentation/doc-frame/doc-frame.vue')
    const { html } = await render({
      render: () => h(DocFrame, null, { default: () => h('pre', 'graph TD') })
    })
    assert.match(html, /<pre>graph TD<\/pre>/)
  })

  test('an open Dialog renders its content', async () => {
    const Dialog = await load('/src/components/overlay/dialog/dialog.vue')
    const DialogPortal = await load('/src/components/overlay/dialog/dialog-portal.vue')
    const DialogContent = await load('/src/components/overlay/dialog/dialog-content.vue')
    const DialogTitle = await load('/src/components/overlay/dialog/dialog-title.vue')
    const { html, teleports } = await render({
      render: () =>
        h(Dialog, { defaultOpen: true }, () =>
          h(DialogPortal, null, () =>
            h(DialogContent, null, () => h(DialogTitle, null, () => 'Delete domain'))
          )
        )
    })
    assert.match(html + teleports, /Delete domain/)
  })

  test('an open Drawer renders its content', async () => {
    const Drawer = await load('/src/components/overlay/drawer/drawer.vue')
    const DrawerPortal = await load('/src/components/overlay/drawer/drawer-portal.vue')
    const DrawerContent = await load('/src/components/overlay/drawer/drawer-content.vue')
    const DrawerTitle = await load('/src/components/overlay/drawer/drawer-title.vue')
    const { html, teleports } = await render({
      render: () =>
        h(Drawer, { defaultOpen: true }, () =>
          h(DrawerPortal, null, () =>
            h(DrawerContent, null, () => h(DrawerTitle, null, () => 'Edit domain'))
          )
        )
    })
    assert.match(html + teleports, /Edit domain/)
  })
})
