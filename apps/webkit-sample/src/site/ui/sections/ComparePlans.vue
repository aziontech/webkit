<script setup lang="ts">
  import SectionModule from '@aziontech/webkit/section-module'

  import { COMPARISON_SECTIONS, ON_DEMAND_LINK, PLANS } from '../../data/pricing.js'
  import PlanMatrix from './PlanMatrix.vue'
  import type { PlanMatrixPlan, PlanMatrixSection } from './PlanMatrix.vue'
  import type { SiteAction, SiteLink } from './types'

  defineOptions({ name: 'ComparePlans' })

  interface Props {
    /** The plans, one column each, in order. */
    plans?: PlanMatrixPlan[]
    /** One band per product, each with its rows. */
    sections?: PlanMatrixSection[]
    /** Link closing the table, to the per-unit rates. */
    link?: SiteLink | null
    /** Screen-reader caption of the table. */
    caption?: string
    /** Heading of the feature column. */
    columnLabel?: string
    /** Accessible name of the narrow-layout plan picker. */
    pickerLabel?: string
  }

  withDefaults(defineProps<Props>(), {
    plans: () =>
      PLANS.map(({ id, name, highlighted, action }) => ({
        id,
        name,
        highlighted,
        action: { label: action.label, kind: action.kind, href: action.to } as SiteAction
      })),
    sections: () => COMPARISON_SECTIONS,
    link: () => ON_DEMAND_LINK,
    caption: 'Feature and included-usage comparison across the Hobby, Pro and Enterprise plans.',
    columnLabel: 'Features',
    pickerLabel: 'Plan being compared'
  })
</script>

<template>
  <SectionModule
    id="comparison"
    :divided="false"
    :padded="false"
  >
    <PlanMatrix
      :plans="plans"
      :sections="sections"
      :link="link"
      :caption="caption"
      :column-label="columnLabel"
      :picker-label="pickerLabel"
    />
  </SectionModule>
</template>
