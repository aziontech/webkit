<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import FrameBox from '../../../layout/frame-box/frame-box.vue'

  defineOptions({
    name: 'CardGridCell',
    inheritAttrs: false
  })

  /** The cell's fill. */
  export type CardGridCellKind = 'surface' | 'canvas' | 'none'

  interface Props {
    /** The cell's fill; `none` leaves the surface to the content composed inside it. */
    kind?: CardGridCellKind
    /** Pads the cell's content away from its rules; off for content that reaches the cell's edges. */
    padded?: boolean
  }

  withDefaults(defineProps<Props>(), {
    kind: 'surface',
    padded: true
  })

  defineSlots<{
    /** The cell's content, composed as real elements. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-card-grid-cell'
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex min-w-0"
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
