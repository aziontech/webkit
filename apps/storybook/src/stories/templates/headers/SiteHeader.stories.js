import {
  SITE_HEADER_COMPONENTS,
  SITE_HEADER_IMPORTS,
  SITE_HEADER_MARKUP,
  SITE_HEADER_SETUP,
  SITE_LINKS
} from '../../_shared/headers'
import { toSfc } from '../../_shared/story-source'

const TEMPLATE = `<div class="w-full bg-(--bg-canvas)">
${SITE_HEADER_MARKUP}
</div>`

const meta = {
  title: 'Templates/Headers/SiteHeader',
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
          'The marketing bar: a sticky `GlobalHeader` in its `site` placement. The surface runs to the window edges while the regions are capped at the bar’s own measure and centred, so the bar answers to the framed page under it. Start: the navigation trigger below `xl` and the brand. Middle: the navigation, from `xl`. End: search first, then Contact from `xl`, Login and Start for Free last. Search leads the end cluster in every channel, ahead of the buttons, so it never moves between the site, the docs and the console. The mega-menus and the navigation sheet are documented on Templates › Marketing › Shell › SiteNav. Built from `GlobalHeader`, `NavigationMenu`, `IconButton`, `Button` and `Brand`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components: SITE_HEADER_COMPONENTS,
    setup: () => ({ links: SITE_LINKS }),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The bar with plain links. From `xl` the links and Contact show; below it the navigation trigger opens the sheet and Login stays on the bar down to the narrowest phone.'
      },
      source: { code: toSfc([...SITE_HEADER_IMPORTS, '', ...SITE_HEADER_SETUP], TEMPLATE) }
    }
  }
}
