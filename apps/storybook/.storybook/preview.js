import { withThemeByClassName } from '@storybook/addon-themes'

import '@aziontech/theme/globals.css'
import '../src/styles/preview.css'
import '@aziontech/icons'
import '@aziontech/webkit/styles/country-flags'

export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/i
    },
    expanded: true
  },
  docs: {
    source: {
      type: 'code'
    },
    theme: {
      base: 'dark',
      // Typography
      fontBase: '"Sora", sans-serif',
      fontCode: '"Roboto Mono", monospace',
      // Colors
      colorPrimary: '#F3652B',
      colorSecondary: '#585C6D',
      // UI
      appBg: '#0a0a0a',
      appContentBg: '#0a0a0a',
      appBorderColor: '#3e3e3e',
      appBorderRadius: 4,
      // Text colors
      textColor: '#ededed',
      textInverseColor: '#0a0a0a',
      // Toolbar
      barTextColor: '#b5b5b5',
      barSelectedColor: '#F3652B',
      barBg: '#111111',
      // Form
      inputBg: '#171717',
      inputBorder: '#3e3e3e',
      inputTextColor: '#ededed',
      inputBorderRadius: 4
    }
  },
  backgrounds: {
    default: 'azion azion-dark',
    values: [
      {
        name: 'azion-dark',
        value: '#0a0a0a'
      },
      {
        name: 'azion-light',
        value: '#ffffff'
      }
    ]
  },
  options: {
    storySort: {
      order: [
        'Get Started',
        'Foundations',
        ['Colors', 'Theme', 'Spacing', 'Typography', 'Icons'],
        'Components',
        'Site'
      ]
    }
  }
}

export const decorators = [
  withThemeByClassName({
    themes: {
      light: 'azion azion-light',
      dark: 'azion azion-dark'
    },
    defaultTheme: 'dark'
  })
]
