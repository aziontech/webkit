import BreadcrumbItem from '@aziontech/webkit/breadcrumb-item'

/** @type {import('@storybook/vue3').Meta<typeof BreadcrumbItem>} */
const meta = {
 title: 'Components/Navigation/BreadcrumbItem',
  component: BreadcrumbItem,
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
          'Single segment in a breadcrumb trail. Ancestor segments use muted label text; the current page uses default text with hover and focus-visible navigation affordances.'
      }
    }
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible segment label.',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'Page Name' }, category: 'props' }
    },
    href: {
      control: 'text',
      description: 'Destination when the segment is a link (ignored when `current` is true).',
      table: { type: { summary: 'string' }, defaultValue: { summary: '#' }, category: 'props' }
    },
    current: {
      control: 'boolean',
      description: 'Marks the current page (last segment).',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    showIcon: {
      control: 'boolean',
      description: 'When true, renders a leading PrimeIcons icon before the label.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    icon: {
      control: 'text',
      description: 'PrimeIcons class for the leading icon when `showIcon` is true.',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'pi pi-box' }, category: 'props' }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction and applies disabled tokens.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    onClick: {
      action: 'click',
      description: 'Fires when the segment is activated; carries the segment label and href.',
      table: {
        type: { summary: '(event: MouseEvent, item: { label: string; href: string })' },
        category: 'events'
      }
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

/** @type {import('@storybook/vue3').StoryObj<typeof BreadcrumbItem>} */
export const Default = {
  render: Template
}

/** @type {import('@storybook/vue3').StoryObj<typeof BreadcrumbItem>} */
export const Current = {
  render: Template,
  args: {
    label: 'Current Page',
    current: true
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof BreadcrumbItem>} */
export const WithIcon = {
  render: Template,
  args: {
    showIcon: true,
    icon: 'pi pi-box'
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof BreadcrumbItem>} */
export const Disabled = {
  render: Template,
  args: {
    disabled: true
  }
}
