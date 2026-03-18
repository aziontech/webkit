/**
 * SEMANTIC BACKGROUND TOKENS
 *
 * Generated from figma-reference-tokens-studio.
 */

import { tokenRef } from '../build/refs.js';

export const backgroundSemantic = {
  light: {
    bgLayer1: tokenRef('brand.surfaces.surface-0'),
    bgLayer2: tokenRef('brand.surfaces.surface-50'),
    bgBase: tokenRef('brand.surfaces.surface-0'),
    bgCanvas: tokenRef('brand.surfaces.surface-100'),
    bgLayer1Hover: tokenRef('brand.surfaces.surface-50'),
    bgLayer2Hover: tokenRef('brand.surfaces.surface-100'),
    bgDangerHover: tokenRef('primitives.red.400'),
    bgWarningHover: tokenRef('primitives.yellow.400'),
    bgSuccessHover: tokenRef('primitives.green.400'),
    bgSuccess: tokenRef('primitives.green.200'),
    bgDanger: tokenRef('primitives.red.200'),
    bgWarning: tokenRef('primitives.yellow.200'),
    bgBackdrop: tokenRef('#00000040'),
    bgPrimaryHover: tokenRef('brand.primary.primary-600'),
    bgPrimary: tokenRef('brand.primary.primary-500')
  },
  dark: {
    bgLayer1: tokenRef('brand.surfaces.surface-800'),
    bgLayer2: tokenRef('brand.surfaces.surface-700'),
    bgBase: tokenRef('brand.surfaces.surface-900'),
    bgCanvas: tokenRef('brand.surfaces.surface-950'),
    bgLayer1Hover: tokenRef('brand.surfaces.surface-700'),
    bgLayer2Hover: tokenRef('brand.surfaces.surface-600'),
    bgDangerHover: tokenRef('primitives.red.600'),
    bgWarningHover: tokenRef('primitives.yellow.600'),
    bgSuccessHover: tokenRef('primitives.green.600'),
    bgSuccess: tokenRef('primitives.green.800'),
    bgDanger: tokenRef('primitives.red.800'),
    bgWarning: tokenRef('primitives.yellow.800'),
    bgBackdrop: tokenRef('#00000040'),
    bgPrimaryHover: tokenRef('brand.primary.primary-400'),
    bgPrimary: tokenRef('brand.primary.primary-500')
  },
};

export default {
  backgroundSemantic,
};
