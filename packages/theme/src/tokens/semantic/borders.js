/**
 * SEMANTIC BORDER TOKENS
 *
 * Generated from figma-reference-tokens-studio.
 */

import { tokenRef } from '../build/refs.js';

export const borderSemantic = {
  light: {
    default: tokenRef('brand.surfaces.surface-100'),
    strong: tokenRef('primitives.base.black'),
    warning: tokenRef('primitives.yellow.600'),
    success: tokenRef('primitives.green.600'),
    danger: tokenRef('primitives.red.600'),
    primary: tokenRef('brand.primary.primary-500'),
    accent: tokenRef('brand.accent.accent-500'),
    warningHover: tokenRef('primitives.yellow.500'),
    successHover: tokenRef('primitives.green.500'),
    dangerHover: tokenRef('primitives.red.500'),
    primaryHover: tokenRef('brand.primary.primary-600'),
    accentHover: tokenRef('brand.accent.accent-600'),
    subtle: tokenRef('brand.surfaces.surface-200')
  },
  dark: {
    default: tokenRef('brand.surfaces.surface-800'),
    strong: tokenRef('primitives.base.white'),
    warning: tokenRef('primitives.yellow.400'),
    success: tokenRef('primitives.green.400'),
    danger: tokenRef('primitives.red.400'),
    primary: tokenRef('brand.primary.primary-500'),
    accent: tokenRef('brand.accent.accent-500'),
    warningHover: tokenRef('primitives.yellow.500'),
    successHover: tokenRef('primitives.green.500'),
    dangerHover: tokenRef('primitives.red.500'),
    primaryHover: tokenRef('brand.primary.primary-400'),
    accentHover: tokenRef('brand.accent.accent-400'),
    subtle: tokenRef('brand.surfaces.surface-700')
  },
};

export default {
  borderSemantic,
};
