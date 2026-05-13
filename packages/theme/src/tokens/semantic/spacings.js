const plugin = (() => {
  try {
    return require('tailwindcss/plugin');
  } catch {
    return (handler) => handler;
  }
})();

/**
 * Generate semantic spacing components
 * @returns {import('tailwindcss/plugin').Plugin}
 */
export const spacingElements = () => {
  return plugin(({ addComponents, theme }) => {
    const mobile = {
      '.gap-spacing-elements-xxl': {
        gap: theme('spacing.8'),
      },
      '.gap-spacing-elements-xl': {
        gap: theme('spacing.6'),
      },
      '.gap-spacing-elements-lg': {
        gap: theme('spacing.4'),
      },
      '.gap-spacing-elements-md': {
        gap: theme('spacing.4'),
      },
      '.gap-spacing-elements-sm': {
        gap: theme('spacing.3'),
      },
      '.gap-spacing-elements-xs': {
        gap: theme('spacing.2'),
      },
      '.gap-spacing-elements-xxs': {
        gap: theme('spacing.1'),
      },
      '.p-spacing-elements-xxl': {
        padding: theme('spacing.8'),
      },
      '.p-spacing-elements-xl': {
        padding: theme('spacing.6'),
      },
      '.p-spacing-elements-lg': {
        padding: theme('spacing.4'),
      },
      '.p-spacing-elements-md': {
        padding: theme('spacing.4'),
      },
      '.p-spacing-elements-sm': {
        padding: theme('spacing.3'),
      },
      '.p-spacing-elements-xs': {
        padding: theme('spacing.2'),
      },
      '.p-spacing-elements-xxs': {
        padding: theme('spacing.1'),
      },
    };

    const medium = {
      [`@media (min-width: ${theme('screens.sm')})`]: {
        '.gap-spacing-elements-xxl': {
          gap: theme('spacing.16'),
        },
        '.gap-spacing-elements-xl': {
          gap: theme('spacing.8'),
        },
        '.gap-spacing-elements-lg': {
          gap: theme('spacing.6'),
        },
        '.gap-spacing-elements-md': {
          gap: theme('spacing.4'),
        },
        '.gap-spacing-elements-sm': {
          gap: theme('spacing.3'),
        },
        '.gap-spacing-elements-xs': {
          gap: theme('spacing.2'),
        },
        '.gap-spacing-elements-xxs': {
          gap: theme('spacing.1'),
        },
        '.p-spacing-elements-xxl': {
          padding: theme('spacing.16'),
        },
        '.p-spacing-elements-xl': {
          padding: theme('spacing.8'),
        },
        '.p-spacing-elements-lg': {
          padding: theme('spacing.6'),
        },
        '.p-spacing-elements-md': {
          padding: theme('spacing.4'),
        },
        '.p-spacing-elements-sm': {
          padding: theme('spacing.3'),
        },
        '.p-spacing-elements-xs': {
          padding: theme('spacing.2'),
        },
        '.p-spacing-elements-xxs': {
          padding: theme('spacing.1'),
        },
      },
    };

    const large = {
      [`@media (min-width: ${theme('screens.xl')})`]: {
        '.gap-spacing-elements-xxl': {
          gap: theme('spacing.24'),
        },
        '.gap-spacing-elements-xl': {
          gap: theme('spacing.12'),
        },
        '.gap-spacing-elements-lg': {
          gap: theme('spacing.6'),
        },
        '.gap-spacing-elements-md': {
          gap: theme('spacing.4'),
        },
        '.gap-spacing-elements-sm': {
          gap: theme('spacing.3'),
        },
        '.gap-spacing-elements-xs': {
          gap: theme('spacing.2'),
        },
        '.gap-spacing-elements-xxs': {
          gap: theme('spacing.1'),
        },
        '.p-spacing-elements-xxl': {
          padding: theme('spacing.24'),
        },
        '.p-spacing-elements-xl': {
          padding: theme('spacing.12'),
        },
        '.p-spacing-elements-lg': {
          padding: theme('spacing.6'),
        },
        '.p-spacing-elements-md': {
          padding: theme('spacing.4'),
        },
        '.p-spacing-elements-sm': {
          padding: theme('spacing.3'),
        },
        '.p-spacing-elements-xs': {
          padding: theme('spacing.2'),
        },
        '.p-spacing-elements-xxs': {
          padding: theme('spacing.1'),
        },
      },
    };

    addComponents(mobile);
    addComponents(medium);
    addComponents(large);
  });
};

export default spacingElements;
