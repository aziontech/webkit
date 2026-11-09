import ContactHub from '@aziontech/webkit/sections/contact-hub'

import { toSfc } from '../../../_shared/story-source'
import { SITE_SECTION } from '../../../templates/marketing/_sections/contact-hub'

const IMPORT = "import ContactHub from '@aziontech/webkit/sections/contact-hub'"

/** @type {import('@storybook/vue3').Meta<typeof ContactHub>} */
const meta = {
  title: 'Components/Sections/ContactHub',
  component: ContactHub,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }]
      }
    },
    docs: {
      description: {
        component:
          "The band under the Contact title band: the team lanes side by side (Sales and Support), each with its scope in one sentence and the action that reaches that team, over a row of self-serve channels. It is a page section — the site places it from a `{ _id: 'contact-hub', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `card-grid`, `topic` and `button`. A lane can carry a second link to the system status page, so a reader can check for an incident before opening a ticket."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    lanes: {
      control: 'object',
      description:
        "The team lanes side by side, in order; each is `{ icon, title, description, action?, statusLink? }` where `action` is the lane's button and `statusLink` the system status link beside it.",
      table: {
        category: 'props',
        type: { summary: 'ContactHubLane[]' },
        defaultValue: { summary: '[]' }
      }
    },
    channels: {
      control: 'object',
      description:
        'The self-serve channels under the lanes, in order; each is `{ icon, title, description, href, target? }`, rendered as a linked topic.',
      table: {
        category: 'props',
        type: { summary: 'ContactHubChannel[]' },
        defaultValue: { summary: '[]' }
      }
    }
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { ContactHub },
  setup() {
    return { args }
  },
  template: '<ContactHub v-bind="args" />'
})

const DEFAULT_MARKUP = `<ContactHub
  :lanes="[
    {
      icon: 'pi pi-briefcase',
      title: 'Sales',
      description: 'Discuss your requirements, get custom pricing, or see the platform running on your own workload.',
      action: { label: 'Talk to sales', href: '/contact/sales' }
    },
    {
      icon: 'pi pi-headphones',
      title: 'Support',
      description: 'Log in with your Azion account to open a ticket. Our engineers pick it up 24/7 on paid support plans.',
      action: { label: 'Log in to open a ticket', href: 'https://console.azion.com/login', trailing: true },
      statusLink: { label: 'System status', href: 'https://status.azion.com/', target: '_blank' }
    }
  ]"
  :channels="[
    {
      icon: 'pi pi-shield',
      title: 'Under a cyberattack?',
      description: 'Get emergency mitigation for an attack in progress, even before you become a customer.',
      href: 'https://www.azion.com/en/lp/under-attack-mitigation/',
      target: '_blank'
    },
    {
      icon: 'pi pi-discord',
      title: 'Join the community',
      description: 'Ask developers and the Azion team on Discord. Open to everyone, on any plan.',
      href: 'https://discord.com/invite/pM8ANzztuB',
      target: '_blank'
    },
    {
      icon: 'pi pi-book',
      title: 'Read the docs',
      description: 'Guides, API reference, and troubleshooting for every Azion product.',
      href: 'https://www.azion.com/en/documentation/',
      target: '_blank'
    }
  ]"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof ContactHub>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The Contact page band: Sales and Support lanes, Support with its system status link, over three self-serve channels. Edit the props in the Controls panel — a band with no lanes and no channels renders nothing.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}
