export const drawerSizePixels = {
  small: '384px',
  medium: '672px',
  large: '1024px'
}

export const drawerSizeSummaries = {
  small: '384px',
  medium: '672px',
  large: '1024px'
}

/**
 * @param {'small' | 'medium' | 'large'} size
 * @param {boolean} isDesktop
 */
export const getDrawerShellSizeStyle = (size, isDesktop) => {
  if (!isDesktop) return {}

  return {
    width: '100%',
    maxWidth: drawerSizePixels[size] ?? drawerSizePixels.medium
  }
}
