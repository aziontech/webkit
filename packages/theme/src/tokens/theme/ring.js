import { tokenRef } from '../../scripts/refs.js'

export const ring = {
  light: {
    'ring-color': tokenRef('theme.surfaces.surface-600')
  },
  dark: {
    'ring-color': tokenRef('theme.surfaces.surface-500')
  }
}

export default { ring }
