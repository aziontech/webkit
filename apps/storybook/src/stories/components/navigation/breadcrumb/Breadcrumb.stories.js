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
          "Shows the page hierarchy so users can navigate back to parent views. Pass an `items` array for the common case, or compose `Breadcrumb.List`, `Breadcrumb.Item`, and `Breadcrumb.Separator` through the default slot. The trail is always a single row: a segment too wide for the space ellipsizes, and a trail that still does not fit scrolls horizontally. In `items` mode, viewports below `md` additionally collapse the middle segments into a dropdown menu opened by an ellipsis icon button; a hand-composed trail keeps every segment it was given, since the component cannot know which of the consumer's children are collapsible."
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

/** @type {import('@storybook/vue3').StoryObj<typeof Breadcrumb.Root>} */
export const ResponsiveCollapsed = {
  render: Template,
  args: {
    items: [ancestor, ancestor, ancestor, ancestor, current]
  },
  parameters: {
    viewport: { defaultViewport: 'mobile' },
    docs: {
      description: {
        story:
          'Below `md` (768px), only the first and current segments show inline; the middle segments open from the ellipsis icon button via a dropdown menu.'
      },
      source: { code: toSfc([IMPORT, '', ...DEFAULT_ITEMS_LINES], DEFAULT_MARKUP) }
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

const LONG_LABEL_MOBILE_LINES = [
  'const items = [',
  "  { label: 'Page Name', href: '#' },",
  "  { label: 'Page Name', href: '#' },",
  `  { label: '${LONG_LABEL}', current: true }`,
  ']'
]

const LONG_LABEL_MOBILE_MARKUP = '<Breadcrumb :items="items" />'

/** @type {import('@storybook/vue3').StoryObj<typeof Breadcrumb.Root>} */
export const LongLabelMobile = {
  render: () => ({
    components: { Breadcrumb },
    setup() {
      return { items: [ancestor, ancestor, { label: LONG_LABEL, current: true }] }
    },
    template: LONG_LABEL_MOBILE_MARKUP
  }),
  parameters: {
    viewport: { defaultViewport: 'mobile' },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'The same long segment at a 375px viewport, with a middle segment so the collapse applies too: first segment, overflow menu, then the ellipsized current page. Nothing extends past the viewport.'
      },
      source: { code: toSfc([IMPORT, '', ...LONG_LABEL_MOBILE_LINES], LONG_LABEL_MOBILE_MARKUP) }
    }
  }
}

const COMPOSED_TEMPLATE = `<Breadcrumb>
  <Breadcrumb.List>
    <li><Breadcrumb.Item label="Home" href="#" /></li>
    <Breadcrumb.Separator />
    <li><Breadcrumb.Item label="Workspaces" href="#" /></li>
    <Breadcrumb.Separator />
    <li><Breadcrumb.Item label="Projects" href="#" /></li>
    <Breadcrumb.Separator />
    <li><Breadcrumb.Item label="Edge Applications" href="#" /></li>
    <Breadcrumb.Separator />
    <li><Breadcrumb.Item label="Settings" current /></li>
  </Breadcrumb.List>
</Breadcrumb>`

/** @type {import('@storybook/vue3').StoryObj<typeof Breadcrumb.Root>} */
export const ComposedMobile = {
  render: () => ({ components: { Breadcrumb }, template: COMPOSED_TEMPLATE }),
  parameters: {
    viewport: { defaultViewport: 'mobile' },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'A hand-composed trail at 375px. Every segment the consumer wrote is kept (there is no collapse in this mode), so the row scrolls horizontally once ellipsizing is exhausted rather than wrapping to a second line or bleeding off-screen.'
      },
      source: { code: toSfc(IMPORT, COMPOSED_TEMPLATE) }
    }
  }
}
