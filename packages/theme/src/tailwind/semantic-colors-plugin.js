/**
 * Tailwind plugin to expose semantic colors at root level.
 *
 * This allows using classes like `text-muted` instead of `text-text-muted`.
 *
 * Usage in tailwind.config.js:
 * ```javascript
 * import { theme } from '@aziontech/theme/tailwind/tailwind-theme.js';
 * import semanticColors from '@aziontech/theme/tailwind/semantic-colors-plugin';
 *
 * export default {
 *   theme,
 *   plugins: [semanticColors()],
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
 * Generate semantic color utilities
 * @returns {import('tailwindcss/plugin').Plugin}
 */
export const semanticColors = () => {
  return plugin(({ addUtilities }) => {
    const textColors = {
      '.text-default': { color: 'var(--text-default)' },
      '.text-muted': { color: 'var(--text-muted)' },
      '.text-link': { color: 'var(--text-link)' },
      '.text-linkHover': { color: 'var(--text-linkHover)' },
      '.text-code': { color: 'var(--text-code)' },
      '.text-primary': { color: 'var(--text-primary)' },
      '.text-primaryHover': { color: 'var(--text-primaryHover)' },
      '.text-accent': { color: 'var(--text-accent)' },
      '.text-accentHover': { color: 'var(--text-accentHover)' },
      '.text-danger': { color: 'var(--text-danger)' },
      '.text-dangerHover': { color: 'var(--text-dangerHover)' },
      '.text-warning': { color: 'var(--text-warning)' },
      '.text-warningHover': { color: 'var(--text-warningHover)' },
      '.text-success': { color: 'var(--text-success)' },
      '.text-successHover': { color: 'var(--text-successHover)' },
    };

    const bgColors = {
      '.bg-surfaceRaised': { 'background-color': 'var(--background-surfaceRaised)' },
      '.bg-surfaceOverlay': { 'background-color': 'var(--background-surfaceOverlay)' },
      '.bg-surface': { 'background-color': 'var(--background-surface)' },
      '.bg-canvas': { 'background-color': 'var(--background-canvas)' },
      '.bg-danger': { 'background-color': 'var(--background-danger)' },
      '.bg-dangerHover': { 'background-color': 'var(--background-dangerHover)' },
      '.bg-warning': { 'background-color': 'var(--background-warning)' },
      '.bg-warningHover': { 'background-color': 'var(--background-warningHover)' },
      '.bg-success': { 'background-color': 'var(--background-success)' },
      '.bg-successHover': { 'background-color': 'var(--background-successHover)' },
      '.bg-backdrop': { 'background-color': 'var(--background-backdrop)' },
      '.bg-primary': { 'background-color': 'var(--background-primary)' },
      '.bg-primaryHover': { 'background-color': 'var(--background-primaryHover)' },
      '.bg-primary-mask': { 'background-color': 'var(--background-primaryMask)' },
    };

    const borderColors = {
      '.border-default': { 'border-color': 'var(--border-default)' },
      '.border-strong': { 'border-color': 'var(--border-strong)' },
      '.border-subtle': { 'border-color': 'var(--border-subtle)' },
      '.border-warning': { 'border-color': 'var(--border-warning)' },
      '.border-warningHover': { 'border-color': 'var(--border-warningHover)' },
      '.border-success': { 'border-color': 'var(--border-success)' },
      '.border-successHover': { 'border-color': 'var(--border-successHover)' },
      '.border-danger': { 'border-color': 'var(--border-danger)' },
      '.border-dangerHover': { 'border-color': 'var(--border-dangerHover)' },
      '.border-primary': { 'border-color': 'var(--border-primary)' },
      '.border-primaryHover': { 'border-color': 'var(--border-primaryHover)' },
      '.border-accent': { 'border-color': 'var(--border-accent)' },
      '.border-accentHover': { 'border-color': 'var(--border-accentHover)' },
    };

    const variants = ['responsive', 'hover', 'dark', 'before', 'after', 'focus', 'active', 'disabled'];
    addUtilities(textColors, variants);
    addUtilities(bgColors, variants);
    addUtilities(borderColors, variants);
  });
};

export default semanticColors;
