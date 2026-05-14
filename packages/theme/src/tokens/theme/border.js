import { tokenRef } from '../../scripts/refs.js';

export const border = {
  light: {
    'border-default': tokenRef('theme.surfaces.surface-200'),
    'border-muted': tokenRef('theme.surfaces.surface-100'),
    'border-strong': tokenRef('primitives.base.black'),
    'border-selected': tokenRef('brand.primary.primary-500'),
  },
  dark: {
    'border-default': tokenRef('theme.surfaces.surface-800'),
    'border-muted': tokenRef('theme.surfaces.surface-700'),
    'border-strong': tokenRef('primitives.base.white'),
    'border-selected': tokenRef('brand.primary.primary-500'),
  },
};

export default { border };
