import typography from '@tailwindcss/typography'
import { theme } from '@aziontech/theme/tailwind/tailwind-theme'
import semanticColors from '@aziontech/theme/tailwind/semantic-colors-plugin'
import semanticTexts from '@aziontech/theme/tailwind/semantic-texts-plugin'
import semanticSpacing from '@aziontech/theme/tailwind/semantic-spacing-plugin'
import semanticAnimations from '@aziontech/theme/tailwind/semantic-animations-plugin'

export default {
  important: true,
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
    ...theme,
    fontFamily: {
      ...(theme.fontFamily ?? {}),
      sans: ['Sora'],
      mono: ['Proto Mono'],
      code: ['Roboto Mono']
    },
    listStyleType: {
      ...(theme.listStyleType ?? {}),
      none: 'none',
      disc: 'disc',
      decimal: 'decimal',
      square: 'square',
      roman: 'upper-roman'
    },
    extend: {
      ...(theme.extend ?? {}),
      colors: {
        ...(theme.extend?.colors ?? {}),
        header: '#111111',
        'header-button-enabled': '#ffffff32',
        'header-button-hover': '#f5f5f516',
        'header-avatar': '#363636',
        'orange-base': '#F3652B'
      },
      backgroundColor: {
        ...(theme.extend?.backgroundColor ?? {}),
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
  plugins: [
    typography,
    semanticColors(),
    semanticTexts(),
    semanticSpacing(),
    semanticAnimations()
  ]
}
