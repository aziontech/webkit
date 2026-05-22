/**
 * Tokens public exports.
 */

export { createCssVars, cssVarsString, injectCssVars } from '../scripts/css-vars.js';
export { resolveRefsToCssVars } from '../scripts/resolve.js';
export * from './primitives/colors/colors.js';
export { semanticColors, semanticColorsData } from './semantic/colors.js';
export * from './theme.js';

import { semanticColorsData } from './semantic/colors.js';

export const textSemantic = semanticColorsData.text;
export const backgroundSemantic = semanticColorsData.background;
export const borderSemantic = semanticColorsData.border;
