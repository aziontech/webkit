import { tokenRef } from '../../scripts/refs.js'

export const border = {
  light: {
    'border-default': tokenRef('theme.surfaces.surface-275'),
    'border-muted': tokenRef('theme.surfaces.surface-150'),
    'border-strong': tokenRef('primitives.base.black'),
    'border-selected': tokenRef('brand.primary.primary-500')
  },
  dark: {
    'border-default': tokenRef('theme.surfaces.surface-750'),
    'border-muted': tokenRef('theme.surfaces.surface-775'),
    'border-strong': tokenRef('primitives.base.white'),
    'border-selected': tokenRef('brand.primary.primary-500')
  }
}

export default { border }
