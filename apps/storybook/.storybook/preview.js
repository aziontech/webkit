import { setup } from '@storybook/vue3';
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';
import { withThemeByClassName } from '@storybook/addon-themes'

// Import critical CSS
import 'primeflex/primeflex.css'
import '../src/styles/preview.css';
import '../src/styles/flag.css';
import '../src/styles/theme-root-vars.scss';
import '@aziontech/theme'
import '@aziontech/icons'

setup((app) => {
  app.use(PrimeVue, {
    ripple: false
  });

  app.directive('tooltip', Tooltip);
});

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
      colorPrimary: '#F3652B',
      colorSecondary: '#585C6D',
      appBg: '#0a0a0a',
      appContentBg: '#0a0a0a',
      appBorderColor: '#404040',
      textColor: '#FFFFFF',
      textInverseColor: '#0a0a0a',
      barTextColor: '#999999',
      barSelectedColor: '#F3652B',
      barBg: '#0A0A0A',
      inputBg: '#0A0A0A',
      inputBorder: '#404040',
      inputTextColor: '#FFFFFF',
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
      method: 'alphabetical',
      order: ['Introduction', 'Core', 'Components']
    }
  }
};

export const decorators = [
  withThemeByClassName({
    themes: {
      light: 'azion azion-light',
      dark: 'azion azion-dark',
    },
    defaultTheme: 'dark',
  })
]
