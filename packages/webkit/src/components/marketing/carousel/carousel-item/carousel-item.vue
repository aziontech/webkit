<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useCarouselContext } from '../composables/use-carousel-context'

  defineOptions({
    name: 'CarouselItem',
    inheritAttrs: false
  })

  /** Width of a card in the track. */
  export type CarouselItemSize = 'small' | 'medium' | 'large'

  export interface CarouselItemProps {
    /** Width of the card: `small`, `medium` or `large` on the container scale, each at most 85% of the viewport below the small breakpoint. */
    size?: CarouselItemSize
  }

  withDefaults(defineProps<CarouselItemProps>(), {
    size: 'medium'
  })

  defineSlots<{
    /** The card's content, composed as real elements; it fills the card, so every card in the row matches the tallest. */
    default(): unknown
  }>()

  const context = useCarouselContext()
  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-carousel-item'
  )
</script>

<template>
  <li
    v-bind="$attrs"
    :data-testid="testId"
    :data-size="size"
    :data-variant="context.variant.value"
    class="grid w-[85vw] shrink-0 snap-start border border-(--border-default) bg-(--bg-surface) p-(--spacing-xl) data-[variant=cards]:rounded-(--shape-card) data-[variant=strip]:not-last:-me-px data-[size=large]:max-w-(--container-md) data-[size=medium]:max-w-(--container-sm) data-[size=small]:max-w-(--container-2xs) sm:data-[size=large]:w-(--container-md) sm:data-[size=medium]:w-(--container-sm) sm:data-[size=small]:w-(--container-2xs)"
  >
    <slot />
  </li>
</template>
