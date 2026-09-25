import { tokenRef } from '../../scripts/refs.js'

export const background = {
  light: {
    'bg-canvas': tokenRef('theme.surfaces.surface-50'),
    'bg-surface': tokenRef('theme.surfaces.surface-0'),
    'bg-surface-raised': tokenRef('theme.surfaces.surface-0'),
    'bg-mask': tokenRef('primitives.alpha.black.50'),
    'bg-surface-overlay': tokenRef('theme.surfaces.surface-50'),
    'bg-hover': tokenRef('primitives.alpha.black.100'),
    'bg-active': tokenRef('primitives.alpha.black.50'),
    'bg-backdrop': tokenRef('primitives.alpha.black.800'),
    'bg-selected': tokenRef('theme.surfaces.surface-200'),
    'bg-contrast': tokenRef('theme.surfaces.surface-900'),
    'bg-disabled': tokenRef('theme.surfaces.surface-200')
  },
  dark: {
    'bg-canvas': tokenRef('theme.surfaces.surface-950'),
    'bg-surface': tokenRef('theme.surfaces.surface-950'),
    'bg-surface-raised': tokenRef('theme.surfaces.surface-900'),
    'bg-mask': tokenRef('primitives.alpha.white.50'),
    'bg-surface-overlay': tokenRef('theme.surfaces.surface-700'),
    'bg-hover': tokenRef('primitives.alpha.black.200'),
    'bg-active': tokenRef('primitives.alpha.black.100'),
    'bg-backdrop': tokenRef('primitives.alpha.black.800'),
    'bg-selected': tokenRef('theme.surfaces.surface-800'),
    'bg-contrast': tokenRef('theme.surfaces.surface-50'),
    'bg-disabled': tokenRef('theme.surfaces.surface-800')
  }
}

export default { background }
