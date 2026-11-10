import FeatureScroll from '@aziontech/webkit/feature-scroll'

import { toSfc } from '../../../../_shared/story-source'
import { SITE_SECTION } from '../../../../templates/marketing/_sections/feature-scroll'

const IMPORT = "import FeatureScroll from '@aziontech/webkit/feature-scroll'"

/** @type {import('@storybook/vue3').Meta<typeof FeatureScroll>} */
const meta = {
  title: 'Components/Marketing/Sections/FeatureScroll',
  component: FeatureScroll,
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
          "The walkthrough band of a product page: a large section title over one screen per feature. From the large breakpoint up the features scroll through a sticky stack — the copy advances while the illustration stays pinned in a framed, textured stage with one small action under each step; below it the same features are a three-column grid of media tiles. It is a page section — the site places it from a `{ _id: 'feature-scroll', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box`, `card-grid`, `media-tile`, `illustration`, `sticky-stack`, `texture-material` and `button`."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    eyebrow: {
      control: 'text',
      description: 'Overline above the section title.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    title: {
      control: 'text',
      description:
        'Headline of the band, rendered by the large section title as its `h2`; the band renders no header when empty.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    description: {
      control: 'text',
      description: 'Supporting sentence under the headline.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    items: {
      control: 'object',
      description:
        'The features, in order; each is `{ title, description, illustration, action? }` where `illustration` is a registry name and `action` is `{ label, href, trailing? }` rendered as a small secondary button under the step.',
      table: {
        category: 'props',
        type: { summary: 'FeatureScrollItem[]' },
        defaultValue: { summary: '[]' }
      }
    }
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { FeatureScroll },
  setup() {
    return { args }
  },
  template: '<FeatureScroll v-bind="args" />'
})

const DEFAULT_MARKUP = `<FeatureScroll
  eyebrow="Workloads"
  title="Everything a workload does, one screen at a time"
  description="Scroll through the console a workload is run from: the list, the topology, the domains, the deploy and the rollout. Each screen is the one you get, not a picture of it."
  :items="[
    {
      title: 'Every workload on one list',
      description: 'See each workload with its domain, status and last deployment, so what is live is never a question.',
      illustration: 'stay-in-control',
      action: { label: 'Docs', href: 'https://www.azion.com/en/documentation/products/workloads/', trailing: true }
    },
    {
      title: 'Read the deployment topology',
      description: 'The domains, the application and the firewall a workload serves, drawn as one chain.',
      illustration: 'global-network',
      action: { label: 'Docs', href: 'https://www.azion.com/en/documentation/products/workloads/', trailing: true }
    },
    {
      title: 'Domains and TLS, handled',
      description: 'Add a domain, get its certificate issued and renewed, and set the TLS floor without leaving the page.',
      illustration: 'dns-protection',
      action: { label: 'Docs', href: 'https://www.azion.com/en/documentation/products/workloads/', trailing: true }
    },
    {
      title: 'Ship a version in seconds',
      description: 'Build, upload, propagate and warm the cache, every step streamed as it happens until the version is live everywhere.',
      illustration: 'fastest-path-to-live-website',
      action: { label: 'Docs', href: 'https://www.azion.com/en/documentation/products/workloads/', trailing: true }
    },
    {
      title: 'Gradual rollouts and instant rollback',
      description: 'Send a share of traffic to a new version, promote it to every data center once it holds, or roll back to the last one without a redeploy.',
      illustration: 'branches',
      action: { label: 'Docs', href: 'https://www.azion.com/en/documentation/products/workloads/', trailing: true }
    }
  ]"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof FeatureScroll>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The band as the Workloads page places it: the product name as overline, the headline and lead over five feature screens, each with its own illustration and a link out to the documentation. From the large breakpoint up the features run through the sticky stack with the illustration pinned; below it they fall into a three-column grid of media tiles. Edit the props in the Controls panel — a band with no items renders nothing at all.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}
