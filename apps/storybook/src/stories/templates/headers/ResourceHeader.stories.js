import {
  RESOURCE_CRUMBS,
  RESOURCE_FIRST_LEVEL_MARKUP,
  RESOURCE_HEADER_COMPONENTS,
  RESOURCE_HEADER_IMPORTS,
  RESOURCE_SECOND_LEVEL_MARKUP,
  RESOURCE_SECOND_LEVEL_SETUP
} from '../../_shared/headers'
import { toSfc } from '../../_shared/story-source'

const wrap = (markup) => `<div class="w-full bg-(--bg-canvas)">
${markup}
</div>`

const FIRST_LEVEL_TEMPLATE = wrap(RESOURCE_FIRST_LEVEL_MARKUP)
const SECOND_LEVEL_TEMPLATE = wrap(RESOURCE_SECOND_LEVEL_MARKUP)

const meta = {
  title: 'Templates/Headers/ResourceHeader',
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
          'The console bar for every page inside the persistent shell, at its first and second level of resource. A `GlobalHeader` in its default `content` placement, sitting in the content zone beside the navigation rail. Start: the navigation trigger below `md`, the brand, and the breadcrumb from the second level. End: search first, then Create, the Agent button and the account avatar. The first level of a resource names itself with its own page, so the bar carries the brand alone; the second level adds the module and the resource name as a breadcrumb. Below `md` the sample collapses Create and Agent into icon buttons, and from a bar width of `--container-2xl` it widens the search into a field with the ⌘K shortcut. Both thresholds are read from the theme tokens. Built from `GlobalHeader`, `Breadcrumb`, `IconButton`, `Button`, `ButtonHighlight`, `Avatar` and `Brand`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const FirstLevel = {
  name: 'First level',
  render: () => ({
    components: RESOURCE_HEADER_COMPONENTS,
    template: FIRST_LEVEL_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'A module list such as Applications. The page names itself, so the bar shows no crumb: only the brand, then search, Create, Agent and the avatar.'
      },
      source: { code: toSfc(RESOURCE_HEADER_IMPORTS, FIRST_LEVEL_TEMPLATE) }
    }
  }
}

export const SecondLevel = {
  name: 'Second level',
  render: () => ({
    components: RESOURCE_HEADER_COMPONENTS,
    setup: () => ({ crumbs: RESOURCE_CRUMBS }),
    template: SECOND_LEVEL_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'A resource inside a module. The breadcrumb names the module and the resource, and shows from `md`; the last crumb is the current page and carries no link.'
      },
      source: {
        code: toSfc(
          [...RESOURCE_HEADER_IMPORTS, '', ...RESOURCE_SECOND_LEVEL_SETUP],
          SECOND_LEVEL_TEMPLATE
        )
      }
    }
  }
}
