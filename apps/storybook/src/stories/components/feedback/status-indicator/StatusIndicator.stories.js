import StatusIndicator from '@aziontech/webkit/status-indicator'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import StatusIndicator from '@aziontech/webkit/status-indicator'"

/** @type {import('@storybook/vue3').Meta<typeof StatusIndicator>} */
const meta = {
  title: 'Components/Feedback/StatusIndicator',
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
          'Communicates status, alerts, or progress to the user. Renders a colored status dot next to a label; while loading, a spinner replaces the dot and the label appends an ellipsis.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    severity: {
      control: 'select',
      options: ['success', 'info', 'neutral', 'warning', 'alt', 'danger'],
      description: 'Status variant; drives the dot color.',
      table: {
        category: 'props',
        type: { summary: "'success' | 'info' | 'neutral' | 'warning' | 'alt' | 'danger'" },
        defaultValue: { summary: "'success'" }
      }
    },
    label: {
      control: 'text',
      description: 'Visible label text.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Status'" }
      }
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading state and disables activation.',
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

const STATUS_TEMPLATE = `<div class="flex flex-wrap items-center gap-[var(--spacing-3)]">
  <StatusIndicator severity="success" label="Status" />
  <StatusIndicator severity="info" label="Status" />
  <StatusIndicator severity="neutral" label="Status" />
  <StatusIndicator severity="warning" label="Status" />
  <StatusIndicator severity="alt" label="Status" />
  <StatusIndicator severity="danger" label="Status" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof StatusIndicator>} */
export const Status = {
  render: () => ({ components: { StatusIndicator }, template: STATUS_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'All status variants side by side.' },
      source: { code: toSfc(IMPORT, STATUS_TEMPLATE) }
    }
  }
}

const LOADING_MARKUP = '<StatusIndicator severity="success" label="Status" loading />'

/** @type {import('@storybook/vue3').StoryObj<typeof StatusIndicator>} */
export const Loading = {
  args: {
    severity: 'success',
    label: 'Status',
    loading: true
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Loading state: spinner replaces the dot and the label appends an ellipsis.'
      },
      source: { code: toSfc(IMPORT, LOADING_MARKUP) }
    }
  }
}
