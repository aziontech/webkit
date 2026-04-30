const plugin = (() => {
  try {
    return require('tailwindcss/plugin');
  } catch {
    return (handler) => handler;
  }
})();

export const semanticTexts = () => {
  return plugin(({ addComponents, theme }) => {
    const deprecatedTexts = {
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

      '.body-1': {
        fontSize: '1rem',
        lineHeight: '1.4rem',
        fontFamily: 'Sora',
        letterSpacing: '-.05rem',
      },
      '.body-2': {
        fontSize: '0.875rem',
        lineHeight: '1.4rem',
        fontFamily: 'Sora',
        letterSpacing: '-.05rem',
      },
    };

    const texts = {
      '.text-big-number-md': {
        fontSize: '2.25rem',
        lineHeight: '1.20',
      },
      '.text-big-number-sm': {
        fontSize: '1.25rem',
        lineHeight: '1.20',
      },
      '.text-big-number-lg': {
        fontSize: '3.75rem',
        lineHeight: '1.20',
      },
      '.text-heading-2xl': {
        fontSize: '3.75rem',
        lineHeight: '1.2',
      },
      '.text-heading-xl': {
        fontSize: '2.25rem',
        lineHeight: '1.2',
      },
      '.text-heading-lg': {
        fontSize: '1.875rem',
        lineHeight: '1.2',
      },
      '.text-heading-md': {
        fontSize: '1.5rem',
        lineHeight: '1.2',
      },
      '.text-heading-sm': {
        fontSize: '1.125rem',
        lineHeight: '1.2',
      },
      '.text-body-lg': {
        fontSize: '1.125rem',
        lineHeight: '1.5',
      },
      '.text-body-md': {
        fontSize: '1rem',
        lineHeight: '1.5',
      },
      '.text-body-sm': {
        fontSize: '0.875rem',
        lineHeight: '1.5',
      },
      '.text-body-xs': {
        fontSize: '0.75rem',
        lineHeight: '1.5',
      },
      '.text-body-xss': {
        fontSize: '0.625rem',
        lineHeight: '1.5',
      },
      '.text-overline-md': {
        fontSize: '0.875rem',
        lineHeight: '1.4',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      },
      '.text-overline-sm': {
        fontSize: '0.75rem',
        lineHeight: '1.4',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      },
      '.text-overline-xs': {
        fontSize: '0.625rem',
        lineHeight: '1.4',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      },
    };

    const responsiveTexts = {
      [`@media (max-width: ${theme('screens.md', '768px')})`]: {
        '.text-big-number-md': {
          fontSize: '1.5rem',
          lineHeight: '1.20',
        },
        '.text-big-number-sm': {
          fontSize: '1.25rem',
          lineHeight: '1.20',
        },
        '.text-big-number-lg': {
          fontSize: '2.25rem',
          lineHeight: '1.20',
        },
        '.text-heading-2xl': {
          fontSize: '3rem',
        },
        '.text-heading-xl': {
          fontSize: '1.875rem',
        },
        '.text-heading-lg': {
          fontSize: '1.125rem',
        },
        '.text-heading-md': {
          fontSize: '1.25rem',
        },
        '.text-heading-sm': {
          fontSize: '1rem',
        },
        '.text-body-lg': {
          fontSize: '1rem',
        },
        '.text-body-md': {
          fontSize: '1rem',
        },
        '.text-body-sm': {
          fontSize: '0.875rem',
        },
        '.text-body-xs': {
          fontSize: '0.75rem',
        },
        '.text-body-xss': {
          fontSize: '0.625rem',
        },
        '.text-overline-md': {
          fontSize: '0.875rem',
        },
        '.text-overline-sm': {
          fontSize: '0.75rem',
        },
        '.text-overline-xs': {
          fontSize: '0.625rem',
        },
      },
      [`@media (max-width: ${theme('screens.sm', '640px')})`]: {
        '.text-big-number-md': {
          fontSize: '1.25rem',
          lineHeight: '1.20',
        },
        '.text-big-number-sm': {
          fontSize: '1rem',
          lineHeight: '1.20',
        },
        '.text-big-number-lg': {
          fontSize: '1.5rem',
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
          fontSize: '1rem',
        },
        '.text-body-md': {
          fontSize: '1rem',
        },
        '.text-body-sm': {
          fontSize: '0.875rem',
        },
        '.text-body-xs': {
          fontSize: '0.75rem',
        },
        '.text-body-xss': {
          fontSize: '0.625rem',
        },
        '.text-overline-md': {
          fontSize: '0.75rem',
        },
        '.text-overline-sm': {
          fontSize: '0.75rem',
        },
        '.text-overline-xs': {
          fontSize: '0.625rem',
        },
      },

    };

    addComponents(deprecatedTexts);
    addComponents(texts);
    addComponents(responsiveTexts);
  });
};

export default semanticTexts;
