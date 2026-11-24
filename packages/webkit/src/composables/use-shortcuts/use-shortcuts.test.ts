import { afterEach, describe, expect, it, vi } from 'vitest'
import { effectScope, ref } from 'vue'

import {
  createShortcutRegistry,
  parseShortcutKeys,
  shortcutKeyList,
  toAriaKeyshortcuts,
  useShortcutList,
  useShortcuts
} from './index'

const apple = /mac/i.test(navigator.platform || navigator.userAgent || '')

function press(target: EventTarget, init: globalThis.KeyboardEventInit & { keyCode?: number }) {
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init })
  if (init.keyCode !== undefined) Object.defineProperty(event, 'keyCode', { value: init.keyCode })
  target.dispatchEvent(event)
  return event
}

const primary = apple ? { metaKey: true } : { ctrlKey: true }

const cleanups: Array<() => void> = []

afterEach(() => {
  while (cleanups.length) cleanups.pop()!()
  document.body.innerHTML = ''
})

function scoped<T>(fn: () => T): T {
  const scope = effectScope()
  const result = scope.run(fn) as T
  cleanups.push(() => scope.stop())
  return result
}

describe('parseShortcutKeys', () => {
  it('reads modifiers, aliases and the key', () => {
    expect(parseShortcutKeys('meta+s')).toEqual({
      meta: true,
      ctrl: false,
      shift: false,
      alt: false,
      key: 's'
    })
    expect(parseShortcutKeys('Cmd+Enter')?.key).toBe('enter')
    expect(parseShortcutKeys('esc')?.key).toBe('escape')
    expect(parseShortcutKeys('ctrl++')?.key).toBe('+')
    expect(parseShortcutKeys('hyper+s')).toBeNull()
    expect(parseShortcutKeys('')).toBeNull()
  })

  it('lists the keys for Kbd and writes aria-keyshortcuts for both platforms', () => {
    expect(shortcutKeyList('meta+shift+p')).toEqual(['meta', 'shift', 'p'])
    expect(shortcutKeyList('?')).toEqual(['?'])
    expect(toAriaKeyshortcuts('meta+s')).toBe('Meta+S Control+S')
    expect(toAriaKeyshortcuts('meta+enter')).toBe('Meta+Enter Control+Enter')
    expect(toAriaKeyshortcuts('/')).toBe('/')
    expect(toAriaKeyshortcuts('shift+delete')).toBe('Shift+Delete')
  })
})

