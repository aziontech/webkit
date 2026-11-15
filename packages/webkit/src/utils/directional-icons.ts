export const MIRROR_CLASS = 'rtl:-scale-x-100'

export const DIRECTIONAL_ICONS: ReadonlySet<string> = new Set([
  'ai-chevron-left',
  'ai-chevron-right',
  'ai-chevron-circle-left',
  'ai-chevron-circle-right',
  'ai-angle-left',
  'ai-angle-right',
  'ai-angle-double-left',
  'ai-angle-double-right',
  'ai-arrow-left',
  'ai-arrow-right',
  'ai-arrow-circle-left',
  'ai-arrow-circle-right',
  'ai-arrow-down-left',
  'ai-arrow-down-right',
  'ai-caret-left',
  'ai-caret-right',
  'ai-sign-in',
  'ai-sign-out',
  'ai-reply',
  'ai-undo'
])

const DIRECTIONAL_TOKEN =
  /(?:^|\s)ai-(?:(?:(?:chevron|arrow)(?:-circle)?|angle(?:-double)?|arrow-down|caret)-(?:left|right)|sign-in|sign-out|reply|undo)(?=\s|$)/

export function isDirectionalIcon(icon?: string | null): boolean {
  return Boolean(icon && DIRECTIONAL_TOKEN.test(icon))
}

export function directionalIconClass(icon?: string | null): string {
  return isDirectionalIcon(icon) ? MIRROR_CLASS : ''
}
