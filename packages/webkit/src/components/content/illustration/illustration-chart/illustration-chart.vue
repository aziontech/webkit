<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { useIllustrationContext } from '../composables/use-illustration-context'

  defineOptions({
    name: 'IllustrationChart',
    inheritAttrs: false
  })

  interface Props {
    /** Series to plot; values are normalized against their own range. */
    data?: number[]
    /** Axis labels, one per point; empty renders no axis. */
    labels?: string[]
    /** Index of the column to emphasize; -1 emphasizes none. */
    highlight?: number
    /** Draws the line in the brand color; inherits the scene emphasis when omitted. */
    active?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    data: () => [],
    labels: () => [],
    highlight: -1,
    active: undefined
  })

  const attrs = useAttrs()

  // A chart is sized by the scene that places it, so it takes no `size`.
  const { size, active } = useIllustrationContext(
    () => undefined,
    () => props.active
  )

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-illustration-chart'
  )

  const passthroughAttrs = computed(() => {
    const rest = { ...attrs }
    delete rest.class
    delete rest['data-testid']
    return rest
  })

  // Plotted into a unit-square viewBox stretched to the box, so one series serves any aspect
  // ratio; `non-scaling-stroke` keeps the hairline true under that stretch. Values are
  // normalized against their own range with a margin, so a flat series still reads as a line.
  const PLOT_MARGIN = 12

  const points = computed(() => {
    const values = props.data
    if (values.length === 0) return []
    const min = Math.min(...values)
    const max = Math.max(...values)
    const span = max - min || 1
    const step = values.length > 1 ? 100 / (values.length - 1) : 0
    return values.map((value, index) => ({
      x: values.length > 1 ? index * step : 50,
      // SVG y grows downward, so a high value sits near the top.
      y: 100 - PLOT_MARGIN - ((value - min) / span) * (100 - PLOT_MARGIN * 2)
    }))
  })

  const polyline = computed(() => points.value.map((p) => `${p.x},${p.y}`).join(' '))

  const ROOT_CLASS = 'flex w-full shrink-0 flex-col gap-[var(--spacing-xxs)]'

  const PLOT_CLASS = 'group/chart relative flex-1'

  // Each column rises from the baseline to just under its own point, so the bars carry the same
  // shape as the line; the emphasized one runs the full height in the brand ramp.
  const COLUMN_CLASS =
    'flex-1 self-end rounded-[var(--shape-button)] bg-[var(--bg-placeholder)] opacity-40 data-[highlight]:h-full data-[highlight]:opacity-100 data-[highlight]:bg-[linear-gradient(to_bottom,transparent_0%,var(--primary)_100%)]'

  const LINE_CLASS =
    'fill-none stroke-[var(--primary)] [stroke-width:1] [vector-effect:non-scaling-stroke] [stroke-linejoin:round]'

  // Markers sit outside the stretched viewBox, as absolutely-placed squares, so they stay square
  // at any aspect ratio — a <rect> inside `preserveAspectRatio="none"` would shear into a lozenge.
  const MARKER_CLASS =
    'absolute size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-[var(--illustration-shape-node)] border-[length:var(--illustration-rim-width-hairline)] border-solid border-[var(--primary)] bg-[var(--bg-surface)]'

  const AXIS_CLASS =
    'flex w-full justify-between text-label-code-sm text-[length:var(--illustration-label-small)] leading-none text-[var(--text-muted)]'

  const rootClass = computed(() => cn(ROOT_CLASS, attrs.class as string | undefined))
</script>

<template>
  <span
    :data-testid="testId"
    :data-size="size"
    :data-active="active || null"
    :class="rootClass"
    v-bind="passthroughAttrs"
  >
    <span :class="PLOT_CLASS">
      <!-- Column backdrops: one per point, the emphasized one filled with the brand ramp. -->
      <span
        aria-hidden="true"
        class="absolute inset-0 flex items-stretch gap-[var(--spacing-xxs)]"
      >
        <span
          v-for="(point, index) in points"
          :key="`column-${index}`"
          :class="COLUMN_CLASS"
          :data-highlight="index === highlight || null"
          :data-testid="`${testId}__column`"
          :style="{ height: `${100 - point.y}%` }"
        />
      </span>

      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        class="absolute inset-0 size-full overflow-visible"
      >
        <polyline
          :points="polyline"
          :class="LINE_CLASS"
        />
      </svg>

      <span
        v-for="(point, index) in points"
        :key="`marker-${index}`"
        aria-hidden="true"
        :data-testid="`${testId}__marker`"
        :class="MARKER_CLASS"
        :style="{ left: `${point.x}%`, top: `${point.y}%` }"
      />
    </span>

    <span
      v-if="labels.length"
      :class="AXIS_CLASS"
    >
      <span
        v-for="label in labels"
        :key="label"
        class="flex-1 text-center"
        >{{ label }}</span
      >
    </span>
  </span>
</template>
