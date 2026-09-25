import { tokenRef } from '../../../scripts/refs.js';

export const warning = {
  light: {
    warning: tokenRef('primitives.yellow.50'),
    'warning-border': tokenRef('primitives.alpha.yellow.600'),
    'warning-contrast': tokenRef('primitives.yellow.700'),
  },
  dark: {
    warning: tokenRef('primitives.yellow.950'),
    'warning-border': tokenRef('primitives.alpha.yellow.300'),
    'warning-contrast': tokenRef('primitives.yellow.300'),
  },
};

export default { warning };
