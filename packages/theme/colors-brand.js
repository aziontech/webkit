/**
 * BRAND COLORS TOKENS
 *
 * Organized brand colors consuming primitive colors.
 */

import { primitives } from './primitives/colors.js';

export const brandColors = {
  orange: primitives.orange[500],
  darkOrange: primitives.orange[600],
  lavander: primitives.violet[300],
  darkLavander: primitives.slate[900],
  blackLavander: primitives.slate[950],
  gray: primitives.neutral[200],
  mediumGray: primitives.neutral[500],
  darkGray: primitives.neutral[900],
  white: primitives.neutral[50],
  black: primitives.neutral[950],
};

export default {
  brand: brandColors,
};
