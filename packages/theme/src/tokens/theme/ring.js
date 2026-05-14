import { tokenRef } from '../../scripts/refs.js';

export const ring = {
  light: {
    'ring-color': tokenRef('theme.surfaces.surface-950'),
  },
  dark: {
    'ring-color': tokenRef('theme.surfaces.surface-0'),
  },
};

export default { ring };
