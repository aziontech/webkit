<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import RegistrationFrame from '../../../layout/registration-frame/registration-frame.vue'

  defineOptions({
    name: 'CardGridCell',
    inheritAttrs: false
  })

  /** The cell's fill. */
  export type CardGridCellVariant = 'surface' | 'canvas' | 'none'

  export interface CardGridCellProps {
    /** The cell's fill; `none` leaves the surface to the content composed inside it. */
    variant?: CardGridCellVariant
    /** Pads the cell's content away from its rules; off for content that reaches the cell's edges. */
    padded?: boolean
  }

  withDefaults(defineProps<CardGridCellProps>(), {
    variant: 'surface',
    padded: true
  })

  defineSlots<{
    /** The cell's content, composed as real elements. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'card-grid-cell')
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex min-w-0"
  >
    <RegistrationFrame
      :flush="['top', 'left']"
      marks="all"
      class="h-full w-full min-w-0"
    >
      <div
        :data-variant="variant"
        :data-padded="padded || null"
        class="h-full data-[variant=canvas]:bg-(--bg-canvas) data-[variant=surface]:bg-(--bg-surface) data-[padded]:p-(--spacing-xl)"
      >
        <slot />
      </div>
    </RegistrationFrame>
  </div>
</template>
