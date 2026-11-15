import { tokenRef } from '../../scripts/refs.js'

export const border = {
  light: {
    'border-default': tokenRef('primitives.gray.275'),
    'border-muted': tokenRef('primitives.gray.250'),
    'border-input': tokenRef('primitives.gray.275'),
    'border-strong': tokenRef('primitives.base.black'),
    'border-selected': tokenRef('theme.primary.primary')
  },
  dark: {
    'border-default': tokenRef('primitives.gray.650'),
    'border-muted': tokenRef('primitives.gray.650'),
    'border-input': tokenRef('primitives.gray.650'),
    'border-strong': tokenRef('primitives.base.white'),
    'border-selected': tokenRef('theme.primary.primary')
  }
}

export default { border }
