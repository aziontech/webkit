<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import SegmentedButton from '../../actions/segmented-button/segmented-button.vue'

  defineOptions({
    name: 'PricingPlans',
    inheritAttrs: false
  })

  /** One billing period offered by the switch above the row of plan cards. */
  export type PricingPeriod = {
    /** Visible text of the period, rendered inside the switch. */
    label: string
    /** The value the band reports while this period is selected. */
    value: string
  }

  /** Register of the band. */
  export type PricingPlansKind = 'gap' | 'divider'

  interface Props {
    /** Register of the band: gutters between self-contained cards, or hairline rules drawn by the gaps. In `divider` each card fills its own background. */
    kind?: PricingPlansKind
    /** Billing periods offered above the row; each item is a label and a value. The switch is omitted when fewer than two are given. */
    periods?: PricingPeriod[]
    /** Accessible name for the billing-period switch. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'gap',
    periods: () => [],
    ariaLabel: 'Billing period'
  })

  const model = defineModel<string | undefined>({ default: undefined })

  defineSlots<{
    /** The plan cards, composed in reading order. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-pricing-plans'
  )

  const hasSwitch = computed(() => props.periods.length >= 2)
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :data-kind="kind"
    :data-switchable="hasSwitch || null"
    class="group/plans flex flex-col data-[kind=gap]:items-center data-[kind=gap]:gap-(--spacing-xl)"
  >
    <div
      v-if="hasSwitch"
      class="flex shrink-0 justify-center group-data-[kind=divider]/plans:border-b group-data-[kind=divider]/plans:border-(--border-default) group-data-[kind=divider]/plans:p-(--spacing-md)"
    >
      <SegmentedButton
        v-model="model"
        :options="periods"
        :aria-label="ariaLabel"
      />
    </div>
    <div
      class="grid w-full items-stretch md:auto-cols-fr md:grid-flow-col group-data-[kind=gap]/plans:gap-(--spacing-md) group-data-[kind=divider]/plans:gap-px group-data-[kind=divider]/plans:bg-(--border-default)"
    >
      <slot />
    </div>
  </section>
</template>
