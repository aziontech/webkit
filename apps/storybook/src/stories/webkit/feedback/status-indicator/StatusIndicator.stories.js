import StatusIndicator from '@aziontech/webkit/feedback/status-indicator'

const statuses = ['positive', 'info', 'neutral', 'warning', 'alt', 'danger']

export default {
  title: 'Webkit/Feedback/Status Indicator',
  component: StatusIndicator,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark'
    },
    docs: {
      description: {
        component:
          'Inline status indicator with a colored dot and label. When `loading` is true, the dot is replaced by a spinner and the label uses muted text.'
      }
    }
  },
  argTypes: {
    status: {
      control: 'select',
      options: statuses,
      description: 'Visual status variant (Figma: Positive, Info, Neutral, Warning, Alt, Danger)'
    },
    label: {
      control: 'text',
      description: 'Status label text'
    },
    loading: {
      control: 'boolean',
      description: 'Shows spinner instead of dot; label uses muted color'
    }
  }
}

export const Default = {
  args: {
    status: 'positive',
    label: 'Status',
    loading: false
  },
  render: (args) => ({
    components: { StatusIndicator },
    setup() {
      return { args }
    },
    template: `
      <StatusIndicator v-bind="args" />
    `
  })
}

export const AllStatuses = {
  render: () => ({
    components: { StatusIndicator },
    setup() {
      return { statuses }
    },
    template: `
      <div class="flex flex-col gap-4">
        <StatusIndicator
          v-for="status in statuses"
          :key="status"
          :status="status"
          label="Status"
        />
      </div>
    `
  })
}

export const Loading = {
  args: {
    status: 'positive',
    label: 'Status',
    loading: true
  },
  render: (args) => ({
    components: { StatusIndicator },
    setup() {
      return { args }
    },
    template: `
      <StatusIndicator v-bind="args" />
    `
  })
}
