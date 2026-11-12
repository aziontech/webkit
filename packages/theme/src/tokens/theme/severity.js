import { tokenRef } from '../../scripts/refs.js'

export const severity = {
  light: {
    'severity-critical': tokenRef('primitives.red.600'),
    'severity-high': tokenRef('primitives.orange.600'),
    'severity-medium': tokenRef('primitives.yellow.700'),
    'severity-low': tokenRef('primitives.blue.600'),
    'severity-info': tokenRef('primitives.gray.500')
  },
  dark: {
    'severity-critical': tokenRef('primitives.red.400'),
    'severity-high': tokenRef('primitives.orange.400'),
    'severity-medium': tokenRef('primitives.yellow.500'),
    'severity-low': tokenRef('primitives.blue.400'),
    'severity-info': tokenRef('primitives.gray.400')
  }
}

export default { severity }
