import ButtonHighlight from '@aziontech/webkit/button-highlight'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import ButtonHighlight from '@aziontech/webkit/button-highlight'"

/** @type {import('@storybook/vue3').Meta<typeof ButtonHighlight>} */
const meta = {
  title: 'Components/Actions/Button Highlight',
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
    return { args }
  },
  template: '<ButtonHighlight v-bind="args" />'
})

const DEFAULT_MARKUP = '<ButtonHighlight size="large" label="Ask Azion" icon="pi pi-sparkles" />'

/** @type {import('@storybook/vue3').StoryObj<typeof ButtonHighlight>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Default highlight button at large size with an icon.' },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const SIZES_TEMPLATE = `<div class="flex flex-wrap items-center gap-4">
  <ButtonHighlight size="small" label="Ask Azion" icon="pi pi-sparkles" />
  <ButtonHighlight size="medium" label="Ask Azion" icon="pi pi-sparkles" />
  <ButtonHighlight size="large" label="Ask Azion" icon="pi pi-sparkles" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof ButtonHighlight>} */
export const Sizes = {
  render: () => ({ components: { ButtonHighlight }, template: SIZES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'All size variants side by side.' },
      source: { code: toSfc(IMPORT, SIZES_TEMPLATE) }
    }
  }
}

const LOADING_MARKUP = '<ButtonHighlight label="Ask Azion" loading />'

/** @type {import('@storybook/vue3').StoryObj<typeof ButtonHighlight>} */
export const Loading = {
  args: { loading: true, label: 'Ask Azion' },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Loading adopts the disabled visual treatment for clarity: the gradient is replaced by disabled tokens, a spinner replaces the icon, and activation is blocked while the async action runs.'
      },
      source: { code: toSfc(IMPORT, LOADING_MARKUP) }
    }
  }
}

const ICON_TEMPLATE = `<div class="flex flex-wrap items-center gap-4">
  <ButtonHighlight label="Ask Azion" icon="pi pi-sparkles" />
  <ButtonHighlight label="Generate" icon="pi pi-bolt" />
  <ButtonHighlight label="Highlight" icon="pi pi-star" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof ButtonHighlight>} */
export const Icon = {
  render: () => ({ components: { ButtonHighlight }, template: ICON_TEMPLATE }),
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

const DISABLED_MARKUP = '<ButtonHighlight label="Ask Azion" disabled />'

/** @type {import('@storybook/vue3').StoryObj<typeof ButtonHighlight>} */
export const Disabled = {
  args: { disabled: true, label: 'Ask Azion' },
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Disabled state with the gradient replaced by disabled tokens.' },
      source: { code: toSfc(IMPORT, DISABLED_MARKUP) }
    }
  }
}
