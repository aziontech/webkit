import { tokenRef } from '../../scripts/refs.js'

export const ring = {
  light: {
    'ring-color': tokenRef('primitives.gray.600')
  },
  dark: {
    'ring-color': tokenRef('primitives.gray.500')
  }
}

export default { ring }
