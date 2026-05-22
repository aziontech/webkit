import type { DrawerSize } from '../injection-key'

/**
 * Drawer width presets — edge panels are always full viewport height;
 * `size` only controls max-width (`var(--container-*)` from theme).
 */
export const drawerSizeClasses: Record<DrawerSize, string> = {
  small: 'max-w-[var(--container-sm)]',
  medium: 'max-w-[var(--container-2xl)]',
  large: 'max-w-[var(--container-6xl)]'
}

export const drawerSizeSummaries: Record<DrawerSize, string> = {
  small: '384px (container-sm)',
  medium: '672px (container-2xl)',
  large: '1024px (container-6xl)'
}
