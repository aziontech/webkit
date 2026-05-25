/** Generic display formatter for applied filter chip values. */
export function formatFilterValue(_filterKey: string, value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (Array.isArray(value)) return value.join(', ')
  return String(value)
}
