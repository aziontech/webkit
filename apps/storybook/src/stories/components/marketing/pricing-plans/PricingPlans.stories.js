import CardPricing from '@aziontech/webkit/card-pricing'
import PricingPlans from '@aziontech/webkit/pricing-plans'
import { computed, ref, watch } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const SCRIPT = [
  "import { ref } from 'vue'",
  "import CardPricing from '@aziontech/webkit/card-pricing'",
  "import PricingPlans from '@aziontech/webkit/pricing-plans'",
  '',
  "const period = ref('monthly')",
  '',
  'const periods = [',
  "  { label: 'Monthly', value: 'monthly' },",
  "  { label: 'Annual', value: 'annual' }",
  ']'
]

const PERIODS = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Annual', value: 'annual' }
]

const PLANS = [
  {
    planTitle: 'Developer',
    monthly: '20',
    annual: '16',
    pricingDetails: 'Billed monthly. Usage above the included limits is charged on demand.',
    actionLabel: 'Start building',
    showTag: false
  },
  {
    planTitle: 'Business',
    monthly: '100',
    annual: '80',
    pricingDetails: 'Billed monthly. Includes priority support and a higher request allowance.',
    actionLabel: 'Start a trial',
    showTag: true
  },
  {
    planTitle: 'Enterprise',
    monthly: '300',
    annual: '240',
    pricingDetails: 'Billed monthly. Committed capacity, single sign-on, and a named contact.',
    actionLabel: 'Talk to sales',
    showTag: false
  }
]

const priceOf = (plan, period) => (period === 'annual' ? plan.annual : plan.monthly)

const cardsMarkup = (period, kind) =>
  PLANS.map(
    (plan) => `  <CardPricing
    plan-title="${plan.planTitle}"
    :value="${period} === 'annual' ? '${plan.annual}' : '${plan.monthly}'"
    suffix="/ mo"
    pricing-details="${plan.pricingDetails}"
    action-label="${plan.actionLabel}"${plan.showTag ? '\n    show-tag\n    tag-label="Popular"' : ''}
    kind="${kind}"
    aligned
  />`
  ).join('\n')

/** @type {import('@storybook/vue3').Meta<typeof PricingPlans>} */
const meta = {
  title: 'Components/Marketing/PricingPlans',
  component: PricingPlans,
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
          'The pricing band: an optional billing-period switch above a row of plan cards that share one height and one rhythm. It owns the switch and the row; the cards are `card-pricing`, composed by the page, and the selected period is a two-way value the page reads to decide what each card shows.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    modelValue: {
      control: 'text',
      description:
        "The selected billing period's `value` (`v-model`). The page reads it to decide what each composed card shows — the band switches the control, not the prices.",
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' }
      }
    },
    kind: {
      control: 'inline-radio',
      options: ['gap', 'divider'],
      description:
        'Register of the band: gutters between self-contained cards, or hairline rules drawn by the gaps. In `divider` each card fills its own background.',
      table: {
        category: 'props',
        type: { summary: "'gap' | 'divider'" },
        defaultValue: { summary: "'gap'" }
      }
    },
    periods: {
      control: 'object',
      description:
        'Billing periods offered above the row; each item is `{ label, value }`. The switch is omitted when fewer than two are given.',
      table: {
        category: 'props',
        type: { summary: 'PricingPeriod[]' },
        defaultValue: { summary: '[]' }
      }
    },
    ariaLabel: {
      control: 'text',
      description:
        'Accessible name for the billing-period switch, which the band renders no visible label for.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Billing period'" }
      }
    },
    default: {
      control: false,
      description: 'The plan cards, composed as `card-pricing` elements in reading order.',
      table: { category: 'slots' }
    }
  },
  args: {
    modelValue: 'monthly',
    kind: 'gap',
    periods: PERIODS,
    ariaLabel: 'Billing period'
  }
}

export default meta

const Template = (args) => ({
  components: { CardPricing, PricingPlans },
  setup() {
    const period = ref(args.modelValue ?? 'monthly')
    watch(
      () => args.modelValue,
      (next) => {
        period.value = next ?? 'monthly'
      }
    )
    const onUpdate = (next) => {
      period.value = next
      args['onUpdate:modelValue']?.(next)
    }
    const cards = computed(() =>
      PLANS.map((plan) => ({ ...plan, value: priceOf(plan, period.value) }))
    )
    const cardKind = computed(() => (args.kind === 'divider' ? 'transparent' : 'contained'))
    return { args, period, onUpdate, cards, cardKind }
  },
  template: `<PricingPlans v-bind="args" :model-value="period" @update:model-value="onUpdate">
    <CardPricing
      v-for="card in cards"
      :key="card.planTitle"
      :plan-title="card.planTitle"
      :value="card.value"
      suffix="/ mo"
      :pricing-details="card.pricingDetails"
      :action-label="card.actionLabel"
      :show-tag="card.showTag"
      tag-label="Popular"
      :kind="cardKind"
      aligned
    />
  </PricingPlans>`
})

const DEFAULT_MARKUP = `<PricingPlans
  v-model="period"
  :periods="periods"
  aria-label="Billing period"
>
${cardsMarkup('period', 'contained')}
</PricingPlans>`

