import NetworkSection from '@aziontech/webkit/sections/network-section'

import { withStoryAssets, withTemplateAssets } from '../../../_shared/site-assets'
import { toSfc } from '../../../_shared/story-source'
import { OUTCOMES_SECTION } from '../../../templates/marketing/_sections/network-section'

const IMPORT = "import NetworkSection from '@aziontech/webkit/sections/network-section'"

/** @type {import('@storybook/vue3').Meta<typeof NetworkSection>} */
const meta = {
  title: 'Components/Sections/NetworkSection',
  component: NetworkSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }]
      }
    },
    docs: {
      description: {
        component:
          "The infrastructure band of a marketing page: a tall framed panel with the world network map drawn behind a small left-aligned title, a lead line and a row of claim chips, closed by a floor of either client outcomes (a quote with its highlights and the client's mark) or benefits (icon-led topics). It is a page section — the site places it from a `{ _id: 'network-section', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `network-map`, `section-title`, `card-grid`, `quote` and `topic`. `kind` picks the floor only: `outcomes` renders four quotes, `benefits` three topics; the band above is the same."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    kind: {
      control: 'select',
      options: ['outcomes', 'benefits'],
      description:
        'Which floor closes the band: `outcomes` renders the client quotes, `benefits` the icon-led topics.',
      table: {
        category: 'props',
        type: { summary: 'NetworkSectionKind' },
        defaultValue: { summary: "'outcomes'" }
      }
    },
    eyebrow: {
      control: 'text',
      description: 'Overline above the headline.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    title: {
      control: 'text',
      description:
        'Headline of the band, rendered by the small section title as its `h2`; the band renders nothing when empty.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    lead: {
      control: 'text',
      description: 'Overline-set line above the claims.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    claims: {
      control: 'object',
      description: 'Short figures rendered as chips under the lead, in order.',
      table: {
        category: 'props',
        type: { summary: 'string[]' },
        defaultValue: { summary: '[]' }
      }
    },
    outcomes: {
      control: 'object',
      description:
        "Client results for the `outcomes` floor, in order; each is `{ logo, logoAlt, logoTreatment?, text, highlights? }` where `logo` is the mark URL, `logoTreatment` is `'monochrome'` or `'as-is'`, and `highlights` are the phrases of `text` set in the accent.",
      table: {
        category: 'props',
        type: { summary: 'NetworkSectionOutcome[]' },
        defaultValue: { summary: '[]' }
      }
    },
    benefits: {
      control: 'object',
      description:
        'Topics for the `benefits` floor, in order; each is `{ icon, title, description }`.',
      table: {
        category: 'props',
        type: { summary: 'NetworkSectionBenefit[]' },
        defaultValue: { summary: '[]' }
      }
    }
  },
  args: withStoryAssets(OUTCOMES_SECTION.props)
}

export default meta

const Template = (args) => ({
  components: { NetworkSection },
  setup() {
    return { args }
  },
  template: '<NetworkSection v-bind="args" />'
})

