import { tokenRef } from '../../../scripts/refs.js';

export const danger = {
  light: {
    danger: tokenRef('primitives.red.50'),
    'danger-border': tokenRef('primitives.alpha.red.600'),
    'danger-contrast': tokenRef('primitives.red.600'),
  },
  dark: {
    danger: tokenRef('primitives.red.950'),
    'danger-border': tokenRef('primitives.alpha.red.500'),
    'danger-contrast': tokenRef('primitives.red.400'),
  },
};

export default { danger };
