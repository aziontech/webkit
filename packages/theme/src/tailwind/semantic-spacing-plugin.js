/**
 * Tailwind plugin to expose semantic spacing styles.
 *
 * This adds spacing components for container, padding, and gap utilities.
 *
 * Usage in tailwind.config.js:
 * ```javascript
 * import { theme } from '@aziontech/theme/tailwind/tailwind-theme.js';
 * import semanticSpacing from '@aziontech/theme/tailwind/semantic-spacing-plugin.js';
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
        paddingLeft: '0px',
        paddingRight: '0px',
      },
      '.py-container': {
        paddingTop: '48px',
        paddingBottom: '48px',
      },

      // Padding elements
      '.p-elements-confortable': {
        padding: '24px',
      },
      '.p-elements-base': {
        padding: '12px',
      },
      '.p-elements-compact': {
        padding: '6px',
      },

      // Gap elements
      '.gap-elements-confortable': {
        gap: '24px',
      },
      '.gap-elements-base': {
        gap: '12px',
      },
      '.gap-elements-compact': {
        gap: '6px',
      },

      // Gap sections
      '.gap-sections': {
        gap: '48px',
      },
    };

    const responsiveSpacing = {
      [`@media (max-width: ${theme('screens.md', '768px')})`]: {
        '.max-container-width': {
          maxWidth: '1024px',
        },
        '.px-container': {
          paddingLeft: '10px',
          paddingRight: '10px',
        },
        '.py-container': {
          paddingTop: '32px',
          paddingBottom: '32px',
        },
        '.p-elements-confortable': {
          padding: '16px',
        },
        '.p-elements-base': {
          padding: '8px',
        },
        '.p-elements-compact': {
          padding: '5px',
        },
        '.gap-elements-confortable': {
          gap: '16px',
        },
        '.gap-elements-base': {
          gap: '8px',
        },
        '.gap-elements-compact': {
          gap: '6px',
        },
        '.gap-sections': {
          gap: '40px',
        },
      },
      [`@media (max-width: ${theme('screens.sm', '640px')})`]: {
        '.max-container-width': {
          maxWidth: '414px',
        },
        '.px-container': {
          paddingLeft: '4px',
          paddingRight: '4px',
        },
        '.py-container': {
          paddingTop: '16px',
          paddingBottom: '16px',
        },
        '.p-elements-confortable': {
          padding: '8px',
        },
        '.p-elements-base': {
          padding: '6px',
        },
        '.p-elements-compact': {
          padding: '4px',
        },
        '.gap-elements-confortable': {
          gap: '8px',
        },
        '.gap-elements-base': {
          gap: '6px',
        },
        '.gap-elements-compact': {
          gap: '4px',
        },
        '.gap-sections': {
          gap: '20px',
        },
      },
    };

    addComponents(spacing);
    addComponents(responsiveSpacing);
  });
};

export default semanticSpacing;
