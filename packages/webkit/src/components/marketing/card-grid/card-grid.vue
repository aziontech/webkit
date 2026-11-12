<script setup lang="ts">
  import { computed, useAttrs, useSlots } from 'vue'

  import { countRenderedNodes } from '../../../utils/rendered-content'

  defineOptions({
    name: 'CardGrid',
    inheritAttrs: false
  })

  /** Register of the grid. */
  export type CardGridKind = 'gap' | 'divider' | 'frame'
  /** Column count at the large breakpoint. */
  export type CardGridColumns = 2 | 3 | 4 | 5
  /** Column count below the small breakpoint. */
  export type CardGridMobileColumns = 1 | 2
  /** Weight of the hairline rules. */
  export type CardGridDividerColor = 'default' | 'muted'
  /** How the cells fill the rows. */
  export type CardGridLayout = 'balanced' | 'fixed'

  interface Props {
    /** Register of the grid: gutters between self-contained cards, hairline rules drawn by the gaps, or framed cells that draw their own rules and marks. */
    kind?: CardGridKind
    /** How many columns the grid fans out to at the large breakpoint. */
    columns?: CardGridColumns
    /** How many columns the grid holds below the small breakpoint. */
    mobileColumns?: CardGridMobileColumns
    /** Weight of the hairline rules in the `divider` register. */
    dividerColor?: CardGridDividerColor
    /** In the `frame` register, the surrounding frame already draws the grid's outer rules: the grid drops its own top and left ones and lays its right and bottom ones onto the frame's, so a framed column keeps one hairline per edge. */
    flush?: boolean
    /** How the cells fill the rows: `balanced` picks the narrowest track count that keeps the fewest rows `columns` allows, so a count that splits evenly fills every row (2 → halves, 4 → 2 × 2), and a short last row keeps the track width with its trailing tracks left empty, as azion.com does (5 → 3 + 2, 7 → 3 + 3 + 1); `fixed` keeps a strict `columns`-wide grid whatever the count. */
    layout?: CardGridLayout
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'gap',
    columns: 3,
    mobileColumns: 1,
    dividerColor: 'default',
    flush: false,
    layout: 'balanced'
  })

  defineSlots<{
    /** The cells, in reading order. In the `frame` register they are CardGrid.Cell elements; in the `divider` register each cell fills its own background. */
    default?(): unknown
  }>()

  const attrs = useAttrs()
  const slots = useSlots()
  const testId = computed(() => (attrs['data-testid'] as string) ?? 'marketing-card-grid')

  const cellCount = computed(() => countRenderedNodes(slots['default']?.() ?? []))

  const hasCells = computed(() => cellCount.value > 0)

  const rowWidth = (max: number) => {
    const count = Math.max(cellCount.value, 1)
    return Math.ceil(count / Math.ceil(count / max))
  }

  const tracks = (max: number) => (props.layout === 'balanced' ? rowWidth(max) : max)

  const trackCounts = computed(() => [
    tracks(props.mobileColumns),
    tracks(Math.min(props.columns, 2)),
    tracks(props.columns)
  ])

  const fillsTrailingTracks = computed(
    () => props.kind === 'divider' && props.layout === 'balanced' && hasCells.value
  )

  const gridStyle = computed(() => {
    const [base, sm, lg] = trackCounts.value
    const style: Record<string, string | number> = {
      '--card-grid-cols-base': base,
      '--card-grid-cols-sm': sm,
      '--card-grid-cols-lg': lg
    }
    if (!fillsTrailingTracks.value) return style
    const breakpoints = { base, sm, lg }
    for (const [name, width] of Object.entries(breakpoints)) {
      const rest = (width - (cellCount.value % width)) % width
      style[`--card-grid-rest-${name}`] = Math.max(rest, 1)
      style[`--card-grid-fill-${name}`] = rest > 0 ? 'block' : 'none'
    }
    return style
  })
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-kind="kind"
    :data-columns="columns"
    :data-mobile-columns="mobileColumns"
    :data-divider-color="dividerColor"
    :data-flush="flush"
    :data-layout="layout"
    :data-count="cellCount"
    :data-filled="hasCells || null"
    :data-fill-trailing="fillsTrailingTracks || null"
    :style="gridStyle"
    class="grid grid-cols-[repeat(var(--card-grid-cols),minmax(0,1fr))] [--card-grid-cols:var(--card-grid-cols-base)] sm:[--card-grid-cols:var(--card-grid-cols-sm)] lg:[--card-grid-cols:var(--card-grid-cols-lg)] [&>*]:h-auto [&>*]:min-w-0 data-[fill-trailing]:[--card-grid-rest:var(--card-grid-rest-base)] data-[fill-trailing]:sm:[--card-grid-rest:var(--card-grid-rest-sm)] data-[fill-trailing]:lg:[--card-grid-rest:var(--card-grid-rest-lg)] data-[fill-trailing]:[--card-grid-fill:var(--card-grid-fill-base)] data-[fill-trailing]:sm:[--card-grid-fill:var(--card-grid-fill-sm)] data-[fill-trailing]:lg:[--card-grid-fill:var(--card-grid-fill-lg)] data-[fill-trailing]:after:[display:var(--card-grid-fill)] data-[fill-trailing]:after:bg-(--bg-canvas) data-[fill-trailing]:after:content-[''] data-[fill-trailing]:after:[grid-column:span_var(--card-grid-rest)/span_var(--card-grid-rest)] data-[kind=gap]:gap-(--spacing-md) data-[kind=divider]:gap-px data-[kind=divider]:data-[divider-color=default]:bg-(--border-default) data-[kind=divider]:data-[divider-color=muted]:bg-(--border-muted) data-[kind=frame]:border-(--border-default) data-[kind=frame]:data-[filled]:data-[flush=false]:border-s data-[kind=frame]:data-[filled]:data-[flush=false]:border-t data-[kind=frame]:data-[flush=true]:-mb-px data-[kind=frame]:data-[flush=true]:-me-px"
  >
    <slot />
  </div>
</template>
