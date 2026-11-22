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

type Modifier = 'meta' | 'ctrl' | 'shift' | 'alt'

const MODIFIER_TOKENS: Record<Modifier, string[]> = {
  meta: ['⌘', 'cmd', 'meta'],
  ctrl: ['⌃', 'ctrl', 'control'],
  shift: ['⇧', 'shift'],
  alt: ['⌥', 'alt', 'option', 'opt']
}

const MODIFIERS = Object.keys(MODIFIER_TOKENS) as Modifier[]

function modifierOf(token: string): Modifier | null {
  const lower = token.toLowerCase()
  return (
    MODIFIERS.find((modifier) => {
      const [symbol, ...names] = MODIFIER_TOKENS[modifier]
      return token === symbol || names.includes(lower)
    }) ?? null
  )
}

function parseShortcut(command: string): DropdownMenuShortcut | null {
  const parsed: DropdownMenuShortcut = {
    meta: false,
    ctrl: false,
    shift: false,
    alt: false,
    key: ''
  }
  const tokens = command.split(/\s*\+\s*/).flatMap((part) => Array.from(part))
  for (const token of tokens) {
    const modifier = modifierOf(token)
    if (modifier) parsed[modifier] = true
    else parsed.key += token
  }
  if (!parsed.key) return null
  return { ...parsed, key: parsed.key.toLowerCase() }
}

function matches(event: globalThis.KeyboardEvent, parsed: DropdownMenuShortcut): boolean {
  return (
    event.metaKey === parsed.meta &&
    event.ctrlKey === parsed.ctrl &&
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
