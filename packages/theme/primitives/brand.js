/**
 * BRAND + SURFACE PRIMITIVES TOKENS
 *
 * Generated from figma-reference-tokens-studio.
 */

import { brandColors } from '../colors-brand.js';
import { primitives } from './colors.js';

// Aliases:
// - surfaces are neutrals
// - accent is violet
export const surfacePrimitives = {
  surface: {
    0: primitives.base.white,
    50: primitives.neutral[50],
    100: primitives.neutral[100],
    200: primitives.neutral[200],
    300: primitives.neutral[300],
    400: primitives.neutral[400],
    500: primitives.neutral[500],
    600: primitives.neutral[600],
    700: primitives.neutral[700],
    800: primitives.neutral[800],
    900: primitives.neutral[900],
    950: primitives.neutral[950]
  }
};

export const brandPrimitives = {
  accent: {
    50: primitives.violet[50],
    100: primitives.violet[100],
    200: primitives.violet[200],
    300: primitives.violet[300],
    400: primitives.violet[400],
    500: primitives.violet[500],
    600: primitives.violet[600],
    700: primitives.violet[700],
    800: primitives.violet[800],
    900: primitives.violet[900],
    950: primitives.violet[950]
  },
  primary: {
    50: primitives.orange[50],
    100: primitives.orange[100],
    200: primitives.orange[200],
    300: primitives.orange[300],
    400: primitives.orange[400],
    500: primitives.orange[500],
    600: primitives.orange[600],
    700: primitives.orange[700],
    800: primitives.orange[800],
    900: primitives.orange[900],
    950: primitives.orange[950]
  },
  absolute: {
    white: primitives.neutral[50],
    black: primitives.neutral[950]
  }
};

export { brandColors };

export default {
  brandColors,
  brandPrimitives,
  surfacePrimitives,
};
