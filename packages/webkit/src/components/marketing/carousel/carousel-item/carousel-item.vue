<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'CarouselItem',
    inheritAttrs: false
  })

  defineSlots<{
    /** The card's content, composed as real elements; it fills the card, so every card in the row matches the tallest. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-carousel-item'
  )
</script>

<template>
  <li
    v-bind="$attrs"
    :data-testid="testId"
    class="grid shrink-0 snap-start border border-(--border-default) bg-(--bg-surface) p-(--spacing-xl) not-last:-mr-px"
  >
    <slot />
  </li>
</template>
