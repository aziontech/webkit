import { tokenRef } from '../../scripts/refs.js';

export const accent = {
  light: {
    accent: tokenRef('brand.accent.accent-600'),
    'accent-mask': tokenRef('primitives.alpha.violet.50'),
    'accent-selected': tokenRef('brand.accent.accent-500'),
    'accent-hover': tokenRef('brand.accent.accent-600'),
    'accent-active': tokenRef('brand.accent.accent-600'),
    'accent-contrast': tokenRef('primitives.base.black'),
  },
  dark: {
    accent: tokenRef('brand.accent.accent-500'),
    'accent-mask': tokenRef('primitives.alpha.violet.100'),
    'accent-selected': tokenRef('brand.accent.accent-500'),
    'accent-hover': tokenRef('brand.accent.accent-600'),
    'accent-active': tokenRef('brand.accent.accent-600'),
    'accent-contrast': tokenRef('primitives.base.black'),
  },
};

export default { accent };
