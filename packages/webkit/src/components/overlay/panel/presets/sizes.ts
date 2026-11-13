export type PanelPresetSize = 'small' | 'medium' | 'large'

export const panelSizeClasses: Record<PanelPresetSize, string> = {
  small: 'max-w-(--container-sm)',
  medium: 'max-w-(--container-xl)',
  large: 'max-w-(--container-2xl)'
}
export const dialogPanelSizeClasses: Record<PanelPresetSize, string> = {
  small: 'md:max-w-(--container-sm)',
  medium: 'md:max-w-(--container-xl)',
  large: 'md:max-w-(--container-2xl)'
}
