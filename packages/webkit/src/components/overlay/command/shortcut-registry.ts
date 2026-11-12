const claimed = new Map<string, number>()

export function normalizeShortcut(shortcut: string): string {
  return shortcut
    .toLowerCase()
    .split('+')
    .map((token) => token.trim())
    .filter(Boolean)
    .join('+')
}

export function claimShortcut(shortcut: string): () => void {
  const key = normalizeShortcut(shortcut)
  if (!key) return () => {}
  claimed.set(key, (claimed.get(key) ?? 0) + 1)
  let released = false
  return () => {
    if (released) return
    released = true
    const count = (claimed.get(key) ?? 1) - 1
    if (count > 0) claimed.set(key, count)
    else claimed.delete(key)
  }
}

export function isShortcutClaimed(shortcut: string): boolean {
  return claimed.has(normalizeShortcut(shortcut))
}
