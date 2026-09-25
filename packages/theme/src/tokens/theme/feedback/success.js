import { tokenRef } from '../../../scripts/refs.js';

export const success = {
  light: {
    success: tokenRef('primitives.green.200'),
    'success-border': tokenRef('primitives.alpha.green.400'),
    'success-contrast': tokenRef('primitives.green.800'),
  },
  dark: {
    success: tokenRef('primitives.green.900'),
    'success-border': tokenRef('primitives.alpha.green.400'),
    'success-contrast': tokenRef('primitives.green.400'),
  },
};

export default { success };
