import {
  DOCS_HEADER_COMPONENTS,
  DOCS_HEADER_IMPORTS,
  DOCS_HEADER_MARKUP,
  DOCS_HEADER_SETUP,
  DOCS_SECTIONS
} from '../../_shared/headers'
import { toSfc } from '../../_shared/story-source'

const TEMPLATE = `<div class="w-full bg-(--bg-canvas)">
${DOCS_HEADER_MARKUP}
</div>`

const meta = {
  title: 'Templates/Headers/DocsHeader',
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
          'The documentation bar: a `GlobalHeader` in its default `content` placement, so it runs full bleed across the window and opens on the page boundary. Start: the navigation trigger below `lg`, the brand with the Docs tag, and the section links from `lg`. End: search, GitHub, then Console. Search leads the end cluster in every channel, so it sits at the start of the buttons wherever the reader is. The sample widens the search into a field carrying the ⌘K shortcut once the bar is wide enough; the control is an icon button below that, and an icon button here. Built from `GlobalHeader`, `NavigationMenu`, `IconButton`, `Button` and `Brand`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components: DOCS_HEADER_COMPONENTS,
    setup: () => ({ sections: DOCS_SECTIONS }),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The bar at rest. The section links and the brand tag appear from `lg`; below it the navigation trigger opens the page tree and the bar keeps only the brand and the end cluster.'
      },
      source: { code: toSfc([...DOCS_HEADER_IMPORTS, '', ...DOCS_HEADER_SETUP], TEMPLATE) }
    }
  }
}
