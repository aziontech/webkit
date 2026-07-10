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
          'Displays a monetary amount with an optional currency prefix and a muted suffix (e.g. a billing period). Available in small and large size variants.'
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
      options: ['small', 'large'],
      description: 'Visual size token for text and spacing.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'large'" },
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

const SIZES_TEMPLATE = `<div class="flex flex-col gap-6">
  <Currency value="20" prefix="$" suffix="per month" size="small" />
  <Currency value="20" prefix="$" suffix="per month" size="large" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Currency>} */
export const Sizes = {
  render: () => ({ components: { Currency }, template: SIZES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'Both size variants side by side.' },
      source: { code: toSfc(IMPORT, SIZES_TEMPLATE) }
    }
  }
}
