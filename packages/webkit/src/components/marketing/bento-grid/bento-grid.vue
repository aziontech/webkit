<script setup lang="ts">
  import { computed, useAttrs, useSlots } from 'vue'

  import { hasRenderedContent } from '../../../utils/rendered-content'

  defineOptions({
    name: 'BentoGrid',
    inheritAttrs: false
  })

  /** How many columns the mosaic lays out from the medium breakpoint up. */
  export type BentoGridColumns = 2 | 3 | 4
  /** How many columns the mosaic holds below the medium breakpoint. */
  export type BentoGridMobileColumns = 1 | 2

  interface Props {
    /** Accessible name for the grid, when the surrounding section does not already name it. */
    ariaLabel?: string
    /** How many columns the mosaic lays out from the medium breakpoint up. */
    columns?: BentoGridColumns
    /** How many columns the mosaic holds below the medium breakpoint, where every cell claims one of them. */
    mobileColumns?: BentoGridMobileColumns
    /** The surrounding frame already draws the grid's outer rules: the grid drops its own top and left ones and lays its right and bottom ones onto the frame's, so a framed column keeps one hairline per edge. */
    flush?: boolean
  }

  withDefaults(defineProps<Props>(), {
    ariaLabel: '',
    columns: 2,
    mobileColumns: 1,
    flush: false
  })

  defineSlots<{
    /** The grid's cells, composed as BentoGrid.Cell elements in reading order. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const slots = useSlots()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-bento-grid'
  )

  const hasCells = computed(() => hasRenderedContent(slots['default']?.() ?? []))
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :data-filled="hasCells || null"
    :data-columns="columns"
    :data-mobile-columns="mobileColumns"
    :data-flush="flush"
    :aria-label="ariaLabel || undefined"
    class="grid data-[mobile-columns=1]:grid-cols-1 data-[mobile-columns=2]:grid-cols-2 data-[columns=2]:md:grid-cols-2 data-[columns=3]:md:grid-cols-3 data-[columns=4]:md:grid-cols-4 md:auto-rows-fr data-[filled]:border-(--border-default) data-[filled]:data-[flush=false]:border-l data-[filled]:data-[flush=false]:border-t data-[flush=true]:-mb-px data-[flush=true]:-mr-px"
  >
    <slot />
  </section>
</template>
