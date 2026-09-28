<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import TextureMaterial from '../texture-material/texture-material.vue'

  defineOptions({
    name: 'SectionGap',
    inheritAttrs: false
  })

  /** How much vertical air the gap holds. */
  export type SectionGapSize = 'small' | 'medium' | 'large'

  interface Props {
    /** How much vertical air the gap holds, as a multiple of the theme's largest spacing step: `small` is one `--spacing-xxl`, `medium` two, `large` three. The token is responsive, so every step scales with the viewport. */
    size?: SectionGapSize
    /** Draw the gap's ruled line texture — fine vertical rules at a fixed pitch. */
    hatch?: boolean
  }

  withDefaults(defineProps<Props>(), {
    size: 'medium',
    hatch: false
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-section-gap'
  )
</script>

<template>
  <!-- Steps are one, two and three times the theme's largest spacing step (32/64/96px on a
       phone, 96/192/288px wide), so the gap adds no scale of its own. flush leaves a shared
       junction one rule; every corner is still ticked. Hatch belongs here, the one band
       with no copy of its own, and the rules stay unmasked — one solid ink edge to edge, so
       the field never reads as a fill that fades. -->
  <FrameBox
    v-bind="$attrs"
    flush
    borders="y"
    marks="all"
    :data-testid="testId"
    :data-size="size"
    :data-hatch="hatch || null"
    class="h-[calc(var(--spacing-xxl)*2)] data-[size=small]:h-(--spacing-xxl) data-[size=large]:h-[calc(var(--spacing-xxl)*3)]"
  >
    <TextureMaterial
      v-if="hatch"
      kind="lines"
      :data-testid="`${testId}__hatch`"
    />
  </FrameBox>
</template>
