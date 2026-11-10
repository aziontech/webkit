import HeroCopyOnTopArt from '@aziontech/webkit/hero-copy-on-top-art'

import { toSfc } from '../../../../_shared/story-source'
import { SITE_SECTION } from '../../../../templates/marketing/_sections/hero-copy-on-top-art'

const IMPORT = "import HeroCopyOnTopArt from '@aziontech/webkit/hero-copy-on-top-art'"

const ACTION_SUMMARY = "{ label: string; href: string; trailing?: boolean; target?: '_blank' | '_self' }"

/** @type {import('@storybook/vue3').Meta<typeof HeroCopyOnTopArt>} */
const meta = {
  title: 'Components/Marketing/Sections/HeroCopyOnTopArt',
  component: HeroCopyOnTopArt,
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
          "The opening band of a product page whose copy sits centered on top of a topology scene: the page `h1` with its overline, sentence and up to two actions over columns of status cards wired left to right. It is a page section — the site places it from a `{ _id: 'hero-copy-on-top-art', props }` entry and binds `props` straight onto it — and it composes `hero`, `hero-title`, `button`, `flow` and `tag`. It is a separate section from `hero-band` because the scene is a data model of its own: levels of cards, each with a status and an optional focus."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    eyebrow: {
      control: 'text',
      description: 'Short overline above the headline.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    highlight: {
      control: 'text',
      description:
        'Opening words of the headline, painted in the brand accent; reads as one sentence with `title`.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    title: {
      control: 'text',
      description: 'Page headline, rendered as the page `h1`; the band renders nothing when empty.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    description: {
      control: 'text',
      description: 'Sentence under the headline.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    primaryAction: {
      control: 'object',
      description:
        'First button under the headline; `{ label, href, trailing?, target? }`. Shown only with a label and a link.',
      table: {
        category: 'props',
        type: { summary: 'HeroCopyOnTopArtAction', detail: ACTION_SUMMARY },
        defaultValue: { summary: 'undefined' }
      }
    },
    secondaryAction: {
      control: 'object',
      description:
        'Second, outlined button beside the first; `{ label, href, trailing?, target? }`. Shown only with a label and a link.',
      table: {
        category: 'props',
        type: { summary: 'HeroCopyOnTopArtAction', detail: ACTION_SUMMARY },
        defaultValue: { summary: 'undefined' }
      }
    },
    levels: {
      control: 'object',
      description:
        'The columns of the topology, left to right; each is `{ nodes }`, the cards top to bottom, each `{ eyebrow, icon, title, label, severity, lit? }`. A card without `title` is skipped, and the scene renders only when a level has a card.',
      table: {
        category: 'props',
        type: { summary: 'HeroCopyOnTopArtLevel[]' },
        defaultValue: { summary: '[]' }
      }
    }
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { HeroCopyOnTopArt },
  setup() {
    return { args }
  },
  template: '<HeroCopyOnTopArt v-bind="args" />'
})

const DEFAULT_MARKUP = `<HeroCopyOnTopArt
  eyebrow="Workloads"
  title="Put your application close to users in seconds"
  description="A workload is the hostname, the certificate and the routing that make an application reachable. Create one and it is live in every Azion data center — no servers to size, no regions to pick."
  :primary-action="{ label: 'Start for free', href: 'https://console.azion.com/signup' }"
  :secondary-action="{ label: 'Docs', href: 'https://www.azion.com/en/documentation/', trailing: true }"
  :levels="[
    {
      nodes: [
        { eyebrow: 'Domain', icon: 'ai ai-domains', title: 'shop.example.com', label: 'Public', severity: 'info' },
        { eyebrow: 'Domain', icon: 'ai ai-domains', title: 'api.example.com', label: 'Public', severity: 'info' }
      ]
    },
    {
      nodes: [
        { eyebrow: 'Workload', icon: 'ai ai-workloads', title: 'shop-prod', label: 'Live', severity: 'success', lit: true }
      ]
    },
    {
      nodes: [
        { eyebrow: 'Application', icon: 'ai ai-edge-application', title: 'storefront', label: 'Active', severity: 'success' },
        { eyebrow: 'Firewall', icon: 'ai ai-edge-firewall', title: 'shop-rules', label: 'Active', severity: 'success' }
      ]
    }
  ]"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof HeroCopyOnTopArt>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The Workloads hero: the copy centered on top, and the topology under it — two domains feed the lit workload, which binds an application and a firewall. Edit the props in the Controls panel — a card with no title is skipped, and a band with no levels drops the scene.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}
