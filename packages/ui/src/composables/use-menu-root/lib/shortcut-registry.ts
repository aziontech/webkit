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

const MODIFIERS: [RegExp, string][] = [
  [/^(⌘|mod|cmd|command|meta)$/i, 'meta'],
  [/^(⌃|ctrl|control)$/i, 'ctrl'],
  [/^(⇧|shift)$/i, 'shift'],
  [/^(⌥|alt|option|opt)$/i, 'alt']
]

const modifier = (token: string) => MODIFIERS.find(([pattern]) => pattern.test(token))?.[1]

function shortcutKeys(command: string): string[] {
  const keys: string[] = []
  for (const part of command.replace(/\+\+$/, '+plus').split('+')) {
    let rest = part.trim()
    while (rest.length > 1 && modifier(rest[0]!)) {
      keys.push(modifier(rest[0]!)!)
      rest = rest.slice(1)
    }
    if (rest) keys.push(modifier(rest) ?? (rest === 'plus' ? '+' : rest))
  }
  return keys
}

export const isMac = (): boolean => /mac|iphone|ipad/i.test(globalThis.navigator?.platform ?? '')

export function shortcutLabel(command: string, mac: boolean): string {
  const glyphs: Record<string, string> = mac
    ? { meta: '⌘', ctrl: '⌃', alt: '⌥', shift: '⇧' }
    : { meta: 'Ctrl', ctrl: 'Ctrl', alt: 'Alt', shift: '⇧' }
  return shortcutKeys(command)
    .map((key) => glyphs[key] ?? key.toUpperCase())
    .join(mac ? '' : ' ')
}

function parseShortcut(command: string): DropdownMenuShortcut | null {
  const keys = shortcutKeys(command)
  const key = keys.filter((name) => !/^(meta|ctrl|shift|alt)$/.test(name)).join('')
  if (!key) return null
  return {
    meta: keys.includes('meta'),
    ctrl: keys.includes('ctrl'),
    shift: keys.includes('shift'),
    alt: keys.includes('alt'),
    key: key.toLowerCase()
  }
}

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
