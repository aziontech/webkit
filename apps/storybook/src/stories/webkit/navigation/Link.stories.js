import Link from '@aziontech/webkit/link'

/** @type {import('@storybook/vue3').Meta<typeof Link>} */
const meta = {
  title: 'Webkit/Navigation/Link',
  component: Link,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark'
    },
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }]
      }
    },
    docs: {
      description: {
        component:
          'Text link with optional trailing icon and ghost hover surface.'
      }
    }
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible label rendered inside the link.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: 'Learn More' } }
    },
    size: {
      control: 'select',
      options: ['large', 'medium'],
      description: 'Size token. Affects height, gap, and typography.',
      table: {
        category: 'props',
        type: { summary: "'large' | 'medium'" },
        defaultValue: { summary: "'large'" }
      }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction and applies disabled token set.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    showIcon: {
      control: 'boolean',
      description: 'When true, renders the trailing icon.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
    },
    icon: {
      control: 'text',
      description: 'PrimeIcons class for the trailing icon.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: 'pi pi-external-link' }
      }
    },
    href: {
      control: 'text',
      description: 'Destination URL for the anchor.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: '#' } }
    },
    target: {
      control: 'select',
      options: ['_self', '_blank'],
      description: 'Link target when navigating.',
      table: {
        category: 'props',
        type: { summary: "'_self' | '_blank'" },
        defaultValue: { summary: "'_self'" }
      }
    },
    onClick: {
      action: 'click',
      description: 'Emitted when the link is clicked (unless disabled).',
      table: { category: 'events', type: { summary: 'MouseEvent' } }
    }
  },
  args: {
    label: 'Learn More',
    size: 'large',
    disabled: false,
    showIcon: true,
    icon: 'pi pi-external-link',
    href: '#',
    target: '_self'
  }
}

export default meta

const Template = (args) => ({
  components: { Link },
  setup() {
    return { args }
  },
  template: `
    <Link
      :label="args.label"
      :size="args.size"
      :disabled="args.disabled"
      :show-icon="args.showIcon"
      :icon="args.icon"
      :href="args.href"
      :target="args.target"
      @click="args.onClick"
    />
  `
})

/** @type {import('@storybook/vue3').StoryObj<typeof Link>} */
export const Default = {
  render: Template,
  parameters: {
    docs: { description: { story: 'Default large link with trailing icon.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Link>} */
export const Sizes = {
  render: () => ({
    components: { Link },
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <Link size="large" label="Learn More" />
        <Link size="medium" label="Learn More" />
      </div>
    `
  }),
  parameters: {
    docs: { description: { story: 'All size variants side by side.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Link>} */
export const Disabled = {
  args: { disabled: true },
  render: Template,
  parameters: {
    docs: { description: { story: 'Disabled state.' } }
  }
}
