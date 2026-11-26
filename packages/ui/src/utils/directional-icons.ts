export const MIRROR_CLASS = 'rtl:-scale-x-100'

export const DIRECTIONAL_ICONS: ReadonlySet<string> = new Set([
  'az-chevron-left',
  'az-chevron-right',
  'az-circle-chevron-left',
  'az-circle-chevron-right',
  'az-chevrons-left',
  'az-chevrons-right',
  'az-arrow-left',
  'az-arrow-right',
  'az-arrow-left-to-line',
  'az-arrow-right-to-line',
  'az-circle-arrow-left',
  'az-circle-arrow-right',
  'az-arrow-down-left',
  'az-arrow-down-right',
  'az-caret-left',
  'az-caret-right',
  'az-log-in',
  'az-log-out',
  'az-reply',
  'az-undo'
])

const DIRECTIONAL_TOKEN =
  /(?:^|\s)az-(?:(?:(?:circle-)?(?:chevron|arrow)|chevrons|arrow-down|caret)-(?:left|right)|arrow-(?:left|right)-to-line|log-in|log-out|reply|undo)(?=\s|$)/

export function isDirectionalIcon(icon?: string | null): boolean {
  return Boolean(icon && DIRECTIONAL_TOKEN.test(icon))
}

export function directionalIconClass(icon?: string | null): string {
  return isDirectionalIcon(icon) ? MIRROR_CLASS : ''
}
