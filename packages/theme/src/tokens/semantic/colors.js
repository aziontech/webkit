/**
 * SEMANTIC COLOR TOKENS
 *
 * Single source of truth for semantic color tokens.
 *
 * - `semanticColorsData`: token refs grouped by category (`text`, `background`,
 *   `border`) and mode (`light`, `dark`). Consumed by `tokens/build/css-vars.js`
 *   to emit `:root` / `.dark` CSS variables.
 * - `semanticColors`: derived map of `var(--…)` strings, grouped by category,
 *   consumed by `tokens/theme.js` to extend Tailwind's `textColor`,
 *   `backgroundColor`, and `borderColor`. Generates utilities like
 *   `text-default`, `bg-surface`, `border-danger` natively — no plugin needed.
 *
 * Adding a new semantic color: add a key under both `light` and `dark` in the
 * relevant category here. The CSS variable and the Tailwind utility are both
 * derived automatically.
 */

import { tokenRef } from '../build/refs.js';

export const semanticColorsData = {
  text: {
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
      warning: tokenRef('primitives.yellow.600'),
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
    },
  },
  background: {
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
      primaryMask: tokenRef('primitives.alpha.brand.primary.65'),
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
      primaryMask: tokenRef('primitives.alpha.brand.primary.65'),
    },
  },
  border: {
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
      subtle: tokenRef('brand.surfaces.surface-200'),
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
      subtle: tokenRef('brand.surfaces.surface-700'),
    },
  },
};

const toCssVarMap = (category, mode) =>
  Object.fromEntries(Object.keys(mode).map((key) => [key, `var(--${category}-${key})`]));

export const semanticColors = {
  text: toCssVarMap('text', semanticColorsData.text.light),
  background: toCssVarMap('background', semanticColorsData.background.light),
  border: toCssVarMap('border', semanticColorsData.border.light),
};

export default {
  semanticColors,
  semanticColorsData,
};
