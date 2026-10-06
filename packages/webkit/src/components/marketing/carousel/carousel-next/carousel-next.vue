<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useCarouselContext } from '../composables/use-carousel-context'

  defineOptions({
    name: 'CarouselNext',
    inheritAttrs: false
  })

  interface Props {
    /** Accessible name for the control that steps the track forward. */
    ariaLabel?: string
  }

  withDefaults(defineProps<Props>(), {
    ariaLabel: 'Next slide'
  })

  const context = useCarouselContext()
  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-carousel-next'
  )
</script>

<template>
  <button
    v-bind="$attrs"
    type="button"
    :data-testid="testId"
    :aria-label="ariaLabel"
    :disabled="!context.canScrollNext.value"
    class="flex h-10 w-10 items-center justify-center rounded-(--shape-button) border border-(--border-default) bg-(--bg-surface) text-(--text-muted) transition-colors duration-150 ease-out hover:text-(--text-default) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
    @click="context.scrollNext()"
  >
    <i
      class="pi pi-chevron-right"
      aria-hidden="true"
    />
  </button>
</template>
