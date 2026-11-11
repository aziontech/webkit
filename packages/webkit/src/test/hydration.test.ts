// Hydration (M1.10): every block and example is rendered to HTML with vue/server-renderer, then
// hydrated over that HTML with createSSRApp in the browser. Any hydration mismatch warning fails,
// because Nuxt and other SSR hosts would patch or re-render that DOM on the client.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { type Component, createSSRApp, nextTick } from 'vue'
import { renderToString, type SSRContext } from 'vue/server-renderer'

const modules = {
  ...import.meta.glob<{ default: Component }>('../../blocks/**/*.vue'),
  ...import.meta.glob<{ default: Component }>('../../examples/**/*.vue')
}

const MISMATCH = /hydration/i

const summary = (message: string): string => {
  const [head = '', ...rest] = message.split('\n')
  const detail = rest.filter((line) => /rendered on server|expected on client/.test(line))
  const owners = rest
    .map((line) => line.match(/at <(\w+)/)?.[1])
    .filter((name) => name && !/^(BaseTransition|Transition|TransitionGroup|Teleport)$/.test(name))
  return [
    head.trim(),
    ...detail.map((line) => line.trim().slice(0, 160)),
    `in ${owners.slice(0, 3).join(' < ')}`
  ].join(' | ')
}

describe('blocks and examples hydrate without mismatches', () => {
  let messages: string[] = []
  let host: HTMLElement
  const teleported: Node[] = []
  beforeEach(() => {
    messages = []
    const collect = (...args: unknown[]) => {
      messages.push(args.map(String).join(' '))
    }
    vi.spyOn(console, 'warn').mockImplementation(collect)
    vi.spyOn(console, 'error').mockImplementation(collect)
    host = document.createElement('div')
    document.body.appendChild(host)
  })
  afterEach(() => {
    host.remove()
    for (const node of teleported.splice(0)) node.parentNode?.removeChild(node)
    vi.restoreAllMocks()
  })

  it.each(Object.keys(modules).map((file) => [file.replace('../../', '')]))('%s', async (file) => {
    const mod = await modules[`../../${file}`]()
    const ctx: SSRContext = {}
    host.innerHTML = await renderToString(createSSRApp(mod.default), ctx)
    for (const [to, html] of Object.entries(ctx.teleports ?? {})) {
      const target = document.querySelector(to) as (Element & { _lpa?: Node | null }) | null
      if (!target) continue
      const parsed = document.createElement('template')
      parsed.innerHTML = html
      teleported.push(...Array.from(parsed.content.childNodes))
      target._lpa = null
      target.prepend(parsed.content)
    }
    const app = createSSRApp(mod.default)
    app.mount(host)
    await nextTick()
    app.unmount()
    const mismatches = messages.filter((m) => MISMATCH.test(m)).map(summary)
    expect(mismatches, mismatches.join('\n')).toEqual([])
  })
})
