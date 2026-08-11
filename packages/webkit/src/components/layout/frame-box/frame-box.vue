<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'FrameBox',
    inheritAttrs: false
  })

  /** Which of the frame's own rules are drawn. */
  export type FrameBoxBorders = 'all' | 'x' | 'y' | 'none'

  interface Props {
    /** Which of the frame's own rules to draw. Use `y` for a full-bleed band and `none` when a surrounding grid already draws every edge. */
    borders?: FrameBoxBorders
    /** Show the four corner registration squares, inset from both rules. */
    marks?: boolean
    /** Show the faint vertical hatch-line texture behind the content, faded toward the edges. */
    hatch?: boolean
    /** Pull the frame up by its border width so its top rule lands on the bottom rule of the block above. */
    flush?: boolean
  }

  withDefaults(defineProps<Props>(), {
    borders: 'all',
    marks: true,
    hatch: false,
    flush: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'layout-frame-box')

  // Each square is anchored to a corner and inset from both rules by its own margin,
  // so the mark sits INSIDE the frame instead of straddling the border line. At 6px
  // filled it reads as a tick in the corner, not as a second, competing border.
  const MARK_CLASS = 'pointer-events-none absolute z-20 m-1 block size-1.5 bg-(--border-default)'
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-borders="borders"
    :data-marks="marks || null"
    :data-hatch="hatch || null"
    :data-flush="flush || null"
    class="relative border-(--border-default) data-[borders=all]:border data-[borders=x]:border-x data-[borders=y]:border-y data-[flush]:-mt-px"
  >
    <!-- Vertical hatch-line texture, faded toward the edges. -->
    <div
      v-if="hatch"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 opacity-40 [background-image:repeating-linear-gradient(to_right,var(--border-muted)_0,var(--border-muted)_1px,transparent_1px,transparent_var(--spacing-lg))] mask-[radial-gradient(ellipse_at_center,black,transparent_85%)]"
    />

    <!-- Corner registration squares. -->
    <template v-if="marks">
      <span
        aria-hidden="true"
        :class="[MARK_CLASS, 'left-0 top-0']"
      />
      <span
        aria-hidden="true"
        :class="[MARK_CLASS, 'right-0 top-0']"
      />
      <span
        aria-hidden="true"
        :class="[MARK_CLASS, 'left-0 bottom-0']"
      />
      <span
        aria-hidden="true"
        :class="[MARK_CLASS, 'right-0 bottom-0']"
      />
    </template>

    <!-- Content sits above the hatch texture. `h-full` is what lets a frame used as a
         grid cell hand its stretched height down to the content: against an auto-height
         frame it resolves to auto, but when the grid stretches the frame to the tallest
         cell in the row, the content fills it — so a cell can push its footer onto the
         row's bottom edge and align with its neighbours. -->
    <div class="relative z-10 h-full">
      <slot />
    </div>
  </div>
</template>
