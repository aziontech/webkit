import { tokenRef } from '../token-ref.js'

export const info = {
  light: {
    info: tokenRef('primitives.blue.200'),
    'info-border': tokenRef('primitives.alpha.blue.400'),
    'info-foreground': tokenRef('primitives.blue.800'),
    'info-mark': tokenRef('primitives.blue.500')
  },
  dark: {
    info: tokenRef('primitives.blue.900'),
    'info-border': tokenRef('primitives.alpha.blue.400'),
    'info-foreground': tokenRef('primitives.blue.200'),
    'info-mark': tokenRef('primitives.blue.400')
  }
}
