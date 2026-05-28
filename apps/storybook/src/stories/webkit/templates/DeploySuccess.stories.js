import DeploySuccess from '@aziontech/webkit/templates/deploy-success'
import { completeDeployLog } from '../code/complete-deploy-log.js'

/** @type {import('@storybook/vue3').Meta<typeof DeploySuccess>} */
const meta = {
  title: 'Webkit/Templates/Deploy Success',
  component: DeploySuccess,
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
          'Post-deploy success screen: optional global header, centered CardBox with congratulations message, scope tag, visit link, embedded build log, icon next steps, and manage CTA.'
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
      description: 'Supporting copy before the scope tag.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    scope: {
      control: 'text',
      description: 'Scope label rendered in the header tag.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    appName: {
      control: 'text',
      description: 'Deployed application name above the build log.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    lines: {
      control: 'object',
      description: 'Log entries passed to LogView.',
      table: { type: { summary: 'LogViewLine[]' }, category: 'props' }
    },
    stepsLabel: {
      control: 'text',
      description: 'Section label above the next-steps list.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    steps: {
      control: 'object',
      description: 'Ordered next-step entries (title, description, icon per row).',
      table: { type: { summary: 'DeploySuccessStep[]' }, category: 'props' }
    },
    actionLabel: {
      control: 'text',
      description: 'Primary footer button label.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    visitLabel: {
      control: 'text',
      description: 'Visit link label in the card header.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    visitHref: {
      control: 'text',
      description: 'Visit link destination URL.',
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
      description: 'Disables toolbar controls and the primary action button.',
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
    onVisitClick: {
      action: 'visit-click',
      description: 'Fires when the visit link is activated.',
      table: { type: { summary: 'MouseEvent' }, category: 'events' }
    },
    onStepClick: {
      action: 'step-click',
      description: 'Fires when a next-step row is activated.',
      table: { type: { summary: '[index: number, event: MouseEvent]' }, category: 'events' }
    },
    header: {
      control: false,
      description: 'Replaces the built-in GlobalHeader bar.',
      table: { type: { summary: 'VNode' }, category: 'slots' }
    },
    success: {
      control: false,
      description: 'Replaces the built-in congratulations header inside CardBox header.',
      table: { type: { summary: 'VNode' }, category: 'slots' }
    },
    logs: {
      control: false,
      description: 'Replaces the built-in app name + LogView region.',
      table: { type: { summary: 'VNode' }, category: 'slots' }
    },
    stepsSlot: {
      control: false,
      description: 'Replaces the built-in next-steps list.',
      table: { type: { summary: 'VNode' }, category: 'slots' }
    },
    actions: {
      control: false,
      description: 'Replaces the built-in footer primary button.',
      table: { type: { summary: 'VNode' }, category: 'slots' }
    }
  },
  args: {
    title: 'Congratulations!',
    description: 'You just deployed a new application into',
    scope: 'mygithub-scope',
    appName: 'myappname',
    stepsLabel: 'Next Steps',
    actionLabel: 'Manage',
    visitLabel: 'Visit',
    visitHref: 'https://example.com',
    showHeader: true,
    disabled: false
  }
}

export default meta

const defaultSteps = [
  {
    title: 'Customize Domain',
    description: 'Associate a custom domain and subdomains to Azion to handle user access.',
    icon: 'ai ai-domains'
  },
  {
    title: 'Point Traffic',
    description:
      'Redirect the traffic of a domain to Azion and take advantage of the distributed network.',
    icon: 'ai ai-network-lists'
  },
  {
    title: 'View Analytics',
    description: 'Gain powerful insights into your performance, availability, and security.',
    icon: 'ai ai-real-time-metrics'
  }
]

const Template = (args) => ({
  components: { DeploySuccess },
  setup() {
    return { args }
  },
  template: '<DeploySuccess v-bind="args" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof DeploySuccess>} */
export const Default = {
  args: {
    lines: completeDeployLog,
    steps: defaultSteps
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Default post-deploy success screen matching the Figma Example frame.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof DeploySuccess>} */
export const Disabled = {
  args: {
    lines: completeDeployLog,
    steps: defaultSteps,
    disabled: true
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Success screen with build log toolbar and manage action disabled.'
      }
    }
  }
}
