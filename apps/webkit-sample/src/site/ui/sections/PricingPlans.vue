<script setup lang="ts">
  import CardGrid from '@aziontech/webkit/card-grid-root'
  import CardPricing from '@aziontech/webkit/card-pricing'
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionModule from '@aziontech/webkit/section-module'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import { computed, ref } from 'vue'

  import { BILLING_PERIODS, PLANS } from '../../data/pricing.js'
  import SectionAction from './SectionAction.vue'
  import type { SiteAction } from './types'

  defineOptions({ name: 'PricingPlans' })

  export interface PricingPlanPrice {
    /** The amount, or a word standing in for it. */
    value: string
    /** Currency symbol before the amount. */
    prefix?: string
    /** Unit after the amount. */
    suffix?: string
    /** Terms under the price. */
    details?: string
  }

  export interface PricingPlanFeature {
    /** Leading glyph, as an icon class. */
    icon: string
    /** What the plan includes. */
    label: string
  }

  export interface PricingPlan {
    /** Stable key of the card. */
    id: string
    /** Plan name. */
    name: string
    /** Fallback for the terms when a period states none. */
    description?: string
    /** Raises the card on the surface fill and shows its tag. */
    highlighted?: boolean
    /** Tag on the highlighted card. */
    tagLabel?: string
    /** Price per billing period, keyed by the period value. */
    price: Record<string, PricingPlanPrice>
    /** Lead-in above the feature list. */
    featuresTitle: string
    /** What the plan adds. */
    features: PricingPlanFeature[]
    /** The card's call to action. */
    action: SiteAction
  }

  export interface PricingPeriod {
    /** Visible label of the toggle option. */
    label: string
    /** Key into each plan's price. */
    value: string
  }

  interface Props {
    /** The plans, side by side. */
    plans?: PricingPlan[]
    /** Billing periods of the toggle; the first is selected. */
    periods?: PricingPeriod[]
    /** Accessible name of the billing-period toggle. */
    periodLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    plans: () =>
      PLANS.map(({ action, ...plan }) => ({
        ...plan,
        action: { label: action.label, kind: action.kind, href: action.to } as SiteAction
      })),
    periods: () => BILLING_PERIODS,
    periodLabel: 'Billing period'
  })

  const period = ref(props.periods[0]?.value ?? '')

  const cards = computed(() =>
    props.plans.map((plan) => {
      const price = plan.price[period.value] ?? Object.values(plan.price)[0]
      return {
        ...plan,
        value: price?.value ?? '',
        prefix: price?.prefix ?? '',
        suffix: price?.suffix ?? '',
        details: price?.details || plan.description || ''
      }
    })
  )
</script>

<template>
  <SectionModule
    id="plans"
    :divided="false"
    :padded="false"
  >
    <FrameBox
      flush
      borders="y"
      marks="bottom"
    >
      <div class="flex justify-center border-b border-(--border-default) p-(--spacing-md)">
        <SegmentedButton
          v-model="period"
          :options="periods"
          :aria-label="periodLabel"
        />
      </div>
      <CardGrid
        kind="divider"
        :columns="3"
      >
        <div
          v-for="card in cards"
          :key="card.id"
          :data-highlighted="card.highlighted || null"
          class="flex bg-(--bg-canvas) data-highlighted:bg-(--bg-surface)"
        >
          <CardPricing
            aligned
            slot-position="middle"
            kind="transparent"
            :plan-title="card.name"
            :value="card.value"
            :prefix="card.prefix"
            :suffix="card.suffix"
            :show-prefix="Boolean(card.prefix)"
            :show-suffix="Boolean(card.suffix)"
            :pricing-details="card.details"
            :show-tag="card.highlighted ?? false"
            :tag-label="card.tagLabel"
            action-label=""
            :data-testid="`pricing-card-${card.id}`"
          >
            <div class="flex flex-col gap-(--spacing-md)">
              <p class="m-0 text-body-sm text-(--text-muted)">{{ card.featuresTitle }}</p>
              <ul class="m-0 flex list-none flex-col gap-(--spacing-sm) p-0">
                <li
                  v-for="feature in card.features"
                  :key="feature.label"
                  class="flex items-start gap-(--spacing-sm)"
                >
                  <i
                    :class="[feature.icon, 'mt-0.5 shrink-0 text-body-sm text-(--primary)']"
                    aria-hidden="true"
                  />
                  <span class="text-body-sm text-(--text-default)">{{ feature.label }}</span>
                </li>
              </ul>
            </div>

            <template #actions>
              <SectionAction
                :action="card.action"
                class="w-full"
              />
            </template>
          </CardPricing>
        </div>
      </CardGrid>
    </FrameBox>
  </SectionModule>
</template>
