import PricingCard from '@aziontech/webkit/pricing-card'

const defaultFeatures = [
  { icon: 'pi-check', label: 'Unlimited rules engine' },
  { icon: 'pi-check', label: 'Global edge deployment' },
  { icon: 'pi-check', label: 'Advanced observability' },
  { icon: 'pi-check', label: '24/7 support' }
]

const renderWithButtonSlot = (slotContent) => (args) => ({
  components: { PricingCard },
  setup() {
    return { args }
  },
  template: `
    <PricingCard v-bind="args">
      <template #button>
        ${slotContent}
      </template>
    </PricingCard>
  `
})

export default {
  title: 'Core/PricingCard',
  component: PricingCard,
  tags: ['autodocs'],
  argTypes: {
    popular: {
      control: 'boolean',
      description: 'Shows the popular badge next to the title'
    },
    popularText: {
      control: 'text',
      description: 'Text displayed inside the popular badge'
    },
    title: {
      control: 'text',
      description: 'Plan name displayed as the card heading'
    },
    subtitle: {
      control: 'text',
      description: 'Short plan description under the title'
    },
    features: {
      control: 'object',
      description: 'List of features with optional icon and label'
    },
    monthlyPrice: {
      control: 'text',
      description: 'Price value shown for monthly billing'
    },
    annualPrice: {
      control: 'text',
      description: 'Price value shown for annual billing'
    },
    currentPeriod: {
      control: 'select',
      options: ['monthly', 'annual'],
      description: 'Defines which billing period price is displayed'
    },
    priceLabel: {
      control: 'text',
      description: 'Helper text shown above the price block'
    },
    customPrice: {
      control: 'text',
      description: 'Custom text that replaces the numeric price display'
    },
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Layout direction used to render the card'
    }
  }
}

export const Default = {
  args: {
    popular: false,
    popularText: 'Popular',
    title: 'Pro',
    subtitle: 'For teams scaling edge applications fast.',
    features: defaultFeatures,
    monthlyPrice: '$49',
    annualPrice: '$39',
    currentPeriod: 'monthly',
    priceLabel: 'start at',
    customPrice: '',
    orientation: 'vertical'
  },
  render: renderWithButtonSlot(`
    <a
      href="#"
      class="w-full justify-center inline-flex px-4 py-2 rounded-md bg-primary text-white hover:bg-primaryHover transition-colors"
    >
      Get Started
    </a>
  `)
}

export const Popular = {
  args: {
    ...Default.args,
    popular: true,
    title: 'Business'
  },
  render: Default.render
}

export const AnnualBilling = {
  args: {
    ...Default.args,
    currentPeriod: 'annual'
  },
  render: Default.render
}

export const CustomPrice = {
  args: {
    ...Default.args,
    title: 'Enterprise',
    customPrice: 'Contact us'
  },
  render: renderWithButtonSlot(`
    <a
      href="#"
      class="w-full justify-center inline-flex px-4 py-2 rounded-md border border-default text-default hover:bg-surface transition-colors"
    >
      Talk to Sales
    </a>
  `)
}

export const Horizontal = {
  args: {
    ...Default.args,
    orientation: 'horizontal'
  },
  render: Default.render
}
