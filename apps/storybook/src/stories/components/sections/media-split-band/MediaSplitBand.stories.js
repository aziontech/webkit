import MediaSplitBand from '@aziontech/webkit/sections/media-split-band'

import { toSfc } from '../../../_shared/story-source'
import { SITE_SECTION } from '../../../templates/marketing/_sections/media-split-band'

const IMPORT = "import MediaSplitBand from '@aziontech/webkit/sections/media-split-band'"

const ACTION_SUMMARY = "{ label: string; href: string; trailing?: boolean; target?: '_blank' | '_self' }"

/** @type {import('@storybook/vue3').Meta<typeof MediaSplitBand>} */
const meta = {
  title: 'Components/Sections/MediaSplitBand',
  component: MediaSplitBand,
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
          "One claim beside its picture, on its own frame: the copy cell with its overline, headline and sentence on one side, and the media on a raised, pixel-textured surface on the other. It is a page section — the site places it from a `{ _id: 'media-split-band', props }` entry and binds `props` straight onto it — and it composes `section-module`, a framed `media-split`, `button`, `illustration` and the webkit scene assets. The media is a scene, an image or an illustration; with one action the whole band links to it, with two the band stays unlinked."
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
    title: {
      control: 'text',
      description:
        'Headline of the band, rendered by the media split as its `h2` and naming its region; the band renders nothing when empty.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    description: {
      control: 'text',
      description: 'Paragraph under the headline.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    size: {
      control: 'inline-radio',
      options: ['medium', 'large'],
      description:
        'Type scale of the copy; `large` sets the headline at heading-xl and centres the copy beside the media.',
      table: {
        category: 'props',
        type: { summary: 'MediaSplitBandSize' },
        defaultValue: { summary: "'medium'" }
      }
    },
    scene: {
      control: 'object',
      description:
        'Scene drawn in the media cell, `{ component }` naming a webkit scene asset; wins over `image` and `illustration`.',
      table: {
        category: 'props',
        type: { summary: 'MediaSplitBandScene' },
        defaultValue: { summary: 'undefined' }
      }
    },
    image: {
      control: 'object',
      description:
        'Picture drawn in the media cell when no scene is set; `{ src, alt?, width?, height? }`.',
      table: {
        category: 'props',
        type: { summary: 'MediaSplitBandImage' },
        defaultValue: { summary: 'undefined' }
      }
    },
    illustration: {
      control: 'text',
      description:
        'Registry name of the illustration drawn in the media cell when neither a scene nor an image is set.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    illustrationAriaLabel: {
      control: 'text',
      description: 'Accessible name of the illustration; empty keeps it decorative.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    primaryAction: {
      control: 'object',
      description:
        'First button under the copy; `{ label, href, trailing?, target? }`. When it is the only action, the whole band links to it.',
      table: {
        category: 'props',
        type: { summary: 'MediaSplitBandAction', detail: ACTION_SUMMARY },
        defaultValue: { summary: 'undefined' }
      }
    },
    secondaryAction: {
      control: 'object',
      description:
        'Second, outlined button beside the first; `{ label, href, trailing?, target? }`. With two actions the band stays unlinked.',
      table: {
        category: 'props',
        type: { summary: 'MediaSplitBandAction', detail: ACTION_SUMMARY },
        defaultValue: { summary: 'undefined' }
      }
    }
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { MediaSplitBand },
  setup() {
    return { args }
  },
  template: '<MediaSplitBand v-bind="args" />'
})

const DEFAULT_MARKUP = `<MediaSplitBand
  eyebrow="Our values"
  title="Four values shape every role at Azion"
  description="Quality, Drive, Accountability, and Innovation. They guide how we work every day: we set high standards and measure what we deliver, take on hard problems with persistence, own our commitments and mistakes, and use AI and new technology to solve problems in new ways. Together, they help us earn and keep the trust of our customers."
  size="large"
  :scene="{ component: 'BrandGlobeScene' }"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof MediaSplitBand>} */
export const Default = {
  render: Template,
  parameters: {
    visual: false,
    docs: {
      description: {
        story:
          'The Careers values band: a large, centred copy cell with no actions beside the turning brand globe. Edit the props in the Controls panel — give it one action and the whole band becomes a link, two and it stays unlinked.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}
