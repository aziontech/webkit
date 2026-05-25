import { tokenRef } from '../../scripts/refs.js';

export const text = {
  light: {
    'text-default': tokenRef('primitives.gray.900'),
    'text-muted': tokenRef('primitives.gray.600'),
    'text-disabled': tokenRef('primitives.gray.600'),
    'text-link': tokenRef('theme.accent.accent'),
  },
  dark: {
    'text-default': tokenRef('primitives.gray.50'),
    'text-muted': tokenRef('primitives.gray.400'),
    'text-disabled': tokenRef('primitives.gray.600'),
    'text-link': tokenRef('theme.accent.accent'),
  },
};

export default { text };
