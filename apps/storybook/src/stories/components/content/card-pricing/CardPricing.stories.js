import Button from '@aziontech/webkit/button'
import CardPricing from '@aziontech/webkit/card-pricing'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import CardPricing from '@aziontech/webkit/card-pricing'"
const BUTTON_IMPORT = "import Button from '@aziontech/webkit/button'"

// The card carries ONE prose region — the billing caveat under the price. A second band
// above the amount used to exist and said much the same thing in the same treatment; the
// Figma component has a single region, so the pitch now belongs to the slot.
const defaultPricingDetails = 'Billed annually or $25/mo billed monthly.'

/** @type {import('@storybook/vue3').Meta<typeof CardPricing>} */
const meta = {
  title: 'Components/Content/CardPricing',
  component: CardPricing,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
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
          'Pricing plan card presenting a plan title, description, currency amount, and call-to-action. Supports bottom or middle slot placement, contained or transparent surfaces, an optional highlight tag, and slots for feature content and custom actions.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    planTitle: {
      control: 'text',
      description: 'Plan name displayed as the card heading.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Pro'" }
      }
    },
    pricingDetails: {
      control: 'text',
      description: 'Secondary line shown below the currency amount.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    showPricingDetails: {
      control: 'boolean',
      description: 'Whether the pricing details line is visible.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    showTag: {
      control: 'boolean',
      description: 'Whether the highlight tag is shown next to the title.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    aligned: {
      control: 'boolean',
      description:
        "Reserves each prose region's band so a row of cards aligns row-for-row. Set it on every card in the row.",
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    tagLabel: {
      control: 'text',
      description: 'Text displayed inside the highlight tag.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Popular'" }
      }
    },
    slotPosition: {
      control: 'select',
      options: ['bottom', 'middle'],
      description:
        'Slot and actions layout; bottom uses a small currency, middle uses a large one.',
      table: {
        category: 'props',
        type: { summary: "'bottom' | 'middle'" },
        defaultValue: { summary: "'bottom'" }
      }
    },
    kind: {
      control: 'select',
      options: ['contained', 'transparent'],
      description: 'Surface style variant.',
      table: {
        category: 'props',
        type: { summary: "'contained' | 'transparent'" },
        defaultValue: { summary: "'contained'" }
      }
    },
    value: {
      control: 'text',
      description: 'Numeric amount rendered by the currency block.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'20'" }
      }
    },
    prefix: {
      control: 'text',
      description: 'Currency symbol shown before the value.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'$'" }
      }
    },
    suffix: {
      control: 'text',
      description: 'Billing period label shown after the value.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'/ mon'" }
      }
    },
    showPrefix: {
      control: 'boolean',
      description: 'Whether the prefix symbol is visible.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    showSuffix: {
      control: 'boolean',
      description: 'Whether the suffix label is visible.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    actionLabel: {
      control: 'text',
      description: 'Label of the default action button when the actions slot is empty.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Label'" }
      }
    },
    default: {
      control: false,
      description: 'Main content region, typically a feature list.',
      table: { category: 'slots', type: { summary: 'VNode' } }
    },
    actions: {
      control: false,
      description: 'Replaces the default action button.',
      table: { category: 'slots', type: { summary: 'VNode' } }
    }
  },
  args: {
    planTitle: 'Pro',
    pricingDetails: defaultPricingDetails,
    showPricingDetails: true,
    showTag: false,
    tagLabel: 'Popular',
    aligned: false,
    slotPosition: 'bottom',
    kind: 'contained',
    value: '20',
    prefix: '$',
    suffix: '/ mon',
    showPrefix: true,
    showSuffix: true,
    actionLabel: 'Label'
  }
}

export default meta

const Template = (args) => ({
  components: { CardPricing },
  setup() {
    return { args }
  },
  template: '<CardPricing v-bind="args" />'
})

