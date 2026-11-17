import { tokenRef } from '../token-ref.js'

export const danger = {
  light: {
    danger: tokenRef('primitives.red.200'),
    'danger-border': tokenRef('primitives.red.400'),
    'danger-foreground': tokenRef('primitives.red.900'),
    'danger-mark': tokenRef('primitives.red.500')
  },
  dark: {
    danger: tokenRef('primitives.red.800'),
    'danger-border': tokenRef('primitives.red.400'),
    'danger-foreground': tokenRef('primitives.red.100'),
    'danger-mark': tokenRef('primitives.red.300')
  }
}

export default { danger }
