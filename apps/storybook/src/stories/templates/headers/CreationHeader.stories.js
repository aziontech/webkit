import {
  CREATION_CRUMBS,
  CREATION_HEADER_COMPONENTS,
  CREATION_HEADER_IMPORTS,
  CREATION_HEADER_MARKUP,
  CREATION_HEADER_SETUP
} from '../../_shared/headers'
import { toSfc } from '../../_shared/story-source'

const TEMPLATE = `<div class="w-full bg-(--bg-canvas)">
${CREATION_HEADER_MARKUP}
</div>`

const meta = {
  title: 'Templates/Headers/CreationHeader',
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
          'The console bar for the focused creation shell: create, edit and deploy flows that run without the navigation rail. A `GlobalHeader` in its default `content` placement, spanning the whole window. Start: a small back button, the brand and the breadcrumb of where the flow lives. End: the account avatar alone, so the signed-in user stays visible. The bar carries no search, Create or Agent: the flow is the one thing on screen. The back button returns to the list the flow started from and is omitted when there is nowhere to go back to. Built from `GlobalHeader`, `Breadcrumb`, `IconButton`, `Avatar` and `Brand`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components: CREATION_HEADER_COMPONENTS,
    setup: () => ({ crumbs: CREATION_CRUMBS }),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The bar above a create flow, with the back button and a two-level breadcrumb ending on the flow itself.'
      },
      source: { code: toSfc([...CREATION_HEADER_IMPORTS, '', ...CREATION_HEADER_SETUP], TEMPLATE) }
    }
  }
}
