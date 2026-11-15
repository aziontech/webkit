import { tokenRef } from '../token-ref.js'

export const background = {
  light: {
    'bg-canvas': tokenRef('primitives.gray.100'),
    'bg-surface': tokenRef('primitives.base.white'),
    'bg-surface-raised': tokenRef('primitives.base.white'),
    'bg-mask': tokenRef('primitives.alpha.black.50'),
    'bg-surface-overlay': tokenRef('primitives.gray.50'),
    'bg-placeholder': tokenRef('primitives.alpha.black.100'),
    'bg-placeholder-highlight': tokenRef('primitives.alpha.white.600'),
    'bg-hover': tokenRef('primitives.alpha.black.100'),
    'bg-active': tokenRef('primitives.alpha.black.50'),
    'bg-backdrop': tokenRef('primitives.alpha.black.800'),
    'bg-selected': tokenRef('primitives.gray.200'),
    'bg-contrast': tokenRef('primitives.gray.900'),
    'bg-disabled': tokenRef('primitives.gray.200')
  },
  dark: {
    'bg-canvas': tokenRef('primitives.base.black'),
    'bg-surface': tokenRef('primitives.gray.950'),
    'bg-surface-raised': tokenRef('primitives.gray.900'),
    'bg-mask': tokenRef('primitives.alpha.white.50'),
    'bg-surface-overlay': tokenRef('primitives.gray.700'),
    'bg-placeholder': tokenRef('primitives.alpha.white.100'),
    'bg-placeholder-highlight': tokenRef('primitives.alpha.white.100'),
    'bg-hover': tokenRef('primitives.alpha.white.100'),
    'bg-active': tokenRef('primitives.alpha.white.50'),
    'bg-backdrop': tokenRef('primitives.alpha.black.800'),
    'bg-selected': tokenRef('primitives.gray.750'),
    'bg-contrast': tokenRef('primitives.gray.50'),
    'bg-disabled': tokenRef('primitives.gray.800')
  }
}

export default { background }