describe('useShortcuts', () => {
  it('runs the handler and prevents the browser default', () => {
    const handler = vi.fn()
    scoped(() => useShortcuts({ keys: 'meta+s', handler }))
    const event = press(document.body, { key: 's', ...primary })
    expect(handler).toHaveBeenCalledWith(event)
    expect(event.defaultPrevented).toBe(true)
  })

  it('uses Command on Apple platforms and Control elsewhere', () => {
    const handler = vi.fn()
    scoped(() => useShortcuts({ keys: 'meta+s', handler }))
    press(document.body, { key: 's', ...(apple ? { ctrlKey: true } : { metaKey: true }) })
    expect(handler).not.toHaveBeenCalled()
  })

  it('never fires a single-key shortcut while typing in a field', () => {
    const handler = vi.fn()
    scoped(() => useShortcuts({ keys: '/', handler }))
    document.body.innerHTML = `
      <input data-testid="text" />
      <textarea data-testid="area"></textarea>
      <div data-testid="editable" contenteditable="true"></div>
      <div data-testid="combobox" role="combobox" tabindex="0"></div>
      <input data-testid="checkbox" type="checkbox" />`
    for (const id of ['text', 'area', 'editable', 'combobox']) {
      press(document.querySelector(`[data-testid="${id}"]`)!, { key: '/' })
    }
    expect(handler).not.toHaveBeenCalled()
    press(document.querySelector('[data-testid="checkbox"]')!, { key: '/' })
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('fires a modifier shortcut inside a field', () => {
    const handler = vi.fn()
    scoped(() => useShortcuts({ keys: 'meta+enter', handler }))
    document.body.innerHTML = '<textarea></textarea>'
    press(document.querySelector('textarea')!, { key: 'Enter', ...primary })
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('ignores a single-key shortcut pressed with a modifier', () => {
    const handler = vi.fn()
    scoped(() => useShortcuts({ keys: '/', handler }))
    press(document.body, { key: '/', ...primary })
    press(document.body, { key: '/', altKey: true })
    expect(handler).not.toHaveBeenCalled()
  })

  it('matches a punctuation key by its character, whatever Shift does', () => {
    const handler = vi.fn()
    scoped(() => useShortcuts({ keys: '?', handler }))
    press(document.body, { key: '?', shiftKey: true })
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('ignores IME composition, prevented events and auto-repeat', () => {
    const handler = vi.fn()
    scoped(() => useShortcuts({ keys: 'g', handler }))
    press(document.body, { key: 'g', isComposing: true })
    press(document.body, { key: 'Process', keyCode: 229 })
    press(document.body, { key: 'g', repeat: true })
    const prevented = new KeyboardEvent('keydown', { key: 'g', bubbles: true, cancelable: true })
    prevented.preventDefault()
    document.body.dispatchEvent(prevented)
    expect(handler).not.toHaveBeenCalled()
  })

  it('respects when, and lets the last registration win', () => {
    const enabled = ref(false)
    const first = vi.fn()
    const second = vi.fn()
    scoped(() => useShortcuts({ keys: 'meta+s', handler: first }))
    scoped(() => useShortcuts({ keys: 'meta+s', handler: second, when: enabled }))
    press(document.body, { key: 's', ...primary })
    expect(first).toHaveBeenCalledTimes(1)
    enabled.value = true
    press(document.body, { key: 's', ...primary })
    expect(second).toHaveBeenCalledTimes(1)
    expect(first).toHaveBeenCalledTimes(1)
  })

  it('inside an open modal layer fires only the layer’s own shortcuts', () => {
    document.body.innerHTML = `
      <main><button data-testid="page">Page</button></main>
      <div role="dialog" aria-modal="true"><textarea data-testid="field"></textarea></div>`
    const layer = document.querySelector<HTMLElement>('[role="dialog"]')!
    const page = vi.fn()
    const inLayer = vi.fn()
    scoped(() => useShortcuts({ keys: 'meta+s', handler: page }))
    press(document.querySelector('[data-testid="page"]')!, { key: 's', ...primary })
    expect(page).not.toHaveBeenCalled()
    scoped(() => useShortcuts({ keys: 'meta+enter', handler: inLayer, element: () => layer }))
    press(document.querySelector('[data-testid="field"]')!, { key: 'Enter', ...primary })
    expect(inLayer).toHaveBeenCalledTimes(1)
  })

  it('removes the shortcuts when the scope is disposed', () => {
    const handler = vi.fn()
    const scope = effectScope()
    scope.run(() => useShortcuts({ keys: 'g', handler }))
    scope.stop()
    press(document.body, { key: 'g' })
    expect(handler).not.toHaveBeenCalled()
  })

  it('stop removes them before the scope ends', () => {
    const handler = vi.fn()
    const { stop } = scoped(() => useShortcuts({ keys: 'g', handler }))
    stop()
    press(document.body, { key: 'g' })
    expect(handler).not.toHaveBeenCalled()
  })
})

describe('useShortcutList', () => {
  it('groups labelled, enabled shortcuts and drops duplicates', () => {
    const visible = ref(true)
    scoped(() =>
      useShortcuts([
        { keys: '/', label: 'Focus search', group: 'Page', handler: () => {} },
        { keys: 'meta+s', label: 'Save changes', group: 'Page', handler: () => {} },
        { keys: '?', label: 'Show keyboard shortcuts', handler: () => {} },
        { keys: 'meta+k', label: 'Search', when: visible },
        { keys: 'meta+k', label: 'Search' },
        { keys: 'g', handler: () => {} }
      ])
    )
    const { groups } = scoped(() => useShortcutList())
    expect(groups.value.map((group) => group.group)).toEqual(['', 'Page'])
    expect(groups.value[0]!.items.map((item) => item.label)).toEqual([
      'Show keyboard shortcuts',
      'Search'
    ])
    expect(groups.value[1]!.items.map((item) => item.keyList)).toEqual([['/'], ['meta', 's']])
    visible.value = false
    expect(groups.value[0]!.items).toHaveLength(2)
  })

  it('a registry keeps its own shortcuts and listener', () => {
    const registry = createShortcutRegistry()
    const handler = vi.fn()
    const remove = registry.register({ keys: 'g', handler })
    press(document.body, { key: 'g' })
    expect(handler).toHaveBeenCalledTimes(1)
    remove()
    press(document.body, { key: 'g' })
    expect(handler).toHaveBeenCalledTimes(1)
    expect(registry.entries).toHaveLength(0)
  })
})
