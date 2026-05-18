import typography from '@tailwindcss/typography'
import themePreset from '@aziontech/theme/tailwind-preset/v3'

/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  presets: [themePreset],
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}',
    '../../packages/webkit/src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  // Dark mode configuration
  // Use `.dark` on an ancestor (Storybook uses `withThemeByClassName` to toggle it)
  darkMode: ['class'],
  theme: {
    fontFamily: {
      sans: ['Sora'],
      mono: ['Proto Mono'],
      code: ['Roboto Mono']
    },
    listStyleType: {
      none: 'none',
      disc: 'disc',
      decimal: 'decimal',
      square: 'square',
      roman: 'upper-roman'
    },
    extend: {
      // Storybook-specific color extensions (merged on top of the theme preset)
      colors: {
        header: '#111111',
        'header-button-enabled': '#ffffff32',
        'header-button-hover': '#f5f5f516',
        'header-avatar': '#363636',
        'orange-base': '#F3652B'
      },
      backgroundColor: {
        'orange-bullet': '#F3652B'
      },
      borderColor: {
        header: '#3e3e3e',
        'header-hover': '#F3652B',
        'radio-card-active': '#F3652B'
      },
      textColor: {
        header: '#b5b5b5',
        'success-check': '#22C55E'
      },
      transitionProperty: {
        width: 'width'
      },
      width: {
        slide: '384px'
      },
      height: {
        // subtract 60px for footer and 56px for header
        'visible-area': 'calc(100vh - 60px - 56px)',
        'graph-card': '552px'
      },
      fontFamily: {
        roboto: ['Roboto'],
        robotomono: ['Roboto Mono'],
        sora: ['Sora'],
        'proto-mono': ['Proto Mono'],
        protomono: ['Proto Mono'],
        mono: ['Proto Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Courier New', 'monospace']
      }
    }
  },
  plugins: [typography]
}
