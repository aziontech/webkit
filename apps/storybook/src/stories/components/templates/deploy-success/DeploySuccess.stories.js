import DeploySuccess from '@aziontech/webkit/deploy-success'

import { toSfc } from '../../../_shared/story-source'
import { completeDeployLog } from '../../code/log-view/complete-deploy-log.js'

const defaultSteps = [
  {
    title: 'Customize Domain',
    description: 'Associate a custom domain and subdomains to Azion to handle user access.',
    icon: 'ai ai-domains'
  },
  {
    title: 'Point Traffic',
    description: 'Redirect the traffic of a domain to Azion and take advantage of the distributed network.',
    icon: 'ai ai-network-lists'
  },
  {
    title: 'View Analytics',
    description: 'Gain powerful insights into your performance, availability, and security.',
    icon: 'ai ai-real-time-metrics'
  }
]

const IMPORT = [
  "import DeploySuccess from '@aziontech/webkit/deploy-success'",
  '',
  'const steps = [',
  "  { title: 'Customize Domain', description: 'Associate a custom domain to handle user access.', icon: 'ai ai-domains' },",
  "  { title: 'Point Traffic', description: 'Redirect traffic to Azion and use the distributed network.', icon: 'ai ai-network-lists' },",
  "  { title: 'View Analytics', description: 'Gain insights into performance, availability, and security.', icon: 'ai ai-real-time-metrics' }",
  ']',
  'const lines = [',
  "  { id: '1', time: '13:47:33', type: 'text', message: 'Deploy started successfully!' },",
  "  { id: '2', time: '13:49:10', type: 'success', message: 'Deploy finalized successfully!' }",
  ']'
]

const meta = {
  title: 'Components/Templates/DeploySuccess',
  component: DeploySuccess,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component:
          'Post-deploy success screen: optional global header, centered CardBox with a congratulations message, scope tag, visit link, embedded LogView build log, icon next-steps list, and a "Manage" CTA.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Main success heading in the card header region.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "'Congratulations!'" } }
    },
    description: {
      control: 'text',
      description: 'Supporting copy before the scope tag.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    scope: {
      control: 'text',
      description: 'Scope label rendered in the header tag.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "'mygithub-scope'" } }
    },
    appName: {
      control: 'text',
      description: 'Deployed application name above the build log.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "'myappname'" } }
    },
    lines: {
      control: false,
      description: 'Build log entries passed to LogView.',
      table: { category: 'props', type: { summary: 'LogViewLine[]' }, defaultValue: { summary: '[]' } }
    },
    stepsLabel: {
      control: 'text',
      description: 'Section label above the next-steps list.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "'Next Steps'" } }
    },
    steps: {
      control: false,
      description: 'Ordered next-step entries (title, description, icon per row).',
      table: { category: 'props', type: { summary: 'DeploySuccessStep[]' } }
    },
    actionLabel: {
      control: 'text',
      description: 'Primary footer button label.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "'Manage'" } }
    },
    visitLabel: {
      control: 'text',
      description: 'Visit link label in the card header.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "'Visit'" } }
    },
    visitHref: {
      control: 'text',
      description: 'Visit link destination URL.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "'#'" } }
    },
    showHeader: {
      control: 'boolean',
      description: 'When true, renders the top GlobalHeader bar with the brand slot.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables toolbar controls and the primary action button.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    onActionClick: {
      action: 'action-click',
      description: 'Fires when the primary footer button is activated.',
      table: { category: 'events', type: { summary: 'MouseEvent' } }
    },
    onVisitClick: {
      action: 'visit-click',
      description: 'Fires when the visit link is activated.',
      table: { category: 'events', type: { summary: 'MouseEvent' } }
    },
    onStepClick: {
      action: 'step-click',
      description: 'Fires when a next-step row is activated.',
      table: { category: 'events', type: { summary: '[index: number, event: MouseEvent]' } }
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

const Template = (args) => ({
  components: { DeploySuccess },
  setup() {
    return { args }
  },
  template: '<DeploySuccess v-bind="args" />'
})

const DEFAULT_MARKUP = `<DeploySuccess
  app-name="myappname"
  scope="mygithub-scope"
  visit-href="https://example.com"
  :lines="lines"
  :steps="steps"
/>`

export const Default = {
  args: { lines: completeDeployLog, steps: defaultSteps },
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Default post-deploy success screen matching the Figma Example frame.' },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const DISABLED_MARKUP = `<DeploySuccess
  app-name="myappname"
  scope="mygithub-scope"
  visit-href="https://example.com"
  :lines="lines"
  :steps="steps"
  disabled
/>`

export const Disabled = {
  args: { lines: completeDeployLog, steps: defaultSteps, disabled: true },
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Success screen with the build-log toolbar and the manage action disabled.' },
      source: { code: toSfc(IMPORT, DISABLED_MARKUP) }
    }
  }
}
