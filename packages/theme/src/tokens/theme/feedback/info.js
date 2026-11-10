import { tokenRef } from '../../../scripts/refs.js'

export const info = {
  light: {
    info: tokenRef('primitives.blue.200'),
    'info-border': tokenRef('primitives.alpha.blue.400'),
    'info-contrast': tokenRef('primitives.blue.800')
  },
  dark: {
    info: tokenRef('primitives.blue.900'),
    'info-border': tokenRef('primitives.alpha.blue.400'),
    'info-contrast': tokenRef('primitives.blue.300')
  }
}

export default { info }
