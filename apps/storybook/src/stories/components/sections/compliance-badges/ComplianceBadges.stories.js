import ComplianceBadges from '@aziontech/webkit/sections/compliance-badges'

import { withStoryAssets } from '../../../_shared/site-assets'
import { toSfc } from '../../../_shared/story-source'
import { SITE_SECTION } from '../../../templates/marketing/_sections/compliance-badges'

const IMPORT = "import ComplianceBadges from '@aziontech/webkit/sections/compliance-badges'"

/** @type {import('@storybook/vue3').Meta<typeof ComplianceBadges>} */
const meta = {
  title: 'Components/Sections/ComplianceBadges',
  component: ComplianceBadges,
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
          'The compliance band of a page: a framed media split whose copy states the certifications and whose media is a frame grid of badges, each a picture over a check-marked pill, closed by a "see more" cell. It is a page section — the site places it from a `{ _id: \'compliance-badges\', props }` entry and binds `props` straight onto it — and it composes `section-module`, `media-split` and `card-grid`.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
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
        'Headline of the band, rendered by the media split as its `h2`; the band renders nothing when empty.',
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
    ariaLabel: {
      control: 'text',
      description: 'Accessible name of the badge list.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    certifications: {
      control: 'object',
      description:
        'The badges, in order; each is `{ label, badge, alt }` where `badge` is the picture URL and `label` the pill text.',
      table: {
        category: 'props',
        type: { summary: 'ComplianceBadgesCertification[]' },
        defaultValue: { summary: '[]' }
      }
    },
    primaryAction: {
      control: 'object',
      description: 'The closing "see more" cell; `{ label, href }`. Omitted when absent.',
      table: {
        category: 'props',
        type: { summary: 'ComplianceBadgesAction' },
        defaultValue: { summary: 'undefined' }
      }
    }
  },
  args: withStoryAssets(SITE_SECTION.props)
}

export default meta

const Template = (args) => ({
  components: { ComplianceBadges },
  setup() {
    return { args }
  },
  template: '<ComplianceBadges v-bind="args" />'
})

const DEFAULT_MARKUP = `<ComplianceBadges
  eyebrow="Compliance"
  title="Meet your compliance requirements"
  description="Azion's certifications help customers and global partners meet a wide range of compliance requirements."
  aria-label="Compliance certifications"
  :certifications="[
    {
      label: 'SOC 2 & 3',
      badge: '/marketing-components/badges/soc.svg',
      alt: 'AICPA SOC 2 Type 2 and SOC 3 badge'
    },
    {
      label: 'PCI DSS',
      badge: '/marketing-components/badges/pci-dss.svg',
      alt: 'PCI DSS badge'
    },
    {
      label: 'LGPD',
      badge: '/marketing-components/badges/lgpd.svg',
      alt: 'LGPD badge'
    },
    {
      label: 'GDPR',
      badge: '/marketing-components/badges/gdpr.svg',
      alt: 'GDPR badge'
    },
    {
      label: 'CCPA',
      badge: '/marketing-components/badges/ccpa.svg',
      alt: 'CCPA badge'
    }
  ]"
  :primary-action="{ label: 'See more', href: '/compliance' }"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof ComplianceBadges>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The band as the marketing site places it: the certifications headline and lead in the media split, five certification badges in a frame grid, and a closing "See more" cell linking to the compliance page. Edit the props in the Controls panel — a band with no title renders nothing at all.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}
