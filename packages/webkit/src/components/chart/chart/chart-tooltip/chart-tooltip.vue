<script setup lang="ts">
  import { computed, ref, useAttrs, watch } from 'vue'

  import { isFiniteNumber } from '../../_lib'
  import { useChartContext } from '../composables/use-chart-context'

  defineOptions({ name: 'ChartTooltip', inheritAttrs: false })

  const attrs = useAttrs()
  const ctx = useChartContext()
  const moving = ref(false)

  watch(
    () => ctx.activeIndex.value,
    (next, previous) => {
      moving.value = next !== null && previous !== null
    }
  )

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__tooltip`
  )

  const readout = computed(() => {
    const index = ctx.activeIndex.value
    if (index === null) return null
    const label = ctx.labels.value[index]
    const plot = ctx.plot.value
    const along = ctx.category.value.position(index)
    const vertical = ctx.orientation.value === 'vertical'
    const x = vertical ? along : plot.left + plot.width
    const y = vertical ? plot.top : along
    const side = vertical && along < plot.left + plot.width / 2 ? 'end' : 'start'
    return {
      title: label === undefined ? '' : ctx.formatLabel(label),
      x,
      y,
      side,
      rows: ctx.visibleSeries.value.map((entry) => {
        const value = entry.values[index]
        return {
          id: entry.id,
          name: entry.name,
          color: entry.color,
          value: isFiniteNumber(value) ? ctx.formatValue(value) : ''
        }
      })
    }
  })
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    aria-hidden="true"
    class="pointer-events-none relative col-start-1 row-start-1 min-h-0 min-w-0"
  >
    <div
      v-if="readout"
      :data-moving="moving || null"
      :style="{ translate: `${readout.x}px ${readout.y}px` }"
      class="absolute left-0 top-0 data-[moving]:transition-[translate] data-[moving]:duration-fast-02 data-[moving]:ease-productive-entrance motion-reduce:transition-none"
    >
      <div
        :data-side="readout.side"
        class="flex w-max max-w-(--container-3xs) flex-col gap-(--spacing-xxs) rounded-(--shape-elements) bg-(--chart-tooltip-bg) p-(--spacing-xs) text-(--chart-tooltip-text) shadow-(--shadow-sm) data-[side=end]:translate-x-(--spacing-sm) data-[side=start]:-translate-x-[calc(100%+var(--spacing-sm))]"
      >
        <span class="text-label-sm text-(--chart-tooltip-muted)">{{ readout.title }}</span>
        <span
          v-for="row in readout.rows"
          :key="row.id"
          class="flex items-center gap-(--spacing-xs)"
        >
          <span
            class="h-0.5 w-3 shrink-0 rounded-full bg-(--chart-tooltip-key)"
            :style="{ '--chart-tooltip-key': row.color }"
          />
          <span class="text-label-code-sm tabular-nums">{{ row.value }}</span>
          <span class="truncate text-body-xs text-(--chart-tooltip-muted)">{{ row.name }}</span>
        </span>
      </div>
    </div>
  </div>
</template>
