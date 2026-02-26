import { primitiveColors } from 'azion-theme/src/tokens/colors-primitive';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'src/**/*.{astro,html,md,mdx,js,vue}',
    'node_modules/**/*.{html,vue}'
  ],
  plugins: [
    require('@tailwindcss/typography'),
    function ({ addUtilities }) {
      const newUtilities = {};

      newUtilities[".px-shell"] = {
        paddingLeft: "1rem",
        paddingRight: "1rem",
      };
      newUtilities[".px-container"] = {
        maxWidth: "1344px",
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: "1rem",
        paddingRight: "1rem",
      };
      newUtilities["@media (min-width: 768px)"] = {
        ".px-shell": {
          paddingLeft: "2rem",
          paddingRight: "2rem",
        },
        ".px-container": {
          paddingLeft: "2rem",
          paddingRight: "2rem",
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
    function ({ addComponents }) {
      const components = {
        '.display-1':  {
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
          fontSize: '.875rem',
          lineHeight: '1.4rem',
          fontFamily: 'Sora',
          letterSpacing: '-.05rem',
        },
      };
      
      addComponents(components);
    },
  ],
  important: true,
  darkMode: 'class',
  theme: {
    screens: {
      'xxs': '0px',
      'xs': '360px',
      'sm': '480px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1200px',
      'xxl': '1366px',
      'xxxl': '1600px',
    },
    extend: {
      fontFamily: {
        'mono': 'Roboto Mono',
      },
      colors: {
        ...primitiveColors
      },
      container: {
        padding: {
          DEFAULT: '.75rem',
          sm: '2rem',
          xl: '5rem',
          '2xl': '10rem'
        }
      },
      listStyleType: {
        none: 'none',
        disc: 'disc',
        decimal: 'decimal',
        square: 'square',
        roman: 'upper-roman'
      },
      width: {
        slide: '300px'
      },
      maxWidth: {
        'xxs': '0px',
        'xs': '360px',
        'sm': '480px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1200px',
        'xxl': '1366px',
        'xxxl': '1600px',
      },
      animation: {
        fadeIn: 'fadeIn 220ms ease-in-out',
        fadeOut: 'fadeOut 220ms ease-in-out',
        'pretty': 'pretty 4s ease-in-out infinite',
      },
      transitionProperty: {
        width: 'width'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        'pretty': {
          '0%': {
            'background-size': '200% 200%',
            'background-position': 'left'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right'
          },
          '100%': {
            'background-size': '200% 200%',
            'background-position': 'left'
           }
        }
      }
    }
  }
}
