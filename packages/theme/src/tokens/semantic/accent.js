import { tokenRef } from '../token-ref.js'

export const accent = {
  light: {
    accent: tokenRef('primitives.blue.600'),
    'accent-mask': tokenRef('primitives.alpha.blue.100'),
    'accent-selected': tokenRef('primitives.blue.600'),
    'accent-foreground': tokenRef('primitives.base.white'),
    'brand-blue': tokenRef('primitives.blue.500'),
    'brand-blue-foreground': tokenRef('primitives.base.white')
  },
  dark: {
    accent: tokenRef('primitives.blue.200'),
    'accent-mask': tokenRef('primitives.alpha.blue.100'),
    'accent-selected': tokenRef('primitives.blue.200'),
    'accent-foreground': tokenRef('primitives.base.black'),
    'brand-blue': tokenRef('primitives.blue.500'),
    'brand-blue-foreground': tokenRef('primitives.base.white')
  }
}
