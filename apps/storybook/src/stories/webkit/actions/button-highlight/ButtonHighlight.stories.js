import ButtonHighlight from '@aziontech/webkit/button-highlight'

/** @type {import('@storybook/vue3').Meta<typeof ButtonHighlight>} */
const meta = {
  title: 'Webkit/Actions/Button Highlight',
  component: ButtonHighlight,
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
          'Visually emphasized action trigger built on a brand-accent gradient. One visual treatment (the gradient); same prop surface as `Button` minus the `kind` axis. Use it to draw attention to a primary AI / highlight flow that needs to stand out.'
      }
    }
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible label text. Required — use `IconButton` for icon-only controls.',
      table: { category: 'props', type: { summary: 'string', required: true } }
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
      description: 'PrimeIcons class for the leading icon.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    href: {
      control: 'text',
      description: 'When set, renders as an anchor link.',
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
    label: 'Ask Azion',
    size: 'large',
    disabled: false,
    loading: false,
    icon: 'pi pi-sparkles',
    href: '',
    target: '_self'
  }
}

export default meta

const Template = (args) => ({
  components: { ButtonHighlight },
  setup() {
    const { onClick, ...props } = args

    return { props, onClick }
  },
  template: '<ButtonHighlight v-bind="props" @click="onClick" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof ButtonHighlight>} */
export const Default = {
  render: Template,
  parameters: {
    docs: { description: { story: 'Default highlight button at large size with an icon.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof ButtonHighlight>} */
export const Sizes = {
  render: () => ({
    components: { ButtonHighlight },
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <ButtonHighlight size="small" label="Ask Azion" icon="pi pi-sparkles" />
        <ButtonHighlight size="medium" label="Ask Azion" icon="pi pi-sparkles" />
        <ButtonHighlight size="large" label="Ask Azion" icon="pi pi-sparkles" />
      </div>
    `
  }),
  parameters: {
    docs: { description: { story: 'All size variants side by side.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof ButtonHighlight>} */
export const Loading = {
  args: { loading: true, label: 'Ask Azion' },
  render: Template,
  parameters: {
    docs: { description: { story: 'Loading state with spinner replacing the icon.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof ButtonHighlight>} */
export const Icon = {
  render: () => ({
    components: { ButtonHighlight },
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <ButtonHighlight label="Ask Azion" icon="pi pi-sparkles" />
        <ButtonHighlight label="Generate" icon="pi pi-bolt" />
        <ButtonHighlight label="Highlight" icon="pi pi-star" />
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Icon + label via the `icon` prop (PrimeIcons class) paired with `label`. `label` is required — for icon-only controls use `IconButton`.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof ButtonHighlight>} */
export const Disabled = {
  args: { disabled: true, label: 'Ask Azion' },
  render: Template,
  parameters: {
    docs: { description: { story: 'Disabled state with the gradient replaced by disabled tokens.' } }
  }
}
