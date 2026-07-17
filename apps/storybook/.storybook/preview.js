import { withThemeByClassName } from '@storybook/addon-themes'
import { addons } from '@storybook/preview-api'
import { GLOBALS_UPDATED } from '@storybook/core-events'

import '@aziontech/theme/globals.css'
import '../src/styles/preview.css'
import '@aziontech/icons'
import '@aziontech/webkit/styles/country-flags'

// withThemeByClassName only runs as a story decorator, so on pure-MDX docs pages
// (Get Started, Style Guide) the toolbar toggle never updated the html class.
// Mirror the `theme` global onto <html> ourselves so those pages switch too.
const THEME_CLASSES = {
  light: ['azion', 'azion-light'],
  dark: ['azion', 'azion-dark']
}
function applyThemeClass(name) {
  const el = document.documentElement
  el.classList.remove('azion', 'azion-light', 'azion-dark')
  el.classList.add(...(THEME_CLASSES[name] || THEME_CLASSES.dark))
}
applyThemeClass('dark')
try {
  addons.getChannel().on(GLOBALS_UPDATED, ({ globals }) => {
    if (globals && globals.theme) applyThemeClass(globals.theme)
  })
} catch {
  /* headless/test contexts without a channel */
}

export const parameters = {
  controls: {
    matchers: {
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
