<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import Button from '../../action/button/button.vue'
  import ToggleGroup from '../../action/toggle-group/toggle-group.vue'
  import PricingCard from '../../content/pricing-card/pricing-card.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'
  import CardGrid from '../../marketing/card-grid/card-grid.vue'
  import type { SectionTitleAction } from '../../marketing/section-title/section-title.vue'

  defineOptions({
    name: 'PricingPlansSection',
    inheritAttrs: false
  })

  export type { SectionTitleAction }

  /** One option of the billing-period toggle. */
  export type PricingPlansSectionPeriod = {
    /** Visible label of the option. */
    label: string
    /** Value a plan's price is matched by. */
    value: string
  }

  /** A plan's price for one billing period. */
  export type PricingPlansSectionPrice = {
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
  export type PricingPlansSectionFeature = {
    /** Icon class of the glyph leading the line. */
    icon: string
    /** What the plan includes. */
    label: string
  }

  /** One plan card. */
  export type PricingPlansSectionPlan = {
    /** Plan name heading the card; a plan without one is dropped. */
    name: string
    /** Line under the price when the picked period's price states no billing terms. */
    description?: string
    /** Raises the recommended plan, shows its tag and gives it the secondary button. */
    highlighted?: boolean
    /** Text of the highlighted plan's tag. */
    tagLabel?: string
    /** One price per period, matched by `period`. */
    prices: PricingPlansSectionPrice[]
    /** Line above the feature list. */
    featuresTitle?: string
    /** What the plan includes, in order. */
    features?: PricingPlansSectionFeature[]
    /** The card button; `{ label, href }`. */
    action?: SectionTitleAction
  }

  export interface PricingPlansSectionProps {
    /** In-page id set on the band so a hash link can target it. */
    anchor?: string
    /** The billing periods of the toggle, in order; each is `{ label, value }`. The toggle shows with two or more and opens on the first. */
    periods?: PricingPlansSectionPeriod[]
    /** Accessible name of the billing-period toggle. */
    periodsAriaLabel?: string
    /** The plan cards, in order; each is `{ name, description?, highlighted?, tagLabel?, prices, featuresTitle?, features?, action? }` where a price is `{ period?, value, prefix?, suffix?, details? }`, a feature is `{ icon, label }` and `action` is `{ label, href }`; `description` stands in for a price without `details`, a plan without a name is dropped, and an action without a label or href is dropped. */
    plans?: PricingPlansSectionPlan[]
  }

  const props = withDefaults(defineProps<PricingPlansSectionProps>(), {
    anchor: '',
    periods: () => [],
    periodsAriaLabel: '',
    plans: () => []
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'pricing-plans-section'
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

  const priceOf = (plan: PricingPlansSectionPlan): PricingPlansSectionPrice =>
    plan.prices.find((price) => price.period === period.value) ??
    plan.prices.find((price) => !price.period) ?? { value: '' }

  const detailsOf = (plan: PricingPlansSectionPlan) =>
    priceOf(plan).details || plan.description || ''

  const hasAction = (plan: PricingPlansSectionPlan) =>
    Boolean(plan.action?.label && plan.action?.href)
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    class="scroll-mt-(--spacing-2xl)"
  >
    <div
      v-if="visiblePlans.length > 0"
      :data-testid="`${testId}__band`"
      class="w-full border-b border-(--border-default) bg-(--bg-canvas) px-(--layout-boundary-inline)"
    >
      <RegistrationFrame
        flush
        borders="x"
        marks="bottom"
        class="mx-auto max-w-(--layout-measure-site)"
      >
        <div
          v-if="hasToggle"
          class="flex justify-center border-b border-(--border-default) p-(--spacing-md)"
        >
          <ToggleGroup
            v-model="period"
            :options="periods"
            :aria-label="periodsAriaLabel || undefined"
          />
        </div>
        <CardGrid
          variant="divider"
          :columns="3"
        >
          <PricingCard
            v-for="plan in visiblePlans"
            :key="plan.name"
            equal-height
            animated
            actions-position="middle"
            variant="ghost"
            :data-highlighted="plan.highlighted || null"
            class="bg-(--bg-canvas) data-[highlighted]:bg-(--bg-surface)"
            :title="plan.name"
            :value="priceOf(plan).value"
            :prefix="priceOf(plan).prefix ?? ''"
            :suffix="priceOf(plan).suffix ?? ''"
            :show-prefix="Boolean(priceOf(plan).prefix)"
            :show-suffix="Boolean(priceOf(plan).suffix)"
            :pricing-details="detailsOf(plan)"
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
                :variant="plan.highlighted ? 'secondary' : 'outline'"
                size="large"
                class="w-full"
                :href="plan.action?.href ?? ''"
              />
            </template>
          </PricingCard>
        </CardGrid>
      </RegistrationFrame>
    </div>
  </section>
</template>
