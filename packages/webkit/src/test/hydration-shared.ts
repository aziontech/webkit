import { afterEach, beforeEach, vi } from 'vitest'
import { type Component, createSSRApp, nextTick } from 'vue'

export const modules = {
  ...import.meta.glob<{ default: Component }>('../../blocks/**/*.vue'),
  ...import.meta.glob<{ default: Component }>('../../examples/**/*.vue')
}

export const files = Object.keys(modules).map((file) => [file.replace('../../', '')])

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

export function useHydrationHost() {
  const state = { messages: [] as string[], host: document.createElement('div') }
  const teleported: Node[] = []
  beforeEach(() => {
    state.messages = []
    const collect = (...args: unknown[]) => {
      state.messages.push(args.map(String).join(' '))
    }
    vi.spyOn(console, 'warn').mockImplementation(collect)
    vi.spyOn(console, 'error').mockImplementation(collect)
    state.host = document.createElement('div')
    document.body.appendChild(state.host)
  })
  afterEach(() => {
    state.host.remove()
    for (const node of teleported.splice(0)) node.parentNode?.removeChild(node)
    vi.restoreAllMocks()
  })

  const hydrate = async (
    component: Component,
    html: string,
    teleports: Record<string, string>
  ): Promise<string[]> => {
    state.host.innerHTML = html
    for (const [to, markup] of Object.entries(teleports)) {
      const target = document.querySelector(to) as (Element & { _lpa?: Node | null }) | null
      if (!target) continue
      const parsed = document.createElement('template')
      parsed.innerHTML = markup
      teleported.push(...Array.from(parsed.content.childNodes))
      target._lpa = null
      target.prepend(parsed.content)
    }
    const app = createSSRApp(component)
    app.mount(state.host)
    await nextTick()
    app.unmount()
    return state.messages.filter((m) => MISMATCH.test(m)).map(summary)
  }

  return { hydrate }
}
