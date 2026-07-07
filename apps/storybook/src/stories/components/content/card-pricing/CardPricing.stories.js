import Button from '@aziontech/webkit/button'
import CardPricing from '@aziontech/webkit/card-pricing'

const defaultDescription = 'Billed annually or $25/mo billed monthly.'

const sharedArgs = {
  planTitle: 'Pro',
  description: defaultDescription,
  pricingDetails: defaultDescription,
  value: '20',
  prefix: '$',
  suffix: 'per month',
  showPrefix: true,
  showSuffix: true,
  showPricingDetails: true,
  showTag: false,
  tagLabel: 'Popular',
  actionLabel: 'Label'
}

export default {
 title: 'Components/Content/CardPricing',
  component: CardPricing,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark'
    }
  },
  argTypes: {
    planTitle: {
      control: 'text',
      description: 'Plan name displayed as the card heading'
    },
    description: {
      control: 'text',
      description: 'Muted plan description copy'
    },
    pricingDetails: {
      control: 'text',
      description: 'Secondary line shown below the currency amount'
    },
    showPricingDetails: {
      control: 'boolean',
      description: 'Whether the pricing details line is visible'
    },
    showTag: {
      control: 'boolean',
      description: 'Whether the popular tag is shown next to the title'
    },
    tagLabel: {
      control: 'text',
      description: 'Text displayed inside the tag'
    },
    slotPosition: {
      control: 'select',
      options: ['bottom', 'middle'],
      description: 'Slot and actions layout (bottom uses small currency, middle uses large)'
    },
    kind: {
      control: 'select',
      options: ['contained', 'transparent'],
      description: 'Surface style variant (Figma Style)'
    },
    value: {
      control: 'text',
      description: 'Numeric amount passed to Currency'
    },
    prefix: {
      control: 'text',
      description: 'Currency symbol shown before the value'
    },
    suffix: {
      control: 'text',
      description: 'Billing period label after the value'
    },
    showPrefix: {
      control: 'boolean',
      description: 'Whether the prefix symbol is visible'
    },
    showSuffix: {
      control: 'boolean',
      description: 'Whether the suffix label is visible'
    },
    actionLabel: {
      control: 'text',
      description: 'Default button label when the actions slot is empty'
    }
  }
}

const renderCard = (args) => ({
  components: { CardPricing },
  setup() {
    return { args }
  },
  template: `
    <CardPricing v-bind="args" />
  `
})

export const SlotPositionBottomContained = {
  args: {
    ...sharedArgs,
    slotPosition: 'bottom',
    kind: 'contained'
  },
  render: renderCard
}

export const SlotPositionBottomTransparent = {
  args: {
    ...sharedArgs,
    slotPosition: 'bottom',
    kind: 'transparent'
  },
  render: renderCard
}

export const SlotPositionMiddleContained = {
  args: {
    ...sharedArgs,
    slotPosition: 'middle',
    kind: 'contained'
  },
  render: renderCard
}

export const SlotPositionMiddleTransparent = {
  args: {
    ...sharedArgs,
    slotPosition: 'middle',
    kind: 'transparent'
  },
  render: renderCard
}

export const WithTag = {
  args: {
    ...sharedArgs,
    slotPosition: 'bottom',
    kind: 'contained',
    showTag: true
  },
  render: renderCard
}

const sampleFeatures = [
  'Unlimited rules engine',
  'Global edge deployment',
  'Advanced observability',
  '24/7 support'
]

export const WithSlots = {
  args: {
    ...sharedArgs,
    slotPosition: 'middle',
    kind: 'contained',
    showTag: true
  },
  render: (args) => ({
    components: { CardPricing, Button },
    setup() {
      return { args, sampleFeatures }
    },
    template: `
      <CardPricing v-bind="args">
        <ul class="m-0 flex list-none flex-col gap-2 p-0 text-body-sm text-[var(--text-default)]">
          <li
            v-for="(feature, index) in sampleFeatures"
            :key="index"
            class="flex items-center gap-2"
          >
            <i class="pi pi-check text-[var(--primary)]" aria-hidden="true" />
            {{ feature }}
          </li>
        </ul>
        <template #actions>
          <Button label="Get started" kind="primary" size="large" class="w-full" />
        </template>
      </CardPricing>
    `
  })
}

export const AllVariants = {
  render: () => ({
    components: { CardPricing },
    setup() {
      return { sharedArgs }
    },
    template: `
      <div class="flex flex-wrap gap-6">
        <CardPricing v-bind="sharedArgs" slot-position="bottom" kind="contained" />
        <CardPricing v-bind="sharedArgs" slot-position="bottom" kind="transparent" />
        <CardPricing v-bind="sharedArgs" slot-position="middle" kind="contained" />
        <CardPricing v-bind="sharedArgs" slot-position="middle" kind="transparent" />
      </div>
    `
  })
}
