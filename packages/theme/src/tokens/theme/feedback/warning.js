import { tokenRef } from '../../../scripts/refs.js'

export const warning = {
  light: {
    warning: tokenRef('primitives.yellow.300'),
    'warning-border': tokenRef('primitives.alpha.yellow.500'),
    'warning-contrast': tokenRef('primitives.yellow.900')
  },
  dark: {
    warning: tokenRef('primitives.yellow.900'),
    'warning-border': tokenRef('primitives.alpha.yellow.500'),
    'warning-contrast': tokenRef('primitives.yellow.500')
  }
}

export default { warning }
