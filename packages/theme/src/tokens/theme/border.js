import { tokenRef } from '../../scripts/refs.js'

export const border = {
  light: {
    'border-default': tokenRef('primitives.alpha.black.100'),
    'border-muted': tokenRef('primitives.alpha.black.100'),
    'border-strong': tokenRef('primitives.base.black'),
    'border-selected': tokenRef('brand.primary.primary-500')
  },
  dark: {
    'border-default': tokenRef('primitives.alpha.white.100'),
    'border-muted': tokenRef('primitives.alpha.white.50'),
    'border-strong': tokenRef('primitives.base.white'),
    'border-selected': tokenRef('brand.primary.primary-500')
  }
}

export default { border }
