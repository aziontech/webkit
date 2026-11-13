<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import SegmentedButton from '../../actions/segmented-button/segmented-button.vue'
  import CardPricing from '../../content/card-pricing/card-pricing.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import CardGrid from '../../marketing/card-grid/card-grid.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'

  defineOptions({
    name: 'PricingPlans',
    inheritAttrs: false
  })

  /** One option of the billing-period toggle. */
  export type PricingPlansPeriod = {
    /** Visible label of the option. */
    label: string
    /** Value a plan's price is matched by. */
    value: string
  }

  /** A plan's price for one billing period. */
  export type PricingPlansPrice = {
    /** The period this price applies to; a price without one applies to every period. */
    period?: string
    /** The amount, or a word such as Free or Custom. */
    value: string
    /** Text before the amount, such as a currency sign. */
    prefix?: string
    /** Text after the amount, such as a per-month unit. */
    suffix?: string
    /** Line under the price about billing terms. */
    details?: string
  }

  /** One line of what a plan includes. */
  export type PricingPlansFeature = {
    /** Icon class of the glyph leading the line. */
    icon: string
    /** What the plan includes. */
    label: string
  }

  /** The card button of a plan. */
  export type PricingPlansAction = {
    /** Visible label of the button; the button is dropped without one. */
    label: string
    /** Destination the button links to; the button is dropped without one. */
    href: string
  }

  /** One plan card. */
  export type PricingPlansPlan = {
    /** Plan name heading the card; a plan without one is dropped. */
    name: string
    /** Raises the recommended plan, shows its tag and gives it the secondary button. */
    highlighted?: boolean
    /** Text of the highlighted plan's tag. */
    tagLabel?: string
    /** One price per period, matched by `period`. */
    prices: PricingPlansPrice[]
    /** Line above the feature list. */
    featuresTitle?: string
    /** What the plan includes, in order. */
    features?: PricingPlansFeature[]
    /** The card button; `{ label, href }`. */
    action?: PricingPlansAction
  }

  interface Props {
    /** In-page id set on the band so a hash link can target it. */
    anchor?: string
    /** The billing periods of the toggle, in order; each is `{ label, value }`. The toggle shows with two or more and opens on the first. */
    periods?: PricingPlansPeriod[]
    /** Accessible name of the billing-period toggle. */
    periodsAriaLabel?: string
    /** The plan cards, in order; each is `{ name, highlighted?, tagLabel?, prices, featuresTitle?, features?, action? }` where a price is `{ period?, value, prefix?, suffix?, details? }`, a feature is `{ icon, label }` and `action` is `{ label, href }`; a plan without a name is dropped, and an action without a label or href is dropped. */
    plans?: PricingPlansPlan[]
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    periods: () => [],
    periodsAriaLabel: '',
    plans: () => []
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-pricing-plans'
  )

  const visiblePlans = computed(() => props.plans.filter((plan) => Boolean(plan.name)))

  const hasToggle = computed(() => props.periods.length > 1)

  const picked = ref('')

  const period = computed({
    get: () => picked.value || props.periods[0]?.value || '',
    set: (value: string) => {
      picked.value = value
    }
  })

  const priceOf = (plan: PricingPlansPlan): PricingPlansPrice =>
    plan.prices.find((price) => price.period === period.value) ??
    plan.prices.find((price) => !price.period) ?? { value: '' }

  const hasAction = (plan: PricingPlansPlan) => Boolean(plan.action?.label && plan.action?.href)
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    class="scroll-mt-(--spacing-xxl)"
  >
    <SectionModule
      v-if="visiblePlans.length > 0"
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <div
          v-if="hasToggle"
          class="flex justify-center border-b border-(--border-default) p-(--spacing-md)"
        >
          <SegmentedButton
            v-model="period"
            :options="periods"
            :aria-label="periodsAriaLabel || undefined"
          />
        </div>
        <CardGrid
          kind="divider"
          :columns="3"
        >
          <CardPricing
            v-for="plan in visiblePlans"
            :key="plan.name"
            aligned
            slot-position="middle"
            kind="transparent"
            :data-highlighted="plan.highlighted || null"
            class="bg-(--bg-canvas) data-[highlighted]:bg-(--bg-surface)"
            :plan-title="plan.name"
            :value="priceOf(plan).value"
            :prefix="priceOf(plan).prefix ?? ''"
            :suffix="priceOf(plan).suffix ?? ''"
            :show-prefix="Boolean(priceOf(plan).prefix)"
            :show-suffix="Boolean(priceOf(plan).suffix)"
            :pricing-details="priceOf(plan).details ?? ''"
            :show-tag="Boolean(plan.highlighted)"
            :tag-label="plan.tagLabel ?? ''"
            action-label=""
          >
            <div class="flex flex-col gap-(--spacing-md)">
              <p
                v-if="plan.featuresTitle"
                class="m-0 text-body-sm text-(--text-muted)"
              >
                {{ plan.featuresTitle }}
              </p>
              <ul
                v-if="plan.features?.length"
                class="m-0 flex list-none flex-col gap-(--spacing-sm) p-0"
              >
                <li
                  v-for="feature in plan.features"
                  :key="feature.label"
                  class="flex items-start gap-(--spacing-sm)"
                >
                  <i
                    :class="feature.icon"
                    class="mt-0.5 shrink-0 text-body-sm text-(--primary)"
                    aria-hidden="true"
                  />
                  <span class="text-body-sm text-(--text-default)">{{ feature.label }}</span>
                </li>
              </ul>
            </div>

            <template
              v-if="hasAction(plan)"
              #actions
            >
              <Button
                :label="plan.action?.label ?? ''"
                :kind="plan.highlighted ? 'secondary' : 'outlined'"
                size="large"
                class="w-full"
                :href="plan.action?.href ?? ''"
              />
            </template>
          </CardPricing>
        </CardGrid>
      </FrameBox>
    </SectionModule>
  </section>
</template>
