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
export const containers = () => {
  return plugin(({ addComponents, theme }) => {
    const mobile = {
      '.max-container-width': {
        maxWidth: theme('container.md'),
      },
      '.px-container': {
        paddingLeft: theme('spacing.4'),
        paddingRight: theme('spacing.4'),
      },
      '.py-container': {
        paddingTop: theme('spacing.16'),
        paddingBottom: theme('spacing.16'),
      },
    }

    const medium = {
      [`@media (min-width: ${theme('screens.sm',)})`]: {
        '.max-container-width': {
          maxWidth: theme('container.5xl'),
        },
        '.px-container': {
          paddingLeft: theme('spacing.10'),
          paddingRight: theme('spacing.10'),
        },
        '.py-container': {
          paddingTop: theme('spacing.32'),
          paddingBottom: theme('spacing.32'),
        },
      },
    }

    const large = {
      [`@media (max-width: ${theme('screens.xl',)})`]: {
        '.max-container-width': {
          maxWidth: theme('container.7xl'),
        },
        '.px-container': {
          paddingLeft: theme('spacing.0'),
          paddingRight: theme('spacing.0'),
        },
        '.py-container': {
          paddingTop: theme('spacing.48'),
          paddingBottom: theme('spacing.48'),
        },
      },
    }

    addComponents(mobile);
    addComponents(medium);
    addComponents(large);
  });
};

export default containers;
