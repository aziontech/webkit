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
