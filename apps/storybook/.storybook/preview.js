import '../src/styles/preview.css'
import '../src/styles/tailwind.css'
import '@aziontech/icons'
import '@aziontech/webkit/styles/country-flags'

import { withThemeByClassName } from '@storybook/addon-themes'
import { GLOBALS_UPDATED } from '@storybook/core-events'
import { addons } from '@storybook/preview-api'

import { STORYBOOK_VIEWPORTS, THEME_CLASSES } from './visual-modes.js'

function applyThemeClass(name) {
  const docElement = document.documentElement

  docElement.classList.remove('azion', 'azion-light', 'azion-dark')
  docElement.classList.add(...(THEME_CLASSES[name] || THEME_CLASSES.dark))
  docElement.dataset.theme = THEME_CLASSES[name] ? name : 'dark'
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
        [
          'Design Tokens',
          [
            'Primitives',
            [
              'Color',
              'Font Family',
              'Font Size',
              'Font Weight',
              'Line Height',
              'Letter Spacing',
              'Spacing',
              'Size',
              'Container',
              'Breakpoint',
              'Radius',
              'Border',
              'Shadow',
              'Blur',
              'Opacity',
              'Perspective',
              'Aspect Ratio',
              'Z-index',
              'Motion'
            ],
            'Semantic',
            ['Theme', 'Typography'],
            'Responsive',
            ['Spacing', 'Layout']
          ],
          'Assets',
          ['Illustrations', 'Diagrams', 'Logos', 'Icons', 'Product Widgets']
        ],
        'Components',
        [
          'Primitives',
          [
            'Actions',
            'Code',
            'Content',
            'Data',
            'Feedback',
            'Inputs',
            'Layout',
            'Navigation',
            'Overlay'
          ],
          'Marketing',
          'Documentation'
        ],
        'Documentation',
        ['Overview', 'Authoring', 'Example Page'],
        'Templates',
        [
          'Marketing',
          [
            'Overview',
            'Heroes',
            'Features',
            'Solutions',
            'Use Cases',
            'Social Proof',
            'Pricing',
            'Articles',
            'Listings',
            'Closing CTAs',
            'Network',
            'Comparison',
            'Content',
            'Shell'
          ],
          'Platform',
          [
            'Overview',
            'Shell',
            [
              'PlatformShell',
              'CreatePage',
              'SummaryPage',
              'CodeEditor',
              'QueryEditor',
              'EventsVisualizer'
            ],
            'Page',
            'Lists',
            'Forms',
            'Overlays',
            'Creation',
            'States',
            'Detail',
            'Observe',
            'Account'
          ],
          'Headers',
          'Shells'
        ],
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
