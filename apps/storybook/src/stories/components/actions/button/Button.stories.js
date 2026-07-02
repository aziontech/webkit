import Button from '@aziontech/webkit/button'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Button from '@aziontech/webkit/button'"

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
      },
      canvas: { sourceState: 'shown' }
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
    return { args }
  },
  template: '<Button v-bind="args" />'
})

const DEFAULT_MARKUP = '<Button kind="primary" size="large" label="Button" />'

/** @type {import('@storybook/vue3').StoryObj<typeof Button>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Default primary button at large size.' },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const TYPES_TEMPLATE = `<div class="flex flex-wrap items-center gap-4">
  <Button kind="primary" label="Button" />
  <Button kind="secondary" label="Button" />
  <Button kind="outlined" label="Button" />
  <Button kind="text" label="Button" />
  <Button kind="danger" label="Button" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Button>} */
export const Types = {
  render: () => ({ components: { Button }, template: TYPES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'All kind variants side by side.' },
      source: { code: toSfc(IMPORT, TYPES_TEMPLATE) }
    }
  }
}

const SIZES_TEMPLATE = `<div class="flex flex-wrap items-center gap-4">
  <Button size="small" label="Button" />
  <Button size="medium" label="Button" />
  <Button size="large" label="Button" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Button>} */
export const Sizes = {
  render: () => ({ components: { Button }, template: SIZES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'All size variants side by side.' },
      source: { code: toSfc(IMPORT, SIZES_TEMPLATE) }
    }
  }
}

const ICON_TEMPLATE = `<div class="flex flex-wrap items-center gap-4">
  <Button kind="primary" label="Button" icon="pi pi-arrow-right" />
  <Button kind="secondary" label="Button" icon="pi pi-arrow-right" />
  <Button kind="outlined" label="Button" icon="pi pi-arrow-right" />
  <Button kind="text" label="Button" icon="pi pi-arrow-right" />
  <Button kind="danger" label="Button" icon="pi pi-trash" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Button>} */
export const Icon = {
  render: () => ({ components: { Button }, template: ICON_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Icon + label via the `icon` prop (PrimeIcons class) paired with `label`. `label` is required — for icon-only controls use `IconButton`.'
      },
      source: { code: toSfc(IMPORT, ICON_TEMPLATE) }
    }
  }
}

const LOADING_MARKUP = '<Button label="Button" loading />'

/** @type {import('@storybook/vue3').StoryObj<typeof Button>} */
export const Loading = {
  args: { loading: true, label: 'Button' },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Loading adopts the disabled visual treatment for clarity: a spinner replaces the icon and activation is blocked while the async action runs.'
      },
      source: { code: toSfc(IMPORT, LOADING_MARKUP) }
    }
  }
}

const DISABLED_MARKUP = '<Button label="Button" disabled />'

/** @type {import('@storybook/vue3').StoryObj<typeof Button>} */
export const Disabled = {
  args: { disabled: true, label: 'Button' },
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Disabled state.' },
      source: { code: toSfc(IMPORT, DISABLED_MARKUP) }
    }
  }
}
