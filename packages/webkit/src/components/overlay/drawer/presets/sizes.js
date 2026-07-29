/**
 * Drawer width presets — edge panels are always full viewport height;
 * `size` prop controls max-width from `md` up.
 */
export const drawerSizePixels = {
  small: '384px',
  medium: '672px',
  large: '1024px'
}

/**
 * Literal panel widths, deliberately not container tokens: an edge panel is
 * sized against the viewport it covers, not against a reading measure, so it
 * does not move when the container scale is retuned.
 */
export const drawerSizeSummaries = {
  small: '384px',
  medium: '672px',
  large: '1024px'
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
