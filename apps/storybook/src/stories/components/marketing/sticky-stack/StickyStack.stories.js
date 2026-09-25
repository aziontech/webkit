import Illustration from '@aziontech/webkit/illustration'
import StickyStack from '@aziontech/webkit/sticky-stack'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = [
  "import Illustration from '@aziontech/webkit/illustration'",
  "import StickyStack from '@aziontech/webkit/sticky-stack'"
]

const ITEMS = [
  {
    title: 'Automated deployment via Git or CLI',
    description:
      'Push to a branch or run one command; the platform builds the project and puts the result in every location, with the build before it a rollback away.'
  },
  {
    title: 'Infrastructure as code with Terraform',
    description:
      'Declare workloads, rules and domains in the provider and apply them the same way as the rest of your estate, with the same review and the same plan.'
  },
  {
    title: 'Metrics and events via GraphQL API',
    description:
      'Query the same numbers the console charts, from one endpoint, so a dashboard you already run can carry the platform alongside everything else.'
  }
]

const SCENES = ['ai-applications', 'live-debugging', 'deploy-secure-mcp-server']

const SCRIPT = [
  ...IMPORT,
  '',
  `const scenes = [${SCENES.map((scene) => `'${scene}'`).join(', ')}]`,
  '',
  'const items = [',
  ITEMS.map(
    (item) => `  {\n    title: '${item.title}',\n    description:\n      '${item.description}'\n  }`
  ).join(',\n'),
  ']'
]

const MEDIA_SLOT = `  <template #media="{ index }">
    <Illustration :name="scenes[index]" />
  </template>`

/** @type {import('@storybook/vue3').Meta<typeof StickyStack>} */
const meta = {
  title: 'Components/Marketing/StickyStack',
  component: StickyStack,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }]
      }
    },
    docs: {
      description: {
        component:
          'A band that pins to the viewport and is read by scrolling through it: a stack of claims on one side, one piece of media on the other, and the scroll position — not a pointer — deciding which claim is open. Each claim expands in turn while the ones already read collapse and stack above it, so the column keeps one height and the reader always sees where they are in the run. The media beside it is replaced, not dimmed: the outgoing scene leaves and the incoming one mounts, so a scene that animates plays its entrance every time it is reached. Set `--sticky-stack-top` to the height of any sticky header above the band. Below `lg` the band does not pin — every claim is open with its own medium under it.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    items: {
      control: 'object',
      description:
        'The claims, in reading order. Each item is `{ title, description, src, alt }`; `src` builds the image shown while that claim is open, and the `media` slot replaces it with anything richer.',
      table: {
        category: 'props',
        type: { summary: 'StickyStackItem[]' },
        defaultValue: { summary: '[]' }
      }
    },
    size: {
      control: 'inline-radio',
      options: ['small', 'medium', 'large'],
      description:
        "Height the open claim is held to, as a multiple of the band's padding step — three, four, five. The claims already read collapse to their titles, so the stack keeps one height whichever claim is open.",
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'medium'" }
      }
    },
    dwell: {
      control: { type: 'number', min: 0.2, max: 2, step: 0.1 },
      description:
        "Screen-heights of scrolling each claim holds while the band is pinned. The band's total height is one screen plus this much per claim, so three claims at `0.7` pin the page for a little over two screens. Raise it for claims carrying code a reader must actually read.",
      table: {
        category: 'props',
        type: { summary: 'number' },
        defaultValue: { summary: '0.7' }
      }
    },
    showProgress: {
      control: 'boolean',
      description:
        "Fills a hairline along the open claim's bottom edge as its share of the scroll is spent. It is the only thing telling a reader how much of the pin is left, so leave it on.",
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    media: {
      control: false,
      description:
        "The claim's medium, receiving `{ item, index, active }`; replaces the image built from the item's own `src`. It is mounted fresh on every change, so an entrance animation inside it replays.",
      table: { category: 'slots' }
    },
    onIndexChange: {
      action: 'index-change',
      description:
        'Fired when the open claim changes, whether the scroll moved it or a reader selected one.',
      table: { type: { summary: '(index: number)' } }
    }
  },
  args: {
    items: ITEMS,
    size: 'medium',
    dwell: 0.7,
    showProgress: true
  }
}

export default meta

const Template = (args) => ({
  components: { Illustration, StickyStack },
  setup() {
    return { args, scenes: SCENES }
  },
  template: `<StickyStack v-bind="args">\n${MEDIA_SLOT}\n</StickyStack>`
})

const DEFAULT_MARKUP = `<StickyStack :items="items">\n${MEDIA_SLOT}\n</StickyStack>`

/** @type {import('@storybook/vue3').StoryObj<typeof StickyStack>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Three claims and one media frame. The band opens on the first claim; scrolling into it pins the frame and each further screen-height of scroll opens the next claim, collapsing the one before it to its title. The hairline under the open claim fills as its share of the scroll is spent. Every claim title is a real button, so `Tab` reaches each one and focusing or activating it scrolls the band to that claim — a keyboard reader moves the band exactly as a pointer reader does. Scroll the Docs canvas to see the run; a story cannot scroll itself, so what is shown here is the band at rest.'
      },
      source: { code: toSfc(SCRIPT, DEFAULT_MARKUP) }
    }
  }
}

const SIZES_TEMPLATE = `<div class="flex flex-col gap-(--spacing-xxl)">
  <StickyStack size="small" :items="items">
  ${MEDIA_SLOT}
  </StickyStack>
  <StickyStack size="medium" :items="items">
  ${MEDIA_SLOT}
  </StickyStack>
  <StickyStack size="large" :items="items">
  ${MEDIA_SLOT}
  </StickyStack>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof StickyStack>} */
export const Sizes = {
  render: () => ({
    components: { Illustration, StickyStack },
    setup() {
      return { items: ITEMS, scenes: SCENES }
    },
    template: SIZES_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          "Every `size` value, one band under the other with the same three claims on each, so the only thing that changes is the height the open claim is held to — three, four and five times the padding step. The collapsed claims are the same height at every size, which is what keeps each stack a constant height through its whole run: the open claim grows, the read ones shrink to their titles, and the column never reflows the media beside it. `size` is a floor rather than a ceiling — a description longer than the height it sets grows its claim instead of being clipped."
      },
      source: { code: toSfc(SCRIPT, SIZES_TEMPLATE) }
    }
  }
}
