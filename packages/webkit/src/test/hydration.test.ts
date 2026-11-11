// Hydration (M1.10): every block and example is rendered to HTML with vue/server-renderer, then
// hydrated over that HTML with createSSRApp in the browser. Any hydration mismatch warning fails,
// because Nuxt and other SSR hosts would patch or re-render that DOM on the client.
// hydration-node.test.ts runs the same check with the HTML rendered in Node instead.
import { describe, expect, it } from 'vitest'
import { createSSRApp } from 'vue'
import { renderToString, type SSRContext } from 'vue/server-renderer'

import { files, modules, useHydrationHost } from './hydration-shared'

describe('blocks and examples hydrate without mismatches', () => {
  const { hydrate } = useHydrationHost()

  it.each(files)('%s', async (file) => {
    const mod = await modules[`../../${file}`]()
    const ctx: SSRContext = {}
    const html = await renderToString(createSSRApp(mod.default), ctx)
    const mismatches = await hydrate(mod.default, html, ctx.teleports ?? {})
    expect(mismatches, mismatches.join('\n')).toEqual([])
  })
})
