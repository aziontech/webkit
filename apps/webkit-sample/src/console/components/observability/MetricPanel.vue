<script setup>
  // One dashboard panel: a title, the window it covers, and a sparkline of the series.
  //
  // The chart is an inline SVG rather than a charting dependency, for the reason the
  // whole system avoids runtime libraries: a sparkline is a polyline over a scaled
  // series, and owning those twenty lines costs less than a library that ships its own
  // colors, its own tooltip and its own idea of a theme.
  //
  // Everything visual comes from tokens, so the panel is correct in both themes with
  // no per-theme branch: the line is --primary, the fill is the same color at low
  // alpha through `currentColor`, and the frame is the card's own surface and border.
  import CardBox from '@aziontech/webkit/card-box'
  import { computed } from 'vue'

  const props = defineProps({
    /** Panel title — what the series measures. */
    title: { type: String, required: true },
    /** The unit the numbers carry, shown beside the latest value. */
    unit: { type: String, default: '' },
    /** The window the series covers, e.g. "Last 24 hours". */
    period: { type: String, default: '' },
    /** The series itself, oldest first. */
    series: { type: Array, default: () => [] }
  })

  // The viewBox is fixed and the series is scaled into it, so a panel of 24 points
  // and a panel of 200 render at the same stroke weight.
  const WIDTH = 100
  const HEIGHT = 32

  const bounds = computed(() => {
    const values = props.series
    if (!values.length) return { min: 0, max: 1 }
    const min = Math.min(...values)
    const max = Math.max(...values)
    // A flat series would divide by zero and collapse to the top edge; give it a
    // band so it draws as the straight line it is, centred.
    return max === min ? { min: min - 1, max: max + 1 } : { min, max }
  })

  const points = computed(() => {
    const { min, max } = bounds.value
    const step = props.series.length > 1 ? WIDTH / (props.series.length - 1) : 0
    return props.series
      .map((value, index) => {
        const y = HEIGHT - ((value - min) / (max - min)) * HEIGHT
        return `${(index * step).toFixed(2)},${y.toFixed(2)}`
      })
      .join(' ')
  })

  // Closing the polyline down to the baseline turns the same points into the fill.
  const area = computed(() =>
    points.value ? `0,${HEIGHT} ${points.value} ${WIDTH},${HEIGHT}` : ''
  )

  const latest = computed(() => {
    const value = props.series.at(-1)
    if (value === undefined) return ''
    return value >= 100 ? Math.round(value).toLocaleString() : value.toFixed(2)
  })
</script>

<template>
  <CardBox>
    <template #content>
      <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
        <div class="flex min-w-0 items-baseline justify-between gap-(--spacing-xs)">
          <h3 class="min-w-0 truncate text-label-md text-(--text-default)">{{ title }}</h3>
          <span class="shrink-0 text-body-sm text-(--text-muted)">{{ period }}</span>
        </div>

        <p class="flex items-baseline gap-(--spacing-xxs)">
          <span class="text-heading-md text-(--text-default)">{{ latest }}</span>
          <span
            v-if="unit"
            class="text-body-sm text-(--text-muted)"
            >{{ unit }}</span
          >
        </p>

        <!-- aria-hidden with a text summary above it: the numbers are already in the
             DOM as text, so the drawing adds nothing a screen reader needs. -->
        <svg
          :viewBox="`0 0 ${WIDTH} ${HEIGHT}`"
          preserveAspectRatio="none"
          class="h-16 w-full text-(--primary)"
          aria-hidden="true"
        >
          <polygon
            :points="area"
            fill="currentColor"
            opacity="0.12"
          />
          <polyline
            :points="points"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            vector-effect="non-scaling-stroke"
          />
        </svg>
      </div>
    </template>
  </CardBox>
</template>
