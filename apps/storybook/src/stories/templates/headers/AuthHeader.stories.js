import {
  AUTH_HEADER_COMPONENTS,
  AUTH_HEADER_IMPORTS,
  AUTH_HEADER_MARKUP
} from '../../_shared/headers'
import { toSfc } from '../../_shared/story-source'

const TEMPLATE = `<div class="w-full bg-(--bg-canvas)">
${AUTH_HEADER_MARKUP}
</div>`

const meta = {
  title: 'Templates/Headers/AuthHeader',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'focus-order-semantics', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        component:
          'The console bar for the signed-out and onboarding screens: sign in, sign up, password recovery and the first-run steps. A `GlobalHeader` in its default `content` placement with the brand at the start and one outlined Documentation button at the end. There is no navigation, no search and no account control, because there is no session to act on yet. Built from `GlobalHeader`, `Button` and `Brand`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components: AUTH_HEADER_COMPONENTS,
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The bar over an auth card. The brand links home and Documentation is the only way out of the flow.'
      },
      source: { code: toSfc(AUTH_HEADER_IMPORTS, TEMPLATE) }
    }
  }
}
