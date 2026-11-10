import StatusIndicator from '@aziontech/webkit/status-indicator'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import StatusIndicator from '@aziontech/webkit/status-indicator'"

/** @type {import('@storybook/vue3').Meta<typeof StatusIndicator>} */
const meta = {
  title: 'Components/Primitives/Feedback/StatusIndicator',
  component: StatusIndicator,
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
          'Shows the status of a resource as a small colored dot next to a short label. While the status is still in progress, the dot pulses.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    severity: {
      control: 'select',
      options: ['success', 'info', 'neutral', 'warning', 'alt', 'danger'],
      description: 'Severity token driving the status dot color.',
      table: {
        category: 'props',
        type: { summary: "'success' | 'info' | 'neutral' | 'warning' | 'alt' | 'danger'" },
        defaultValue: { summary: "'success'" }
      }
    },
    label: {
      control: 'text',
      description: 'Visible label text naming the status, in sentence case.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Status'" }
      }
    },
    loading: {
      control: 'boolean',
      description: 'Pulses the dot while the status is still in progress.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    }
  },
  args: {
    severity: 'success',
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

const DEFAULT_MARKUP = '<StatusIndicator severity="success" label="Status" />'

/** @type {import('@storybook/vue3').StoryObj<typeof StatusIndicator>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Default success status with label.' },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const STATUS_TEMPLATE = `<div class="flex flex-col items-start gap-(--spacing-lg)">
  <StatusIndicator severity="success" label="Ready" />
  <StatusIndicator severity="info" label="Queued" />
  <StatusIndicator severity="neutral" label="Canceled" />
  <StatusIndicator severity="warning" label="Building" />
  <StatusIndicator severity="alt" label="Promoted" />
  <StatusIndicator severity="danger" label="Error" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof StatusIndicator>} */
export const Status = {
  render: () => ({ components: { StatusIndicator }, template: STATUS_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'Every severity, each with a label that names its state.' },
      source: { code: toSfc(IMPORT, STATUS_TEMPLATE) }
    }
  }
}

const LOADING_MARKUP = '<StatusIndicator severity="warning" label="Building" loading />'

/** @type {import('@storybook/vue3').StoryObj<typeof StatusIndicator>} */
export const Loading = {
  args: {
    severity: 'warning',
    label: 'Building',
    loading: true
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'In progress: the dot pulses until the status settles. No separate spinner.'
      },
      source: { code: toSfc(IMPORT, LOADING_MARKUP) }
    }
  }
}
