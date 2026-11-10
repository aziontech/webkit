import InvestorMarks from '@aziontech/webkit/investor-marks'

import { withStoryAssets } from '../../../../_shared/site-assets'
import { toSfc } from '../../../../_shared/story-source'
import { SITE_SECTION } from '../../../../templates/marketing/_sections/investor-marks'

const IMPORT = "import InvestorMarks from '@aziontech/webkit/investor-marks'"

/** @type {import('@storybook/vue3').Meta<typeof InvestorMarks>} */
const meta = {
  title: 'Components/Marketing/Sections/InvestorMarks',
  component: InvestorMarks,
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
          "The investors band: a centered section title over a two-column bento grid where each cell is an investor's mark, linked to its site, that lifts on hover to reveal a \"visit website\" line. It is a page section — the site places it from a `{ _id: 'investor-marks', props }` entry and binds `props` straight onto it — so its whole API is the props below, and it composes `section-module`, `section-title`, `frame-box` and `bento-grid`."
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
        'Headline of the band, rendered by the centered section title as its `h2`; the band renders no header when empty.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    linkLabel: {
      control: 'text',
      description:
        "Line revealed under a mark on hover, and the start of each link's accessible name.",
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    items: {
      control: 'object',
      description:
        'The investors, in order; each is `{ name, logo, logoLight?, href }` where `logo` is the mark on the dark theme and `logoLight` the one on the light theme.',
      table: {
        category: 'props',
        type: { summary: 'InvestorMarksItem[]' },
        defaultValue: { summary: '[]' }
      }
    }
  },
  args: withStoryAssets(SITE_SECTION.props)
}

export default meta

const Template = (args) => ({
  components: { InvestorMarks },
  setup() {
    return { args }
  },
  template: '<InvestorMarks v-bind="args" />'
})

const DEFAULT_MARKUP = `<InvestorMarks
  eyebrow="Investors"
  title="Backed by visionary investors"
  link-label="Visit website"
  :items="[
    {
      name: 'monashees+',
      logo: '/marketing-components/logos/monashees-extended-reversed.svg',
      logoLight: '/marketing-components/logos/monashees-extended-mono.svg',
      href: 'https://www.monashees.com'
    },
    {
      name: 'Qualcomm Ventures',
      logo: '/marketing-components/logos/qualcomm-extended-reversed.svg',
      logoLight: '/marketing-components/logos/qualcomm-extended-mono.svg',
      href: 'https://www.qualcommventures.com'
    }
  ]"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof InvestorMarks>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The investors band as the company page places it: a centered eyebrow and headline over the investor marks in a two-column bento grid. Hover or focus a mark to reveal its link line. Edit the props in the Controls panel — a band with no items renders nothing at all.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}
