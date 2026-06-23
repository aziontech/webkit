import Breadcrumb from '@aziontech/webkit/navigation/breadcrumb'

const breadcrumbComponents = {
  BreadcrumbRoot: Breadcrumb.Root,
  BreadcrumbList: Breadcrumb.List,
  BreadcrumbItem: Breadcrumb.Item,
  BreadcrumbSeparator: Breadcrumb.Separator
}

const ancestor = { label: 'Page Name', href: '#' }
const current = { label: 'Current Page', current: true }

/** @type {import('@storybook/vue3').Meta<typeof Breadcrumb.Root>} */
const meta = {
 title: 'Components/Navigation/Breadcrumb',
  component: Breadcrumb.Root,
  subcomponents: breadcrumbComponents,
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
          'Shows the page hierarchy so users can navigate back to parent views. Pass an `items` array for the common case, or compose `Breadcrumb.List`, `Breadcrumb.Item`, and `Breadcrumb.Separator` manually. On viewports below `md`, only the first and current segments stay visible; middle segments are listed in a DropdownMenu opened by an ellipsis IconButton.'
      }
    }
  },
  argTypes: {
    items: {
      control: 'object',
      description:
        'Ordered path segments; the last entry is the current page when `current` is omitted on that entry.',
      table: { type: { summary: 'BreadcrumbItemData[]' }, category: 'props' }
    },
    onNavigate: {
      action: 'navigate',
      description: 'Fires when an ancestor segment is activated.',
      table: { type: { summary: 'string' }, category: 'events' }
    },
    default: {
      control: false,
      description: 'Custom composition when `items` is empty.',
      table: { type: { summary: 'VNode' }, category: 'slots' }
    }
  },
  args: {
    items: [ancestor, ancestor, ancestor, ancestor, current]
  }
}

export default meta

const Template = (args) => ({
  components: { BreadcrumbRoot: Breadcrumb.Root },
  setup() {
    return { args }
  },
  template: '<BreadcrumbRoot v-bind="args" class="max-w-[42.5rem]" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof Breadcrumb.Root>} */
export const Default = {
  render: Template
}

/** @type {import('@storybook/vue3').StoryObj<typeof Breadcrumb.Root>} */
export const TwoItems = {
  render: Template,
  args: {
    items: [ancestor, current]
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Breadcrumb.Root>} */
export const SingleItem = {
  render: Template,
  args: {
    items: [{ label: 'Page Name', current: true }]
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Breadcrumb.Root>} */
export const FiveItems = {
  render: Template,
  args: {
    items: [ancestor, ancestor, ancestor, ancestor, current]
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Breadcrumb.Root>} */
export const ResponsiveCollapsed = {
  render: Template,
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    docs: {
      description: {
        story:
          'Below `md` (768px), only the first and current segments show inline; middle segments open from the ellipsis IconButton via DropdownMenu.'
      }
    }
  },
  args: {
    items: [ancestor, ancestor, ancestor, ancestor, current]
  }
}
