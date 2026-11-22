import {
  computed,
  type ComputedRef,
  getCurrentScope,
  hasInjectionContext,
  inject,
  type InjectionKey,
  type MaybeRefOrGetter,
  onScopeDispose,
  provide,
  shallowReactive,
  toValue
} from 'vue'

import { isSingleKey, matchesShortcut, parseShortcutKeys, shortcutKeyList } from './lib/keys'
import { isTypingTarget } from './lib/typing-target'

/** One keyboard shortcut a screen offers. */
export interface Shortcut {
  /** Keys joined with `+`: `meta+s`, `meta+enter`, `/`, `?`. `meta` is Command on Apple platforms and Control elsewhere; `ctrl` is always Control. */
  keys: MaybeRefOrGetter<string>
  /** What the shortcut does, as the shortcuts list shows it. Empty keeps it out of the list. */
  label?: MaybeRefOrGetter<string>
  /** Heading the list files it under. Empty files it under the general group. */
  group?: MaybeRefOrGetter<string>
  /** Runs on the key press, after the browser default is prevented. Omitted, the shortcut is only listed: another part (Command, a field) binds it. */
  handler?: (event: KeyboardEvent) => void
  /** The shortcut works and is listed only while this is true. */
  when?: MaybeRefOrGetter<boolean>
  /** The element the shortcut belongs to. While a modal layer is open, only shortcuts whose element sits inside that layer fire. */
  element?: MaybeRefOrGetter<HTMLElement | null | undefined>
}

/** One row of the shortcuts list. */
export interface ShortcutListItem {
  /** Stable id of the row. */
  id: string
  /** The keys as registered (`meta+s`). */
  keys: string
  /** Each key on its own, for `Kbd` (`['meta', 's']`). */
  keyList: string[]
  /** What the shortcut does. */
  label: string
}

/** One group of the shortcuts list. */
export interface ShortcutListGroup {
  /** The group heading; empty for the general group. */
  group: string
  /** The shortcuts in the group, in registration order. */
  items: ShortcutListItem[]
}

/** What `useShortcuts` returns. */
export interface UseShortcutsReturn {
  /** Removes the shortcuts before the scope ends. */
  stop: () => void
}

/** What `useShortcutList` returns. */
export interface UseShortcutListReturn {
  /** Every listed shortcut that is enabled now, grouped in first-registration order. */
  groups: ComputedRef<ShortcutListGroup[]>
}

/** A shortcut as the registry holds it. */
export interface ShortcutRegistryEntry {
  /** Registration order. */
  id: number
  /** The shortcut as registered. */
  shortcut: Shortcut
}

/** The shortcuts of one app: provided by `provideShortcuts`, or the page-wide default. */
export interface ShortcutRegistry {
  /** Registered shortcuts, in registration order. */
  entries: readonly ShortcutRegistryEntry[]
  /** Adds a shortcut and returns its remover. */
  register: (shortcut: Shortcut) => () => void
}

export const ShortcutsInjectionKey: InjectionKey<ShortcutRegistry> = Symbol('Shortcuts')

function eventTarget(event: KeyboardEvent): Element | null {
  const path = typeof event.composedPath === 'function' ? event.composedPath() : []
  const first = path[0] ?? event.target
  return first instanceof Element ? first : null
}

function topModalLayer(target: Element | null): Element | null {
  const own = target?.closest('[aria-modal="true"]') ?? null
  if (own) return own
  const doc = globalThis.document
  if (!doc) return null
  const layers = doc.querySelectorAll('[aria-modal="true"]')
  return layers.length ? layers[layers.length - 1]! : null
}

function isEnabled(shortcut: Shortcut): boolean {
  return shortcut.when === undefined || toValue(shortcut.when) !== false
}

function matchesPress(shortcut: Shortcut, event: KeyboardEvent, typing: boolean): boolean {
  if (!shortcut.handler || !isEnabled(shortcut)) return false
  const combination = parseShortcutKeys(toValue(shortcut.keys))
  if (!combination || (typing && isSingleKey(combination))) return false
  return matchesShortcut(event, combination)
}

export function createShortcutRegistry(): ShortcutRegistry {
  const entries = shallowReactive<ShortcutRegistryEntry[]>([])
  let nextId = 0
  let listening = false

  function onKeydown(event: KeyboardEvent) {
    if (event.defaultPrevented || event.isComposing || event.keyCode === 229 || event.repeat) {
      return
    }
    const target = eventTarget(event)
    const typing = isTypingTarget(target)
    const layer = topModalLayer(target)
    for (let index = entries.length - 1; index >= 0; index -= 1) {
      const { shortcut } = entries[index]!
      if (!matchesPress(shortcut, event, typing)) continue
      if (layer) {
        const owner = toValue(shortcut.element)
        if (!owner || !layer.contains(owner)) continue
      }
      event.preventDefault()
      shortcut.handler?.(event)
      return
    }
  }

  function setListening(on: boolean) {
    const target = globalThis.window
    if (!target || on === listening) return
    if (on) target.addEventListener('keydown', onKeydown)
    else target.removeEventListener('keydown', onKeydown)
    listening = on
  }

  function register(shortcut: Shortcut): () => void {
    const entry: ShortcutRegistryEntry = { id: nextId++, shortcut }
    entries.push(entry)
    setListening(true)
    let removed = false
    return () => {
      if (removed) return
      removed = true
      const index = entries.indexOf(entry)
      if (index >= 0) entries.splice(index, 1)
      if (!entries.length) setListening(false)
    }
  }

  return { entries, register }
}

let defaultRegistry: ShortcutRegistry | null = null

function resolveRegistry(): ShortcutRegistry {
  const provided = hasInjectionContext() ? inject(ShortcutsInjectionKey, null) : null
  if (provided) return provided
  defaultRegistry ??= createShortcutRegistry()
  return defaultRegistry
}

export function provideShortcuts(): ShortcutRegistry {
  const registry = createShortcutRegistry()
  provide(ShortcutsInjectionKey, registry)
  return registry
}

export function useShortcuts(shortcuts: Shortcut | Shortcut[]): UseShortcutsReturn {
  const list = Array.isArray(shortcuts) ? shortcuts : [shortcuts]
  if (typeof globalThis.window === 'undefined') return { stop: () => {} }
  const registry = resolveRegistry()
  const removers = list.map((shortcut) => registry.register(shortcut))
  const stop = () => {
    for (const remove of removers) remove()
  }
  if (getCurrentScope()) onScopeDispose(stop)
  return { stop }
}

export function useShortcutList(): UseShortcutListReturn {
  const registry = resolveRegistry()
  const groups = computed<ShortcutListGroup[]>(() => {
    const byGroup = new Map<string, ShortcutListItem[]>()
    const seen = new Set<string>()
    for (const { id, shortcut } of registry.entries) {
      const label = toValue(shortcut.label) ?? ''
      if (!label || !isEnabled(shortcut)) continue
      const keys = toValue(shortcut.keys)
      if (!parseShortcutKeys(keys)) continue
      const dedupe = `${keys.trim().toLowerCase()}\u0000${label}`
      if (seen.has(dedupe)) continue
      seen.add(dedupe)
      const group = toValue(shortcut.group) ?? ''
      const items = byGroup.get(group) ?? []
      items.push({
        id: String(id),
        keys,
        keyList: shortcutKeyList(keys),
        label
      })
      byGroup.set(group, items)
    }
    return Array.from(byGroup, ([group, items]) => ({ group, items })).sort(
      (a, b) => Number(Boolean(a.group)) - Number(Boolean(b.group))
    )
  })
  return { groups }
}
