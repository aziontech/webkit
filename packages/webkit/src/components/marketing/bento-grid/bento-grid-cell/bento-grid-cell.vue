<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import FrameBox from '../../../layout/frame-box/frame-box.vue'

  defineOptions({
    name: 'BentoGridCell',
    inheritAttrs: false
  })

  /** How many columns the cell claims from the medium breakpoint up. */
  export type BentoGridCellSpan = '1' | '2' | '3' | '4' | 'full'
  /** How many rows the cell claims from the medium breakpoint up. */
  export type BentoGridCellRows = '1' | '2'
  /** The cell's fill. */
  export type BentoGridCellKind = 'surface' | 'canvas' | 'none'

  interface Props {
    /** How many columns the cell claims from the medium breakpoint up; below it every cell claims one, and only `full` takes the whole row. */
    span?: BentoGridCellSpan
    /** How many rows the cell claims from the medium breakpoint up. */
    rows?: BentoGridCellRows
    /** The cell's fill; `none` leaves the surface to the content composed inside it. */
    kind?: BentoGridCellKind
    /** Pads the cell's content away from its rules; off for content that reaches the cell's edges. */
    padded?: boolean
  }

  withDefaults(defineProps<Props>(), {
    span: '1',
    rows: '1',
    kind: 'surface',
    padded: true
  })

  defineSlots<{
    /** The cell's content, composed as real elements. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-bento-grid-cell'
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-span="span"
    :data-rows="rows"
    class="flex min-w-0 data-[span=full]:col-span-full data-[span=2]:md:col-span-2 data-[span=3]:md:col-span-3 data-[span=4]:md:col-span-4 data-[rows=2]:md:row-span-2"
  >
    <FrameBox
      :flush="['top', 'left']"
      marks="all"
      class="h-full w-full min-w-0"
    >
      <div
        :data-kind="kind"
        :data-padded="padded || null"
        class="h-full data-[kind=canvas]:bg-(--bg-canvas) data-[kind=surface]:bg-(--bg-surface) data-[padded]:p-(--spacing-xl)"
      >
        <slot />
      </div>
    </FrameBox>
  </div>
</template>
