import Divider from '@aziontech/webkit/divider'

/** @type {import('@storybook/vue3').Meta<typeof Divider>} */
const meta = {
  title: 'Components/Layout/Divider',
  component: Divider,
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
        component: [
          'Thin separator line that visually splits content into groups. Renders as a full-width hairline (`horizontal`) or full-height hairline (`vertical`), and can carry centered content (an "Or"-style label) when the default slot or `label` prop is set.',
          '',
          '## Usage',
          '',
          '```vue',
          '<script setup>',
          "import Divider from '@aziontech/webkit/divider'",
          '</script>',
          '',
          '<template>',
          '  <Divider />',
          '  <Divider orientation="vertical" />',
          '  <Divider label="Or" />',
          '</template>',
          '```'
        ].join('\n')
      }
    }
  },
  argTypes: {
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'Layout axis of the separator line.',
      table: {
        category: 'props',
        type: { summary: "'horizontal' | 'vertical'" },
        defaultValue: { summary: "'horizontal'" }
      }
    },
    label: {
      control: 'text',
      description: 'Fallback centered text shown when the default slot is empty.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    default: {
      description: 'Centered content; overrides `label` when provided.',
      control: false,
      table: { category: 'slots', type: { summary: 'VNode | string' } }
    }
  },
  args: {
    orientation: 'horizontal',
    label: ''
  }
}

export default meta

const Template = (args) => ({
  components: { Divider },
  setup() {
    return { args }
  },
  template: '<Divider v-bind="args" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof Divider>} */
export const Default = {
  render: Template,
  parameters: {
    docs: { description: { story: 'Horizontal hairline separating stacked content.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Divider>} */
export const Orientations = {
  render: () => ({
    components: { Divider },
    template: `
      <div class="flex items-stretch gap-[var(--spacing-md)] h-[120px] w-full">
        <div class="flex-1 flex flex-col justify-center gap-[var(--spacing-sm)]">
          <span class="text-body-sm text-[var(--text-default)]">Above</span>
          <Divider orientation="horizontal" />
          <span class="text-body-sm text-[var(--text-default)]">Below</span>
        </div>
        <Divider orientation="vertical" />
        <div class="flex-1 flex items-center justify-center text-body-sm text-[var(--text-default)]">
          Beside the vertical divider
        </div>
      </div>
    `
  }),
  parameters: {
    docs: { description: { story: 'Horizontal and vertical orientations side by side.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Divider>} */
export const WithLabel = {
  render: Template,
  args: { label: 'Or' },
  parameters: {
    docs: { description: { story: 'Centered label splitting the line; the default slot overrides it when provided.' } }
  }
}
