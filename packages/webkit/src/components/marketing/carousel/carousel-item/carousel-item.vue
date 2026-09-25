<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'CarouselItem',
    inheritAttrs: false
  })

  defineSlots<{
    /** The slide's content, composed as real elements. */
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
    class="shrink-0 snap-start"
  >
    <slot />
  </li>
</template>
