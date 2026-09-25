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
  <!-- Steps are one, two and three times the theme's largest spacing step, so the gap adds
       no scale of its own and is responsive for free (32/64/96px on a phone, 96/192/288px
       wide); the 1:2:3 ratio keeps the weights unmistakable. flush + borders/marks leave a
       shared junction one rule and one mark per corner. The gap is where hatch belongs: the
       one band with no copy, so the texture reads as the page's own material. The rules are
       left unmasked — each one is one solid ink from edge to edge, and the transparency is
       the ink's own, so the field never reads as a fill that fades. -->
  <FrameBox
    v-bind="$attrs"
    flush
    borders="y"
    marks="bottom"
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
