export const MIRROR_CLASS = 'rtl:-scale-x-100'

export const DIRECTIONAL_ICONS: ReadonlySet<string> = new Set([
  'pi-chevron-left',
  'pi-chevron-right',
  'pi-chevron-circle-left',
  'pi-chevron-circle-right',
  'pi-angle-left',
  'pi-angle-right',
  'pi-angle-double-left',
  'pi-angle-double-right',
  'pi-arrow-left',
  'pi-arrow-right',
  'pi-arrow-circle-left',
  'pi-arrow-circle-right',
  'pi-arrow-down-left',
  'pi-arrow-down-right',
  'pi-caret-left',
  'pi-caret-right',
  'pi-sign-in',
  'pi-sign-out',
  'pi-reply',
  'pi-undo',
  'ai-angle-left',
  'ai-angle-right',
  'ai-chevron-left',
  'ai-chevron-right',
  'ai-arrow-left',
  'ai-arrow-right'
])

export function isDirectionalIcon(icon?: string | null): boolean {
  if (!icon) return false
  return icon.split(/\s+/).some((token) => DIRECTIONAL_ICONS.has(token))
}

export function directionalIconClass(icon?: string | null): string {
  return isDirectionalIcon(icon) ? MIRROR_CLASS : ''
}
