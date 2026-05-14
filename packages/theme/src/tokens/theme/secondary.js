import { tokenRef } from '../../scripts/refs.js';

export const secondary = {
  light: {
    secondary: tokenRef('primitives.surface.950'),
    'secondary-mask': tokenRef('primitives.alpha.black.50'),
    'secondary-selected': tokenRef('primitives.surface.950'),
    'secondary-hover': tokenRef('brand.primary.primary-600'),
    'secondary-active': tokenRef('brand.primary.primary-600'),
    'secondary-contrast': tokenRef('primitives.base.white'),
  },
  dark: {
    secondary: tokenRef('primitives.surface.0'),
    'secondary-mask': tokenRef('primitives.alpha.white.100'),
    'secondary-selected': tokenRef('primitives.surface.0'),
    'secondary-hover': tokenRef('primitives.surface.300'),
    'secondary-active': tokenRef('brand.primary.primary-600'),
    'secondary-contrast': tokenRef('primitives.base.black'),
  },
};

export default { secondary };
