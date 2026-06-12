import Skeleton from '@aziontech/webkit/feedback/skeleton'

/** @type {import('@storybook/vue3').Meta<typeof Skeleton>} */
const meta = {
  title: 'Webkit/Feedback/Skeleton',
  component: Skeleton,
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
        component: [
          'Loading placeholder that reserves the space of content while it loads, reducing layout shift and signaling progress. Non-interactive and purely decorative: it renders a low-contrast surface block with a soft opacity pulse.',
          '',
          '## Usage',
          '',
          '```vue',
          '<script setup>',
          "import Skeleton from '@aziontech/webkit/feedback/skeleton'",
          '</script>',
          '',
          '<template>',
          '  <div aria-busy="true">',
          '    <Skeleton kind="circular" width="48px" height="48px" />',
          '    <Skeleton kind="shape" width="200px" height="16px" />',
          '    <Skeleton kind="shape" width="240px" height="120px" />',
          '  </div>',
          '</template>',
          '```'
        ].join('\n')
      }
    }
  },
  argTypes: {
    kind: {
      control: 'select',
      options: ['shape', 'circular'],
      description: 'Visual shape variant; controls the border radius token.',
      table: {
        category: 'props',
        type: { summary: "'shape' | 'circular'" },
        defaultValue: { summary: "'shape'" }
      }
    },
    width: {
      control: 'text',
      description: 'CSS width applied as inline style (e.g. `240px`, `100%`).',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'100%'" }
      }
    },
    height: {
      control: 'text',
      description: 'CSS height applied as inline style (e.g. `120px`, `1rem`); use a 1:1 width/height for a square.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'16px'" }
      }
    }
  },
  args: {
    kind: 'shape',
    width: '240px',
    height: '120px'
  }
}

export default meta

const Template = (args) => ({
  components: { Skeleton },
  setup() {
    return { args }
  },
  template: '<Skeleton v-bind="args" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof Skeleton>} */
export const Default = {
  render: Template,
  parameters: {
    docs: { description: { story: 'Default shape placeholder with the opacity pulse.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Skeleton>} */
export const Types = {
  render: () => ({
    components: { Skeleton },
    template: `
      <div class="flex flex-wrap items-center gap-[var(--spacing-3)]">
        <Skeleton kind="shape" width="240px" height="120px" />
        <Skeleton kind="shape" width="200px" height="16px" />
        <Skeleton kind="circular" width="48px" height="48px" />
      </div>
    `
  }),
  parameters: {
    docs: { description: { story: 'All kind variants side by side: shape (block and text line) and circular.' } }
  }
}
