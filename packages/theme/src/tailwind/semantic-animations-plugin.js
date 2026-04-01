/**
 * Tailwind plugin to expose semantic animations and keyframes.
 *
 * This adds animation utilities and keyframes for common UI animations.
 *
 * Usage in tailwind.config.js:
 * ```javascript
 * import { theme } from '@aziontech/theme/tailwind/tailwind-theme.js';
 * import semanticAnimations from '@aziontech/theme/tailwind/semantic-animations-plugin.js';
 *
 * export default {
 *   theme,
 *   plugins: [semanticAnimations()],
 * };
 * ```
 */

// Lazy-require to avoid hard dependency for consumers
const plugin = (() => {
  try {
    return require('tailwindcss/plugin');
  } catch {
    return (handler) => handler;
  }
})();

/**
 * Generate semantic animation utilities and keyframes
 * @returns {import('tailwindcss/plugin').Plugin}
 */
export const semanticAnimations = () => {
  return plugin(({ addUtilities, addComponents, theme }) => {
    // Animation utilities
    const animations = {
      '.animate-fade-in': {
        animation: 'fadeIn 220ms ease-in-out',
      },
      '.animate-fade-out': {
        animation: 'fadeOut 220ms ease-in-out',
      },
      '.animate-slide-down': {
        animation: 'slideDown 220ms ease-in-out',
      },
      '.animate-blink': {
        animation: 'blink 1s step-end infinite',
      },
      '.animate-highlight-fade': {
        animation: 'highlight ease-in forwards',
      },
    };

    // Keyframes components
    const keyframes = {
      '@keyframes fadeIn': {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
      '@keyframes fadeOut': {
        '0%': { opacity: '1' },
        '100%': { opacity: '0' },
      },
      '@keyframes slideDown': {
        '0%': { height: '0' },
        '100%': { height: 'auto' },
      },
      '@keyframes blink': {
        '0%, 100%': { opacity: '1' },
        '50%': { opacity: '0' },
      },
      '@keyframes highlight': {
        '0%': { backgroundColor: 'var(--surface-hover)', fontWeight: '500' },
        '100%': { backgroundColor: 'var(--surface-hover)', fontWeight: '500' },
      },
    };

    const variants = ['responsive', 'hover', 'focus', 'active', 'motion-safe', 'motion-reduce'];
    addUtilities(animations, variants);
    addComponents(keyframes);
  });
};

export default semanticAnimations;
