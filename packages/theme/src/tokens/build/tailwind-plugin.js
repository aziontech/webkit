/**
 * Tailwind plugin to generate static light/dark utilities from semantic tokens.
 *
 * This plugin emits concrete values for both light and dark themes,
 * supporting:
 * - Background color utilities
 * - Text color utilities
 * - Border color utilities
 * - Both dark selectors (.dark and .azion.azion-dark)
 */

// Lazy-require to avoid hard dependency for consumers
const plugin = (() => {
  try {
    return require('tailwindcss/plugin');
  } catch {
    return (handler) => handler;
  }
})();

import { primitives } from '../primitives/colors.js';
import { surfacePrimitives, brandPrimitives } from '../primitives/brand.js';
import { textSemantic } from '../semantic/text.js';
import { backgroundSemantic } from '../semantic/backgrounds.js';
import { borderSemantic } from '../semantic/borders.js';
import { resolveRefsToCssVars } from './resolve.js';

const kebab = (value) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();

const stripPrefix = (value, prefix) =>
  value.startsWith(prefix) ? value.slice(prefix.length) : value;

const resolveTokenMaps = () =>
  resolveRefsToCssVars({
    primitives,
    surfacePrimitives,
    brandPrimitives,
    textSemantic,
    backgroundSemantic,
    borderSemantic,
  });

const getValue = (map, key) => map[`--${key}`];

const addUtility = (
  utilities,
  darkUtilities,
  selectors,
  className,
  property,
  lightValue,
  darkValue
) => {
  if (lightValue) {
    utilities[className] = { [property]: lightValue };
  }
  if (darkValue) {
    selectors.forEach((selector) => {
      darkUtilities[`${selector} ${className}`] = { [property]: darkValue };
    });
  }
};

/**
 * Generate semantic token utilities for light and dark modes
 *
 * Usage:
 * - Background: bg-layer1, bg-layer2, bg-base, bg-canvas, etc.
 * - Text: text-base, text-muted, text-link, text-primary, etc.
 * - Border: border-base, border-warning, border-danger, border-primary, etc.
 */
export const tokenUtilities = (options = {}) => {
  const { light, dark } = resolveTokenMaps();
  const darkSelectors = [options.darkSelector ?? '.dark', ...(options.extraDarkSelectors ?? ['.azion.azion-dark'])];

  const utilities = {};
  const darkUtilities = {};

  // Background color utilities
  Object.keys(backgroundSemantic.light).forEach((key) => {
    const suffix = kebab(stripPrefix(key, 'bg'));
    const className = `.bg-${suffix}`;
    addUtility(
      utilities,
      darkUtilities,
      darkSelectors,
      className,
      'backgroundColor',
      getValue(light, `background-${key}`),
      getValue(dark, `background-${key}`)
    );
  });

  // Text color utilities
  const hasAccent = 'textColorAccent' in textSemantic.light;
  const accentKey = hasAccent ? 'textColorAccent' : 'textColorSecondary';
  const accentHoverKey = hasAccent ? 'textColorAccentHover' : 'textColorSecondaryHover';

  const textMap = {
    base: 'textColorBase',
    muted: 'textColorMuted',
    link: 'textColorLink',
    code: 'textColorCode',
    'muted-hover': 'textColorMutedHover',
    'link-hover': 'textColorLinkHover',
    'base-hover': 'textColorBaseHover',
    primary: 'textColorPrimary',
    'primary-hover': 'textColorPrimaryHover',
    accent: accentKey,
    'accent-hover': accentHoverKey,
    secondary: 'textColorSecondary',
    'secondary-hover': 'textColorSecondaryHover',
    danger: 'textDanger',
    'danger-hover': 'textDangerHover',
    warning: 'textWarning',
    'warning-hover': 'textWarningHover',
    success: 'textSuccess',
    'success-hover': 'textSuccessHover',
  };

  Object.entries(textMap).forEach(([name, key]) => {
    const className = `.text-${name}`;
    addUtility(
      utilities,
      darkUtilities,
      darkSelectors,
      className,
      'color',
      getValue(light, `text-${key}`),
      getValue(dark, `text-${key}`)
    );
  });

  // Border color utilities
  const borderMap = {
    base: 'borderBase',
    'base-hover': 'borderBaseHover',
    warning: 'borderWarning',
    success: 'borderSuccess',
    danger: 'borderDanger',
    primary: 'borderPrimary',
    'primary-hover': 'borderPrimaryHover',
    secondary: 'borderSecondary',
    'secondary-hover': 'borderSecondaryHover',
    accent: 'borderAccent',
    'accent-hover': 'borderAccentHover',
    'warning-hover': 'borderWarningHover',
    'success-hover': 'borderSuccessHover',
    'danger-hover': 'borderDangerHover',
  };

  Object.entries(borderMap).forEach(([name, key]) => {
    const className = `.border-${name}`;
    addUtility(
      utilities,
      darkUtilities,
      darkSelectors,
      className,
      'borderColor',
      getValue(light, `border-${key}`),
      getValue(dark, `border-${key}`)
    );
  });

  return plugin(({ addUtilities }) => {
    addUtilities(utilities);
    addUtilities(darkUtilities);
  });
};

export default tokenUtilities;
