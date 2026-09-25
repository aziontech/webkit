import { tokenRef } from '../../scripts/refs.js';

export const primary = {
  light: {
    primary: tokenRef('brand.primary.primary-500'),
    'primary-mask': tokenRef('primitives.alpha.orange.100'),
    'primary-selected': tokenRef('primitives.alpha.orange.100'),
    'primary-contrast': tokenRef('primitives.base.black'),
  },
  dark: {
    primary: tokenRef('brand.primary.primary-500'),
    'primary-mask': tokenRef('primitives.alpha.orange.100'),
    'primary-selected': tokenRef('primitives.alpha.orange.100'),
    'primary-contrast': tokenRef('primitives.base.white'),
  },
};

export default { primary };
