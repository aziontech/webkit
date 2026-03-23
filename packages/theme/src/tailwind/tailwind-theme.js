/**
 * Tailwind CSS Configuration for @aziontech/theme
 *
 * This file exports a Tailwind config with all design tokens from the token system.
 * Uses CSS variables for semantic tokens, enabling automatic theme switching.
 *
 * Usage:
 * ```javascript
 * // tailwind.config.js
 * import { theme } from '@aziontech/theme/tailwind/tailwind-theme.js';
 * import flatColorsPlugin from '@aziontech/theme/tailwind/tailwind-flat-colors.js';
 *
 * export default {
 *   theme,
 *   plugins: [flatColorsPlugin],
 * };
 * ```
 *
 * For theme switching to work, ensure CSS variables are injected:
 * ```javascript
 * import { injectCssVars } from '@aziontech/theme/tokens';
 * injectCssVars();
 * ```
 */

import { primitives } from '../tokens/primitives/colors.js';
import { brandPrimitives, surfacePrimitives } from '../tokens/primitives/brand.js';

export const theme = {
  extend: {
    colors: {
      base: {
        white: primitives.base.white,
        black: primitives.base.black,
      },
      brand: {
        primary: brandPrimitives.primary,
        accent: brandPrimitives.accent,
      },
      surface: surfacePrimitives.surface,
      orange: primitives.orange,
      violet: primitives.violet,
      neutral: primitives.neutral,
      gray: primitives.gray,
      slate: primitives.slate,
      red: primitives.red,
      green: primitives.green,
      yellow: primitives.yellow,
      blue: primitives.blue,
    },
  },
};

export default { theme };