const DEFAULT_MARKUP = `<NetworkSection
  kind="outcomes"
  eyebrow="Region: Earth."
  title="One distributed infrastructure without the complexity of managing, securing and scaling it"
  lead="Built around your users. Distributed around your data."
  :claims="['100+ data centers', '100+ Tbps network capacity', '30 ms median latency', '100% availability']"
  :outcomes="[
    {
      logo: '/marketing-components/logos/dafiti-extended-mono.svg',
      logoAlt: 'Dafiti',
      logoTreatment: 'monochrome',
      text: '86% faster load times, with a 45% cost reduction in data transfer.',
      highlights: ['86% faster load times', '45% cost reduction']
    },
    {
      logo: '/marketing-components/clients/madeiramadeira.svg',
      logoAlt: 'MadeiraMadeira',
      logoTreatment: 'as-is',
      text: '90% lower cloud costs and faster applications at scale.',
      highlights: ['90% lower cloud costs']
    },
    {
      logo: '/marketing-components/clients/renner-color.svg',
      logoAlt: 'Renner',
      logoTreatment: 'as-is',
      text: '67% saved on data transfer, even during massive traffic spikes.',
      highlights: ['67% saved']
    },
    {
      logo: '/marketing-components/clients/fourbank.svg',
      logoAlt: 'Fourbank',
      logoTreatment: 'monochrome',
      text: 'DDoS mitigated on applications and APIs, with a programmable security layer.',
      highlights: ['DDoS mitigated']
    }
  ]"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof NetworkSection>} */
export const Default = {
  render: Template,
  parameters: {
    visual: { modes: ['dark-desktop', 'light-desktop', 'dark-mobile', 'light-mobile'] },
    docs: {
      description: {
        story:
          'The band as the site places it: the region overline, the headline and lead over the world map, four claim chips, and a floor of four client outcomes with their marks. Edit the props in the Controls panel — a band with no title renders nothing at all.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const TYPES_TEMPLATE = `<div class="flex flex-col gap-(--spacing-xl)">
  <NetworkSection
    kind="outcomes"
    eyebrow="Region: Earth."
    title="One distributed infrastructure without the complexity of managing, securing and scaling it"
    lead="Built around your users. Distributed around your data."
    :claims="['100+ data centers', '100+ Tbps network capacity', '30 ms median latency', '100% availability']"
    :outcomes="[
      {
        logo: '/marketing-components/logos/dafiti-extended-mono.svg',
        logoAlt: 'Dafiti',
        logoTreatment: 'monochrome',
        text: '86% faster load times, with a 45% cost reduction in data transfer.',
        highlights: ['86% faster load times', '45% cost reduction']
      },
      {
        logo: '/marketing-components/clients/madeiramadeira.svg',
        logoAlt: 'MadeiraMadeira',
        logoTreatment: 'as-is',
        text: '90% lower cloud costs and faster applications at scale.',
        highlights: ['90% lower cloud costs']
      },
      {
        logo: '/marketing-components/clients/renner-color.svg',
        logoAlt: 'Renner',
        logoTreatment: 'as-is',
        text: '67% saved on data transfer, even during massive traffic spikes.',
        highlights: ['67% saved']
      },
      {
        logo: '/marketing-components/clients/fourbank.svg',
        logoAlt: 'Fourbank',
        logoTreatment: 'monochrome',
        text: 'DDoS mitigated on applications and APIs, with a programmable security layer.',
        highlights: ['DDoS mitigated']
      }
    ]"
  />
  <NetworkSection
    kind="benefits"
    eyebrow="Region: Earth."
    title="One distributed infrastructure without the complexity of managing, securing and scaling it"
    lead="Built around your users. Distributed around your data."
    :claims="['100+ data centers', '100+ Tbps network capacity', '30 ms median latency', '100% availability']"
    :benefits="[
      {
        icon: 'pi pi-globe',
        title: 'Global resilience beyond anycast',
        description: 'Azion\\'s software-defined global router steers traffic around failures and network degradation faster than BGP can reconverge. Always-on DDoS protection across 100+ data centers worldwide.'
      },
      {
        icon: 'pi pi-stopwatch',
        title: 'Low latency everywhere',
        description: 'Compute, AI, databases, and security run in every data center, close to your users. Median global latency stays under 30 ms, with a built-in CDN and tiered caching for every app.'
      },
      {
        icon: 'pi pi-arrows-v',
        title: 'Zero-ops autoscaling and failover',
        description: 'Absorbs any traffic spike with no cold starts, instantly scaling from zero to millions. No capacity planning, no provisioning. Scale-to-zero with no idle costs: you pay only for what you run.'
      }
    ]"
  />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof NetworkSection>} */
export const Types = {
  render: () => ({ components: { NetworkSection }, template: withTemplateAssets(TYPES_TEMPLATE) }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Both floors stacked: the `outcomes` kind closes the band with four client quotes, the `benefits` kind with three icon-led topics. The map, title, lead and claims above are the same in both.'
      },
      source: { code: toSfc(IMPORT, TYPES_TEMPLATE) }
    }
  }
}
