import type { PanelSize } from '../injection-key'

/** Panel max-width presets (`var(--container-*)` from theme). */
export const panelSizeClasses: Record<PanelSize, string> = {
  small: 'max-w-[var(--container-sm)]',
  medium: 'max-w-[var(--container-xl)]',
  large: 'max-w-[var(--container-2xl)]'
}

/** Dialog: container cap from `md` up; mobile stays fluid `w-full`. */
export const dialogPanelSizeClasses: Record<PanelSize, string> = {
  small: 'md:max-w-[var(--container-sm)]',
  medium: 'md:max-w-[var(--container-xl)]',
  large: 'md:max-w-[var(--container-2xl)]'
}
