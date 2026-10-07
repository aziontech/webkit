<script setup lang="ts">
  import SectionModule from '@aziontech/webkit/section-module'

  import { SUPPORT_SECTIONS, SUPPORT_TIERS } from '../../data/support.js'
  import PlanMatrix from './PlanMatrix.vue'
  import type { PlanMatrixPlan, PlanMatrixSection } from './PlanMatrix.vue'
  import type { SiteAction } from './types'

  defineOptions({ name: 'CompareSupportTiers' })

  interface Props {
    /** The support tiers, one column each, in order, each saying who it is for. */
    tiers?: PlanMatrixPlan[]
    /** One band per service family, each closing on its own link. */
    sections?: PlanMatrixSection[]
    /** Screen-reader caption of the table. */
    caption?: string
    /** Heading of the service column. */
    columnLabel?: string
    /** Accessible name of the narrow-layout tier picker. */
    pickerLabel?: string
  }

  withDefaults(defineProps<Props>(), {
    tiers: () =>
      SUPPORT_TIERS.map(({ id, name, description, highlighted, action }) => ({
        id,
        name,
        description,
        highlighted: highlighted ?? false,
        action: { label: action.label, kind: action.kind, href: action.to } as SiteAction
      })),
    sections: () => SUPPORT_SECTIONS,
    caption:
      'Support and Professional Services comparison across the Developer, Business, Enterprise and Mission-Critical tiers.',
    columnLabel: 'Support',
    pickerLabel: 'Tier being compared'
  })
</script>

<template>
  <SectionModule
    id="tiers"
    :divided="false"
    :padded="false"
  >
    <PlanMatrix
      :plans="tiers"
      :sections="sections"
      :caption="caption"
      :column-label="columnLabel"
      :picker-label="pickerLabel"
    />
  </SectionModule>
</template>
