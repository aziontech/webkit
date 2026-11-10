import ComparePlans from '@aziontech/webkit/sections/compare-plans'

import { sectionMarkup } from '../../../_shared/section-source'
import { toSfc } from '../../../_shared/story-source'
import { SITE_SECTION } from '../../../templates/marketing/_sections/compare-plans'

const IMPORT = "import ComparePlans from '@aziontech/webkit/sections/compare-plans'"

const DEFAULT_SOURCE = (() => {
  const { body, script } = sectionMarkup('ComparePlans', SITE_SECTION.props)
  return toSfc([IMPORT, '', ...script], body)
})()

/** @type {import('@storybook/vue3').Meta<typeof ComparePlans>} */
const meta = {
  title: 'Components/Sections/ComparePlans',
  component: ComparePlans,
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
          "The feature-by-feature matrix under the plan cards on Pricing: one column per plan with its name and action button pinned in the header while the page scrolls, one band per product with an overline, a title and a lead, and one row per feature saying what each plan includes — a tick, a dash, or the allowance as text. The recommended plan carries an accent bar, and below the large breakpoint the table folds to one plan picked from a select. It is a page section — the site places it from a `{ _id: 'compare-plans', props }` entry and binds `props` straight onto it — and it composes `section-module`, `select`, `button`, `overline`, `hint`, `tag` and `link`."
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
      description: 'Heading of the feature column, shown from the large breakpoint up.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    pickerAriaLabel: {
      control: 'text',
      description: 'Accessible name of the plan picker shown below the large breakpoint.',
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
    plans: {
      control: 'object',
      description:
        'The plan columns, in order; each is `{ id, name, highlighted?, action }` with `action` as `{ label, href }`; a plan without a name is dropped.',
      table: {
        category: 'props',
        type: { summary: 'ComparePlansPlan[]' },
        defaultValue: { summary: '[]' }
      }
    },
    sections: {
      control: 'object',
      description:
        'The product bands, in order; each is `{ eyebrow, title, description, rows }` and a row is `{ label, values, group?, hint?, tag? }` with one value per plan: `true` or `✓` ticks, `—` dashes, other text shows as written, empty is blank.',
      table: {
        category: 'props',
        type: { summary: 'ComparePlansSection[]' },
        defaultValue: { summary: '[]' }
      }
    },
    primaryAction: {
      control: 'object',
      description:
        'Closing link under the table, opened in a new tab; `{ label, href }`. Omitted when absent.',
      table: {
        category: 'props',
        type: { summary: 'ComparePlansAction' },
        defaultValue: { summary: 'undefined' }
      }
    }
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { ComparePlans },
  setup() {
    return { args }
  },
  template: '<ComparePlans v-bind="args" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof ComparePlans>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Hobby, Pro and Enterprise across the four Pricing product bands, closing on the link to the on-demand rates. Narrow the canvas below 1024px to see the plan picker, which opens on Pro.'
      },
      source: { code: DEFAULT_SOURCE }
    }
  }
}
