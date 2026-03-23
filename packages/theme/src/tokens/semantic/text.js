/**
 * SEMANTIC TEXT TOKENS
 *
 * Generated from figma-reference-tokens-studio.
 */

import { tokenRef } from '../build/refs.js';

export const textSemantic = {
  light: {
    default: tokenRef('primitives.neutral.900'),
    muted: tokenRef('primitives.neutral.600'),
    link: tokenRef('primitives.blue.600'),
    code: tokenRef('primitives.neutral.600'),
    linkHover: tokenRef('primitives.blue.700'),
    primary: tokenRef('brand.primary.primary-500'),
    primaryHover: tokenRef('brand.primary.primary-600'),
    accent: tokenRef('brand.accent.accent-500'),
    accentHover: tokenRef('brand.accent.accent-600'),
    dangerHover: tokenRef('primitives.red.500'),
    warningHover: tokenRef('primitives.yellow.500'),
    successHover: tokenRef('primitives.green.500'),
    success: tokenRef('primitives.green.600'),
    danger: tokenRef('primitives.red.600'),
    warning: tokenRef('primitives.yellow.600')
  },
  dark: {
    default: tokenRef('primitives.neutral.50'),
    muted: tokenRef('primitives.neutral.400'),
    link: tokenRef('primitives.blue.400'),
    code: tokenRef('primitives.neutral.400'),
    linkHover: tokenRef('primitives.blue.300'),
    primary: tokenRef('brand.primary.primary-500'),
    primaryHover: tokenRef('brand.primary.primary-400'),
    accent: tokenRef('brand.accent.accent-500'),
    accentHover: tokenRef('brand.accent.accent-400'),
    dangerHover: tokenRef('primitives.red.500'),
    warningHover: tokenRef('primitives.yellow.500'),
    successHover: tokenRef('primitives.green.500'),
    success: tokenRef('primitives.green.400'),
    danger: tokenRef('primitives.red.400'),
    warning: tokenRef('primitives.yellow.400'),
  }
};

export default {
  textSemantic,
};
