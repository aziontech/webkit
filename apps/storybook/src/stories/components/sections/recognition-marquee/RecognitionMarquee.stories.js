import RecognitionMarquee from '@aziontech/webkit/sections/recognition-marquee'

import { toSfc } from '../../../_shared/story-source'
import { SITE_SECTION } from '../../../templates/marketing/_sections/recognition-marquee'

const IMPORT = "import RecognitionMarquee from '@aziontech/webkit/sections/recognition-marquee'"

/** @type {import('@storybook/vue3').Meta<typeof RecognitionMarquee>} */
const meta = {
  title: 'Components/Sections/RecognitionMarquee',
  component: RecognitionMarquee,
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
          "The analyst-recognition band: a section title over a framed strip of signed quotes, one per report, marked by the firm logo. The strip scrolls continuously and pauses on hover or focus. It is a page section: the site places it from a `{ _id: 'recognition-marquee', props }` entry and binds `props` straight onto it, so its whole API is the props below."
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
        'Headline of the band, rendered by the section title as its `h2`; the band renders no header when empty.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name of the scrolling region.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    duration: {
      control: 'number',
      description: 'Seconds one loop of the strip takes; `0` paces it at twelve seconds per item.',
      table: {
        category: 'props',
        type: { summary: 'number' },
        defaultValue: { summary: '0' }
      }
    },
    items: {
      control: 'object',
      description:
        'The recognitions, in order; each is `{ text, reportName, date?, firmName, logo, logoLight? }` where `logo` is the firm mark on the dark theme and `logoLight` the one on the light theme.',
      table: {
        category: 'props',
        type: { summary: 'RecognitionMarqueeItem[]' },
        defaultValue: { summary: '[]' }
      }
    }
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { RecognitionMarquee },
  setup() {
    return { args }
  },
  template: '<RecognitionMarquee v-bind="args" />'
})

const DEFAULT_MARKUP = `<RecognitionMarquee
  eyebrow="Analysts"
  title="Recognized as a market leader"
  aria-label="Analyst recognitions"
  :items="[
    {
      text: 'Named a Leader and Fast Mover, and the only vendor whose platform meets every key criterion the report sets for a full-stack edge deployment.',
      reportName: 'GigaOm Radar for Full-Stack Edge Deployments v3',
      date: 'May 2026',
      firmName: 'GigaOm',
      logo: '/marketing-components/logos/gigaom-extended-reversed.svg',
      logoLight: '/marketing-components/logos/gigaom-extended-color.svg'
    },
    {
      text: 'Evaluated as a Strong Performer among the edge development platforms that matter most.',
      reportName: 'The Forrester Wave™: Edge Development Platforms',
      date: 'March 2026',
      firmName: 'Forrester',
      logo: '/marketing-components/logos/forrester-extended-reversed.svg',
      logoLight: '/marketing-components/logos/forrester-extended-color.svg'
    },
    {
      text: 'Covered as a vendor in the market guide that defines the edge distribution platform category, in two consecutive editions.',
      reportName: 'Gartner Market Guide for Edge Distribution Platforms',
      date: 'November 2025',
      firmName: 'Gartner',
      logo: '/marketing-components/logos/gartner-extended-reversed.svg',
      logoLight: '/marketing-components/logos/gartner-extended-color.svg'
    },
    {
      text: 'Recognized as Latin America Company of the Year in the edge distribution platform industry, after being profiled among the Companies to Action on the Frost Radar™.',
      reportName: 'Frost & Sullivan Latin America Company of the Year',
      date: 'June 2026',
      firmName: 'Frost & Sullivan',
      logo: '/marketing-components/logos/frost-and-sullivan-extended-reversed.svg',
      logoLight: '/marketing-components/logos/frost-and-sullivan-extended-color.svg'
    },
    {
      text: 'Positioned as a Challenger and Fast Mover, with the application and API security stack evaluated as one platform rather than a set of bolt-ons.',
      reportName: 'GigaOm Radar for Application and API Security v5',
      date: 'March 2026',
      firmName: 'GigaOm',
      logo: '/marketing-components/logos/gigaom-extended-reversed.svg',
      logoLight: '/marketing-components/logos/gigaom-extended-color.svg'
    },
    {
      text: 'Recognized as a Leader in CDN, Web Security, and DDoS Protection, and a High Performer in Cloud Security, WAF, Bot Detection and Mitigation, SSL & TLS Certificate Tools, and API Security Tools.',
      reportName: 'G2 Reports',
      date: 'March 2026',
      firmName: 'G2',
      logo: '/marketing-components/logos/g2-symbol-color.svg'
    },
    {
      text: 'Recognized as a Leader in CDN and a High Performer in Web Security, DDoS Protection, WAF, Bot Detection and Mitigation, SSL & TLS Certificate Tools, and DNS Security Solution.',
      reportName: 'G2 Reports',
      date: 'December 2025',
      firmName: 'G2',
      logo: '/marketing-components/logos/g2-symbol-color.svg'
    }
  ]"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof RecognitionMarquee>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The band as the analyst-recognitions page places it: the eyebrow and headline above a framed strip of seven signed recognitions, each marked by its firm logo. Edit the props in the Controls panel; a band with no items renders nothing at all.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}
