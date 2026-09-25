import { tokenRef } from '../../../scripts/refs.js';

export const warning = {
  light: {
    warning: tokenRef('primitives.yellow.200'),
    'warning-border': tokenRef('primitives.alpha.yellow.500'),
    'warning-contrast': tokenRef('primitives.yellow.800'),
  },
  dark: {
    warning: tokenRef('primitives.yellow.900'),
    'warning-border': tokenRef('primitives.alpha.yellow.500'),
    'warning-contrast': tokenRef('primitives.yellow.500'),
  },
};

export default { warning };
