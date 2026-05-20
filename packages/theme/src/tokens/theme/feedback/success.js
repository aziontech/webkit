import { tokenRef } from '../../../scripts/refs.js';

export const success = {
  light: {
    success: tokenRef('primitives.green.50'),
    'success-border': tokenRef('primitives.alpha.green.600'),
    'success-contrast': tokenRef('primitives.green.700'),
  },
  dark: {
    success: tokenRef('primitives.green.950'),
    'success-border': tokenRef('primitives.alpha.green.400'),
    'success-contrast': tokenRef('primitives.green.500'),
  },
};

export default { success };
