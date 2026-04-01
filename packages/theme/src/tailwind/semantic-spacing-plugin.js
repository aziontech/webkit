/**
 * Tailwind plugin to expose semantic spacing styles.
 *
 * This adds spacing components for container, padding, and gap utilities.
 *
 * Usage in tailwind.config.js:
 * ```javascript
 * import { theme } from '@aziontech/theme/tailwind/tailwind-theme.js';
 * import semanticSpacing from '@aziontech/theme/tailwind/semantic-spacing-plugin';
 *
 * export default {
 *   theme,
 *   plugins: [semanticSpacing()],
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
 * Generate semantic spacing style components
 * @returns {import('tailwindcss/plugin').Plugin}
 */
export const semanticSpacing = () => {
  return plugin(({ addComponents, theme }) => {
    const spacing = {
      // Container
      '.max-container-width': {
        maxWidth: '1280px',
      },
      '.px-container': {
        paddingLeft: theme('spacing.0'),
        paddingRight: theme('spacing.0'),
      },
      '.py-container': {
        paddingTop: theme('spacing.48'),
        paddingBottom: theme('spacing.48'),
      },

      // Padding elements
      '.p-elements-confortable': {
        padding: theme('spacing.24'),
      },
      '.p-elements-base': {
        padding: theme('spacing.12'),
      },
      '.p-elements-compact': {
        padding: theme('spacing.6'),
      },

      // Gap elements
      '.gap-elements-confortable': {
        gap: theme('spacing.24'),
      },
      '.gap-elements-base': {
        gap: theme('spacing.12'),
      },
      '.gap-elements-compact': {
        gap: theme('spacing.6'),
      },

      // Gap sections
      '.gap-sections': {
        gap: theme('spacing.48'),
      },
    };

    const responsiveSpacing = {
      [`@media (max-width: ${theme('screens.md', '768px')})`]: {
        '.max-container-width': {
          maxWidth: '1024px',
        },
        '.px-container': {
          paddingLeft: theme('spacing.10'),
          paddingRight: theme('spacing.10'),
        },
        '.py-container': {
          paddingTop: theme('spacing.32'),
          paddingBottom: theme('spacing.32'),
        },
        '.p-elements-confortable': {
          padding: theme('spacing.16'),
        },
        '.p-elements-base': {
          padding: theme('spacing.8'),
        },
        '.p-elements-compact': {
          padding: theme('spacing.5'),
        },
        '.gap-elements-confortable': {
          gap: theme('spacing.16'),
        },
        '.gap-elements-base': {
          gap: theme('spacing.8'),
        },
        '.gap-elements-compact': {
          gap: theme('spacing.6'),
        },
        '.gap-sections': {
          gap: theme('spacing.40'),
        },
      },
      [`@media (max-width: ${theme('screens.sm', '640px')})`]: {
        '.max-container-width': {
          maxWidth: theme('screens.lg'),
        },
        '.px-container': {
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4'),
        },
        '.py-container': {
          paddingTop: theme('spacing.16'),
          paddingBottom: theme('spacing.16'),
        },
        '.p-elements-confortable': {
          padding: theme('spacing.8'),
        },
        '.p-elements-base': {
          padding: theme('spacing.6'),
        },
        '.p-elements-compact': {
          padding: theme('spacing.4'),
        },
        '.gap-elements-confortable': {
          gap: theme('spacing.8'),
        },
        '.gap-elements-base': {
          gap: theme('spacing.6'),
        },
        '.gap-elements-compact': {
          gap: theme('spacing.4'),
        },
        '.gap-sections': {
          gap: theme('spacing.20'),
        },
      },
    };

    addComponents(spacing);
    addComponents(responsiveSpacing);
  });
};

export default semanticSpacing;
