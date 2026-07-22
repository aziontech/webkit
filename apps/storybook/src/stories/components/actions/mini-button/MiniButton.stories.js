import MiniButton from '@aziontech/webkit/mini-button'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import MiniButton from '@aziontech/webkit/mini-button'"

/** @type {import('@storybook/vue3').Meta<typeof MiniButton>} */
const meta = {
  title: 'Components/Actions/MiniButton',
  component: MiniButton,
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
          'Compact text action with an optional trailing external-link icon and a ghost hover surface. Use for secondary CTAs in dense layouts where a full `Button` is too heavy.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible label rendered inside the control.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Learn More'" }
      }
    },
    size: {
      control: 'select',
      options: ['large', 'medium'],
      description: 'Size token; affects height, gap, and typography.',
      table: {
        category: 'props',
        type: { summary: "'large' | 'medium'" },
        defaultValue: { summary: "'large'" }
      }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction and applies disabled tokens.',
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
        defaultValue: { summary: "'pi pi-external-link'" }
      }
    },
    href: {
      control: 'text',
      description: 'Destination URL for the anchor.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "'#'" } }
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
      description: 'Emitted when the control is activated (unless disabled).',
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
  components: { MiniButton },
  setup() {
    return { args }
  },
  template: '<MiniButton v-bind="args" />'
})

const DEFAULT_MARKUP = '<MiniButton size="large" label="Learn More" href="#" />'

/** @type {import('@storybook/vue3').StoryObj<typeof MiniButton>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Default large mini button with trailing icon.' },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const SIZES_TEMPLATE = `<div class="flex flex-wrap items-center gap-4">
  <MiniButton size="medium" label="Learn More" href="#" />
  <MiniButton size="large" label="Learn More" href="#" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof MiniButton>} */
export const Sizes = {
  render: () => ({ components: { MiniButton }, template: SIZES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'All size variants side by side.' },
      source: { code: toSfc(IMPORT, SIZES_TEMPLATE) }
    }
  }
}
