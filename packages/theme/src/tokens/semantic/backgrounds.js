/**
 * SEMANTIC BACKGROUND TOKENS
 *
 * Generated from figma-reference-tokens-studio.
 */

import { tokenRef } from '../build/refs.js'

export const backgroundSemantic = {
  light: {
    surfaceRaised: tokenRef('brand.surfaces.surface-0'),
    surfaceOverlay: tokenRef('brand.surfaces.surface-50'),
    surface: tokenRef('brand.surfaces.surface-0'),
    canvas: tokenRef('brand.surfaces.surface-100'),
    dangerHover: tokenRef('primitives.red.400'),
    warningHover: tokenRef('primitives.yellow.400'),
    successHover: tokenRef('primitives.green.400'),
    success: tokenRef('primitives.green.200'),
    danger: tokenRef('primitives.red.200'),
    warning: tokenRef('primitives.yellow.200'),
    backdrop: tokenRef('primitives.alpha.neutral.25'),
    primaryHover: tokenRef('brand.primary.primary-600'),
    primary: tokenRef('brand.primary.primary-500'),
    primaryMask: tokenRef('primitives.alpha.brand.primary.65')
  },
  dark: {
    surfaceRaised: tokenRef('brand.surfaces.surface-800'),
    surfaceOverlay: tokenRef('brand.surfaces.surface-700'),
    surface: tokenRef('brand.surfaces.surface-900'),
    canvas: tokenRef('brand.surfaces.surface-950'),
    dangerHover: tokenRef('primitives.red.600'),
    warningHover: tokenRef('primitives.yellow.600'),
    successHover: tokenRef('primitives.green.600'),
    success: tokenRef('primitives.green.800'),
    danger: tokenRef('primitives.red.800'),
    warning: tokenRef('primitives.yellow.800'),
    backdrop: tokenRef('primitives.alpha.neutral.25'),
    primaryHover: tokenRef('brand.primary.primary-400'),
    primary: tokenRef('brand.primary.primary-500'),
    primaryMask: tokenRef('primitives.alpha.brand.primary.65')
  }
}

export default {
  backgroundSemantic
}
