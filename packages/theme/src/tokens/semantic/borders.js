/**
 * SEMANTIC BORDER TOKENS
 *
 * Generated from figma-reference-tokens-studio.
 */

import { tokenRef } from '../build/refs.js';

export const borderSemantic = {
  light: {
    borderDefault: tokenRef('brand.surfaces.surface-100'),
    borderStrong: tokenRef('primitives.base.black'),
    borderWarning: tokenRef('primitives.yellow.600'),
    borderSuccess: tokenRef('primitives.green.600'),
    borderDanger: tokenRef('primitives.red.600'),
    borderPrimary: tokenRef('brand.primary.primary-500'),
    borderAccent: tokenRef('brand.accent.accent-500'),
    borderWarningHover: tokenRef('primitives.yellow.500'),
    borderSuccessHover: tokenRef('primitives.green.500'),
    borderDangerHover: tokenRef('primitives.red.500'),
    borderPrimaryHover: tokenRef('brand.primary.primary-600'),
    borderAccentHover: tokenRef('brand.accent.accent-600'),
    borderSubtle: tokenRef('brand.surfaces.surface-200')
  },
  dark: {
    borderDefault: tokenRef('brand.surfaces.surface-800'),
    borderStrong: tokenRef('primitives.base.white'),
    borderWarning: tokenRef('primitives.yellow.400'),
    borderSuccess: tokenRef('primitives.green.400'),
    borderDanger: tokenRef('primitives.red.400'),
    borderPrimary: tokenRef('brand.primary.primary-500'),
    borderAccent: tokenRef('brand.accent.accent-500'),
    borderWarningHover: tokenRef('primitives.yellow.500'),
    borderSuccessHover: tokenRef('primitives.green.500'),
    borderDangerHover: tokenRef('primitives.red.500'),
    borderPrimaryHover: tokenRef('brand.primary.primary-400'),
    borderAccentHover: tokenRef('brand.accent.accent-400'),
    borderSubtle: tokenRef('brand.surfaces.surface-700')
  },
};

export default {
  borderSemantic,
};
