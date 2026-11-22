<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import IconButton from '../../../action/icon-button/icon-button.vue'
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
</script>

<template>
  <IconButton
    v-bind="$attrs"
    variant="outline"
    icon="az az-chevron-left"
    :data-testid="testId"
    :aria-label="ariaLabel || t('carousel.previous')"
    :disabled="!context.canScrollPrev.value"
    @click="context.scrollPrev()"
  />
</template>
