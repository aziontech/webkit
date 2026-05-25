import { tokenRef } from '../../../scripts/refs.js';

export const info = {
  light: {
    info: tokenRef('brand.accent.accent-50'),
    'info-border': tokenRef('primitives.alpha.violet.600'),
    'info-contrast': tokenRef('brand.accent.accent-500'),
  },
  dark: {
    info: tokenRef('brand.accent.accent-950'),
    'info-border': tokenRef('primitives.alpha.violet.400'),
    'info-contrast': tokenRef('primitives.violet.500'),
  },
};

export default { info };
