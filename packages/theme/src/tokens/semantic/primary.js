import { tokenRef } from '../token-ref.js'

export const primary = {
  light: {
    primary: tokenRef('brand.primary.primary-500'),
    'primary-mask': tokenRef('primitives.alpha.orange.200'),
    'primary-selected': tokenRef('primitives.alpha.orange.200'),
    'primary-foreground': tokenRef('primitives.base.black')
  },
  dark: {
    primary: tokenRef('brand.primary.primary-500'),
    'primary-mask': tokenRef('primitives.alpha.orange.200'),
    'primary-selected': tokenRef('primitives.alpha.orange.200'),
    'primary-foreground': tokenRef('primitives.base.black')
  }
}
