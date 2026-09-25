<script setup lang="ts">
  import { computed, useAttrs, useSlots } from 'vue'

  import { hasRenderedContent } from '../../../utils/rendered-content'

  defineOptions({
    name: 'CardGrid',
    inheritAttrs: false
  })

  /** Register of the grid. */
  export type CardGridKind = 'gap' | 'divider' | 'frame'
  /** Column count at the large breakpoint. */
  export type CardGridColumns = 2 | 3 | 4
  /** Column count below the small breakpoint. */
  export type CardGridMobileColumns = 1 | 2
  /** Weight of the hairline rules. */
  export type CardGridDividerColor = 'default' | 'muted'

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
  }

  withDefaults(defineProps<Props>(), {
    kind: 'gap',
    columns: 3,
    mobileColumns: 1,
    dividerColor: 'default',
    flush: false
  })

  defineSlots<{
    /** The cells, in reading order. In the `frame` register they are CardGrid.Cell elements; in the `divider` register each cell fills its own background. */
    default?(): unknown
  }>()

  const attrs = useAttrs()
  const slots = useSlots()
  const testId = computed(() => (attrs['data-testid'] as string) ?? 'marketing-card-grid')

  const hasCells = computed(() => hasRenderedContent(slots['default']?.() ?? []))
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
    :data-filled="hasCells || null"
    class="grid data-[mobile-columns=1]:grid-cols-1 data-[mobile-columns=2]:grid-cols-2 data-[columns=2]:sm:grid-cols-2 data-[columns=3]:sm:grid-cols-2 data-[columns=3]:lg:grid-cols-3 data-[columns=4]:sm:grid-cols-2 data-[columns=4]:lg:grid-cols-4 data-[kind=gap]:gap-(--spacing-md) data-[kind=divider]:gap-px data-[kind=divider]:data-[divider-color=default]:bg-(--border-default) data-[kind=divider]:data-[divider-color=muted]:bg-(--border-muted) data-[kind=frame]:border-(--border-default) data-[kind=frame]:data-[filled]:data-[flush=false]:border-l data-[kind=frame]:data-[filled]:data-[flush=false]:border-t data-[kind=frame]:data-[flush=true]:-mb-px data-[kind=frame]:data-[flush=true]:-mr-px"
  >
    <slot />
  </div>
</template>
