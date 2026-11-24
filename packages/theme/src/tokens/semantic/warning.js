import { tokenRef } from '../token-ref.js'

export const warning = {
  light: {
    warning: tokenRef('primitives.yellow.300'),
    'warning-border': tokenRef('primitives.alpha.yellow.500'),
    'warning-foreground': tokenRef('primitives.yellow.900'),
    'warning-mark': tokenRef('primitives.yellow.700')
  },
  dark: {
    warning: tokenRef('primitives.yellow.900'),
    'warning-border': tokenRef('primitives.alpha.yellow.500'),
    'warning-foreground': tokenRef('primitives.yellow.500'),
    'warning-mark': tokenRef('primitives.yellow.600')
  }
}
