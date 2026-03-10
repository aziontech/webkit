/**
 * CSS variables initializer for tokens.
 */

import { primitives } from '../primitives/colors.js';
import { surfacePrimitives, brandPrimitives } from '../primitives/brand.js';
import { textSemantic } from '../semantic/text.js';
import { backgroundSemantic } from '../semantic/backgrounds.js';
import { borderSemantic } from '../semantic/borders.js';
import { resolveRefsToCssVars } from './resolve.js';

export const createCssVars = () =>
  resolveRefsToCssVars({
    primitives,
    surfacePrimitives,
    brandPrimitives,
    textSemantic,
    backgroundSemantic,
    borderSemantic,
  });

export const cssVarsString = () => {
  const { light, dark } = createCssVars();
  const format = (vars) =>
    Object.entries(vars)
      .map(([key, value]) => `  ${key}: ${value};`)
      .join('\n');

  return [
    `:root, [data-theme=light], .azion.azion-light {\n${format(light)}\n}`,
    `[data-theme=dark], .dark, .azion.azion-dark {\n${format(dark)}\n}`,
  ].join('\n\n');
};

export const injectCssVars = () => {
  const style = document.createElement('style');
  style.setAttribute('data-azion-tokens', 'true');
  style.textContent = cssVarsString();
  document.head.appendChild(style);
  return style;
};