const DEFAULT_MARKUP = `<CardPricing
  plan-title="Pro"
  pricing-details="Billed annually or $25/mo billed monthly."
  slot-position="bottom"
  kind="contained"
  value="20"
  prefix="$"
  suffix="/ mon"
  action-label="Label"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof CardPricing>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Default pricing card with bottom slot placement and a contained surface.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const VARIANTS_TEMPLATE = `<div class="grid grid-cols-[repeat(auto-fit,320px)] gap-6">
  <CardPricing
    slot-position="bottom"
    kind="contained"
    plan-title="Pro"
    pricing-details="Billed annually or $25/mo billed monthly."
    value="20"
    prefix="$"
    suffix="/ mon"
    action-label="Label"
  />
  <CardPricing
    slot-position="bottom"
    kind="transparent"
    plan-title="Pro"
    pricing-details="Billed annually or $25/mo billed monthly."
    value="20"
    prefix="$"
    suffix="/ mon"
    action-label="Label"
  />
  <CardPricing
    slot-position="middle"
    kind="contained"
    plan-title="Pro"
    pricing-details="Billed annually or $25/mo billed monthly."
    value="20"
    prefix="$"
    suffix="/ mon"
    action-label="Label"
  />
  <CardPricing
    slot-position="middle"
    kind="transparent"
    plan-title="Pro"
    pricing-details="Billed annually or $25/mo billed monthly."
    value="20"
    prefix="$"
    suffix="/ mon"
    action-label="Label"
  />
</div>`

const ALIGNED_TEMPLATE = `<div class="grid grid-cols-[repeat(auto-fit,320px)] gap-6">
  <CardPricing
    aligned
    plan-title="Hobby"
    pricing-details=""
    value="Free"
    prefix=""
    suffix=""
    action-label="Start free"
  />
  <CardPricing
    aligned
    show-tag
    tag-label="Popular"
    plan-title="Pro"
    pricing-details="Billed annually, save 20%"
    value="20"
    prefix="$"
    suffix="/ mon"
    action-label="Continue with Pro"
  />
  <CardPricing
    aligned
    plan-title="Enterprise"
    pricing-details="Tailored to your usage requirements and payment terms"
    value="Custom"
    prefix=""
    suffix=""
    action-label="Contact sales"
  />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof CardPricing>} */
export const Aligned = {
  render: () => ({ components: { CardPricing }, template: ALIGNED_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Three tiers whose copy is deliberately uneven: Hobby has no billing caveat, Pro has one line and Enterprise two. With `aligned` every region sits on the same line in all three cards, so the row reads as one comparison. Drop the prop and each card sizes to its own copy, staggering the feature lists and the buttons.'
      },
      source: { code: toSfc(IMPORT, ALIGNED_TEMPLATE) }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof CardPricing>} */
export const Variants = {
  render: () => ({ components: { CardPricing }, template: VARIANTS_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Every slot position (bottom, middle) and card style (contained, transparent) combination.'
      },
      source: { code: toSfc(IMPORT, VARIANTS_TEMPLATE) }
    }
  }
}

const WITH_TAG_MARKUP = `<CardPricing
  plan-title="Pro"
  pricing-details="Billed annually or $25/mo billed monthly."
  show-tag
  tag-label="Popular"
  value="20"
  prefix="$"
  suffix="/ mon"
  action-label="Label"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof CardPricing>} */
export const WithTag = {
  args: { showTag: true },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Highlight tag rendered next to the plan title when `showTag` is enabled.'
      },
      source: { code: toSfc(IMPORT, WITH_TAG_MARKUP) }
    }
  }
}

const SLOTS_TEMPLATE = `<CardPricing
  plan-title="Pro"
  pricing-details="Billed annually or $25/mo billed monthly."
  slot-position="middle"
  kind="contained"
  show-tag
  tag-label="Popular"
  value="20"
  prefix="$"
  suffix="/ mon"
>
  <ul class="m-0 flex list-none flex-col gap-2 p-0 text-body-sm text-(--text-default)">
    <li class="flex items-center gap-2">
      <i class="pi pi-check text-(--primary)" aria-hidden="true" />
      Unlimited rules engine
    </li>
    <li class="flex items-center gap-2">
      <i class="pi pi-check text-(--primary)" aria-hidden="true" />
      Global edge deployment
    </li>
    <li class="flex items-center gap-2">
      <i class="pi pi-check text-(--primary)" aria-hidden="true" />
      Advanced observability
    </li>
    <li class="flex items-center gap-2">
      <i class="pi pi-check text-(--primary)" aria-hidden="true" />
      24/7 support
    </li>
  </ul>
  <template #actions>
    <Button label="Get started" kind="primary" size="large" class="w-full" />
  </template>
</CardPricing>`

/** @type {import('@storybook/vue3').StoryObj<typeof CardPricing>} */
export const Slots = {
  render: () => ({ components: { CardPricing, Button }, template: SLOTS_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Default slot filled with a feature list and the actions slot replacing the default button.'
      },
      source: { code: toSfc([IMPORT, BUTTON_IMPORT], SLOTS_TEMPLATE) }
    }
  }
}
