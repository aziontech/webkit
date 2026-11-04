import ClientQuotes from '@aziontech/webkit/sections/client-quotes'

import { toSfc } from '../../../_shared/story-source'
import { SITE_SECTION } from '../../../templates/marketing/_sections/client-quotes'

const IMPORT = "import ClientQuotes from '@aziontech/webkit/sections/client-quotes'"

/** @type {import('@storybook/vue3').Meta<typeof ClientQuotes>} */
const meta = {
  title: 'Components/Sections/ClientQuotes',
  component: ClientQuotes,
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
          "The client-stories band: a framed quote-tabs carousel of customer quotes, each signed by its author and marked by the client's logo, with one call to action under it. It is a page section — the site places it from a `{ _id: 'client-quotes', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `quote-tabs` and `button`."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    ariaLabel: {
      control: 'text',
      description: 'Accessible name of the quote carousel.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    items: {
      control: 'object',
      description:
        'The quotes, in order; each is `{ text, name?, jobTitle?, mark?, logo?, clientName?, photo? }` where `mark` is a registry mark name and `logo` a mark URL named by `clientName`.',
      table: {
        category: 'props',
        type: { summary: 'ClientQuotesItem[]' },
        defaultValue: { summary: '[]' }
      }
    },
    primaryAction: {
      control: 'object',
      description: 'Button under the quotes; `{ label, href, trailing? }`. Omitted when absent.',
      table: {
        category: 'props',
        type: { summary: 'ClientQuotesAction' },
        defaultValue: { summary: 'undefined' }
      }
    }
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { ClientQuotes },
  setup() {
    return { args }
  },
  template: '<ClientQuotes v-bind="args" />'
})

const DEFAULT_MARKUP = `<ClientQuotes
  aria-label="Client stories"
  :items='[
    {
      mark: "dafiti",
      clientName: "Dafiti",
      text: "One of the best CDN and WAF solutions I've ever used. Easy to implement and integrate, with speed and low latency that make a real difference for our customers.",
      name: "Julian H",
      jobTitle: "IT OPS, SRE & SEC Manager at Dafiti Group"
    },
    {
      mark: "axur",
      text: "With Azion, we scale proprietary AI models without managing infrastructure—inspecting millions of websites daily and automating the market’s fastest threat takedown.",
      name: "Fabio Ramos",
      jobTitle: "CEO at Axur"
    },
    {
      logo: "/marketing-components/logos/magalu-extended-color.svg",
      clientName: "Magalu",
      text: "Azion shielded us from sophisticated cyberattacks and empowered us to modernize our infrastructure, reduce costs, and deliver the best shopping experiences to millions of customers across Latin America.",
      name: "Allan Monteiro",
      jobTitle: "CISO & Head of Technology at Magalu"
    },
    {
      logo: "/marketing-components/logos/herospark-extended-color.svg",
      clientName: "HeroSpark",
      text: "Azion transformed our operations, reducing costs and improving performance while freeing 200+ monthly hours for strategic development.",
      name: "Mateus Leonardi",
      jobTitle: "CTO at HeroSpark"
    },
    {
      logo: "/marketing-components/logos/zoop-extended-color.svg",
      clientName: "Zoop",
      text: "Azion delivered the advanced protection and superior performance we needed, with fast implementation and immediate results.",
      name: "Ismael Aguilar",
      jobTitle: "Information Security Manager at Zoop"
    },
    {
      mark: "contabilizei",
      text: "With Azion, Contabilizei improved request delivery at the Edge, reduced infrastructure costs, and gained fast access to support whenever needed.",
      name: "Fabrício Santos",
      jobTitle: "DevSecOps Manager at Contabilizei"
    }
  ]'
  :primary-action="{ label: 'See customer stories', href: '/success-cases', trailing: true }"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof ClientQuotes>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The band as the site places it: six customer quotes in a framed carousel, each with its client mark and signature, and one call to action under the tabs. Edit the props in the Controls panel — a band with no items renders nothing at all.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}
