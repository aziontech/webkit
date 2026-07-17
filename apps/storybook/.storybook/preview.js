import '@aziontech/theme/globals.css'
import '../src/styles/preview.css'
import '@aziontech/theme'
import '@aziontech/icons'
import '@aziontech/webkit/styles/country-flags'

import { withThemeByClassName } from '@storybook/addon-themes'
import { GLOBALS_UPDATED } from '@storybook/core-events'
import { addons } from '@storybook/preview-api'
import { setup } from '@storybook/vue3'

import { STORYBOOK_VIEWPORTS, THEME_CLASSES } from './visual-modes.js'

function applyThemeClass(name) {
  const docElement = document.documentElement

  docElement.classList.remove('azion', 'azion-light', 'azion-dark')
  docElement.classList.add(...(THEME_CLASSES[name] || THEME_CLASSES.dark))
}

applyThemeClass('dark')

try {
  addons.getChannel().on(GLOBALS_UPDATED, ({ globals }) => {
    if (globals && globals.theme) applyThemeClass(globals.theme)
  })
} catch(error) {
  console.error(`[ERROR]: ${error}`)
}

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
      // Also the docs hyperlink color — #585C6D was unreadable on the dark canvas.
      colorSecondary: '#F3652B',
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
  viewport: {
    viewports: STORYBOOK_VIEWPORTS
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
        'Style Guide',
        'Foundations',
        ['Colors', 'Spacing', 'Typography', 'Icons'],
        'Components',
        'Site'
      ]
    }
  }
}

export const decorators = [
  withThemeByClassName({
    themes: {
      light: THEME_CLASSES.light.join(' '),
      dark: THEME_CLASSES.dark.join(' ')
    },
    defaultTheme: 'dark'
  })
]
