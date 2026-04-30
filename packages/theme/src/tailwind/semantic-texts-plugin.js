const plugin = (() => {
  try {
    return require('tailwindcss/plugin');
  } catch {
    return (handler) => handler;
  }
})();

export const semanticTexts = () => {
  return plugin(({ addComponents, theme }) => {
    const getFontSize = (token, fallback) => {
      const value = theme(`fontSize.${token}`, fallback);
      return Array.isArray(value) ? value[0] : value;
    };

    const deprecatedTexts = {
      '.display-1': {
        fontSize: getFontSize('5xl', '3rem'),
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
        fontSize: getFontSize('2xl', '1.5rem'),
        lineHeight: '1.3',
        fontFamily: 'Sora',
        letterSpacing: '-.05rem',
      },
      '.display-5': {
        fontSize: getFontSize('xl', '1.25rem'),
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
        fontSize: getFontSize('3xl', '1.875rem'),
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
        fontSize: getFontSize('xl', '1.25rem'),
        lineHeight: '1.35',
        fontFamily: 'Sora',
        letterSpacing: '-.05rem',
      },
      '.display-5-mobile': {
        fontSize: getFontSize('lg', '1.125rem'),
        lineHeight: '1.35',
        fontFamily: 'Sora',
        letterSpacing: '-.05rem',
      },

      '.body-1': {
        fontSize: getFontSize('base', '1rem'),
        lineHeight: '1.4rem',
        fontFamily: 'Sora',
        letterSpacing: '-.05rem',
      },
      '.body-2': {
        fontSize: getFontSize('sm', '.875rem'),
        lineHeight: '1.4rem',
        fontFamily: 'Sora',
        letterSpacing: '-.05rem',
      },
    };

    const texts = {
      '.text-big-number-md': {
        fontSize: getFontSize('4xl', '2.25rem'),
        lineHeight: '1.20',
      },
      '.text-big-number-sm': {
        fontSize: getFontSize('xl', '1.25rem'),
        lineHeight: '1.20',
      },
      '.text-big-number-lg': {
        fontSize: getFontSize('6xl', '3.75rem'),
        lineHeight: '1.20',
      },
      '.text-heading-2xl': {
        fontSize: getFontSize('6xl', '3.75rem'),
        lineHeight: '1.2',
      },
      '.text-heading-xl': {
        fontSize: getFontSize('4xl', '2.25rem'),
        lineHeight: '1.2',
      },
      '.text-heading-lg': {
        fontSize: getFontSize('3xl', '1.875rem'),
        lineHeight: '1.2',
      },
      '.text-heading-md': {
        fontSize: getFontSize('2xl', '1.5rem'),
        lineHeight: '1.2',
      },
      '.text-heading-sm': {
        fontSize: getFontSize('lg', '1.125rem'),
        lineHeight: '1.2',
      },
      '.text-body-lg': {
        fontSize: getFontSize('lg', '18px'),
        lineHeight: '1.5',
      },
      '.text-body-md': {
        fontSize: getFontSize('base', '16px'),
        lineHeight: '1.5',
      },
      '.text-body-sm': {
        fontSize: getFontSize('sm', '14px'),
        lineHeight: '1.5',
      },
      '.text-body-xs': {
        fontSize: getFontSize('xs', '12px'),
        lineHeight: '1.5',
      },
      '.text-body-xss': {
        fontSize: '10px',
        lineHeight: '1.5',
      },
      '.text-overline-md': {
        fontSize: getFontSize('sm', '14px'),
        lineHeight: '1.4',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      },
      '.text-overline-sm': {
        fontSize: getFontSize('xs', '12px'),
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
          fontSize: getFontSize('2xl', '1.5rem'),
          lineHeight: '1.20',
        },
        '.text-big-number-sm': {
          fontSize: getFontSize('xl', '1.25rem'),
          lineHeight: '1.20',
        },
        '.text-big-number-lg': {
          fontSize: getFontSize('4xl', '2.25rem'),
          lineHeight: '1.20',
        },
        '.text-heading-2xl': {
          fontSize: getFontSize('5xl', '3rem'),
        },
        '.text-heading-xl': {
          fontSize: getFontSize('3xl', '1.875rem'),
        },
        '.text-heading-lg': {
          fontSize: getFontSize('lg', '1.125rem'),
        },
        '.text-heading-md': {
          fontSize: getFontSize('xl', '1.25rem'),
        },
        '.text-heading-sm': {
          fontSize: getFontSize('base', '1rem'),
        },
        '.text-body-lg': {
          fontSize: getFontSize('base', '16px'),
        },
        '.text-body-md': {
          fontSize: getFontSize('base', '16px'),
        },
        '.text-body-sm': {
          fontSize: getFontSize('sm', '14px'),
        },
        '.text-body-xs': {
          fontSize: getFontSize('xs', '12px'),
        },
        '.text-body-xss': {
          fontSize: '10px',
        },
        '.text-overline-md': {
          fontSize: getFontSize('sm', '14px'),
        },
        '.text-overline-sm': {
          fontSize: getFontSize('xs', '12px'),
        },
        '.text-overline-xs': {
          fontSize: '10px',
        },
      },
      [`@media (max-width: ${theme('screens.sm', '640px')})`]: {
        '.text-big-number-md': {
          fontSize: getFontSize('xl', '1.25rem'),
          lineHeight: '1.20',
        },
        '.text-big-number-sm': {
          fontSize: getFontSize('base', '1rem'),
          lineHeight: '1.20',
        },
        '.text-big-number-lg': {
          fontSize: getFontSize('2xl', '1.5rem'),
          lineHeight: '1.20',
        },
        '.text-heading-2xl': {
          fontSize: getFontSize('3xl', '1.875rem'),
        },
        '.text-heading-xl': {
          fontSize: getFontSize('xl', '1.25rem'),
        },
        '.text-heading-lg': {
          fontSize: getFontSize('lg', '1.125rem'),
        },
        '.text-heading-md': {
          fontSize: getFontSize('base', '1rem'),
        },
        '.text-heading-sm': {
          fontSize: getFontSize('sm', '0.875rem'),
        },
        '.text-body-lg': {
          fontSize: getFontSize('base', '16px'),
        },
        '.text-body-md': {
          fontSize: getFontSize('base', '16px'),
        },
        '.text-body-sm': {
          fontSize: getFontSize('sm', '14px'),
        },
        '.text-body-xs': {
          fontSize: getFontSize('xs', '12px'),
        },
        '.text-body-xss': {
          fontSize: '10px',
        },
        '.text-overline-md': {
          fontSize: getFontSize('xs', '12px'),
        },
        '.text-overline-sm': {
          fontSize: getFontSize('xs', '12px'),
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
