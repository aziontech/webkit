export function initialsOf(name: string): string {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => Array.from(word))
  const first = words[0] ?? []
  if (words.length < 2) return first.slice(0, 2).join('').toUpperCase()
  const last = words[words.length - 1] ?? []
  return `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase()
}
