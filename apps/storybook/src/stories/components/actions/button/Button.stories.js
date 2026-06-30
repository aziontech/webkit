import { expect, fn, userEvent, within } from '@storybook/test'

import Button from '@aziontech/webkit/button'

/** @type {import('@storybook/vue3').Meta<typeof Button>} */
const meta = {
 title: 'Components/Actions/Button',
  component: Button,
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
          'Interactive control for user actions. `label` is required (use `IconButton` for icon-only controls). Supports optional icon, loading state, and link rendering when `href` is set.'
      }
    }
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible label text. Required — use `IconButton` for icon-only controls.',
      table: { category: 'props', type: { summary: 'string', required: true } }
    },
    kind: {
      control: 'select',
      options: ['primary', 'secondary', 'outlined', 'text', 'danger'],
      description: 'Visual variant.',
      table: {
        category: 'props',
        type: { summary: "'primary' | 'secondary' | 'outlined' | 'text' | 'danger'" },
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
    const { onClick, ...props } = args

    return { props, onClick }
  },
  template: '<Button v-bind="props" @click="onClick" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof Button>} */
export const Default = {
  args: { onClick: fn() },
  render: Template,
  parameters: {
    docs: { description: { story: 'Default primary button at large size.' } }
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Button' })

    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalledTimes(1)

    button.focus()
    await expect(button).toHaveFocus()

    await userEvent.keyboard('{Enter}')
    await expect(args.onClick).toHaveBeenCalledTimes(2)

    await userEvent.keyboard(' ')
    await expect(args.onClick).toHaveBeenCalledTimes(3)
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Button>} */
export const Types = {
  render: () => ({
    components: { Button },
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <Button kind="primary" label="Button" />
        <Button kind="secondary" label="Button" />
        <Button kind="outlined" label="Button" />
        <Button kind="text" label="Button" />
        <Button kind="danger" label="Button" />
      </div>
    `
  }),
  parameters: {
    docs: { description: { story: 'All kind variants side by side.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Button>} */
export const Sizes = {
  render: () => ({
    components: { Button },
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <Button size="small" label="Button" />
        <Button size="medium" label="Button" />
        <Button size="large" label="Button" />
      </div>
    `
  }),
  parameters: {
    docs: { description: { story: 'All size variants side by side.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Button>} */
export const Loading = {
  args: { loading: true, label: 'Button' },
  render: Template,
  parameters: {
    docs: { description: { story: 'Loading state with spinner replacing the icon.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Button>} */
export const Icon = {
  render: () => ({
    components: { Button },
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <Button kind="primary" label="Button" icon="pi pi-arrow-right" />
        <Button kind="secondary" label="Button" icon="pi pi-arrow-right" />
        <Button kind="outlined" label="Button" icon="pi pi-arrow-right" />
        <Button kind="text" label="Button" icon="pi pi-arrow-right" />
        <Button kind="danger" label="Button" icon="pi pi-trash" />
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

/** @type {import('@storybook/vue3').StoryObj<typeof Button>} */
export const Disabled = {
  args: { disabled: true, label: 'Button', onClick: fn() },
  render: Template,
  parameters: {
    docs: { description: { story: 'Disabled state.' } }
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Button' })

    await userEvent.click(button)
    await expect(args.onClick).not.toHaveBeenCalled()
    await expect(button).toHaveAttribute('aria-disabled', 'true')
  }
}
