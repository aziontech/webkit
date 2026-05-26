import Button from '@aziontech/webkit/actions/button'

/** @type {import('@storybook/vue3').Meta<typeof Button>} */
const meta = {
  title: 'Webkit/Actions/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
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
          'Interactive control for user actions. Supports label text, optional icon, loading state, and link rendering when `href` is set.'
      }
    }
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible label text.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    kind: {
      control: 'select',
      options: ['primary', 'secondary', 'outlined', 'text'],
      description: 'Visual variant.',
      table: {
        category: 'props',
        type: { summary: "'primary' | 'secondary' | 'outlined' | 'text'" },
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
    icon: {
      control: 'text',
      description: 'PrimeIcons class for the leading/trailing icon.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
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
    label: 'Button',
    kind: 'primary',
    size: 'large',
    disabled: false,
    loading: false,
    icon: '',
    href: '',
    target: '_self'
  }
}

export default meta

const Template = (args) => ({
  components: { Button },
  setup() {
    return { args }
  },
  template: '<Button v-bind="args" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof Button>} */
export const Default = {
  render: Template,
  parameters: {
    docs: { description: { story: 'Default primary button at large size.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Button>} */
export const Primary = {
  args: { kind: 'primary', label: 'Button' },
  render: Template,
  parameters: {
    docs: { description: { story: 'Primary kind variant.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Button>} */
export const Secondary = {
  args: { kind: 'secondary', label: 'Button' },
  render: Template,
  parameters: {
    docs: { description: { story: 'Secondary kind variant.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Button>} */
export const Outlined = {
  args: { kind: 'outlined', label: 'Button' },
  render: Template,
  parameters: {
    docs: { description: { story: 'Outlined kind variant.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Button>} */
export const Text = {
  args: { kind: 'text', label: 'Button' },
  render: Template,
  parameters: {
    docs: { description: { story: 'Text kind variant.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Button>} */
export const Small = {
  args: { size: 'small', label: 'Button' },
  render: Template,
  parameters: {
    docs: { description: { story: 'Small size variant.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Button>} */
export const Medium = {
  args: { size: 'medium', label: 'Button' },
  render: Template,
  parameters: {
    docs: { description: { story: 'Medium size variant.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Button>} */
export const Large = {
  args: { size: 'large', label: 'Button' },
  render: Template,
  parameters: {
    docs: { description: { story: 'Large size variant.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Button>} */
export const Disabled = {
  args: { disabled: true, label: 'Button' },
  render: Template,
  parameters: {
    docs: { description: { story: 'Disabled state.' } }
  }
}
