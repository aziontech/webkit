<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import FrameBox from '../frame-box/frame-box.vue'

  defineOptions({
    name: 'SectionGap',
    inheritAttrs: false
  })

  /** How much vertical air the gap holds. */
  export type SectionGapSize = 'small' | 'medium' | 'large'

  interface Props {
    /** How much vertical air the gap holds, as a multiple of the theme's largest spacing step: `small` is one `--spacing-xxl`, `medium` two, `large` three. The token is responsive, so every step scales with the viewport. */
    size?: SectionGapSize
    /** Draw the frame's diagonal hatch texture in the gap. */
    hatch?: boolean
  }

  withDefaults(defineProps<Props>(), {
    size: 'medium',
    hatch: false
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'layout-section-gap'
  )
</script>

<template>
  <!-- The three steps are one, two and three times `--spacing-xxl`, the largest step of the
       theme's own spacing scale — so the gap adds no scale of its own, and it is responsive
       for free: that token already resolves to 2rem / 4rem / 6rem across the breakpoints,
       which makes the steps 32/64/96px on a phone and 96/192/288px on a wide screen. The
       ratio (1 : 2 : 3) is what keeps the three weights unmistakable at every width.
       `borders="y"` keeps only the two rules that do the dividing; `flush` draws the one it
       shares with the section above exactly once, and `marks="bottom"` leaves the top pair of
       ticks to that same neighbour so the shared junction carries one mark per corner.

       The gap is where `hatch` belongs on a framed page: it is the one band with no content of
       its own, so the texture reads as the page's own material instead of competing with copy. -->
  <FrameBox
    v-bind="$attrs"
    flush
    borders="y"
    marks="bottom"
    :hatch="hatch"
    :data-testid="testId"
    :data-size="size"
    class="h-[calc(var(--spacing-xxl)*2)] data-[size=small]:h-(--spacing-xxl) data-[size=large]:h-[calc(var(--spacing-xxl)*3)]"
  />
</template>
