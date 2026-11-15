import { tokenRef } from '../../scripts/refs.js'

export const secondary = {
  light: {
    secondary: tokenRef('primitives.gray.950'),
    'secondary-mask': tokenRef('primitives.alpha.black.50'),
    'secondary-selected': tokenRef('primitives.gray.950'),
    'secondary-contrast': tokenRef('primitives.base.white')
  },
  dark: {
    secondary: tokenRef('primitives.base.white'),
    'secondary-mask': tokenRef('primitives.alpha.white.100'),
    'secondary-selected': tokenRef('primitives.base.white'),
    'secondary-contrast': tokenRef('primitives.base.black')
  }
}

export default { secondary }
