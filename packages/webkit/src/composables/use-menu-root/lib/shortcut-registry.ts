export interface DropdownMenuShortcut {
  meta: boolean
  ctrl: boolean
  shift: boolean
  alt: boolean
  key: string
}

interface ShortcutEntry {
  parsed: DropdownMenuShortcut
  enabled: () => boolean
  activate: (event: globalThis.KeyboardEvent) => void
  priority: () => number
}

const entries = new Set<ShortcutEntry>()
let listening = false

const GLYPHS: Record<string, ShortcutKey> = { '⌘': 'meta', '⌃': 'ctrl', '⇧': 'shift', '⌥': 'alt' }

const WORDS: Record<string, ShortcutKey> = {
  mod: 'meta',
  cmd: 'meta',
  command: 'meta',
  meta: 'meta',
  ctrl: 'ctrl',
  control: 'ctrl',
  shift: 'shift',
  alt: 'alt',
  option: 'alt',
  opt: 'alt'
}

export type ShortcutKey = 'meta' | 'ctrl' | 'shift' | 'alt'

export function shortcutKeys(command: string): string[] {
  const keys: string[] = []
  const parts = command.trim().endsWith('++')
    ? [...command.trim().slice(0, -2).split('+'), '+']
    : command.split('+')
  for (const raw of parts) {
    const part = raw.trim()
    if (!part) continue
    const word = WORDS[part.toLowerCase()]
    if (word) {
      keys.push(word)
      continue
    }
    let rest = part
    while (rest.length > 1 && GLYPHS[rest[0]!]) {
      keys.push(GLYPHS[rest[0]!]!)
      rest = rest.slice(1)
    }
    keys.push(GLYPHS[rest] ?? rest)
  }
  return keys
}

function parseShortcut(command: string): DropdownMenuShortcut | null {
  const keys = shortcutKeys(command)
  const key = keys.filter((name) => !['meta', 'ctrl', 'shift', 'alt'].includes(name)).join('')
  if (!key) return null
  return {
    meta: keys.includes('meta'),
    ctrl: keys.includes('ctrl'),
    shift: keys.includes('shift'),
    alt: keys.includes('alt'),
    key: key.toLowerCase()
  }
}

const isMac = () => /mac|iphone|ipad/i.test(globalThis.navigator?.platform ?? '')

function matches(event: globalThis.KeyboardEvent, parsed: DropdownMenuShortcut): boolean {
  const mac = isMac()
  const meta = mac ? parsed.meta : false
  const ctrl = mac ? parsed.ctrl : parsed.ctrl || parsed.meta
  return (
    event.metaKey === meta &&
    event.ctrlKey === ctrl &&
    event.shiftKey === parsed.shift &&
    event.altKey === parsed.alt &&
    event.key.toLowerCase() === parsed.key
  )
}

function onKeydown(event: globalThis.KeyboardEvent) {
  let best: ShortcutEntry | null = null
  let bestPriority = -1
  for (const entry of entries) {
    if (!matches(event, entry.parsed) || !entry.enabled()) continue
    const priority = entry.priority()
    if (priority > bestPriority) {
      best = entry
      bestPriority = priority
    }
  }
  if (!best) return
  event.preventDefault()
  best.activate(event)
}

export function registerShortcut(
  command: string,
  enabled: () => boolean,
  activate: (event: globalThis.KeyboardEvent) => void,
  priority: () => number = () => 0
): () => void {
  const parsed = parseShortcut(command)
  const target = globalThis.window
  if (!parsed || !target) return () => {}
  const entry: ShortcutEntry = { parsed, enabled, activate, priority }
  entries.add(entry)
  if (!listening) {
    target.addEventListener('keydown', onKeydown)
    listening = true
  }
  return () => {
    entries.delete(entry)
    if (entries.size === 0 && listening) {
      target.removeEventListener('keydown', onKeydown)
      listening = false
    }
  }
}
