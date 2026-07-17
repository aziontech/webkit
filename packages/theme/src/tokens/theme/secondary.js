import { tokenRef } from '../../scripts/refs.js'

export const secondary = {
  light: {
    secondary: tokenRef('theme.surfaces.surface-950'),
    'secondary-mask': tokenRef('primitives.alpha.black.50'),
    'secondary-selected': tokenRef('theme.surfaces.surface-950'),
    'secondary-contrast': tokenRef('primitives.base.white')
  },
  dark: {
    secondary: tokenRef('theme.surfaces.surface-0'),
    'secondary-mask': tokenRef('primitives.alpha.white.100'),
    'secondary-selected': tokenRef('theme.surfaces.surface-0'),
    'secondary-contrast': tokenRef('primitives.base.black')
  }
}

export default { secondary }
