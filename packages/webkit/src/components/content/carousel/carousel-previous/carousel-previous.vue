<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import { useCarouselContext } from '../composables/use-carousel-context'

  defineOptions({
    name: 'CarouselPrevious',
    inheritAttrs: false
  })

  export interface CarouselPreviousProps {
    /** Accessible name for the control that steps the track back. Empty uses the locale catalog (`Previous slide`). */
    ariaLabel?: string
  }

  withDefaults(defineProps<CarouselPreviousProps>(), {
    ariaLabel: ''
  })

  const context = useCarouselContext()
  const attrs = useAttrs()
  const { t } = useTranslate({ carousel: en.carousel })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'carousel-previous')

  const ROOT_CLASS =
    'flex h-10 w-10 items-center justify-center rounded-(--shape-button) border border-(--border-default) bg-(--bg-surface) text-(--text-muted) transition-colors duration-150 ease-out ' +
    'hover:text-(--text-default) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) disabled:cursor-not-allowed ' +
    'disabled:opacity-50 motion-reduce:transition-none'
</script>

<template>
  <button
    v-bind="$attrs"
    type="button"
    :data-testid="testId"
    :aria-label="ariaLabel || t('carousel.previous')"
    :disabled="!context.canScrollPrev.value"
    :class="ROOT_CLASS"
    @click="context.scrollPrev()"
  >
    <i
      class="az az-chevron-left rtl:-scale-x-100"
      aria-hidden="true"
    />
  </button>
</template>
