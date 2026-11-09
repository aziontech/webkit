import { tokenRef } from '../../scripts/refs.js'

export const accent = {
  light: {
    accent: tokenRef('primitives.blue.500'),
    'accent-mask': tokenRef('primitives.alpha.blue.100'),
    'accent-selected': tokenRef('primitives.blue.500'),
    'accent-contrast': tokenRef('primitives.base.black')
  },
  dark: {
    accent: tokenRef('primitives.blue.500'),
    'accent-mask': tokenRef('primitives.alpha.blue.100'),
    'accent-selected': tokenRef('primitives.blue.500'),
    'accent-contrast': tokenRef('primitives.base.black')
  }
}

export default { accent }
