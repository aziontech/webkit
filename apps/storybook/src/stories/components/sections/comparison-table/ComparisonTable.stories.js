import cloudflareExtendedColor from '@aziontech/webkit/assets/cloudflare-extended-color.svg'
import cloudflareExtendedReversed from '@aziontech/webkit/assets/cloudflare-extended-reversed.svg'
import ComparisonTable from '@aziontech/webkit/sections/comparison-table'

import { sectionMarkup } from '../../../_shared/section-source'
import { toSfc } from '../../../_shared/story-source'
import { CLOUDFLARE_SECTION } from '../../../templates/marketing/_sections/comparison-table'

const IMPORT = "import ComparisonTable from '@aziontech/webkit/sections/comparison-table'"

const DEFAULT_SOURCE = (() => {
  const { body, script } = sectionMarkup('ComparisonTable', CLOUDFLARE_SECTION.props)
  return toSfc([IMPORT, '', ...script], body)
})()

/** @type {import('@storybook/vue3').Meta<typeof ComparisonTable>} */
const meta = {
  title: 'Components/Sections/ComparisonTable',
  component: ComparisonTable,
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
          "The capability-by-capability comparison of Azion with one competitor on a migration landing page: a left section title over a framed table whose header row (the capability column, the Azion brand and the competitor logo) stays pinned while the page scrolls. Each category opens with a heading row; each cell is a support glyph — full, partial or none — named by a tooltip and by screen-reader text, and a capability with a definition carries an info button that opens it in a popover. It is a page section — the site places it from a `{ _id: 'comparison-table', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box`, `brand`, `popover`, `icon-button` and `tooltip`."
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
        'Headline of the band, rendered by the section title as its `h2` and naming the band; no header renders when empty.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    caption: {
      control: 'text',
      description: 'Screen-reader caption naming the table.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    columnLabel: {
      control: 'text',
      description: 'Heading of the capability column.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    fullLabel: {
      control: 'text',
      description: 'Tooltip and screen-reader text of a full-support cell.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    partialLabel: {
      control: 'text',
      description: 'Tooltip and screen-reader text of a partial-support cell.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    noneLabel: {
      control: 'text',
      description: 'Tooltip and screen-reader text of an unsupported cell.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    competitor: {
      control: 'object',
      description:
        'The platform compared with Azion; `{ name, logo?, logoLight? }` where `logo` is the dark-theme file and `logoLight` the light-theme one.',
      table: {
        category: 'props',
        type: { summary: 'ComparisonTableCompetitor' },
        defaultValue: { summary: '—' }
      }
    },
    groups: {
      control: 'object',
      description:
        'The categories, in order; each is `{ title, rows }` and a row is `{ capability, definition?, azion?, competitor? }` with each level `full`, `partial` or `none` (missing reads as `none`).',
      table: {
        category: 'props',
        type: { summary: 'ComparisonTableGroup[]' },
        defaultValue: { summary: '[]' }
      }
    }
  },
  args: {
    ...CLOUDFLARE_SECTION.props,
    competitor: {
      name: 'Cloudflare',
      logo: cloudflareExtendedReversed,
      logoLight: cloudflareExtendedColor
    }
  }
}

export default meta

const Template = (args) => ({
  components: { ComparisonTable },
  setup() {
    return { args }
  },
  template: '<ComparisonTable v-bind="args" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof ComparisonTable>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The Cloudflare comparison as the migration guide places it: six categories, each capability with a definition behind its info button and a support glyph per platform. The header row stays pinned while the page scrolls. Edit the props in the Controls panel — a band with no groups renders nothing at all.'
      },
      source: { code: DEFAULT_SOURCE }
    }
  }
}