/** @type {import('@storybook/vue3').StoryObj<typeof PricingPlans>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The `gap` register: self-contained cards separated by real gutters, with the switch centred above them. Move the switch and the prices follow — but the band did not change them. It reports the selected period through `v-model` and the page decides what each card shows, because only the page knows what an annual plan costs. Every card carries `aligned`, which reserves the caveat band so three cards whose sentences run to different lengths still start their action on the same line.'
      },
      source: { code: toSfc(SCRIPT, DEFAULT_MARKUP) }
    }
  }
}

const TYPES_TEMPLATE = `<div class="flex flex-col gap-(--spacing-xxl)">
  <PricingPlans
    v-model="gapPeriod"
    kind="gap"
    :periods="periods"
    aria-label="Billing period"
  >
${cardsMarkup('gapPeriod', 'contained')}
  </PricingPlans>
  <PricingPlans
    v-model="dividerPeriod"
    kind="divider"
    :periods="periods"
    aria-label="Billing period"
  >
${cardsMarkup('dividerPeriod', 'transparent')}
  </PricingPlans>
</div>`

const TYPES_SCRIPT = [
  "import { ref } from 'vue'",
  "import CardPricing from '@aziontech/webkit/card-pricing'",
  "import PricingPlans from '@aziontech/webkit/pricing-plans'",
  '',
  "const gapPeriod = ref('monthly')",
  "const dividerPeriod = ref('monthly')",
  '',
  'const periods = [',
  "  { label: 'Monthly', value: 'monthly' },",
  "  { label: 'Annual', value: 'annual' }",
  ']'
]

/** @type {import('@storybook/vue3').StoryObj<typeof PricingPlans>} */
export const Types = {
  render: () => ({
    components: { CardPricing, PricingPlans },
    setup() {
      const gapPeriod = ref('monthly')
      const dividerPeriod = ref('monthly')
      const gapCards = computed(() =>
        PLANS.map((plan) => ({ ...plan, value: priceOf(plan, gapPeriod.value) }))
      )
      const dividerCards = computed(() =>
        PLANS.map((plan) => ({ ...plan, value: priceOf(plan, dividerPeriod.value) }))
      )
      return { gapPeriod, dividerPeriod, gapCards, dividerCards, periods: PERIODS }
    },
    template: `<div class="flex flex-col gap-(--spacing-xxl)">
      <PricingPlans v-model="gapPeriod" kind="gap" :periods="periods" aria-label="Billing period">
        <CardPricing
          v-for="card in gapCards"
          :key="card.planTitle"
          :plan-title="card.planTitle"
          :value="card.value"
          suffix="/ mo"
          :pricing-details="card.pricingDetails"
          :action-label="card.actionLabel"
          :show-tag="card.showTag"
          tag-label="Popular"
          kind="contained"
          aligned
        />
      </PricingPlans>
      <PricingPlans v-model="dividerPeriod" kind="divider" :periods="periods" aria-label="Billing period">
        <CardPricing
          v-for="card in dividerCards"
          :key="card.planTitle"
          :plan-title="card.planTitle"
          :value="card.value"
          suffix="/ mo"
          :pricing-details="card.pricingDetails"
          :action-label="card.actionLabel"
          :show-tag="card.showTag"
          tag-label="Popular"
          kind="transparent"
          aligned
        />
      </PricingPlans>
    </div>`
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Both registers, one under the other. `gap` spaces the row with a real gutter and centres the switch above it — cards that read as three objects on the page. `divider` closes that gutter to a hairline the cards themselves draw, and turns the switch into a strip with its own floor, so the row reads as one table of plans. The register picks the card: `gap` pairs with `card-pricing kind="contained"`, `divider` with `kind="transparent"`, because a contained card in the divider register would draw a border a pixel from the seam that already separates it.'
      },
      source: { code: toSfc(TYPES_SCRIPT, TYPES_TEMPLATE) }
    }
  }
}

const WITHOUT_PERIODS_SCRIPT = [
  "import CardPricing from '@aziontech/webkit/card-pricing'",
  "import PricingPlans from '@aziontech/webkit/pricing-plans'"
]

const WITHOUT_PERIODS_MARKUP = `<PricingPlans>
${PLANS.map(
  (plan) => `  <CardPricing
    plan-title="${plan.planTitle}"
    value="${plan.monthly}"
    suffix="/ mo"
    pricing-details="${plan.pricingDetails}"
    action-label="${plan.actionLabel}"${plan.showTag ? '\n    show-tag\n    tag-label="Popular"' : ''}
    aligned
  />`
).join('\n')}
</PricingPlans>`

/** @type {import('@storybook/vue3').StoryObj<typeof PricingPlans>} */
export const WithoutPeriods = {
  args: { periods: [], modelValue: undefined },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'One billing model, so no switch: leave `periods` empty and the band renders the row alone rather than a dead control above it. The switch is also withheld for a single period — a control over one option is furniture. Everything else holds, so a page that later adds an annual plan passes two periods and reads the two-way value; nothing about the row changes.'
      },
      source: { code: toSfc(WITHOUT_PERIODS_SCRIPT, WITHOUT_PERIODS_MARKUP) }
    }
  }
}
