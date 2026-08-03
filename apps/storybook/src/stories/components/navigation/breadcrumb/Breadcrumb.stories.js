import Breadcrumb from '@aziontech/webkit/breadcrumb'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Breadcrumb from '@aziontech/webkit/breadcrumb'"

const ancestor = { label: 'Page Name', href: '#' }
const current = { label: 'Current Page', current: true }

const subcomponents = {
  BreadcrumbList: Breadcrumb.List,
  BreadcrumbItem: Breadcrumb.Item,
  BreadcrumbSeparator: Breadcrumb.Separator
}

/** @type {import('@storybook/vue3').Meta<typeof Breadcrumb.Root>} */
const meta = {
  title: 'Components/Navigation/Breadcrumb',
  component: Breadcrumb.Root,
  subcomponents,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
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
          "Shows the page hierarchy so users can navigate back to parent views. Pass an `items` array for the common case, or compose `Breadcrumb.List`, `Breadcrumb.Item`, and `Breadcrumb.Separator` through the default slot. The trail is always a single row: segments shrink and ellipsize rather than wrapping or bleeding off-screen, whether one segment is too wide or the whole trail is. In `items` mode, viewports below `md` additionally collapse the middle segments into a dropdown menu opened by an ellipsis icon button. A hand-composed trail keeps every segment it was given: the root does not reach into the slot to decide which of the consumer's children are collapsible."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    items: {
      control: 'object',
      description:
        'Ordered path segments; the last entry is the current page when `current` is omitted on that entry.',
      table: {
        category: 'props',
        type: { summary: 'BreadcrumbItemData[]' },
        defaultValue: { summary: '[]' }
      }
    },
    onNavigate: {
      action: 'navigate',
      description:
        'Emitted when an ancestor segment is activated; the payload is the segment `href`.',
      table: { category: 'events', type: { summary: '(event: MouseEvent, href: string)' } }
    },
    default: {
      control: false,
      description: 'Custom composition rendered when `items` is empty.',
      table: { category: 'slots', type: { summary: 'VNode' } }
    }
  },
  args: {
    items: [ancestor, ancestor, ancestor, ancestor, current]
  }
}

export default meta

const Template = (args) => ({
  components: { Breadcrumb },
  setup() {
    return { args }
  },
  template: '<Breadcrumb v-bind="args" class="max-w-[42.5rem]" />'
})

const DEFAULT_ITEMS_LINES = [
  'const items = [',
  "  { label: 'Page Name', href: '#' },",
  "  { label: 'Page Name', href: '#' },",
  "  { label: 'Page Name', href: '#' },",
  "  { label: 'Page Name', href: '#' },",
  "  { label: 'Current Page', current: true }",
  ']'
]

const DEFAULT_MARKUP = '<Breadcrumb :items="items" class="max-w-[42.5rem]" />'

/** @type {import('@storybook/vue3').StoryObj<typeof Breadcrumb.Root>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'A multi-level trail rendered from an `items` array; the last entry is the current page.'
      },
      source: { code: toSfc([IMPORT, '', ...DEFAULT_ITEMS_LINES], DEFAULT_MARKUP) }
    }
  }
}

const DEPTHS_TEMPLATE = `<div class="flex flex-col gap-4 max-w-[42.5rem]">
  <Breadcrumb :items="single" />
  <Breadcrumb :items="two" />
  <Breadcrumb :items="full" />
</div>`

const DEPTHS_SCRIPT = [
  IMPORT,
  '',
  "const single = [{ label: 'Page Name', current: true }]",
  'const two = [',
  "  { label: 'Page Name', href: '#' },",
  "  { label: 'Current Page', current: true }",
  ']',
  'const full = [',
  "  { label: 'Page Name', href: '#' },",
  "  { label: 'Page Name', href: '#' },",
  "  { label: 'Page Name', href: '#' },",
  "  { label: 'Page Name', href: '#' },",
  "  { label: 'Current Page', current: true }",
  ']'
]

/** @type {import('@storybook/vue3').StoryObj<typeof Breadcrumb.Root>} */
export const Depths = {
  render: () => ({
    components: { Breadcrumb },
    setup() {
      return {
        single: [{ label: 'Page Name', current: true }],
        two: [ancestor, current],
        full: [ancestor, ancestor, ancestor, ancestor, current]
      }
    },
    template: DEPTHS_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Trails of increasing depth: a single current page, a two-level path, and a full five-level trail.'
      },
      source: { code: toSfc(DEPTHS_SCRIPT, DEPTHS_TEMPLATE) }
    }
  }
}


const LONG_LABEL = 'production-edge-application-with-a-very-long-configuration-name'

const LONG_LABEL_LINES = [
  'const items = [',
  "  { label: 'Page Name', href: '#' },",
  `  { label: '${LONG_LABEL}', current: true }`,
  ']'
]

const LONG_LABEL_MARKUP = '<Breadcrumb :items="items" class="max-w-[20rem]" />'

/** @type {import('@storybook/vue3').StoryObj<typeof Breadcrumb.Root>} */
export const LongLabel = {
  render: () => ({
    components: { Breadcrumb },
    setup() {
      return { items: [ancestor, { label: LONG_LABEL, current: true }] }
    },
    template: LONG_LABEL_MARKUP
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'A segment wider than the space available. It ellipsizes instead of pushing the trail off-screen, and the row stays a single line. Collapsing cannot help here: there are no middle segments to hide.'
      },
      source: { code: toSfc([IMPORT, '', ...LONG_LABEL_LINES], LONG_LABEL_MARKUP) }
    }
  }
}

