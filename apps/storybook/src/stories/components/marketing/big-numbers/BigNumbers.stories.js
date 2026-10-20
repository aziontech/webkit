import BigNumbers from '@aziontech/webkit/big-numbers'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import BigNumbers from '@aziontech/webkit/big-numbers'"

const ITEMS = [
  { value: '120', suffix: '+', label: 'Points of presence' },
  { value: '99.99', suffix: '%', label: 'Availability' },
  { prefix: '<', value: '15', suffix: 'ms', label: 'Median latency' },
  { value: '4.5', suffix: 'Tbps', label: 'Network capacity' }
]

/** @type {import('@storybook/vue3').Meta<typeof BigNumbers>} */
const meta = {
  title: 'Components/Marketing/BigNumbers',
  component: BigNumbers,
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
          'A band of headline figures — throughput, uptime, points of presence — set in the display face at big-number scale, each in its own framed cell with a short caption underneath. It is the proof band of a marketing page: the one place a page states its numbers, between a `section-title` and the section body.'
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
        type: { summary: 'BigNumberItem[]' },
        defaultValue: { summary: '[]' }
      }
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size token; picks the big-number scale the figures are set at.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'medium'" }
      }
    }
  },
  args: {
    items: ITEMS,
    size: 'medium'
  }
}

export default meta

const Template = (args) => ({
  components: { BigNumbers },
  setup() {
    return { args }
  },
  template: '<BigNumbers v-bind="args" />'
})

const DEFAULT_MARKUP = `<BigNumbers
  :items="[
    { value: '120', suffix: '+', label: 'Points of presence' },
    { value: '99.99', suffix: '%', label: 'Availability' },
    { prefix: '<', value: '15', suffix: 'ms', label: 'Median latency' },
    { value: '4.5', suffix: 'Tbps', label: 'Network capacity' }
  ]"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof BigNumbers>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Four measured facts at the default `medium` scale. The unit rides in `suffix` and the qualifier in `prefix`, so the figure itself stays the largest, highest-contrast thing in each cell. Edit `items` in the Controls panel to see the band grow or shrink — a band with no items renders nothing at all.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const SIZES_TEMPLATE = `<div class="flex flex-col gap-(--spacing-xxl)">
  <BigNumbers
    size="small"
    :items="[
      { value: '120', suffix: '+', label: 'Points of presence' },
      { value: '99.99', suffix: '%', label: 'Availability' },
      { prefix: '<', value: '15', suffix: 'ms', label: 'Median latency' },
      { value: '4.5', suffix: 'Tbps', label: 'Network capacity' }
    ]"
  />
  <BigNumbers
    size="medium"
    :items="[
      { value: '120', suffix: '+', label: 'Points of presence' },
      { value: '99.99', suffix: '%', label: 'Availability' },
      { prefix: '<', value: '15', suffix: 'ms', label: 'Median latency' },
      { value: '4.5', suffix: 'Tbps', label: 'Network capacity' }
    ]"
  />
  <BigNumbers
    size="large"
    :items="[
      { value: '120', suffix: '+', label: 'Points of presence' },
      { value: '99.99', suffix: '%', label: 'Availability' },
      { prefix: '<', value: '15', suffix: 'ms', label: 'Median latency' },
      { value: '4.5', suffix: 'Tbps', label: 'Network capacity' }
    ]"
  />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof BigNumbers>} */
export const Sizes = {
  render: () => ({ components: { BigNumbers }, template: SIZES_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Every `size` value, one band under the other. Only the figure moves up the big-number scale — the caption stays at overline scale and the cell keeps its frame, so a denser section can drop to `small` and a page hero can reach for `large` without the band changing shape.'
      },
      source: { code: toSfc(IMPORT, SIZES_TEMPLATE) }
    }
  }
}
