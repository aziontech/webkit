import { tokenRef } from '../../scripts/refs.js'

export const primary = {
  light: {
    primary: tokenRef('brand.primary.primary-500'),
    'primary-mask': tokenRef('primitives.alpha.orange.200'),
    'primary-selected': tokenRef('primitives.alpha.orange.200'),
    'primary-contrast': tokenRef('primitives.base.black')
  },
  dark: {
    primary: tokenRef('brand.primary.primary-500'),
    'primary-mask': tokenRef('primitives.alpha.orange.200'),
    'primary-selected': tokenRef('primitives.alpha.orange.200'),
    'primary-contrast': tokenRef('primitives.base.white')
  }
}

export default { primary }
