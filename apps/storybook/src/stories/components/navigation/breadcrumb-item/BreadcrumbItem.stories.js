import BreadcrumbItem from '@aziontech/webkit/breadcrumb-item'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import BreadcrumbItem from '@aziontech/webkit/breadcrumb-item'"

/** @type {import('@storybook/vue3').Meta<typeof BreadcrumbItem>} */
const meta = {
  title: 'Components/Navigation/BreadcrumbItem',
  component: BreadcrumbItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark'
    },
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
          'Single segment in a breadcrumb trail. Ancestor segments use muted label text; the current page uses default text with hover and focus-visible navigation affordances.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible segment label.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Page Name'" }
      }
    },
    href: {
      control: 'text',
      description: 'Destination when the segment is a link (ignored when `current` is true).',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "'#'" } }
    },
    current: {
      control: 'boolean',
      description:
        'Marks the current page (last segment); renders as a span with `aria-current="page"`.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    showIcon: {
      control: 'boolean',
      description: 'When true, renders a leading PrimeIcons icon before the label.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    icon: {
      control: 'text',
      description: 'PrimeIcons class for the leading icon when `showIcon` is true.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'pi pi-box'" }
      }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction and applies disabled tokens.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    onClick: {
      action: 'click',
      description: 'Fires when the segment is activated.',
      table: { category: 'events', type: { summary: '(event: MouseEvent, item: { label: string; href: string })' } }
    }
  },
  args: {
    label: 'Page Name',
    href: '#',
    current: false,
    showIcon: false,
    icon: 'pi pi-box',
    disabled: false
  }
}

export default meta

const Template = (args) => ({
  components: { BreadcrumbItem },
  setup() {
    return { args }
  },
  template: '<BreadcrumbItem v-bind="args" />'
})

const DEFAULT_MARKUP = '<BreadcrumbItem label="Page Name" href="#" />'

/** @type {import('@storybook/vue3').StoryObj<typeof BreadcrumbItem>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Ancestor segment rendered as a link with muted label text.' },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const CURRENT_MARKUP = '<BreadcrumbItem label="Current Page" current />'

/** @type {import('@storybook/vue3').StoryObj<typeof BreadcrumbItem>} */
export const Current = {
  args: {
    label: 'Current Page',
    current: true
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Current page segment: rendered as a span with `aria-current="page"` and default (non-muted) text.'
      },
      source: { code: toSfc(IMPORT, CURRENT_MARKUP) }
    }
  }
}

const WITH_ICON_MARKUP = '<BreadcrumbItem label="Page Name" href="#" show-icon icon="pi pi-box" />'

/** @type {import('@storybook/vue3').StoryObj<typeof BreadcrumbItem>} */
export const WithIcon = {
  args: {
    showIcon: true,
    icon: 'pi pi-box'
  },
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Segment with a leading PrimeIcons icon before the label.' },
      source: { code: toSfc(IMPORT, WITH_ICON_MARKUP) }
    }
  }
}

const DISABLED_MARKUP = '<BreadcrumbItem label="Page Name" href="#" disabled />'

/** @type {import('@storybook/vue3').StoryObj<typeof BreadcrumbItem>} */
export const Disabled = {
  args: {
    disabled: true
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Disabled segment: interaction is blocked and disabled tokens are applied.'
      },
      source: { code: toSfc(IMPORT, DISABLED_MARKUP) }
    }
  }
}
