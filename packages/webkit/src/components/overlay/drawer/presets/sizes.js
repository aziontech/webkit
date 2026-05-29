/**
 * Drawer width presets — edge panels are always full viewport height;
 * `size` prop controls max-width from `md` up.
 */
export const drawerSizePixels = {
  small: '384px',
  medium: '672px',
  large: '1024px'
}

export const drawerSizeSummaries = {
  small: '384px (container-sm)',
  medium: '672px (container-2xl)',
  large: '1024px (container-5xl)'
}

/**
 * Desktop shell width — inline style (reliable across Tailwind JIT + Storybook `important`).
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
