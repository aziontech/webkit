import Currency from '@aziontech/webkit/content/currency'

const sizes = ['small', 'large']

export default {
 title: 'Components/Content/Currency',
  component: Currency,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark'
    }
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Numeric amount to display'
    },
    prefix: {
      control: 'text',
      description: 'Currency symbol shown before the value'
    },
    suffix: {
      control: 'text',
      description: 'Secondary label after the value (e.g. billing period)'
    },
    size: {
      control: 'select',
      options: sizes,
      description: 'Visual size variant (Figma Size)'
    }
  }
}

export const Default = {
  args: {
    value: '20',
    prefix: '$',
    suffix: 'per month',
    size: 'small'
  },
  render: (args) => ({
    components: { Currency },
    setup() {
      return { args }
    },
    template: `
      <Currency v-bind="args" />
    `
  })
}

export const Sizes = {
  render: () => ({
    components: { Currency },
    template: `
      <div class="flex flex-col gap-6 font-sora">
        <Currency value="20" prefix="$" suffix="per month" size="small" />
        <Currency value="20" prefix="$" suffix="per month" size="large" />
      </div>
    `
  })
}
