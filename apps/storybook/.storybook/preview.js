// v3 token build: primitives, --bg-* / --text-* / --border-*, and .text-body-md etc.
// (replaces injectCssVars(), which only emitted --background-* aliases — webkit components use --bg-*)
import '@aziontech/theme/globals.css'
import 'primeflex/primeflex.css'
import '../src/styles/preview.css'
import '@aziontech/theme'
import '@aziontech/icons'
import '@aziontech/webkit/styles/country-flags'

import { withThemeByClassName } from '@storybook/addon-themes'
import { GLOBALS_UPDATED } from '@storybook/core-events'
import { addons } from '@storybook/preview-api'
import { setup } from '@storybook/vue3'
import PrimeVue from 'primevue/config'
import Tooltip from 'primevue/tooltip'

import { STORYBOOK_VIEWPORTS, THEME_CLASSES } from './visual-modes.js'

setup((app) => {
  app.use(PrimeVue, {
    ripple: false
  })

  app.directive('tooltip', Tooltip)
})

// withThemeByClassName only runs as a story decorator, so on pure-MDX docs pages
// (Get Started, Style Guide) the toolbar toggle never updated the html class.
// Mirror the `theme` global onto <html> ourselves so those pages switch too.
// THEME_CLASSES lives in ./visual-modes.js — the visual test-runner applies
// the same classes when it screenshots each theme.
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
    // DS-breakpoint-aligned viewports — the same set the visual tests shoot
    // (see ./visual-modes.js). Deliberately replaces the addon defaults, so
    // story-level defaultViewport must use 'mobile' | 'tablet' | 'desktop'.
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
