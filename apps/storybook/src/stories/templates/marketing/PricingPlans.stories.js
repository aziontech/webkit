import Button from '@aziontech/webkit/button'
import CardGrid from '@aziontech/webkit/card-grid'
import CardPricing from '@aziontech/webkit/card-pricing'
import FrameBox from '@aziontech/webkit/frame-box'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SegmentedButton from '@aziontech/webkit/segmented-button'
import { ref } from 'vue'

import { COLUMN_IMPORTS, each, inColumn } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const BILLING_PERIODS = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Annual', value: 'annual' }
]

const PLANS = [
  {
    id: 'hobby',
    name: 'Hobby',
    highlighted: false,
    price: {
      monthly: {
        value: 'Free',
        prefix: '',
        suffix: '',
        details: 'Free forever, no card required. Included limits reset every month.'
      },
      annual: {
        value: 'Free',
        prefix: '',
        suffix: '',
        details: 'Free forever, no card required. Included limits reset every month.'
      }
    },
    featuresTitle: 'All Features Included.',
    features: [
      { icon: 'pi pi-globe', label: 'Global infrastructure' },
      { icon: 'ai ai-edge-functions', label: 'Serverless functions' },
      { icon: 'ai ai-edge-storage', label: 'Storage and database' },
      { icon: 'pi pi-image', label: 'Image optimization' },
      { icon: 'ai ai-edge-firewall', label: 'DDoS mitigation and firewall' }
    ],
    action: { label: 'Start for free', kind: 'outlined', href: '/signup' }
  },
  {
    id: 'pro',
    name: 'Pro',
    highlighted: true,
    tagLabel: 'Popular',
    price: {
      monthly: {
        value: '25',
        prefix: '$',
        suffix: '/mo',
        details:
          'Billed monthly, cancel anytime. Usage past the included limits is charged on demand.'
      },
      annual: {
        value: '20',
        prefix: '$',
        suffix: '/mo',
        details: 'Billed annually, save 20%. Usage past the included limits is charged on demand.'
      }
    },
    featuresTitle: 'All Hobby features, plus:',
    features: [
      { icon: 'ai ai-workloads', label: 'Additional workloads' },
      { icon: 'ai ai-edge-application', label: 'Higher application limits' },
      { icon: 'ai ai-store', label: 'More storage capacity' },
      { icon: 'ai ai-waf-rules', label: 'Broader security coverage' },
      { icon: 'pi pi-wallet', label: 'Configurable spend limit' }
    ],
    action: { label: 'Start with Pro', kind: 'secondary', href: '/signup' }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    highlighted: false,
    price: {
      monthly: {
        value: 'Custom',
        prefix: '',
        suffix: '',
        details: 'Custom terms and payment schedule. Commit up front and save on usage.'
      },
      annual: {
        value: 'Custom',
        prefix: '',
        suffix: '',
        details: 'Custom terms and payment schedule. Commit up front and save on usage.'
      }
    },
    featuresTitle: 'All Pro features, plus:',
    features: [
      { icon: 'pi pi-chart-line', label: 'On-demand pricing' },
      { icon: 'pi pi-arrow-down', label: 'Cut costs with commitments' },
      { icon: 'ai ai-layers', label: 'Capacity Reservation available' },
      { icon: 'pi pi-calendar', label: 'Savings Plan available' },
      { icon: 'ai ai-business-support', label: 'Advanced support available' }
    ],
    action: { label: 'Contact us', kind: 'outlined', href: '#contact' }
  }
]

const quoted = (text) => `'${text.replaceAll("'", "\\'")}'`

const variesByPeriod = ({ price }) =>
  price.monthly.value !== price.annual.value || price.monthly.details !== price.annual.details

const priceName = (plan) => `${plan.id}Price`

const priceLine = (plan) =>
  `const ${priceName(plan)} = {\n${BILLING_PERIODS.map(
    ({ value: period }) =>
      `  ${period}: {\n    value: ${quoted(plan.price[period].value)},\n    details: ${quoted(plan.price[period].details)}\n  }`
  ).join(',\n')}\n}`

const IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import CardGrid from '@aziontech/webkit/card-grid'",
  "import CardPricing from '@aziontech/webkit/card-pricing'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SegmentedButton from '@aziontech/webkit/segmented-button'",
  "import { ref } from 'vue'",
  '',
  "const period = ref('monthly')",
  '',
  `const billingPeriods = [\n${BILLING_PERIODS.map(({ label, value }) => `  { label: ${quoted(label)}, value: ${quoted(value)} }`).join(',\n')}\n]`,
  ...PLANS.filter(variesByPeriod).flatMap((plan) => ['', priceLine(plan)])
]

const components = {
  Button,
  CardGrid,
  CardPricing,
  FrameBox,
  SectionContainer,
  SectionGap,
  SectionModule,
  SegmentedButton
}

const flag = (name, on) => (on ? name : `:${name}="false"`)

const priceProps = (plan) => {
  const { prefix, suffix, value, details } = plan.price.monthly
  const bound = variesByPeriod(plan)
  return [
    bound ? `:value="${priceName(plan)}[period].value"` : `value="${value}"`,
    `prefix="${prefix}"`,
    `suffix="${suffix}"`,
    flag('show-prefix', Boolean(prefix)),
    flag('show-suffix', Boolean(suffix)),
    bound ? `:pricing-details="${priceName(plan)}[period].details"` : `pricing-details="${details}"`
  ]
}

const card = (plan) => {
  const props = [
    'aligned',
    'slot-position="middle"',
    'kind="transparent"',
    `class="${plan.highlighted ? 'bg-(--bg-surface)' : 'bg-(--bg-canvas)'}"`,
    `plan-title="${plan.name}"`,
    ...priceProps(plan),
    flag('show-tag', plan.highlighted),
    ...(plan.tagLabel ? [`tag-label="${plan.tagLabel}"`] : []),
    'action-label=""',
    `data-testid="pricing-card-${plan.id}"`
  ]
  return `<CardPricing
${props.map((prop) => `  ${prop}`).join('\n')}
>
  <div class="flex flex-col gap-(--spacing-md)">
    <p class="m-0 text-body-sm text-(--text-muted)">${plan.featuresTitle}</p>
    <ul class="m-0 flex list-none flex-col gap-(--spacing-sm) p-0">
${each(
  plan.features,
  (feature) => `<li class="flex items-start gap-(--spacing-sm)">
  <i class="${feature.icon} mt-0.5 shrink-0 text-body-sm text-(--primary)" aria-hidden="true" />
  <span class="text-body-sm text-(--text-default)">${feature.label}</span>
</li>`,
  3
)}
    </ul>
  </div>

  <template #actions>
    <Button
      label="${plan.action.label}"
      kind="${plan.action.kind}"
      size="large"
      class="w-full"
      href="${plan.action.href}"
    />
  </template>
</CardPricing>`
}

const TEMPLATE = inColumn(`<SectionModule id="plans" :divided="false" :padded="false">
  <FrameBox flush borders="y" marks="bottom">
    <div class="flex justify-center border-b border-(--border-default) p-(--spacing-md)">
      <SegmentedButton v-model="period" :options="billingPeriods" aria-label="Billing period" />
    </div>
    <CardGrid kind="divider" :columns="3">
${each(PLANS, card, 3)}
    </CardGrid>
  </FrameBox>
</SectionModule>`)

const priceState = () =>
  Object.fromEntries(
    PLANS.filter(variesByPeriod).map((plan) => [
      priceName(plan),
      Object.fromEntries(
        BILLING_PERIODS.map(({ value: period }) => [
          period,
          { value: plan.price[period].value, details: plan.price[period].details }
        ])
      )
    ])
  )

const meta = {
  title: 'Templates/Marketing/Content/PricingPlans',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The plan picker that opens the Pricing page’s column: a billing-period toggle over the plans side by side, each with its price, what it includes and one action, and the recommended plan raised on the surface fill with its tag. Built from `SectionModule`, `FrameBox`, `SegmentedButton`, `CardGrid` (divider) and `CardPricing`, with `Button` in each card’s actions slot.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Plans = {
  render: () => ({
    components,
    setup: () => ({
      period: ref('monthly'),
      billingPeriods: BILLING_PERIODS,
      ...priceState()
    }),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Hobby, Pro and Enterprise. The toggle drives `period`; only Pro’s price and terms change with it (25 a month billed monthly, 20 billed annually), so only Pro reads from a per-period object and the other two cards are static. The Enterprise action points at the page’s `#contact` band.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}
