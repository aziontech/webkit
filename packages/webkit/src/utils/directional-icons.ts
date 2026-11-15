export const MIRROR_CLASS = 'rtl:-scale-x-100'

export const DIRECTIONAL_ICONS: ReadonlySet<string> = new Set([
  'ai-chevron-left',
  'ai-chevron-right',
  'ai-circle-chevron-left',
  'ai-circle-chevron-right',
  'ai-chevrons-left',
  'ai-chevrons-right',
  'ai-arrow-left',
  'ai-arrow-right',
  'ai-circle-arrow-left',
  'ai-circle-arrow-right',
  'ai-arrow-down-left',
  'ai-arrow-down-right',
  'ai-caret-left',
  'ai-caret-right',
  'ai-log-in',
  'ai-log-out',
  'ai-reply',
  'ai-undo'
])

const DIRECTIONAL_TOKEN =
  /(?:^|\s)ai-(?:(?:(?:circle-)?(?:chevron|arrow)|chevrons|arrow-down|caret)-(?:left|right)|log-in|log-out|reply|undo)(?=\s|$)/

export function isDirectionalIcon(icon?: string | null): boolean {
  return Boolean(icon && DIRECTIONAL_TOKEN.test(icon))
}

export function directionalIconClass(icon?: string | null): string {
  return isDirectionalIcon(icon) ? MIRROR_CLASS : ''
}
