<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Stats from '../../marketing/stats/stats.vue'
  import SectionBand from '../parts/section-band.vue'

  defineOptions({
    name: 'StatsSection',
    inheritAttrs: false
  })

  /** One headline figure and the caption naming what it measures. */
  export type StatsSectionItem = {
    /** The figure itself, set at big-number scale. */
    value: string
    /** Caption naming what the figure measures. */
    label: string
    /** Qualifier set before the figure. */
    prefix?: string
    /** Unit set after the figure. */
    suffix?: string
  }

  export interface StatsSectionProps {
    /**
     * The figures rendered as cells, in order; each item is `{ value, label, prefix?, suffix? }`
     * where `value` is the figure, `label` its caption, and `prefix` / `suffix` the qualifier and
     * unit set beside it.
     */
    items?: StatsSectionItem[]
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
  }

  const props = withDefaults(defineProps<StatsSectionProps>(), {
    items: () => [],
    anchor: ''
  })

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'stats-section')

  const hasItems = computed(() => props.items.length > 0)
</script>

<template>
  <SectionBand
    v-bind="$attrs"
    :anchor="anchor"
    :data-testid="testId"
    :filled="hasItems"
    marks="bottom"
  >
    <Stats :items="items" />
  </SectionBand>
</template>
