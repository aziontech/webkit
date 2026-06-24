import PlanSuccess from '@aziontech/webkit/plan-success'

/** @type {import('@storybook/vue3').Meta<typeof PlanSuccess>} */
const meta = {
  title: 'Templates/Plan Success',
  component: PlanSuccess,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'landmark-one-main', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        component:
          'Post-checkout success screen for the Azion Plans flow: optional global header, centered CardBox with activation message, numbered next steps, and primary deploy CTA.'
      }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Main success heading in the card header region.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    description: {
      control: 'text',
      description: 'Supporting copy under the success heading.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    stepsLabel: {
      control: 'text',
      description: 'Section label above the numbered steps list.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    steps: {
      control: 'object',
      description: 'Ordered next-step entries (title + description per row).',
      table: { type: { summary: 'PlanSuccessStep[]' }, category: 'props' }
    },
    actionLabel: {
      control: 'text',
      description: 'Primary footer button label.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    showHeader: {
      control: 'boolean',
      description: 'When true, renders the top GlobalHeader bar with the brand.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: 'props'
      }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the primary action button.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'props'
      }
    },
    onActionClick: {
      action: 'action-click',
      description: 'Fires when the primary footer button is activated.',
      table: { type: { summary: 'MouseEvent' }, category: 'events' }
    },
    header: {
      control: false,
      description: 'Replaces the built-in GlobalHeader bar.',
      table: { type: { summary: 'VNode' }, category: 'slots' }
    },
    success: {
      control: false,
      description: 'Replaces the built-in success banner inside CardBox header.',
      table: { type: { summary: 'VNode' }, category: 'slots' }
    },
    actions: {
      control: false,
      description: 'Replaces the built-in footer primary button.',
      table: { type: { summary: 'VNode' }, category: 'slots' }
    }
  },
  args: {
    title: 'Your Pro Plan is now Active',
    description: 'A receipt has been sent to your email for your records.',
    stepsLabel: 'Next Steps',
    actionLabel: 'Start deploying',
    showHeader: true,
    disabled: false
  }
}

export default meta

const defaultSteps = [
  {
    title: 'Start by creating your first Deploy',
    description:
      'Deploy your workload and start delivering content through the Azion Network.'
  },
  {
    title: 'Protect your Workload',
    description: 'Enable security features to safeguard your workloads, users, and data.'
  },
  {
    title: 'Observe your Metrics',
    description:
      'Track metrics, analyze traffic in real-time, and gain insights to optimize and protect your applications.'
  }
]

const Template = (args) => ({
  components: { PlanSuccess },
  setup() {
    return { args }
  },
  template: '<PlanSuccess v-bind="args" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof PlanSuccess>} */
export const Default = {
  args: {
    steps: defaultSteps
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Default plan activation success screen matching the Azion Plans checkout flow.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof PlanSuccess>} */
export const Disabled = {
  args: {
    steps: defaultSteps,
    disabled: true
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Success screen with the primary deploy action disabled.'
      }
    }
  }
}
