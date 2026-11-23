export function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ''
  if (words.length === 1)
    return Array.from(words[0] as string)
      .slice(0, 2)
      .join('')
      .toUpperCase()
  const first = Array.from(words[0] as string)[0] ?? ''
  const last = Array.from(words[words.length - 1] as string)[0] ?? ''
  return `${first}${last}`.toUpperCase()
}
