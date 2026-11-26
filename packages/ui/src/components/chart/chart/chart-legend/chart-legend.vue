<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useChartContext } from '../composables/use-chart-context'
  import ChartLegendButton from '../parts/chart-legend-button.vue'

  defineOptions({ name: 'ChartLegend', inheritAttrs: false })

  export interface ChartLegendProps {
    /** Shows each series total beside its name (the same name as ChartTooltip). */
    total?: boolean
  }

  withDefaults(defineProps<ChartLegendProps>(), {
    total: false
  })

  const attrs = useAttrs()
  const ctx = useChartContext()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'chart-legend')

  const entries = computed(() =>
    ctx.series.value.map((entry) => ({
      id: entry.id,
      name: entry.name,
      color: entry.color,
      total: ctx.formatValue(entry.total),
      hidden: ctx.hidden.value.has(entry.id),
      dimmed: ctx.emphasized.value !== null && ctx.emphasized.value !== entry.id
    }))
  )
</script>

<template>
  <ul
    v-if="entries.length > 1"
    v-bind="$attrs"
    :data-testid="testId"
    class="col-start-1 row-start-2 m-0 mt-(--spacing-sm) flex list-none flex-wrap gap-x-(--spacing-sm) gap-y-(--spacing-2xs) p-0"
  >
    <li
      v-for="entry in entries"
      :key="entry.id"
    >
      <ChartLegendButton
        :color="entry.color"
        :pressed="!entry.hidden"
        :dimmed="entry.dimmed"
        :data-testid="`${testId}__item`"
        @click="ctx.toggleSeries($event, entry.id)"
        @pointerenter="ctx.setEmphasized(entry.hidden ? null : entry.id)"
        @pointerleave="ctx.setEmphasized(null)"
        @focus="ctx.setEmphasized(entry.hidden ? null : entry.id)"
        @blur="ctx.setEmphasized(null)"
      >
        <span>{{ entry.name }}</span>
        <span
          v-if="total"
          class="tabular-nums text-(--text-muted)"
        >
          {{ entry.total }}
        </span>
      </ChartLegendButton>
    </li>
  </ul>
</template>
