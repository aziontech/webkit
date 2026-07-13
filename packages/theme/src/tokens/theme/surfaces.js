import { tokenRef } from '../../scripts/refs.js'

const shared = {
  'surface-0': tokenRef('primitives.base.white'),
  'surface-50': tokenRef('primitives.gray.50'),
  'surface-100': tokenRef('primitives.gray.100'),
  'surface-200': tokenRef('primitives.gray.200'),
  'surface-300': tokenRef('primitives.gray.300'),
  'surface-400': tokenRef('primitives.gray.400'),
  'surface-500': tokenRef('primitives.gray.500'),
  'surface-600': tokenRef('primitives.gray.600'),
  'surface-700': tokenRef('primitives.gray.700'),
  'surface-800': tokenRef('primitives.gray.800'),
  'surface-900': tokenRef('primitives.gray.900'),
  'surface-950': tokenRef('primitives.gray.950')
}

export const surfaces = {
  light: shared,
  dark: shared
}

export default { surfaces }
