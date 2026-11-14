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
}

const entries = new Set<ShortcutEntry>()
let listening = false

export function parseShortcut(command: string): DropdownMenuShortcut | null {
  let meta = false
  let ctrl = false
  let shift = false
  let alt = false
  let key = ''
  const tokens = command.split(/\s*\+\s*/).flatMap((part) => Array.from(part))
  for (const token of tokens) {
    const lower = token.toLowerCase()
    if (token === '⌘' || lower === 'cmd' || lower === 'meta') meta = true
    else if (token === '⌃' || lower === 'ctrl' || lower === 'control') ctrl = true
    else if (token === '⇧' || lower === 'shift') shift = true
    else if (token === '⌥' || lower === 'alt' || lower === 'option' || lower === 'opt') alt = true
    else key += token
  }
  if (!key) return null
  return { meta, ctrl, shift, alt, key: key.toLowerCase() }
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
  for (const entry of entries) {
    if (entry.enabled() && matches(event, entry.parsed)) {
      event.preventDefault()
      entry.activate(event)
      return
    }
  }
}

export function registerShortcut(
  command: string,
  enabled: () => boolean,
  activate: (event: globalThis.KeyboardEvent) => void
): () => void {
  const parsed = parseShortcut(command)
  const target = globalThis.window
  if (!parsed || !target) return () => {}
  const entry: ShortcutEntry = { parsed, enabled, activate }
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
