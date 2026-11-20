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

/** A parsed key combination. */
export interface ShortcutCombination {
  /** Command on Apple platforms, Control elsewhere. */
  meta: boolean
  /** Control on every platform. */
  ctrl: boolean
  /** Shift. */
  shift: boolean
  /** Alt, Option on Apple platforms. */
  alt: boolean
  /** The key, lowercase, as `KeyboardEvent.key` names it (`s`, `enter`, `/`). */
  key: string
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

const MODIFIER_ALIASES: Record<string, keyof Omit<ShortcutCombination, 'key'>> = {
  meta: 'meta',
  cmd: 'meta',
  command: 'meta',
  mod: 'meta',
  ctrl: 'ctrl',
  control: 'ctrl',
  shift: 'shift',
  alt: 'alt',
  option: 'alt'
}

const KEY_ALIASES: Record<string, string> = {
  esc: 'escape',
  space: ' ',
  del: 'delete',
  return: 'enter',
  up: 'arrowup',
  down: 'arrowdown',
  left: 'arrowleft',
  right: 'arrowright',
  plus: '+'
}

const ARIA_KEY_NAMES: Record<string, string> = {
  ' ': 'Space',
  escape: 'Escape',
  enter: 'Enter',
  delete: 'Delete',
  backspace: 'Backspace',
  tab: 'Tab',
  arrowup: 'ArrowUp',
  arrowdown: 'ArrowDown',
  arrowleft: 'ArrowLeft',
  arrowright: 'ArrowRight'
}

const TEXT_INPUT_TYPES = new Set([
  'text',
  'search',
  'email',
  'url',
  'tel',
  'password',
  'number',
  'date',
  'datetime-local',
  'month',
  'time',
  'week'
])

const TYPING_ROLES = new Set(['textbox', 'searchbox', 'combobox', 'spinbutton'])

function splitKeys(keys: string): string[] {
  const trimmed = keys.trim().toLowerCase()
  if (!trimmed) return []
  if (trimmed === '+') return ['+']
  const tokens = trimmed.split('+').map((token) => token.trim())
  if (trimmed.endsWith('++')) tokens.splice(-2, 2, '+')
  return tokens.filter(Boolean)
}

export function parseShortcutKeys(keys: string): ShortcutCombination | null {
  const combination: ShortcutCombination = {
    meta: false,
    ctrl: false,
    shift: false,
    alt: false,
    key: ''
  }
  const tokens = splitKeys(keys)
  if (!tokens.length) return null
  const key = tokens[tokens.length - 1]!
  for (const token of tokens.slice(0, -1)) {
    const modifier = MODIFIER_ALIASES[token]
    if (!modifier) return null
    combination[modifier] = true
  }
  combination.key = KEY_ALIASES[key] ?? key
  return combination
}

export function shortcutKeyList(keys: string): string[] {
  const combination = parseShortcutKeys(keys)
  if (!combination) return []
  const list: string[] = []
  if (combination.meta) list.push('meta')
  if (combination.ctrl) list.push('ctrl')
  if (combination.alt) list.push('alt')
  if (combination.shift) list.push('shift')
  list.push(combination.key === ' ' ? 'space' : combination.key)
  return list
}

export function toAriaKeyshortcuts(keys: string): string {
  const combination = parseShortcutKeys(keys)
  if (!combination) return ''
  const key =
    ARIA_KEY_NAMES[combination.key] ??
    (combination.key.length === 1 ? combination.key.toUpperCase() : combination.key)
  const rest = [combination.alt && 'Alt', combination.shift && 'Shift', key].filter(
    (part): part is string => Boolean(part)
  )
  if (combination.meta) {
    const extra = combination.ctrl ? ['Control'] : []
    return `${['Meta', ...extra, ...rest].join('+')} ${['Control', ...rest].join('+')}`
  }
  return [combination.ctrl && 'Control', ...rest]
    .filter((part): part is string => Boolean(part))
    .join('+')
}

function isApplePlatform(): boolean {
  const nav = globalThis.navigator
  if (!nav) return false
  return /mac/i.test(nav.platform || nav.userAgent || '')
}

function isSingleKey(combination: ShortcutCombination): boolean {
  return !combination.meta && !combination.ctrl && !combination.alt
}

function keyMatches(event: KeyboardEvent, key: string): boolean {
  const pressed = event.key.toLowerCase()
  if (pressed === key) return true
  if (/^[a-z]$/.test(key)) return event.code === `Key${key.toUpperCase()}`
  if (/^[0-9]$/.test(key)) return event.code === `Digit${key}`
  return false
}

export function matchesShortcut(event: KeyboardEvent, combination: ShortcutCombination): boolean {
  if (!keyMatches(event, combination.key)) return false
  const apple = isApplePlatform()
  const wantMeta = combination.meta && apple
  const wantCtrl = combination.ctrl || (combination.meta && !apple)
  if (event.metaKey !== wantMeta || event.ctrlKey !== wantCtrl) return false
  if (event.altKey !== combination.alt) return false
  const shiftAgnostic = combination.key.length === 1 && !/^[a-z0-9]$/.test(combination.key)
  if (!shiftAgnostic && event.shiftKey !== combination.shift) return false
  return true
}

function eventTarget(event: KeyboardEvent): Element | null {
  const path = typeof event.composedPath === 'function' ? event.composedPath() : []
  const first = path[0] ?? event.target
  return first instanceof Element ? first : null
}

export function isTypingTarget(target: Element | null): boolean {
  if (!target) return false
  if (target instanceof HTMLElement && target.isContentEditable) return true
  const tag = target.tagName.toLowerCase()
  if (tag === 'textarea' || tag === 'select') return true
  if (tag === 'input') {
    const type = ((target as HTMLInputElement).type || 'text').toLowerCase()
    return TEXT_INPUT_TYPES.has(type)
  }
  const role = target.getAttribute('role')
  return role !== null && TYPING_ROLES.has(role)
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
      const entry = entries[index]!
      const { shortcut } = entry
      if (!shortcut.handler || !isEnabled(shortcut)) continue
      const combination = parseShortcutKeys(toValue(shortcut.keys))
      if (!combination) continue
      if (typing && isSingleKey(combination)) continue
      if (!matchesShortcut(event, combination)) continue
      if (layer) {
        const owner = toValue(shortcut.element)
        if (!owner || !layer.contains(owner)) continue
      }
      event.preventDefault()
      shortcut.handler(event)
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
