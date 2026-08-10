/** Panel max-width presets (`var(--container-*)` from theme). */
export const panelSizeClasses = {
  small: 'max-w-(--container-sm)',
  medium: 'max-w-(--container-xl)',
  large: 'max-w-(--container-2xl)'
}
/** Dialog: container cap from `md` up; mobile stays fluid `w-full`. */
export const dialogPanelSizeClasses = {
  small: 'md:max-w-(--container-sm)',
  medium: 'md:max-w-(--container-xl)',
  large: 'md:max-w-(--container-2xl)'
}
