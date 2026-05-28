import IconButton from '@aziontech/webkit/actions/icon-button'

/** @type {import('@storybook/vue3').Meta<typeof IconButton>} */
const meta = {
  title: 'Webkit/Actions/Icon Button',
  component: IconButton,
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
          'Interactive icon-only control for user actions. Requires an accessible label and supports loading state and link rendering when `href` is set.'
      }
    }
  },
  argTypes: {
    icon: {
      control: 'text',
      description: 'PrimeIcons class for the leading/trailing icon.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name for icon-only controls.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    kind: {
      control: 'select',
      options: ['primary', 'secondary', 'outlined', 'transparent'],
      description: 'Visual variant.',
      table: {
        category: 'props',
        type: { summary: "'primary' | 'secondary' | 'outlined' | 'transparent'" },
        defaultValue: { summary: "'primary'" }
      }
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size token; affects height, padding, and typography.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'large'" }
      }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction and applies disabled tokens.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading state and disables activation.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    href: {
      control: 'text',
      description: 'When set, renders as a link (`<a>`).',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    target: {
      control: 'select',
      options: ['_self', '_blank'],
      description: 'Link target when `href` is set.',
      table: {
        category: 'props',
        type: { summary: "'_blank' | '_self'" },
        defaultValue: { summary: "'_self'" }
      }
    },
    onClick: {
      action: 'click',
      description: 'Emitted when the button is activated.',
      table: { category: 'events', type: { summary: 'MouseEvent' } }
    }
  },
  args: {
    icon: 'pi pi-plus',
    ariaLabel: 'Add',
    kind: 'primary',
    size: 'large',
    disabled: false,
    loading: false,
    href: '',
    target: '_self'
  }
}

export default meta

const Template = (args) => ({
  components: { IconButton },
  setup() {
    return { args }
  },
  template: '<IconButton v-bind="args" @click="args.onClick" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof IconButton>} */
export const Default = {
  render: Template,
  parameters: {
    docs: { description: { story: 'Default primary icon button at large size.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof IconButton>} */
export const Types = {
  render: () => ({
    components: { IconButton },
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <IconButton kind="primary" icon="pi pi-plus" aria-label="Add" />
        <IconButton kind="secondary" icon="pi pi-plus" aria-label="Add" />
        <IconButton kind="outlined" icon="pi pi-plus" aria-label="Add" />
        <IconButton kind="transparent" icon="pi pi-plus" aria-label="Add" />
      </div>
    `
  }),
  parameters: {
    docs: { description: { story: 'All kind variants side by side.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof IconButton>} */
export const Sizes = {
  render: () => ({
    components: { IconButton },
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <IconButton size="small" icon="pi pi-plus" aria-label="Add" />
        <IconButton size="medium" icon="pi pi-plus" aria-label="Add" />
        <IconButton size="large" icon="pi pi-plus" aria-label="Add" />
      </div>
    `
  }),
  parameters: {
    docs: { description: { story: 'All size variants side by side.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof IconButton>} */
export const Loading = {
  args: { loading: true, icon: 'pi pi-plus', ariaLabel: 'Add' },
  render: Template,
  parameters: {
    docs: { description: { story: 'Loading state with spinner replacing the icon.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof IconButton>} */
export const Disabled = {
  args: { disabled: true, icon: 'pi pi-plus', ariaLabel: 'Add' },
  render: Template,
  parameters: {
    docs: { description: { story: 'Disabled state.' } }
  }
}
