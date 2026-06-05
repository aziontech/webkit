import { tokenRef } from '../../../scripts/refs.js';

export const info = {
  light: {
    info: tokenRef('primitives.blue.100'),
    'info-border': tokenRef('primitives.alpha.violet.400'),
    'info-contrast': tokenRef('primitives.blue.700'),
  },
  dark: {
    info: tokenRef('primitives.blue.900'),
    'info-border': tokenRef('primitives.alpha.blue.500'),
    'info-contrast': tokenRef('primitives.blue.300'),
  },
};

export default { info };
