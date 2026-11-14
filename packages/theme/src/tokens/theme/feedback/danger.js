import { tokenRef } from '../../../scripts/refs.js'

export const danger = {
  light: {
    danger: tokenRef('primitives.red.200'),
    'danger-border': tokenRef('primitives.alpha.red.400'),
    'danger-contrast': tokenRef('primitives.red.900')
  },
  dark: {
    danger: tokenRef('primitives.red.800'),
    'danger-border': tokenRef('primitives.alpha.red.400'),
    'danger-contrast': tokenRef('primitives.red.100')
  }
}

export default { danger }
