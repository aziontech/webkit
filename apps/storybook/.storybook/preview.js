import '../src/styles/preview.css'
import '../src/styles/tailwind.css'
import '@aziontech/icons'
import '@aziontech/webkit/styles/country-flags'

import { primitives } from '@aziontech/theme/colors'
import { withThemeByClassName } from '@storybook/addon-themes'
import { GLOBALS_UPDATED } from '@storybook/core-events'
import { addons } from '@storybook/preview-api'

import { azionDocsTheme } from './azion-theme.js'
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
    theme: azionDocsTheme
  },
  viewport: {
    viewports: STORYBOOK_VIEWPORTS
  },
  backgrounds: {
    default: 'azion azion-dark',
    values: [
      {
        name: 'azion-dark',
        value: primitives.surface[950]
      },
      {
        name: 'azion-light',
        value: primitives.surface[100]
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
            ['Theme', 'Data Viz', 'Typography'],
            'Responsive',
            ['Spacing', 'Layout']
          ],
          'Assets',
          ['Illustrations', 'Diagrams', 'Globe', 'Logos', 'Icons', 'Product Widgets']
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
          'Chart',
          ['Overview', 'Chart', 'DonutChart', 'StatTile', 'ChartCard'],
          'Marketing',
          ['Primitives', 'Sections'],
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
              'HomeDashboard',
              'SinglePageCreate',
              'MultipageCreate',
              'DetailsPageWithTabs',
              'SplitView',
              'CodeEditor',
              'QueryEditor'
            ],
            'Page',
            'Lists',
            'Forms',
            'Overlays',
            'Creation',
            'States',
            'Detail',
            'Dashboards',
            [
              'AnalyticsDashboard',
              'DataDashboard',
              'ServiceMonitoringDashboard',
              'SecurityDashboard',
              'ExecutiveSummaryDashboard',
              'FunnelCohortDashboard',
              'CompositionDashboard',
              'ProjectStatusDashboard',
              'AlertsDashboard',
              'HealthScoreDashboard',
              'ScanResultsDashboard',
              'ActivityOutcomesDashboard',
              'ConfigurableDashboard',
              'Metrics',
              'MetricPanel',
              'RequestHistory'
            ],
            'Auth',
            'Account'
          ],
          'Headers',
          'Shells',
          ['Overview', 'Console', 'Documentation', 'Website']
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
