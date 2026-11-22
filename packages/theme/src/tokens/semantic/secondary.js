import { tokenRef } from '../token-ref.js'

export const secondary = {
  light: {
    secondary: tokenRef('primitives.gray.950'),
    'secondary-mask': tokenRef('primitives.alpha.black.50'),
    'secondary-selected': tokenRef('primitives.gray.950'),
    'secondary-foreground': tokenRef('primitives.base.white')
  },
  dark: {
    secondary: tokenRef('primitives.base.white'),
    'secondary-mask': tokenRef('primitives.alpha.white.100'),
    'secondary-selected': tokenRef('primitives.base.white'),
    'secondary-foreground': tokenRef('primitives.base.black')
  }
}
