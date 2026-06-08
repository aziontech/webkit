import MiniButton from '@aziontech/webkit/mini-button'

/** @type {import('@storybook/vue3').Meta<typeof MiniButton>} */
const meta = {
  title: 'Webkit/Actions/Mini Button',
  component: MiniButton,
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
        component: `Compact text action with an optional trailing external-link icon and a ghost hover surface. Use for secondary CTAs in dense layouts where a full \`Button\` is too heavy.

\`\`\`vue
<script setup>
import MiniButton from '@aziontech/webkit/mini-button'
</script>

<template>
  <MiniButton label="Learn More" href="#" target="_blank" />
</template>
\`\`\``
      }
    }
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible label rendered inside the control.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: 'Learn More' } }
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
  template: '<MiniButton v-bind="args" @click="args.onClick" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof MiniButton>} */
export const Default = {
  render: Template,
  parameters: {
    docs: { description: { story: 'Default large mini button with trailing icon.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof MiniButton>} */
export const Sizes = {
  render: () => ({
    components: { MiniButton },
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <MiniButton size="medium" label="Learn More" href="#" />
        <MiniButton size="large" label="Learn More" href="#" />
      </div>
    `
  }),
  parameters: {
    docs: { description: { story: 'All size variants side by side.' } }
  }
}
