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

export function isSingleKey(combination: ShortcutCombination): boolean {
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
