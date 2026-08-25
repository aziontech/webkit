import Currency from '@aziontech/webkit/currency'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Currency from '@aziontech/webkit/currency'"

/** @type {import('@storybook/vue3').Meta<typeof Currency>} */
const meta = {
  title: 'Components/Content/Currency',
  component: Currency,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark'
    },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'focus-order-semantics', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        component:
          'Typesets one monetary amount as three separately-styled parts — the currency symbol, the figure, and a trailing period or unit in the code face. The size ladder is a reading distance: small for an amount in a table row, medium for an amount stated on a card, large for the headline figure of a pricing card.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Monetary value content.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    prefix: {
      control: 'text',
      description: 'Text displayed before the value (currency symbol).',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "'$'" } }
    },
    suffix: {
      control: 'text',
      description: 'Text displayed after the value (e.g. billing period).',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size token; affects typography and the gap between the figure and the suffix.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'small'" }
      }
    }
  },
  args: {
    value: '20',
    prefix: '$',
    suffix: 'per month',
    size: 'small'
  }
}

export default meta

const Template = (args) => ({
  components: { Currency },
  setup() {
    return { args }
  },
  template: '<Currency v-bind="args" />'
})

const DEFAULT_MARKUP = '<Currency value="20" prefix="$" suffix="per month" size="small" />'

/** @type {import('@storybook/vue3').StoryObj<typeof Currency>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Default small currency with prefix and billing-period suffix.' },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const SIZES_TEMPLATE = `<div class="flex flex-col items-start gap-6">
  <Currency value="20" prefix="$" suffix="per month" size="small" />
  <Currency value="20" prefix="$" suffix="per month" size="medium" />
  <Currency value="20" prefix="$" suffix="per month" size="large" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Currency>} */
export const Sizes = {
  render: () => ({ components: { Currency }, template: SIZES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'The three steps of the ladder. `large` bottom-aligns the suffix against the figure; the smaller two centre it.'
      },
      source: { code: toSfc(IMPORT, SIZES_TEMPLATE) }
    }
  }
}
