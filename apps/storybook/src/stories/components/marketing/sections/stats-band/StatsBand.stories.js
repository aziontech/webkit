import StatsBand from '@aziontech/webkit/stats-band'

import { toSfc } from '../../../../_shared/story-source'
import { REACH_SECTION } from '../../../../templates/marketing/_sections/stats-band'

const IMPORT = "import StatsBand from '@aziontech/webkit/stats-band'"

/** @type {import('@storybook/vue3').Meta<typeof StatsBand>} */
const meta = {
  title: 'Components/Marketing/Sections/StatsBand',
  component: StatsBand,
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
          "The proof-by-numbers band of a marketing page: a framed row of big figures, each with its caption and optional prefix or unit. It is a page section — the site places it from a `{ _id: 'stats-band', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box` and `big-numbers`, which owns the figures' scale and layout."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    items: {
      control: 'object',
      description:
        'The figures rendered as cells, in order; each item is `{ value, label, prefix?, suffix? }` where `value` is the figure, `label` its caption, and `prefix` / `suffix` the qualifier and unit set beside it.',
      table: {
        category: 'props',
        type: { summary: 'StatsBandItem[]' },
        defaultValue: { summary: '[]' }
      }
    }
  },
  args: REACH_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { StatsBand },
  setup() {
    return { args }
  },
  template: '<StatsBand v-bind="args" />'
})

const DEFAULT_MARKUP = `<StatsBand
  :items="[
    { value: '100', suffix: 'ms', label: 'Median response, worldwide' },
    { value: '24', suffix: '/7', label: 'Support on every plan' },
    { value: '99.99', suffix: '%', label: 'Availability, contractual' }
  ]"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof StatsBand>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The band as the reach section of a marketing page places it: three figures, each with its unit as suffix and a caption beneath. Edit the items in the Controls panel — a band with no items renders nothing at all.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}
