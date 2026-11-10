import CompareSupportTiers from '@aziontech/webkit/compare-support-tiers'

import { sectionMarkup } from '../../../../_shared/section-source'
import { toSfc } from '../../../../_shared/story-source'
import { SITE_SECTION } from '../../../../templates/marketing/_sections/compare-support-tiers'

const IMPORT = "import CompareSupportTiers from '@aziontech/webkit/compare-support-tiers'"

const DEFAULT_SOURCE = (() => {
  const { body, script } = sectionMarkup('CompareSupportTiers', SITE_SECTION.props)
  return toSfc([IMPORT, '', ...script], body)
})()

/** @type {import('@storybook/vue3').Meta<typeof CompareSupportTiers>} */
const meta = {
  title: 'Components/Marketing/Sections/CompareSupportTiers',
  component: CompareSupportTiers,
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
          "The tier-by-tier comparison on the Support page: one column per support tier with its name, who it is for and its action button pinned in the header while the page scrolls, one band per service family with an overline and a title, and one row per service saying what each tier includes — a tick, a dash, or the allowance as text. Each band closes on its own link to the matching pricing documentation, the recommended tier carries an accent bar, and below the large breakpoint the table folds to one tier picked from a select. It is a page section — the site places it from a `{ _id: 'compare-support-tiers', props }` entry and binds `props` straight onto it — and it composes `section-module`, `select`, `button`, `overline` and `link`."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    anchor: {
      control: 'text',
      description: 'In-page id set on the band so a hash link can target it.',
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
      description: 'Heading of the service column, shown from the large breakpoint up.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    pickerAriaLabel: {
      control: 'text',
      description: 'Accessible name of the tier picker shown below the large breakpoint.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    includedLabel: {
      control: 'text',
      description: 'Screen-reader text of a ticked cell.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    excludedLabel: {
      control: 'text',
      description: 'Screen-reader text of a dashed cell.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    tiers: {
      control: 'object',
      description:
        'The tier columns, in order; each is `{ id, name, description, highlighted?, action }` with `action` as `{ label, href }`; a tier without a name is dropped.',
      table: {
        category: 'props',
        type: { summary: 'CompareSupportTiersTier[]' },
        defaultValue: { summary: '[]' }
      }
    },
    sections: {
      control: 'object',
      description:
        'The service bands, in order; each is `{ eyebrow, title, action?, rows }` where `action` is the closing `{ label, href }` link, and a row is `{ label, values, group? }` with one value per tier: `true` or `✓` ticks, `—` dashes, other text shows as written, empty is blank.',
      table: {
        category: 'props',
        type: { summary: 'CompareSupportTiersSection[]' },
        defaultValue: { summary: '[]' }
      }
    }
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { CompareSupportTiers },
  setup() {
    return { args }
  },
  template: '<CompareSupportTiers v-bind="args" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof CompareSupportTiers>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Developer, Business, Enterprise and Mission-Critical across the Support and the Professional Services bands, each closing on its pricing link. Narrow the canvas below 1024px to see the tier picker, which opens on Enterprise.'
      },
      source: { code: DEFAULT_SOURCE }
    }
  }
}
