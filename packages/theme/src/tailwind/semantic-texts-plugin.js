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
        fontSize: theme('fontSize.5xl')[0],
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
        fontSize: theme('fontSize.2xl')[0],
        lineHeight: '1.3',
        fontFamily: 'Sora',
        letterSpacing: '-.05rem',
      },
      '.display-5': {
        fontSize: theme('fontSize.xl')[0],
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
        fontSize: theme('fontSize.3xl')[0],
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
        fontSize: theme('fontSize.xl')[0],
        lineHeight: '1.35',
        fontFamily: 'Sora',
        letterSpacing: '-.05rem',
      },
      '.display-5-mobile': {
        fontSize: theme('fontSize.lg')[0],
        lineHeight: '1.35',
        fontFamily: 'Sora',
        letterSpacing: '-.05rem',
      },

      '.body-1': {
        fontSize: theme('fontSize.base')[0],
        lineHeight: '1.4rem',
        fontFamily: 'Sora',
        letterSpacing: '-.05rem',
      },
      '.body-2': {
        fontSize: theme('fontSize.sm')[0],
        lineHeight: '1.4rem',
        fontFamily: 'Sora',
        letterSpacing: '-.05rem',
      },
    };

    const texts = {
      '.text-big-number-md': {
        fontSize: theme('fontSize.4xl')[0],
        lineHeight: '1.20',
      },
      '.text-big-number-sm': {
        fontSize: theme('fontSize.xl')[0],
        lineHeight: '1.20',
      },
      '.text-big-number-lg': {
        fontSize: theme('fontSize.6xl')[0],
        lineHeight: '1.20',
      },
      '.text-heading-2xl': {
        fontSize: theme('fontSize.6xl')[0],
        lineHeight: '1.2',
      },
      '.text-heading-xl': {
        fontSize: theme('fontSize.4xl')[0],
        lineHeight: '1.2',
      },
      '.text-heading-lg': {
        fontSize: theme('fontSize.3xl')[0],
        lineHeight: '1.2',
      },
      '.text-heading-md': {
        fontSize: theme('fontSize.2xl')[0],
        lineHeight: '1.2',
      },
      '.text-heading-sm': {
        fontSize: theme('fontSize.lg')[0],
        lineHeight: '1.2',
      },
      '.text-body-lg': {
        fontSize: theme('fontSize.lg')[0],
        lineHeight: '1.5',
      },
      '.text-body-md': {
        fontSize: theme('fontSize.base')[0],
        lineHeight: '1.5',
      },
      '.text-body-sm': {
        fontSize: theme('fontSize.sm')[0],
        lineHeight: '1.5',
      },
      '.text-body-xs': {
        fontSize: theme('fontSize.xs')[0],
        lineHeight: '1.5',
      },
      '.text-body-xss': {
        fontSize: '10px',
        lineHeight: '1.5',
      },
      '.text-overline-md': {
        fontSize: theme('fontSize.sm')[0],
        lineHeight: '1.4',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      },
      '.text-overline-sm': {
        fontSize: theme('fontSize.xs')[0],
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
          fontSize: theme('fontSize.2xl')[0],
          lineHeight: '1.20',
        },
        '.text-big-number-sm': {
          fontSize: theme('fontSize.xl')[0],
          lineHeight: '1.20',
        },
        '.text-big-number-lg': {
          fontSize: theme('fontSize.4xl')[0],
          lineHeight: '1.20',
        },
        '.text-heading-2xl': {
          fontSize: theme('fontSize.5xl')[0],
        },
        '.text-heading-xl': {
          fontSize: theme('fontSize.3xl')[0],
        },
        '.text-heading-lg': {
          fontSize: theme('fontSize.lg')[0],
        },
        '.text-heading-md': {
          fontSize: theme('fontSize.xl')[0],
        },
        '.text-heading-sm': {
          fontSize: theme('fontSize.base')[0],
        },
        '.text-body-lg': {
          fontSize: theme('fontSize.base')[0],
        },
        '.text-body-md': {
          fontSize: theme('fontSize.base')[0],
        },
        '.text-body-sm': {
          fontSize: theme('fontSize.sm')[0],
        },
        '.text-body-xs': {
          fontSize: theme('fontSize.xs')[0],
        },
        '.text-body-xss': {
          fontSize: '10px',
        },
        '.text-overline-md': {
          fontSize: theme('fontSize.sm')[0],
        },
        '.text-overline-sm': {
          fontSize: theme('fontSize.xs')[0],
        },
        '.text-overline-xs': {
          fontSize: '10px',
        },
      },
      [`@media (max-width: ${theme('screens.sm', '640px')})`]: {
        '.text-big-number-md': {
          fontSize: theme('fontSize.xl')[0],
          lineHeight: '1.20',
        },
        '.text-big-number-sm': {
          fontSize: theme('fontSize.base')[0],
          lineHeight: '1.20',
        },
        '.text-big-number-lg': {
          fontSize: theme('fontSize.2xl')[0],
          lineHeight: '1.20',
        },
        '.text-heading-2xl': {
          fontSize: theme('fontSize.3xl')[0],
        },
        '.text-heading-xl': {
          fontSize: theme('fontSize.xl')[0],
        },
        '.text-heading-lg': {
          fontSize: theme('fontSize.lg')[0],
        },
        '.text-heading-md': {
          fontSize: theme('fontSize.base')[0],
        },
        '.text-heading-sm': {
          fontSize: theme('fontSize.sm')[0],
        },
        '.text-body-lg': {
          fontSize: theme('fontSize.base')[0],
        },
        '.text-body-md': {
          fontSize: theme('fontSize.base')[0],
        },
        '.text-body-sm': {
          fontSize: theme('fontSize.sm')[0],
        },
        '.text-body-xs': {
          fontSize: theme('fontSize.xs')[0],
        },
        '.text-body-xss': {
          fontSize: '10px',
        },
        '.text-overline-md': {
          fontSize: theme('fontSize.xs')[0],
        },
        '.text-overline-sm': {
          fontSize: theme('fontSize.xs')[0],
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
