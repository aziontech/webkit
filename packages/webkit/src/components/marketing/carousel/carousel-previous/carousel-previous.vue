<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useLocale } from '../../../../composables/use-locale'
  import * as en from '../../../../i18n/messages/en'
  import { useCarouselContext } from '../composables/use-carousel-context'

  defineOptions({
    name: 'CarouselPrevious',
    inheritAttrs: false
  })

  interface Props {
    /** Accessible name for the control that steps the track back. Empty uses the locale catalog (`Previous slide`). */
    ariaLabel?: string
  }

  withDefaults(defineProps<Props>(), {
    ariaLabel: ''
  })

  const context = useCarouselContext()
  const attrs = useAttrs()
  const { t } = useLocale({ carousel: en.carousel })

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-carousel-previous'
  )
</script>

<template>
  <button
    v-bind="$attrs"
    type="button"
    :data-testid="testId"
    :aria-label="ariaLabel || t('carousel.previous')"
    :disabled="!context.canScrollPrev.value"
    class="flex h-10 w-10 items-center justify-center rounded-(--shape-button) border border-(--border-default) bg-(--bg-surface) text-(--text-muted) transition-colors duration-150 ease-out hover:text-(--text-default) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
    @click="context.scrollPrev()"
  >
    <i
      class="pi pi-chevron-left"
      aria-hidden="true"
    />
  </button>
</template>
