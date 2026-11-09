<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useChartContext } from '../composables/use-chart-context'

  defineOptions({ name: 'ChartLegend', inheritAttrs: false })

  interface Props {
    /** Shows each series total beside its name. */
    totals?: boolean
  }

  withDefaults(defineProps<Props>(), {
    totals: false
  })

  const attrs = useAttrs()
  const ctx = useChartContext()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__legend`
  )

  const entries = computed(() =>
    ctx.series.value.map((entry) => ({
      id: entry.id,
      name: entry.name,
      color: entry.color,
      total: ctx.formatValue(entry.total),
      kind: ctx.markKindOf(entry.id),
      hidden: ctx.hidden.value.has(entry.id)
    }))
  )
</script>

<template>
  <ul
    v-if="entries.length > 1"
    v-bind="$attrs"
    :data-testid="testId"
    class="col-start-1 row-start-2 m-0 mt-(--spacing-sm) flex list-none flex-wrap gap-x-(--spacing-sm) gap-y-(--spacing-xxs) p-0"
  >
    <li
      v-for="entry in entries"
      :key="entry.id"
    >
      <button
        type="button"
        :aria-pressed="!entry.hidden"
        :data-hidden="entry.hidden || null"
        :data-testid="`${testId}-item`"
        class="inline-flex min-h-6 items-center gap-(--spacing-xs) rounded-(--shape-elements) px-(--spacing-xxs) text-body-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) data-[hidden]:text-(--text-muted)"
        @click="ctx.toggleSeries($event, entry.id)"
        @pointerenter="ctx.setEmphasized(entry.hidden ? null : entry.id)"
        @pointerleave="ctx.setEmphasized(null)"
        @focus="ctx.setEmphasized(entry.hidden ? null : entry.id)"
        @blur="ctx.setEmphasized(null)"
      >
        <span
          :data-kind="entry.kind"
          :data-hidden="entry.hidden || null"
          :style="{ '--chart-legend-key': entry.color }"
          class="shrink-0 bg-(--chart-legend-key) data-[kind=area]:size-2.5 data-[kind=area]:rounded-(--shape-flat) data-[kind=bar]:size-2.5 data-[kind=bar]:rounded-(--shape-flat) data-[kind=line]:h-0.5 data-[kind=line]:w-3 data-[kind=line]:rounded-full data-[hidden]:opacity-30"
        />
        <span>{{ entry.name }}</span>
        <span
          v-if="totals"
          class="tabular-nums text-(--text-muted)"
        >
          {{ entry.total }}
        </span>
      </button>
    </li>
  </ul>
</template>
