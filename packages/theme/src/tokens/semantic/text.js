import { tokenRef } from '../token-ref.js'

export const text = {
  light: {
    'text-default': tokenRef('primitives.gray.900'),
    'text-muted': tokenRef('primitives.gray.650'),
    'text-disabled': tokenRef('primitives.gray.400'),
    'text-primary': tokenRef('brand.primary.primary-700'),
    'text-brand': tokenRef('brand.primary.primary-500'),
    'text-link': tokenRef('primitives.blue.600'),
    'text-link-hover': tokenRef('primitives.blue.700'),
    'text-contrast': tokenRef('primitives.gray.50')
  },
  dark: {
    'text-default': tokenRef('primitives.gray.50'),
    'text-muted': tokenRef('primitives.gray.300'),
    'text-disabled': tokenRef('primitives.gray.700'),
    'text-primary': tokenRef('brand.primary.primary-300'),
    'text-brand': tokenRef('brand.primary.primary-500'),
    'text-link': tokenRef('primitives.blue.200'),
    'text-link-hover': tokenRef('primitives.blue.200'),
    'text-contrast': tokenRef('primitives.base.black')
  }
}

export default { text }
