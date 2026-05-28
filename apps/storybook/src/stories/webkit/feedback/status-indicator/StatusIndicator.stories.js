import StatusIndicator from '@aziontech/webkit/feedback/status-indicator'

const statuses = ['positive', 'info', 'neutral', 'warning', 'alt', 'danger']

/** @type {import('@storybook/vue3').Meta<typeof StatusIndicator>} */
const meta = {
  title: 'Webkit/Feedback/Status Indicator',
  component: StatusIndicator,
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
        component: [
          'Communicates status, alerts, or progress to the user.',
          '',
          '## Usage',
          '',
          '```vue',
          '<script setup>',
          "import StatusIndicator from '@aziontech/webkit/feedback/status-indicator'",
          '</script>',
          '',
          '<template>',
          '  <StatusIndicator status="positive" label="Status" />',
          '</template>',
          '```'
        ].join('\n')
      }
    }
  },
  argTypes: {
    status: {
      control: 'select',
      options: statuses,
      description: 'status.',
      table: {
        defaultValue: { summary: 'positive' }
      }
    },
    label: {
      control: 'text',
      description: 'Visible label text.',
      table: {
        defaultValue: { summary: 'Status' }
      }
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading state and disables activation.',
      table: {
        defaultValue: { summary: false }
      }
    }
  },
  args: {
    status: 'positive',
    label: 'Status',
    loading: false
  }
}

export default meta

const Template = (args) => ({
  components: { StatusIndicator },
  setup() {
    return { args }
  },
  template: '<StatusIndicator v-bind="args" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof StatusIndicator>} */
export const Default = {
  render: Template,
  parameters: {
    docs: { description: { story: 'Default positive status with label.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof StatusIndicator>} */
export const Status = {
  render: () => ({
    components: { StatusIndicator },
    setup() {
      return { statuses }
    },
    template: `
      <div class="flex flex-wrap items-center gap-[var(--spacing-3)]">
        <StatusIndicator
          v-for="status in statuses"
          :key="status"
          :status="status"
          label="Status"
        />
      </div>
    `
  }),
  parameters: {
    docs: { description: { story: 'All status variants side by side.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof StatusIndicator>} */
export const Loading = {
  args: {
    status: 'positive',
    label: 'Status',
    loading: true
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Loading state: spinner replaces the dot and the label appends an ellipsis.'
      }
    }
  }
}
