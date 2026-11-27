<script setup lang="ts">
  import { computed, ref, useAttrs, watch } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import { isFiniteNumber } from '../../lib'
  import { useChartContext } from '../composables/use-chart-context'
  import ChartTooltipPanel from '../parts/chart-tooltip-panel.vue'

  defineOptions({ name: 'ChartTooltip', inheritAttrs: false })

  export interface ChartTooltipProps {
    /** Adds a Total row that sums the visible series at the active index. */
    total?: boolean
  }

  withDefaults(defineProps<ChartTooltipProps>(), {
    total: false
  })

  const slots = defineSlots<{
    /** A hint line under the rows, such as what a click on the plot does. */
    footer?(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = useChartContext()
  const { t } = useTranslate({ chart: en.chart })
  const moving = ref(false)

  watch(
    () => ctx.activeIndex.value,
    (next, previous) => {
      moving.value = next !== null && previous !== null
    }
  )

  const rootEl = ref<HTMLElement | null>(null)
  const boxEl = ref<HTMLElement | null>(null)
  const nudge = ref(0)

  function keepInside(x: number): void {
    const box = boxEl.value
    const panel = box?.firstElementChild
    const width = rootEl.value?.clientWidth ?? 0
    if (!box || !panel || !width) return
    const shape = panel.getBoundingClientRect()
    const start = x + shape.left - box.getBoundingClientRect().left
    if (start < 0 || shape.width >= width) nudge.value = -start
    else if (start + shape.width > width) nudge.value = width - start - shape.width
    else nudge.value = 0
  }

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'chart-tooltip')

  const readout = computed(() => {
    const index = ctx.activeIndex.value
    if (index === null) return null
    const label = ctx.labels.value[index]
    const plot = ctx.plot.value
    const along = ctx.category.value.position(index)
    const vertical = ctx.orientation.value === 'vertical'
    const rtl = ctx.rtl.value
    const x = vertical ? along : rtl ? plot.left : plot.left + plot.width
    const y = vertical ? plot.top : along
    const side = vertical
      ? along < plot.left + plot.width / 2
        ? 'end'
        : 'start'
      : rtl
        ? 'end'
        : 'start'
    return {
      title: label === undefined ? '' : ctx.formatLabel(label),
      x,
      y,
      side,
      total: ctx.formatValue(
        ctx.visibleSeries.value.reduce((sum, entry) => {
          const value = entry.values[index]
          return isFiniteNumber(value) ? sum + value : sum
        }, 0)
      ),
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

  watch(
    () => readout.value && `${readout.value.x}:${readout.value.y}:${readout.value.side}`,
    () => {
      if (readout.value) keepInside(readout.value.x)
    },
    { flush: 'post' }
  )
</script>

<template>
  <div
    ref="rootEl"
    v-bind="$attrs"
    :data-testid="testId"
    aria-hidden="true"
    class="pointer-events-none relative col-start-1 row-start-1 min-h-0 min-w-0"
  >
    <div
      v-if="readout"
      ref="boxEl"
      :data-moving="moving || null"
      :style="{ left: '0', translate: `${readout.x + nudge}px ${readout.y}px` }"
      class="absolute top-0 data-[moving]:transition-[translate] data-[moving]:duration-fast-02 data-[moving]:ease-productive-entrance motion-reduce:transition-none"
    >
      <ChartTooltipPanel
        :title="readout.title"
        :side="readout.side"
      >
        <span class="flex flex-col gap-(--spacing-2xs) px-(--spacing-sm) py-(--spacing-xs)">
          <span
            v-for="row in readout.rows"
            :key="row.id"
            class="flex items-center gap-(--spacing-xs)"
          >
            <span
              class="h-0.5 w-3 shrink-0 rounded-full bg-(--chart-tooltip-key) forced-color-adjust-none"
              :style="{ '--chart-tooltip-key': row.color }"
            />
            <span class="min-w-0 flex-1 truncate text-label-md text-(--chart-tooltip-muted)">
              {{ row.name }}
            </span>
            <span class="shrink-0 ps-(--spacing-sm) text-label-code-md tabular-nums">
              {{ row.value }}
            </span>
          </span>
        </span>
        <span
          v-if="total"
          :data-testid="`${testId}__total`"
          class="flex items-center gap-(--spacing-xs) border-t border-(--chart-tooltip-border) px-(--spacing-sm) py-(--spacing-xs)"
        >
          <span class="min-w-0 flex-1 truncate text-label-md">{{ t('chart.total') }}</span>
          <span class="shrink-0 ps-(--spacing-sm) text-label-code-md tabular-nums">
            {{ readout.total }}
          </span>
        </span>
        <span
          v-if="slots.footer"
          :data-testid="`${testId}__footer`"
          class="border-t border-(--chart-tooltip-border) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--chart-tooltip-muted)"
        >
          <slot name="footer" />
        </span>
      </ChartTooltipPanel>
    </div>
  </div>
</template>
