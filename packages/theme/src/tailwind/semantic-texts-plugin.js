/**
 * Tailwind plugin to expose semantic text styles (typography).
 *
 * This adds typography components like display-1, body-1, etc.
 *
 * Usage in tailwind.config.js:
 * ```javascript
 * import { theme } from '@aziontech/theme/tailwind/tailwind-theme.js';
 * import semanticTexts from '@aziontech/theme/tailwind/semantic-texts-plugin';
 *
 * export default {
 *   theme,
 *   plugins: [semanticTexts()],
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
 * Generate semantic text style components
 * @returns {import('tailwindcss/plugin').Plugin}
 */
export const semanticTexts = () => {
  return plugin(({ addComponents, theme }) => {
    const deprecatedTexts = {
      // Display styles - Desktop
      '.display-1': {
        fontSize: '3rem',
        lineHeight: '1.10',
        fontFamily: 'Sora',
        letterSpacing: '-.05rem',
      },
      '.display-2': {
        fontSize: '2rem',
        lineHeight: '1.2',
        fontFamily: 'Sora',
        letterSpacing: '-.05rem',
      },
      '.display-3': {
        fontSize: '1.75rem',
        lineHeight: '1.25',
        fontFamily: 'Sora',
        letterSpacing: '-.05rem',
      },
      '.display-4': {
        fontSize: '1.5rem',
        lineHeight: '1.3',
        fontFamily: 'Sora',
        letterSpacing: '-.05rem',
      },
      '.display-5': {
        fontSize: '1.25rem',
        lineHeight: '1.4',
        fontFamily: 'Sora',
        letterSpacing: '-.05rem',
      },

      // Display styles - Mobile
      '.display-1-mobile': {
        fontSize: '2.5rem',
        lineHeight: '1.15',
        fontFamily: 'Sora',
        letterSpacing: '-.05rem',
      },
      '.display-2-mobile': {
        fontSize: '1.875rem',
        lineHeight: '1.20',
        fontFamily: 'Sora',
        letterSpacing: '-.05rem',
      },
      '.display-3-mobile': {
        fontSize: '1.375rem',
        lineHeight: '1.3',
        fontFamily: 'Sora',
        letterSpacing: '-.05rem',
      },
      '.display-4-mobile': {
        fontSize: '1.25rem',
        lineHeight: '1.35',
        fontFamily: 'Sora',
        letterSpacing: '-.05rem',
      },
      '.display-5-mobile': {
        fontSize: '1.125rem',
        lineHeight: '1.35',
        fontFamily: 'Sora',
        letterSpacing: '-.05rem',
      },

      // Body styles
      '.body-1': {
        fontSize: '1rem',
        lineHeight: '1.4rem',
        fontFamily: 'Sora',
        letterSpacing: '-.05rem',
      },
      '.body-2': {
        fontSize: '.875rem',
        lineHeight: '1.4rem',
        fontFamily: 'Sora',
        letterSpacing: '-.05rem',
      },
    };

    const texts = {
      '.text-big-number-md': {
        fontSize: '4.5rem', // 7xl
        lineHeight: '1.20',
      },
        '.text-heading-2xl': {
        fontSize: '3.75rem', // text-6xl
        lineHeight: '1.2',
      },
      '.text-heading-xl': {
        fontSize: '2.25rem', // text-4xl
        lineHeight: '1.2',
      },
      '.text-heading-lg': {
        fontSize: '1.875rem', // text-3xl
        lineHeight: '1.2',
      },
      '.text-heading-md': {
        fontSize: '1.5rem', // text-2xl
        lineHeight: '1.2',
      },
      '.text-heading-sm': {
        fontSize: '1.125rem', // text-lg
        lineHeight: '1.2',
      },
        '.text-body-lg': {
        fontSize: '18px', // text-lg
        lineHeight: '1.5',
      },
      '.text-body-md': {
        fontSize: '16px', // text-base
        lineHeight: '1.5',
      },
      '.text-body-sm': {
        fontSize: '14px', // text-sm
        lineHeight: '1.5',
      },
      '.text-body-xs': {
        fontSize: '12px', // text-xs
        lineHeight: '1.5',
      },
      '.text-body-xss': {
        fontSize: '10px',
        lineHeight: '1.5',
      },
      '.text-overline-md': {
        fontSize: '14px', // text-sm
        lineHeight: '1.4',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      },
      '.text-overline-sm': {
        fontSize: '12px', // text-xs
        lineHeight: '1.4',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      },
      '.text-overline-xs': {
        fontSize: '10px',
        lineHeight: '1.4',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      },
    };

    const responsiveTexts = {
      [`@media (max-width: ${theme('screens.md', '768px')})`]: {
        '.text-big-number-md': {
          fontSize: '3rem',
          lineHeight: '1.20',
        },
        '.text-heading-2xl': {
          fontSize: '3rem', // text-5xl
        },
        '.text-heading-xl': {
          fontSize: '1.875rem', // text-3xl
        },
        '.text-heading-lg': {
          fontSize: '1.125rem', // text-lg
        },
        '.text-heading-md': {
          fontSize: '1.25rem', // text-xl
        },
        '.text-heading-sm': {
          fontSize: '1rem', // text-base
        },
        '.text-body-lg': {
          fontSize: '16px', // text-base
        },
        '.text-body-md': {
          fontSize: '16px', // mantém
        },
        '.text-body-sm': {
          fontSize: '14px',
        },
        '.text-body-xs': {
          fontSize: '12px',
        },
        '.text-body-xss': {
          fontSize: '10px',
        },
        '.text-overline-md': {
          fontSize: '14px',
        },
        '.text-overline-sm': {
          fontSize: '12px',
        },
        '.text-overline-xs': {
          fontSize: '10px',
        },
      },
      [`@media (max-width: ${theme('screens.sm', '640px')})`]: {
        '.text-big-number-md': {
          fontSize: '3rem',
          lineHeight: '1.20',
        },
        '.text-heading-2xl': {
          fontSize: '1.875rem',
        },
        '.text-heading-xl': {
          fontSize: '1.25rem',
        },
        '.text-heading-lg': {
          fontSize: '1.125rem',
        },
        '.text-heading-md': {
          fontSize: '1rem',
        },
        '.text-heading-sm': {
          fontSize: '0.875rem',
        },
        '.text-body-lg': {
          fontSize: '16px',
        },
        '.text-body-md': {
          fontSize: '16px',
        },
        '.text-body-sm': {
          fontSize: '14px',
        },
        '.text-body-xs': {
          fontSize: '12px',
        },
        '.text-body-xss': {
          fontSize: '10px',
        },
        '.text-overline-md': {
          fontSize: '12px',
        },
        '.text-overline-sm': {
          fontSize: '12px',
        },
        '.text-overline-xs': {
          fontSize: '10px',
        },
      },

    };

    addComponents(deprecatedTexts);
    addComponents(texts);
    addComponents(responsiveTexts);
  });
};

export default semanticTexts;
