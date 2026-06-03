import typography from '@tailwindcss/typography'
import preset from '@aziontech/theme/tailwind-preset'

export default {
  important: true,
  presets: [preset],
  content: [
    './src/**/*.vue',
    './src/**/*.js',
    './src/**/*.ts',
    './src/**/*.jsx',
    './src/**/*.tsx',
    '../../packages/webkit/src/**/*.vue',
    '../../packages/webkit/src/**/*.js',
    '../../packages/webkit/src/**/*.ts',
    '../../packages/webkit/src/**/*.jsx',
    '../../packages/webkit/src/**/*.tsx'
  ],
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
        'visible-area': 'calc(100vh - 60px - 56px)',
        'graph-card': '552px'
      },
      fontFamily: {
        roboto: ['Roboto'],
        robotomono: ['Roboto Mono'],
        sora: ['Sora'],
        'proto-mono': ['Proto Mono'],
        protomono: ['Proto Mono'],
        mono: [
          'Proto Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Cascadia Code',
          'Roboto Mono',
          'Courier New',
          'monospace'
        ]
      }
    }
  },
  plugins: [typography]
}
