export type DrawerPresetSize = 'small' | 'medium' | 'large'

export interface DrawerShellSizeStyle {
  width?: string
  maxWidth?: string
}

export const drawerSizePixels: Record<DrawerPresetSize, string> = {
  small: '384px',
  medium: '672px',
  large: '1024px'
}

export const drawerSizeSummaries: Record<DrawerPresetSize, string> = {
  small: '384px',
  medium: '672px',
  large: '1024px'
}

export const getDrawerShellSizeStyle = (
  size: DrawerPresetSize,
  isDesktop: boolean
): DrawerShellSizeStyle => {
  if (!isDesktop) return {}

  return {
    width: '100%',
    maxWidth: drawerSizePixels[size] ?? drawerSizePixels.medium
  }
}
